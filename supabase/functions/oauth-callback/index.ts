import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OAuth configurations for different providers
const oauthProviders: Record<string, {
  tokenUrl: string;
  userInfoUrl?: string;
  clientIdEnvKey: string;
  clientSecretEnvKey: string;
}> = {
  google_sheets: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    clientIdEnvKey: "GOOGLE_CLIENT_ID",
    clientSecretEnvKey: "GOOGLE_CLIENT_SECRET",
  },
  hubspot: {
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    clientIdEnvKey: "HUBSPOT_CLIENT_ID",
    clientSecretEnvKey: "HUBSPOT_CLIENT_SECRET",
  },
  zoho_crm: {
    tokenUrl: "https://accounts.zoho.com/oauth/v2/token",
    clientIdEnvKey: "ZOHO_CLIENT_ID",
    clientSecretEnvKey: "ZOHO_CLIENT_SECRET",
  },
  calendly: {
    tokenUrl: "https://auth.calendly.com/oauth/token",
    clientIdEnvKey: "CALENDLY_CLIENT_ID",
    clientSecretEnvKey: "CALENDLY_CLIENT_SECRET",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return redirectWithError("OAuth authorization was denied or failed");
    }

    if (!code || !state) {
      return redirectWithError("Missing authorization code or state");
    }

    // Parse state to get provider and integration info
    let stateData: { provider: string; tenant_id: string; user_id: string; redirect_uri: string };
    try {
      stateData = JSON.parse(atob(state));
    } catch {
      return redirectWithError("Invalid state parameter");
    }

    const { provider, tenant_id, user_id, redirect_uri } = stateData;
    const providerConfig = oauthProviders[provider];

    if (!providerConfig) {
      return redirectWithError(`Unsupported OAuth provider: ${provider}`);
    }

    const clientId = Deno.env.get(providerConfig.clientIdEnvKey);
    const clientSecret = Deno.env.get(providerConfig.clientSecretEnvKey);

    if (!clientId || !clientSecret) {
      console.error(`Missing OAuth credentials for ${provider}`);
      return redirectWithError("OAuth configuration error");
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(providerConfig.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return redirectWithError("Failed to exchange authorization code");
    }

    const tokens = await tokenResponse.json();
    console.log(`Successfully obtained tokens for ${provider}`);

    // Store tokens securely in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if integration already exists
    const { data: existing } = await supabase
      .from("integrations")
      .select("id")
      .eq("tenant_id", tenant_id)
      .eq("integration_type", provider)
      .maybeSingle();

    const credentials = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_in 
        ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        : null,
      scope: tokens.scope,
    };

    const integrationName = getIntegrationName(provider);

    if (existing) {
      await supabase
        .from("integrations")
        .update({
          credentials,
          status: "connected",
          last_sync_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("integrations")
        .insert({
          tenant_id,
          integration_type: provider,
          name: integrationName,
          credentials,
          status: "connected",
          config: { connected_at: new Date().toISOString() },
          last_sync_at: new Date().toISOString(),
        });
    }

    // Redirect back to integrations page with success
    const successUrl = `${getAppUrl()}/integrations?connected=${provider}`;
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: successUrl,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return redirectWithError("An unexpected error occurred");
  }
});

function getAppUrl(): string {
  return Deno.env.get("APP_URL") || "https://keyrunflow.lovable.app";
}

function getIntegrationName(provider: string): string {
  const names: Record<string, string> = {
    google_sheets: "Google Sheets",
    hubspot: "HubSpot",
    zoho_crm: "Zoho CRM",
    calendly: "Calendly",
  };
  return names[provider] || provider;
}

function redirectWithError(message: string): Response {
  const errorUrl = `${getAppUrl()}/integrations?error=${encodeURIComponent(message)}`;
  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: errorUrl,
    },
  });
}
