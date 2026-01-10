import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";

const startOfMonthISO = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return start.toISOString();
};

export const useDashboardMetrics = () => {
  const { currentTenant } = useTenants();

  return useQuery({
    queryKey: ["dashboard-metrics", currentTenant?.id],
    enabled: !!currentTenant?.id,
    queryFn: async () => {
      if (!currentTenant?.id) {
        return {
          monthlyConversations: 0,
          activeContacts: 0,
          messagesSent: 0,
          deliveryRate: 0,
        };
      }

      const tenantId = currentTenant.id;
      const monthStart = startOfMonthISO();

      const [{ count: monthlyConversations }, { count: activeContacts }, { count: sent }, { count: delivered }] =
        await Promise.all([
          supabase
            .from("conversations")
            .select("id", { count: "exact", head: true })
            .eq("tenant_id", tenantId)
            .gte("created_at", monthStart),
          supabase
            .from("contacts")
            .select("id", { count: "exact", head: true })
            .eq("tenant_id", tenantId),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("tenant_id", tenantId)
            .eq("direction", "outbound")
            .gte("created_at", monthStart),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("tenant_id", tenantId)
            .eq("direction", "outbound")
            .eq("status", "delivered")
            .gte("created_at", monthStart),
        ]);

      const sentCount = sent ?? 0;
      const deliveredCount = delivered ?? 0;
      const deliveryRate = sentCount === 0 ? 0 : (deliveredCount / sentCount) * 100;

      return {
        monthlyConversations: monthlyConversations ?? 0,
        activeContacts: activeContacts ?? 0,
        messagesSent: sentCount,
        deliveryRate,
      };
    },
  });
};
