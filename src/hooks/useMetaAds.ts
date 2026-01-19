import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";

interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
  business?: { id: string; name: string };
}

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  created_time: string;
  insights?: {
    impressions: string;
    clicks: string;
    spend: string;
    reach: string;
    actions?: Array<{ action_type: string; value: string }>;
  };
}

export const useMetaAds = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFBSDKLoaded, setIsFBSDKLoaded] = useState(false);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string | null>(null);

  // Initialize Facebook SDK
  useEffect(() => {
    if (window.FB) {
      setIsFBSDKLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      const metaAppId = import.meta.env.VITE_META_APP_ID;
      if (!metaAppId) {
        console.warn("Meta App ID not configured");
        return;
      }

      window.FB.init({
        appId: metaAppId,
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
      setIsFBSDKLoaded(true);
    };

    // Load SDK if not already loaded
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Check if Meta Ads is connected
  const connectionQuery = useQuery({
    queryKey: ["meta-ads-connection", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return null;

      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .eq("integration_type", "meta_ads")
        .eq("status", "connected")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentTenantId,
  });

  // Fetch ad accounts from stored integration
  const adAccountsQuery = useQuery({
    queryKey: ["meta-ad-accounts", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId || !connectionQuery.data) return [];

      const config = connectionQuery.data.config as any;
      return (config?.ad_accounts || []) as AdAccount[];
    },
    enabled: !!currentTenantId && !!connectionQuery.data,
  });

  // Fetch campaigns for selected ad account
  const campaignsQuery = useQuery({
    queryKey: ["meta-campaigns", currentTenantId, selectedAdAccount],
    queryFn: async () => {
      if (!currentTenantId || !selectedAdAccount) return [];

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("meta-ads-api", {
        body: null,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      // Use URL params for GET-like requests
      const { data, error } = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-api?action=get_campaigns&tenant_id=${currentTenantId}&ad_account_id=${selectedAdAccount}`,
        {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(r => r.json());

      if (error) throw new Error(error);
      return (data?.campaigns || []) as MetaCampaign[];
    },
    enabled: !!currentTenantId && !!selectedAdAccount && !!connectionQuery.data,
    refetchInterval: 60000, // Refresh every minute
  });

  // Connect Meta Ads via OAuth
  const connectMeta = useCallback(async () => {
    if (!isFBSDKLoaded || !currentTenantId) {
      toast({
        title: "Facebook SDK not ready",
        description: "Please wait a moment and try again",
        variant: "destructive",
      });
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const handleLoginResponse = (response: any) => {
        // Keep this callback synchronous; FB SDK can throw on async callbacks.
        void (async () => {
          if (response?.authResponse) {
            try {
              const { data: session } = await supabase.auth.getSession();
              if (!session.session) throw new Error("Not authenticated");

              // Exchange the code for a long-lived token
              const result = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-api?action=exchange_token&tenant_id=${currentTenantId}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${session.session.access_token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    code: response.authResponse.accessToken,
                    redirect_uri: window.location.origin,
                  }),
                }
              ).then((r) => r.json());

              if (result.error) {
                throw new Error(result.error);
              }

              queryClient.invalidateQueries({ queryKey: ["meta-ads-connection"] });
              queryClient.invalidateQueries({ queryKey: ["meta-ad-accounts"] });

              toast({
                title: "Meta Ads Connected!",
                description: `Found ${result.ad_accounts?.length || 0} ad accounts`,
              });
              resolve();
            } catch (error: any) {
              console.error("Meta connection error:", error);
              toast({
                title: "Connection Failed",
                description: error.message || "Failed to connect Meta Ads",
                variant: "destructive",
              });
              reject(error);
            }
          } else {
            toast({
              title: "Connection Cancelled",
              description: "You cancelled the Facebook login",
              variant: "destructive",
            });
            reject(new Error("User cancelled login"));
          }
        })();
      };

      (window as any).FB.login(handleLoginResponse, {
        scope: "ads_management,ads_read,business_management,pages_read_engagement",
        return_scopes: true,
      });
    });
  }, [isFBSDKLoaded, currentTenantId, queryClient, toast]);

  // Disconnect Meta Ads
  const disconnectMeta = useMutation({
    mutationFn: async () => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const result = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-api?action=disconnect&tenant_id=${currentTenantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(r => r.json());

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-ads-connection"] });
      queryClient.invalidateQueries({ queryKey: ["meta-ad-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["meta-campaigns"] });
      toast({ title: "Meta Ads Disconnected" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to disconnect",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Sync campaigns from Meta to local ads table
  const syncCampaigns = useMutation({
    mutationFn: async (adAccountId: string) => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const result = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-api?action=sync_campaigns&tenant_id=${currentTenantId}&ad_account_id=${adAccountId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      ).then(r => r.json());

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      queryClient.invalidateQueries({ queryKey: ["meta-campaigns"] });
      toast({ title: `Synced ${data.synced} campaigns from Meta` });
    },
    onError: (error: any) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create campaign on Meta
  const createCampaign = useMutation({
    mutationFn: async (params: { 
      adAccountId: string; 
      name: string; 
      objective?: string;
      status?: string;
    }) => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const result = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-api?action=create_campaign&tenant_id=${currentTenantId}&ad_account_id=${params.adAccountId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: params.name,
            objective: params.objective || "MESSAGES",
            status: params.status || "PAUSED",
          }),
        }
      ).then(r => r.json());

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast({ title: "Campaign created on Meta" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    isConnected: !!connectionQuery.data,
    isLoading: connectionQuery.isLoading,
    isFBSDKLoaded,
    adAccounts: adAccountsQuery.data || [],
    campaigns: campaignsQuery.data || [],
    selectedAdAccount,
    setSelectedAdAccount,
    connectMeta,
    disconnectMeta,
    syncCampaigns,
    createCampaign,
  };
};
