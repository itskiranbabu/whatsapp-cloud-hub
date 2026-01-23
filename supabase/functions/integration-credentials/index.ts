import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialRequest {
  action: "store" | "test" | "delete";
  integration_id: string;
  integration_type: string;
  credentials?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight
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

    const body: CredentialRequest = await req.json();
    const { action, integration_id, integration_type, credentials } = body;

    // Verify the integration belongs to the user's tenant
    const { data: integration, error: intError } = await supabase
      .from("integrations")
      .select("id, tenant_id, integration_type, status")
      .eq("id", integration_id)
      .single();

    if (intError || !integration) {
      return new Response(
        JSON.stringify({ error: "Integration not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check user has tenant access
    const { data: hasAccess } = await supabase.rpc("has_tenant_access", {
      _tenant_id: integration.tenant_id,
      _user_id: user.id,
    });

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check user is admin
    const { data: isAdmin } = await supabase.rpc("is_tenant_admin", {
      _tenant_id: integration.tenant_id,
      _user_id: user.id,
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "store") {
      if (!credentials) {
        return new Response(
          JSON.stringify({ error: "Credentials are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate credentials based on integration type
      const validationResult = validateCredentials(integration_type, credentials);
      if (!validationResult.valid) {
        return new Response(
          JSON.stringify({ error: validationResult.error }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Test credentials if applicable
      const testResult = await testCredentials(integration_type, credentials);
      if (!testResult.success) {
        return new Response(
          JSON.stringify({ error: `Credential verification failed: ${testResult.error}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Store credentials securely using service role
      const { error: updateError } = await supabase
        .from("integrations")
        .update({
          credentials: credentials,
          status: "connected",
          last_sync_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", integration_id);

      if (updateError) {
        console.error("Error storing credentials:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to store credentials" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Credentials stored and verified" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "test") {
      // Get existing credentials
      const { data: fullIntegration, error: fetchError } = await supabase
        .from("integrations")
        .select("credentials")
        .eq("id", integration_id)
        .single();

      if (fetchError || !fullIntegration?.credentials) {
        return new Response(
          JSON.stringify({ error: "No credentials found to test" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const testResult = await testCredentials(
        integration_type,
        fullIntegration.credentials as Record<string, string>
      );

      if (testResult.success) {
        // Update last_sync_at on successful test
        await supabase
          .from("integrations")
          .update({ last_sync_at: new Date().toISOString(), error_message: null })
          .eq("id", integration_id);
      } else {
        // Update error message on failed test
        await supabase
          .from("integrations")
          .update({ error_message: testResult.error })
          .eq("id", integration_id);
      }

      return new Response(
        JSON.stringify({ success: testResult.success, message: testResult.success ? "Connection verified" : testResult.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      // Clear credentials
      const { error: deleteError } = await supabase
        .from("integrations")
        .update({ credentials: null, status: "disconnected" })
        .eq("id", integration_id);

      if (deleteError) {
        return new Response(
          JSON.stringify({ error: "Failed to delete credentials" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Credentials deleted" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function validateCredentials(type: string, credentials: Record<string, string>): { valid: boolean; error?: string } {
  switch (type) {
    case "razorpay":
      if (!credentials.key_id || !credentials.key_secret) {
        return { valid: false, error: "Razorpay requires key_id and key_secret" };
      }
      if (!credentials.key_id.startsWith("rzp_")) {
        return { valid: false, error: "Invalid Razorpay key format" };
      }
      break;
    case "shopify":
      if (!credentials.shop_domain || !credentials.access_token) {
        return { valid: false, error: "Shopify requires shop_domain and access_token" };
      }
      break;
    case "woocommerce":
      if (!credentials.site_url || !credentials.consumer_key || !credentials.consumer_secret) {
        return { valid: false, error: "WooCommerce requires site_url, consumer_key, and consumer_secret" };
      }
      break;
    case "zapier":
      if (!credentials.webhook_url) {
        return { valid: false, error: "Zapier requires webhook_url" };
      }
      if (!credentials.webhook_url.includes("hooks.zapier.com")) {
        return { valid: false, error: "Invalid Zapier webhook URL" };
      }
      break;
    case "hubspot":
    case "google_sheets":
    case "zoho_crm":
      if (!credentials.access_token) {
        return { valid: false, error: `${type} requires access_token` };
      }
      break;
  }
  return { valid: true };
}

async function testCredentials(type: string, credentials: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  try {
    switch (type) {
      case "razorpay": {
        // Test Razorpay API connection
        const auth = btoa(`${credentials.key_id}:${credentials.key_secret}`);
        const response = await fetch("https://api.razorpay.com/v1/plans", {
          method: "GET",
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!response.ok && response.status !== 404) {
          return { success: false, error: "Invalid Razorpay credentials" };
        }
        return { success: true };
      }
      case "shopify": {
        // Test Shopify API connection
        const response = await fetch(`https://${credentials.shop_domain}/admin/api/2024-01/shop.json`, {
          headers: { "X-Shopify-Access-Token": credentials.access_token },
        });
        if (!response.ok) {
          return { success: false, error: "Invalid Shopify credentials" };
        }
        return { success: true };
      }
      case "woocommerce": {
        // Test WooCommerce API connection
        const auth = btoa(`${credentials.consumer_key}:${credentials.consumer_secret}`);
        const response = await fetch(`${credentials.site_url}/wp-json/wc/v3/system_status`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!response.ok) {
          return { success: false, error: "Invalid WooCommerce credentials" };
        }
        return { success: true };
      }
      case "zapier": {
        // Zapier webhooks can't be tested without triggering, just validate format
        return { success: true };
      }
      default:
        // For OAuth-based integrations, we trust the access_token from OAuth flow
        return { success: true };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Connection test failed: ${message}` };
  }
}
