import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Campaign = Tables<"campaigns">;
export type CampaignInsert = TablesInsert<"campaigns">;

export const useCampaigns = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();

  const campaignsQuery = useQuery({
    queryKey: ["campaigns", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          templates (
            name
          )
        `)
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentTenantId,
  });

  const createCampaign = useMutation({
    mutationFn: async (campaign: Omit<CampaignInsert, "tenant_id">) => {
      if (!currentTenantId) throw new Error("No tenant selected");
      
      const { data, error } = await supabase
        .from("campaigns")
        .insert({ ...campaign, tenant_id: currentTenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", currentTenantId] });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", currentTenantId] });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", currentTenantId] });
    },
  });

  // Aggregated stats
  const stats = campaignsQuery.data?.reduce(
    (acc, campaign) => ({
      totalSent: acc.totalSent + (campaign.sent_count || 0),
      totalDelivered: acc.totalDelivered + (campaign.delivered_count || 0),
      totalRead: acc.totalRead + (campaign.read_count || 0),
      activeCampaigns: acc.activeCampaigns + (campaign.status === "running" ? 1 : 0),
    }),
    { totalSent: 0, totalDelivered: 0, totalRead: 0, activeCampaigns: 0 }
  ) || { totalSent: 0, totalDelivered: 0, totalRead: 0, activeCampaigns: 0 };

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isLoading,
    error: campaignsQuery.error,
    stats,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};
