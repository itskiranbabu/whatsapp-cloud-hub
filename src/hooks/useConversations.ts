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

  return {
    conversations,
    isLoading,
    error,
    updateConversationStatus,
    assignAgent,
  };
};

export const useMessages = (conversationId: string | null) => {
  const { currentTenant } = useTenants();
  const queryClient = useQueryClient();

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

      // Call edge function to send via WhatsApp
      const { error: sendError } = await supabase.functions.invoke("whatsapp-send", {
        body: {
          messageId: message.id,
          tenantId: currentTenant.id,
        },
      });

      if (sendError) {
        // Update message status to failed
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
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
