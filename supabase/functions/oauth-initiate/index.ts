import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OAuth configurations
const oauthProviders: Record<string, {
  authUrl: string;
  scopes: string[];
  clientIdEnvKey: string;
  additionalParams?: Record<string, string>;
}> = {
  google_sheets: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    clientIdEnvKey: "GOOGLE_CLIENT_ID",
    additionalParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },
  hubspot: {
    authUrl: "https://app.hubspot.com/oauth/authorize",
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
    clientIdEnvKey: "HUBSPOT_CLIENT_ID",
  },
  zoho_crm: {
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
    clientIdEnvKey: "ZOHO_CLIENT_ID",
    additionalParams: {
      access_type: "offline",
    },
  },
  calendly: {
    authUrl: "https://auth.calendly.com/oauth/authorize",
    scopes: [],
    clientIdEnvKey: "CALENDLY_CLIENT_ID",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { provider, tenant_id } = await req.json();

    if (!provider || !tenant_id) {
      return new Response(
        JSON.stringify({ error: "Missing provider or tenant_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify tenant access
    const { data: hasAccess } = await supabase.rpc("has_tenant_access", {
      _tenant_id: tenant_id,
      _user_id: user.id,
    });

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providerConfig = oauthProviders[provider];
    if (!providerConfig) {
      return new Response(
        JSON.stringify({ error: `Unsupported OAuth provider: ${provider}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get(providerConfig.clientIdEnvKey);
    if (!clientId) {
      return new Response(
        JSON.stringify({ error: `OAuth not configured for ${provider}. Please contact support.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build redirect URI for callback
    const callbackUrl = `${supabaseUrl}/functions/v1/oauth-callback`;

    // Build state parameter with necessary info
    const state = btoa(JSON.stringify({
      provider,
      tenant_id,
      user_id: user.id,
      redirect_uri: callbackUrl,
    }));

    // Build authorization URL
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: "code",
      scope: providerConfig.scopes.join(" "),
      state,
      ...providerConfig.additionalParams,
    });

    const authorizationUrl = `${providerConfig.authUrl}?${authParams.toString()}`;

    return new Response(
      JSON.stringify({ 
        authorization_url: authorizationUrl,
        provider,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("OAuth initiate error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to initiate OAuth flow" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
