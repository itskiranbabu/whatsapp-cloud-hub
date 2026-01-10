import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { useToast } from "@/hooks/use-toast";

export interface Ad {
  id: string;
  tenant_id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "facebook" | "instagram";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  messages: number;
  cost_per_message: number;
  ad_account_id?: string;
  campaign_id?: string;
  meta_ad_id?: string;
  created_at: string;
  updated_at: string;
}

export type AdInsert = Omit<Ad, "id" | "tenant_id" | "created_at" | "updated_at">;

export const useAds = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const adsQuery = useQuery({
    queryKey: ["ads", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ad[];
    },
    enabled: !!currentTenantId,
  });

  const createAd = useMutation({
    mutationFn: async (ad: Partial<AdInsert>) => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data, error } = await supabase
        .from("ads")
        .insert({
          tenant_id: currentTenantId,
          name: ad.name || "New Campaign",
          status: ad.status || "draft",
          platform: ad.platform || "facebook",
          budget: ad.budget || 0,
          spent: 0,
          impressions: 0,
          clicks: 0,
          messages: 0,
          cost_per_message: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentTenantId] });
      toast({ title: "Ad campaign created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create ad campaign", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateAd = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ad> & { id: string }) => {
      const { data, error } = await supabase
        .from("ads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentTenantId] });
      toast({ title: "Ad campaign updated" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update ad campaign", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteAd = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentTenantId] });
      toast({ title: "Ad campaign deleted" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to delete ad campaign", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const toggleAdStatus = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const { data, error } = await supabase
        .from("ads")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentTenantId] });
      toast({ 
        title: data.status === "active" ? "Ad campaign resumed" : "Ad campaign paused" 
      });
    },
  });

  // Calculate stats
  const stats = adsQuery.data?.reduce(
    (acc, ad) => ({
      totalSpent: acc.totalSpent + (ad.spent || 0),
      totalMessages: acc.totalMessages + (ad.messages || 0),
      activeAds: acc.activeAds + (ad.status === "active" ? 1 : 0),
      totalImpressions: acc.totalImpressions + (ad.impressions || 0),
    }),
    { totalSpent: 0, totalMessages: 0, activeAds: 0, totalImpressions: 0 }
  ) || { totalSpent: 0, totalMessages: 0, activeAds: 0, totalImpressions: 0 };

  const avgCostPerMessage = stats.totalMessages > 0 
    ? stats.totalSpent / stats.totalMessages 
    : 0;

  return {
    ads: adsQuery.data || [],
    isLoading: adsQuery.isLoading,
    error: adsQuery.error,
    stats: { ...stats, avgCostPerMessage },
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus,
  };
};
