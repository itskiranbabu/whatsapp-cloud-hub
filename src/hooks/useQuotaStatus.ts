import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";

interface QuotaStatus {
  messages: { used: number; limit: number };
  ai: { used: number; limit: number };
  templates: { used: number; limit: number };
  ads: { used: number; limit: number };
  automations: { used: number; limit: number };
}

/**
 * Hook to get current tenant's quota status
 * Used to display usage limits and prevent exceeding quotas
 */
export const useQuotaStatus = () => {
  const { currentTenant } = useTenants();

  const {
    data: quotaStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quota-status", currentTenant?.id],
    queryFn: async (): Promise<QuotaStatus> => {
      if (!currentTenant?.id) {
        return {
          messages: { used: 0, limit: 1000 },
          ai: { used: 0, limit: 100 },
          templates: { used: 0, limit: 50 },
          ads: { used: 0, limit: 100 },
          automations: { used: 0, limit: 500 },
        };
      }

      const { data, error } = await supabase.rpc("get_quota_status", {
        _tenant_id: currentTenant.id,
      });

      if (error) {
        console.error("Failed to fetch quota status:", error);
        throw error;
      }

      return data as unknown as QuotaStatus;
    },
    enabled: !!currentTenant?.id,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  const getUsagePercentage = (type: keyof QuotaStatus): number => {
    if (!quotaStatus) return 0;
    const quota = quotaStatus[type];
    return Math.min((quota.used / quota.limit) * 100, 100);
  };

  const isNearLimit = (type: keyof QuotaStatus, threshold = 80): boolean => {
    return getUsagePercentage(type) >= threshold;
  };

  const isAtLimit = (type: keyof QuotaStatus): boolean => {
    if (!quotaStatus) return false;
    const quota = quotaStatus[type];
    return quota.used >= quota.limit;
  };

  return {
    quotaStatus,
    isLoading,
    error,
    refetch,
    getUsagePercentage,
    isNearLimit,
    isAtLimit,
  };
};
