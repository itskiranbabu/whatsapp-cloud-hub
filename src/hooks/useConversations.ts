import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Conversation = Tables<"conversations">;
type Message = Tables<"messages">;
type Contact = Tables<"contacts">;

interface ConversationWithContact extends Conversation {
  contact: Contact;
  lastMessage?: Message;
}

export const useConversations = () => {
  const { currentTenant } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          contact:contacts(*)
        `)
        .eq("tenant_id", currentTenant.id)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as ConversationWithContact[];
    },
    enabled: !!currentTenant?.id,
  });

  const updateConversationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Conversation["status"] }) => {
      const { data, error } = await supabase
        .from("conversations")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", currentTenant?.id] });
    },
  });

  const assignAgent = useMutation({
    mutationFn: async ({ conversationId, agentId }: { conversationId: string; agentId: string | null }) => {
      const { data, error } = await supabase
        .from("conversations")
        .update({ assigned_agent_id: agentId })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", currentTenant?.id] });
      toast({ title: "Agent assigned successfully" });
    },
  });

  // Create a new conversation with a contact
  const createConversation = useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .eq("contact_id", contactId)
        .single();

      if (existing) return existing;

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          tenant_id: currentTenant.id,
          contact_id: contactId,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", currentTenant?.id] });
    },
  });

  return {
    conversations,
    isLoading,
    error,
    updateConversationStatus,
    assignAgent,
    createConversation,
  };
};

export const useMessages = (conversationId: string | null) => {
  const { currentTenant } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
  });

  const sendMessage = useMutation({
    mutationFn: async ({
      conversationId,
      contactId,
      content,
      messageType = "text",
    }: {
      conversationId: string;
      contactId: string;
      content: string;
      messageType?: string;
    }) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");

      // Get contact phone number
      const { data: contact } = await supabase
        .from("contacts")
        .select("phone")
        .eq("id", contactId)
        .single();

      if (!contact) throw new Error("Contact not found");

      // Insert message into database
      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          tenant_id: currentTenant.id,
          conversation_id: conversationId,
          contact_id: contactId,
          direction: "outbound" as const,
          content,
          message_type: messageType,
          status: "pending" as const,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Try to send via Meta Direct API first, fallback to BSP
      try {
        const { error: metaError } = await supabase.functions.invoke("whatsapp-meta-send", {
          body: {
            messageId: message.id,
            tenantId: currentTenant.id,
            to: contact.phone,
            message: content,
            messageType,
          },
        });

        if (metaError) {
          // Fallback to generic whatsapp-send
          const { error: sendError } = await supabase.functions.invoke("whatsapp-send", {
            body: {
              messageId: message.id,
              tenantId: currentTenant.id,
            },
          });

          if (sendError) throw sendError;
        }
      } catch (sendError: any) {
        // Update message status to failed
        await supabase
          .from("messages")
          .update({ status: "failed", failed_reason: sendError.message })
          .eq("id", message.id);
        
        // Don't throw - message is saved, just not sent
        console.error("Failed to send message:", sendError);
      }

      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send a template message
  const sendTemplateMessage = useMutation({
    mutationFn: async ({
      conversationId,
      contactId,
      templateId,
      variables = {},
    }: {
      conversationId: string;
      contactId: string;
      templateId: string;
      variables?: Record<string, string>;
    }) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");

      // Get template
      const { data: template } = await supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (!template) throw new Error("Template not found");

      // Get contact
      const { data: contact } = await supabase
        .from("contacts")
        .select("phone, name")
        .eq("id", contactId)
        .single();

      if (!contact) throw new Error("Contact not found");

      // Replace variables in template body
      let content = template.body;
      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      });
      // Replace common variables
      content = content.replace(/\{\{name\}\}/g, contact.name || "");
      content = content.replace(/\{\{phone\}\}/g, contact.phone);

      // Insert message
      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          tenant_id: currentTenant.id,
          conversation_id: conversationId,
          contact_id: contactId,
          direction: "outbound" as const,
          content,
          message_type: "template",
          status: "pending" as const,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Send via Meta API
      const { error: sendError } = await supabase.functions.invoke("whatsapp-meta-send", {
        body: {
          messageId: message.id,
          tenantId: currentTenant.id,
          to: contact.phone,
          templateName: template.name,
          templateLanguage: template.language || "en",
          variables: Object.values(variables),
        },
      });

      if (sendError) {
        await supabase
          .from("messages")
          .update({ status: "failed", failed_reason: sendError.message })
          .eq("id", message.id);
        throw sendError;
      }

      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast({ title: "Template message sent successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to send template message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendTemplateMessage,
  };
};
