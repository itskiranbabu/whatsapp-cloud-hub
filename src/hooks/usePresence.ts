import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PresenceState {
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: Date | null;
}

interface PresencePayload {
  presence_ref: string;
  isTyping?: boolean;
  lastSeen?: string;
}

export const usePresence = (conversationId: string | null, userId?: string) => {
  const [contactPresence, setContactPresence] = useState<PresenceState>({
    isOnline: false,
    isTyping: false,
    lastSeen: null,
  });
  const [isTyping, setIsTyping] = useState(false);

  // Track contact presence
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase.channel(`presence-${conversationId}`, {
      config: { presence: { key: userId || 'agent' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const contacts = Object.entries(state).filter(([key]) => key.startsWith('contact-'));
        
        if (contacts.length > 0) {
          const contactState = contacts[0][1] as PresencePayload[];
          setContactPresence({
            isOnline: true,
            isTyping: contactState[0]?.isTyping || false,
            lastSeen: contactState[0]?.lastSeen ? new Date(contactState[0].lastSeen) : null,
          });
        } else {
          setContactPresence(prev => ({
            ...prev,
            isOnline: false,
            isTyping: false,
          }));
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key.startsWith('contact-')) {
          setContactPresence({
            isOnline: true,
            isTyping: (newPresences as PresencePayload[])[0]?.isTyping || false,
            lastSeen: new Date(),
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key.startsWith('contact-')) {
          setContactPresence(prev => ({
            ...prev,
            isOnline: false,
            isTyping: false,
            lastSeen: new Date(),
          }));
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            isTyping: false,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  // Broadcast typing status
  const setTyping = useCallback(async (typing: boolean) => {
    if (!conversationId) return;
    setIsTyping(typing);
    
    const channel = supabase.channel(`presence-${conversationId}`);
    await channel.track({
      isTyping: typing,
      lastSeen: new Date().toISOString(),
    });
  }, [conversationId]);

  return {
    contactPresence,
    isTyping,
    setTyping,
  };
};

// Simulated presence for demo (since we don't have real contacts connecting)
export const useSimulatedPresence = (conversationId: string | null) => {
  const [contactPresence, setContactPresence] = useState<PresenceState>({
    isOnline: false,
    isTyping: false,
    lastSeen: null,
  });

  useEffect(() => {
    if (!conversationId) {
      setContactPresence({ isOnline: false, isTyping: false, lastSeen: null });
      return;
    }

    // Simulate random online/offline status based on conversation
    const hash = conversationId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const isOnline = Math.abs(hash) % 3 !== 0; // ~66% online
    
    setContactPresence({
      isOnline,
      isTyping: false,
      lastSeen: isOnline ? new Date() : new Date(Date.now() - Math.random() * 3600000),
    });

    // Simulate typing indicator occasionally
    if (isOnline) {
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.85) {
          setContactPresence(prev => ({ ...prev, isTyping: true }));
          setTimeout(() => {
            setContactPresence(prev => ({ ...prev, isTyping: false }));
          }, 2000 + Math.random() * 3000);
        }
      }, 10000);

      return () => clearInterval(typingInterval);
    }
  }, [conversationId]);

  return { contactPresence };
};
