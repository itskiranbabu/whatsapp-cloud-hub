import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";

export interface AppHealthStatus {
  database: "healthy" | "degraded" | "down";
  auth: "healthy" | "degraded" | "down";
  whatsapp: "connected" | "disconnected" | "error";
  quotaUsage: {
    messages: number;
    ai: number;
    automations: number;
  };
  lastChecked: Date;
}

export const useAppHealth = () => {
  const { currentTenant, currentTenantId } = useTenants();

  return useQuery({
    queryKey: ["app-health", currentTenantId],
    queryFn: async (): Promise<AppHealthStatus> => {
      const lastChecked = new Date();
      
      // Check database connectivity
      let database: AppHealthStatus["database"] = "healthy";
      try {
        const { error } = await supabase.from("tenants").select("id").limit(1);
        if (error) database = "degraded";
      } catch {
        database = "down";
      }

      // Check auth status
      let auth: AppHealthStatus["auth"] = "healthy";
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) auth = "degraded";
      } catch {
        auth = "down";
      }

      // Check WhatsApp connection
      const tenant = currentTenant as typeof currentTenant & { 
        phone_number_id?: string;
        meta_access_token?: string;
      };
      let whatsapp: AppHealthStatus["whatsapp"] = "disconnected";
      if (tenant?.phone_number_id) {
        whatsapp = "connected";
      }

      // Get quota usage
      let quotaUsage = { messages: 0, ai: 0, automations: 0 };
      if (currentTenantId) {
        try {
          const { data: quotas } = await supabase
            .from("tenant_quotas")
            .select("*")
            .eq("tenant_id", currentTenantId)
            .single();

          if (quotas) {
            quotaUsage = {
              messages: quotas.messages_limit_daily > 0 
                ? (quotas.messages_sent_today / quotas.messages_limit_daily) * 100 
                : 0,
              ai: quotas.ai_calls_limit_daily > 0 
                ? (quotas.ai_calls_today / quotas.ai_calls_limit_daily) * 100 
                : 0,
              automations: quotas.automation_runs_limit_daily > 0 
                ? (quotas.automation_runs_today / quotas.automation_runs_limit_daily) * 100 
                : 0,
            };
          }
        } catch {
          // Quotas table may not exist yet
        }
      }

      return {
        database,
        auth,
        whatsapp,
        quotaUsage,
        lastChecked,
      };
    },
    enabled: true,
    refetchInterval: 60000, // Check every minute
    staleTime: 30000,
  });
};
