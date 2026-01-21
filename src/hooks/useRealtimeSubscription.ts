import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Subscribe to multiple tables at once for a tenant
 * Production-ready with automatic cleanup
 */
export const useTenantRealtimeSubscriptions = (tenantId: string | null) => {
  const queryClient = useQueryClient();
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!tenantId) return;

    // Clean up existing channels
    channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
    channelsRef.current = [];

    // Helper to create typed postgres_changes subscription
    const createSubscription = (
      channelName: string,
      table: string,
      onPayload: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
    ) => {
      return supabase
        .channel(channelName)
        .on<Record<string, unknown>>(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter: `tenant_id=eq.${tenantId}`,
          },
          onPayload
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log(`[Realtime] Subscribed to ${table}`);
          }
        });
    };

    // Conversations channel
    const conversationsChannel = createSubscription(
      `tenant-conversations-${tenantId}`,
      "conversations",
      () => queryClient.invalidateQueries({ queryKey: ["conversations", tenantId] })
    );
    channelsRef.current.push(conversationsChannel);

    // Messages channel
    const messagesChannel = createSubscription(
      `tenant-messages-${tenantId}`,
      "messages",
      () => queryClient.invalidateQueries({ queryKey: ["messages"] })
    );
    channelsRef.current.push(messagesChannel);

    // Contacts channel
    const contactsChannel = createSubscription(
      `tenant-contacts-${tenantId}`,
      "contacts",
      () => queryClient.invalidateQueries({ queryKey: ["contacts", tenantId] })
    );
    channelsRef.current.push(contactsChannel);

    // Automations channel
    const automationsChannel = createSubscription(
      `tenant-automations-${tenantId}`,
      "automations",
      () => queryClient.invalidateQueries({ queryKey: ["automations", tenantId] })
    );
    channelsRef.current.push(automationsChannel);

    // Campaigns channel
    const campaignsChannel = createSubscription(
      `tenant-campaigns-${tenantId}`,
      "campaigns",
      () => queryClient.invalidateQueries({ queryKey: ["campaigns", tenantId] })
    );
    channelsRef.current.push(campaignsChannel);

    console.log(`[Realtime] Subscribed to ${channelsRef.current.length} tenant channels`);

    return () => {
      channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
      channelsRef.current = [];
      console.log(`[Realtime] Cleaned up tenant channels`);
    };
  }, [tenantId, queryClient]);
};

/**
 * Subscribe to a single conversation's messages
 */
export const useConversationRealtimeSubscription = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`conversation-messages-${conversationId}`)
      .on<Record<string, unknown>>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log(`[Realtime] Message ${payload.eventType} in conversation`);
          queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Realtime] Subscribed to conversation ${conversationId}`);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, queryClient]);
};
