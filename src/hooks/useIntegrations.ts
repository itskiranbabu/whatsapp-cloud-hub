import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface Integration {
  id: string;
  tenant_id: string;
  integration_type: string;
  name: string;
  status: "connected" | "disconnected" | "pending" | "error";
  config: Json;
  credentials: Json;
  last_sync_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export type IntegrationInsert = Omit<Integration, "id" | "tenant_id" | "created_at" | "updated_at">;

// Available integrations catalog
export const integrationsCatalog = [
  {
    type: "shopify",
    name: "Shopify",
    description: "Sync orders, send tracking updates, and automate abandoned cart recovery",
    category: "ecommerce",
    icon: "🛒",
    popular: true,
    features: ["Order notifications", "Abandoned cart recovery", "Shipping updates", "Product catalog sync"],
  },
  {
    type: "woocommerce",
    name: "WooCommerce",
    description: "Connect your WooCommerce store for automated order messaging",
    category: "ecommerce",
    icon: "🛍️",
    features: ["Order confirmations", "Delivery notifications", "COD reminders", "Review collection"],
  },
  {
    type: "razorpay",
    name: "Razorpay",
    description: "Send payment links and collect payments directly in WhatsApp",
    category: "payments",
    icon: "💳",
    popular: true,
    features: ["Payment links", "Payment reminders", "Success notifications", "Refund alerts"],
  },
  {
    type: "stripe",
    name: "Stripe",
    description: "Accept payments and subscriptions through WhatsApp",
    category: "payments",
    icon: "💵",
    features: ["One-click payments", "Subscription management", "Invoice delivery", "Payment receipts"],
  },
  {
    type: "google_sheets",
    name: "Google Sheets",
    description: "Sync contacts and export conversation data to spreadsheets",
    category: "productivity",
    icon: "📊",
    features: ["Contact sync", "Lead export", "Campaign reports", "Real-time updates"],
  },
  {
    type: "zapier",
    name: "Zapier",
    description: "Connect to 5000+ apps with no-code automation",
    category: "automation",
    icon: "⚡",
    popular: true,
    features: ["Trigger workflows", "Multi-app automation", "Custom Zaps", "Scheduled actions"],
  },
  {
    type: "dialogflow",
    name: "Dialogflow",
    description: "Build AI-powered chatbots with natural language processing",
    category: "ai",
    icon: "🤖",
    features: ["Intent recognition", "Entity extraction", "Context handling", "Multi-language support"],
  },
  {
    type: "hubspot",
    name: "HubSpot",
    description: "Sync contacts and deals with your HubSpot CRM",
    category: "crm",
    icon: "🧡",
    features: ["Contact sync", "Deal tracking", "Activity logging", "Lead scoring"],
  },
  {
    type: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM integration for sales teams",
    category: "crm",
    icon: "☁️",
    comingSoon: true,
    features: ["Lead management", "Opportunity tracking", "Custom objects", "Workflow automation"],
  },
  {
    type: "calendly",
    name: "Calendly",
    description: "Let customers book appointments directly from WhatsApp",
    category: "productivity",
    icon: "📅",
    features: ["Appointment booking", "Reminders", "Rescheduling", "Calendar sync"],
  },
  {
    type: "make",
    name: "Make (Integromat)",
    description: "Advanced automation with visual workflow builder",
    category: "automation",
    icon: "🔄",
    features: ["Visual workflows", "Data transformation", "Error handling", "Scheduling"],
  },
  {
    type: "freshdesk",
    name: "Freshdesk",
    description: "Convert WhatsApp conversations into support tickets",
    category: "support",
    icon: "🎫",
    comingSoon: true,
    features: ["Ticket creation", "Agent assignment", "SLA tracking", "Knowledge base"],
  },
];

export const useIntegrations = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const integrationsQuery = useQuery({
    queryKey: ["integrations", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];

      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!currentTenantId,
  });

  const connectIntegration = useMutation({
    mutationFn: async ({ 
      integrationType, 
      name, 
      config = {}, 
      credentials = {} 
    }: { 
      integrationType: string; 
      name: string; 
      config?: Json;
      credentials?: Json;
    }) => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data, error } = await supabase
        .from("integrations")
        .upsert([{
          tenant_id: currentTenantId,
          integration_type: integrationType,
          name,
          status: "connected" as const,
          config: config as Json,
          credentials: credentials as Json,
          last_sync_at: new Date().toISOString(),
        }], {
          onConflict: 'tenant_id,integration_type'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["integrations", currentTenantId] });
      toast({ title: `${data.name} connected successfully` });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to connect integration", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const disconnectIntegration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("integrations")
        .update({ status: "disconnected" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", currentTenantId] });
      toast({ title: "Integration disconnected" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to disconnect integration", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteIntegration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("integrations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", currentTenantId] });
      toast({ title: "Integration removed" });
    },
  });

  const updateIntegration = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; config?: Json; credentials?: Json; error_message?: string }) => {
      const { data, error } = await supabase
        .from("integrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", currentTenantId] });
    },
  });

  // Get connected integration types
  const connectedTypes = new Set(
    integrationsQuery.data
      ?.filter(i => i.status === "connected")
      .map(i => i.integration_type) || []
  );

  // Merge catalog with connected status
  const allIntegrations = integrationsCatalog.map(catalog => ({
    ...catalog,
    isConnected: connectedTypes.has(catalog.type),
    dbRecord: integrationsQuery.data?.find(i => i.integration_type === catalog.type),
  }));

  return {
    integrations: integrationsQuery.data || [],
    allIntegrations,
    isLoading: integrationsQuery.isLoading,
    error: integrationsQuery.error,
    connectedCount: connectedTypes.size,
    connectIntegration,
    disconnectIntegration,
    deleteIntegration,
    updateIntegration,
  };
};
