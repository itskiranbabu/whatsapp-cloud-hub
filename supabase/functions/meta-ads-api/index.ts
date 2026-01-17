import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const META_GRAPH_URL = "https://graph.facebook.com/v21.0";

// Exchange authorization code for access token
async function exchangeCodeForToken(code: string, redirectUri: string) {
  const appId = Deno.env.get("META_APP_ID");
  const appSecret = Deno.env.get("META_APP_SECRET");

  if (!appId || !appSecret) {
    throw new Error("Meta App credentials not configured");
  }

  const response = await fetch(
    `${META_GRAPH_URL}/oauth/access_token?` +
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        code,
        redirect_uri: redirectUri,
      })
  );

  const data = await response.json();
  if (data.error) {
    console.error("Token exchange error:", data.error);
    throw new Error(data.error.message || "Failed to exchange code for token");
  }

  return data.access_token;
}

// Get long-lived access token
async function getLongLivedToken(shortLivedToken: string) {
  const appId = Deno.env.get("META_APP_ID");
  const appSecret = Deno.env.get("META_APP_SECRET");

  const response = await fetch(
    `${META_GRAPH_URL}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: appId!,
        client_secret: appSecret!,
        fb_exchange_token: shortLivedToken,
      })
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to get long-lived token");
  }

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
  };
}

// Fetch user's ad accounts
async function getAdAccounts(accessToken: string) {
  const response = await fetch(
    `${META_GRAPH_URL}/me/adaccounts?` +
      new URLSearchParams({
        fields: "id,name,account_status,currency,timezone_name,business",
        access_token: accessToken,
      })
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to fetch ad accounts");
  }

  return data.data || [];
}

// Fetch campaigns for an ad account
async function getCampaigns(adAccountId: string, accessToken: string) {
  const response = await fetch(
    `${META_GRAPH_URL}/${adAccountId}/campaigns?` +
      new URLSearchParams({
        fields: "id,name,status,objective,daily_budget,lifetime_budget,created_time,start_time,stop_time",
        access_token: accessToken,
      })
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to fetch campaigns");
  }

  return data.data || [];
}

// Fetch campaign insights (performance data)
async function getCampaignInsights(campaignId: string, accessToken: string) {
  const response = await fetch(
    `${META_GRAPH_URL}/${campaignId}/insights?` +
      new URLSearchParams({
        fields: "impressions,clicks,spend,reach,cpm,cpc,actions",
        date_preset: "last_30d",
        access_token: accessToken,
      })
  );

  const data = await response.json();
  if (data.error) {
    console.error("Insights fetch error:", data.error);
    return null;
  }

  return data.data?.[0] || null;
}

// Create a new campaign
async function createCampaign(
  adAccountId: string,
  accessToken: string,
  params: {
    name: string;
    objective: string;
    status: string;
    special_ad_categories?: string[];
  }
) {
  const formData = new FormData();
  formData.append("name", params.name);
  formData.append("objective", params.objective || "MESSAGES");
  formData.append("status", params.status || "PAUSED");
  formData.append("special_ad_categories", JSON.stringify(params.special_ad_categories || []));
  formData.append("access_token", accessToken);

  const response = await fetch(`${META_GRAPH_URL}/${adAccountId}/campaigns`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to create campaign");
  }

  return data;
}

// Update campaign status
async function updateCampaignStatus(
  campaignId: string,
  accessToken: string,
  status: string
) {
  const formData = new FormData();
  formData.append("status", status);
  formData.append("access_token", accessToken);

  const response = await fetch(`${META_GRAPH_URL}/${campaignId}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to update campaign");
  }

  return data;
}

