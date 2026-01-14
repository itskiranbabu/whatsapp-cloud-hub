import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface Partner {
  id: string;
  name: string;
  slug: string;
  owner_user_id: string;
  custom_domain: string | null;
  branding: Json;
  commission_rate: number;
  revenue_share_model: string;
  payout_details: Json;
  status: string;
  total_revenue: number;
  total_clients: number;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  commission_rate: number;
  total_earnings: number;
  pending_payout: number;
  payout_details: Json;
  status: string;
  created_at: string;
  updated_at: string;
}

export function usePartners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const partnersQuery = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Partner[];
    },
  });

  const createPartnerMutation = useMutation({
    mutationFn: async (partner: { name: string; slug: string; custom_domain?: string; revenue_share_model?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("partners").insert({
        name: partner.name,
        slug: partner.slug,
        owner_user_id: user.id,
        custom_domain: partner.custom_domain || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["partners"] }); toast({ title: "Partner created" }); },
    onError: (error) => { toast({ title: "Failed", description: error.message, variant: "destructive" }); },
  });

  return {
    partners: partnersQuery.data || [],
    isLoading: partnersQuery.isLoading,
    createPartner: createPartnerMutation.mutate,
    isCreating: createPartnerMutation.isPending,
  };
}

export function useAffiliates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const affiliatesQuery = useQuery({
    queryKey: ["affiliates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Affiliate[];
    },
  });

  const createAffiliateMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const referralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const { data, error } = await supabase.from("affiliates").insert({ user_id: user.id, referral_code: referralCode }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["affiliates"] }); toast({ title: "Affiliate account created" }); },
    onError: (error) => { toast({ title: "Failed", description: error.message, variant: "destructive" }); },
  });

  return {
    affiliates: affiliatesQuery.data || [],
    isLoading: affiliatesQuery.isLoading,
    createAffiliate: createAffiliateMutation.mutate,
    isCreating: createAffiliateMutation.isPending,
  };
}

export function useCommissions() {
  const { data, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("commissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  return { commissions: data || [], isLoading };
}

export function usePayouts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payouts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const requestPayoutMutation = useMutation({
    mutationFn: async ({ amount, affiliateId }: { amount: number; affiliateId?: string }) => {
      const { data, error } = await supabase.from("payouts").insert({ affiliate_id: affiliateId, amount, status: "pending" }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["payouts"] }); toast({ title: "Payout requested" }); },
  });

  return { payouts: data || [], isLoading, requestPayout: requestPayoutMutation.mutate, isRequesting: requestPayoutMutation.isPending };
}