// Delete a campaign
async function deleteCampaign(campaignId: string, accessToken: string) {
  const response = await fetch(
    `${META_GRAPH_URL}/${campaignId}?access_token=${accessToken}`,
    { method: "DELETE" }
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Failed to delete campaign");
  }

  return data;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const tenantId = url.searchParams.get("tenant_id");

    if (!tenantId) {
      throw new Error("tenant_id is required");
    }

    // Verify user has access to tenant
    const { data: hasAccess } = await supabase.rpc("has_tenant_access", {
      _tenant_id: tenantId,
      _user_id: user.id,
    });

    if (!hasAccess) {
      throw new Error("Access denied to this tenant");
    }

    let result: any;

    switch (action) {
      case "exchange_token": {
        const { code, redirect_uri } = await req.json();
        console.log("Exchanging code for token...");
        
        const shortLivedToken = await exchangeCodeForToken(code, redirect_uri);
        const longLivedData = await getLongLivedToken(shortLivedToken);
        const adAccounts = await getAdAccounts(longLivedData.access_token);

        // Store the token and ad accounts in the integrations table
        const { error: upsertError } = await supabase
          .from("integrations")
          .upsert({
            tenant_id: tenantId,
            integration_type: "meta_ads",
            name: "Meta Ads",
            status: "connected",
            config: { ad_accounts: adAccounts },
            credentials: { 
              access_token: longLivedData.access_token,
              expires_at: new Date(Date.now() + longLivedData.expires_in * 1000).toISOString(),
            },
            last_sync_at: new Date().toISOString(),
          }, {
            onConflict: "tenant_id,integration_type",
          });

        if (upsertError) {
          console.error("Failed to store integration:", upsertError);
          throw new Error("Failed to store Meta connection");
        }

        result = { success: true, ad_accounts: adAccounts };
        break;
      }

      case "get_ad_accounts": {
        // Get stored credentials
        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials, config")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        const adAccounts = await getAdAccounts(integration.credentials.access_token);
        result = { ad_accounts: adAccounts };
        break;
      }

      case "get_campaigns": {
        const adAccountId = url.searchParams.get("ad_account_id");
        if (!adAccountId) {
          throw new Error("ad_account_id is required");
        }

        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        const campaigns = await getCampaigns(adAccountId, integration.credentials.access_token);
        
        // Fetch insights for each campaign
        const campaignsWithInsights = await Promise.all(
          campaigns.map(async (campaign: any) => {
            const insights = await getCampaignInsights(campaign.id, integration.credentials.access_token);
            return { ...campaign, insights };
          })
        );

        result = { campaigns: campaignsWithInsights };
        break;
      }

      case "create_campaign": {
        const adAccountId = url.searchParams.get("ad_account_id");
        const body = await req.json();

        if (!adAccountId) {
          throw new Error("ad_account_id is required");
        }

        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        const campaign = await createCampaign(
          adAccountId,
          integration.credentials.access_token,
          body
        );

        result = { success: true, campaign };
        break;
      }

      case "update_campaign_status": {
        const campaignId = url.searchParams.get("campaign_id");
        const { status } = await req.json();

        if (!campaignId) {
          throw new Error("campaign_id is required");
        }

        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        await updateCampaignStatus(campaignId, integration.credentials.access_token, status);
        result = { success: true };
        break;
      }

      case "delete_campaign": {
        const campaignId = url.searchParams.get("campaign_id");

        if (!campaignId) {
          throw new Error("campaign_id is required");
        }

        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        await deleteCampaign(campaignId, integration.credentials.access_token);
        result = { success: true };
        break;
      }

      case "sync_campaigns": {
        const adAccountId = url.searchParams.get("ad_account_id");

        if (!adAccountId) {
          throw new Error("ad_account_id is required");
        }

        const { data: integration } = await supabase
          .from("integrations")
          .select("credentials")
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads")
          .single();

        if (!integration?.credentials?.access_token) {
          throw new Error("Meta Ads not connected");
        }

        const campaigns = await getCampaigns(adAccountId, integration.credentials.access_token);
        
        // Sync each campaign to our ads table
        for (const campaign of campaigns) {
          const insights = await getCampaignInsights(campaign.id, integration.credentials.access_token);
          
          // Extract message actions if available
          const messageActions = insights?.actions?.find((a: any) => 
            a.action_type === "onsite_conversion.messaging_first_reply" ||
            a.action_type === "onsite_web_lead"
          );

          await supabase
            .from("ads")
            .upsert({
              tenant_id: tenantId,
              meta_ad_id: campaign.id,
              ad_account_id: adAccountId,
              name: campaign.name,
              status: campaign.status.toLowerCase() === "active" ? "active" : 
                      campaign.status.toLowerCase() === "paused" ? "paused" : "draft",
              platform: "facebook",
              budget: parseFloat(campaign.daily_budget || campaign.lifetime_budget || 0) / 100,
              spent: parseFloat(insights?.spend || 0),
              impressions: parseInt(insights?.impressions || 0),
              clicks: parseInt(insights?.clicks || 0),
              messages: parseInt(messageActions?.value || 0),
              cost_per_message: messageActions?.value > 0 
                ? parseFloat(insights?.spend || 0) / parseInt(messageActions.value)
                : 0,
            }, {
              onConflict: "tenant_id,meta_ad_id",
              ignoreDuplicates: false,
            });
        }

        result = { success: true, synced: campaigns.length };
        break;
      }

      case "disconnect": {
        const { error: deleteError } = await supabase
          .from("integrations")
          .delete()
          .eq("tenant_id", tenantId)
          .eq("integration_type", "meta_ads");

        if (deleteError) {
          throw new Error("Failed to disconnect Meta Ads");
        }

        result = { success: true };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Meta Ads API error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
