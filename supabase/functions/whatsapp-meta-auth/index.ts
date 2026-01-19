import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_GRAPH_URL = 'https://graph.facebook.com/v21.0';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface DebugTokenResponse {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    scopes: string[];
    granular_scopes: Array<{
      scope: string;
      target_ids?: string[];
    }>;
  };
}

interface WABAInfo {
  id: string;
  name: string;
  phone_numbers: {
    data: Array<{
      id: string;
      display_phone_number: string;
      verified_name: string;
    }>;
  };
}

// Exchange OAuth code for access token
async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const appId = Deno.env.get('VITE_META_APP_ID');
  const appSecret = Deno.env.get('META_APP_SECRET');

  if (!appId || !appSecret) {
    throw new Error('Meta App credentials not configured. Please add VITE_META_APP_ID and META_APP_SECRET secrets.');
  }

  console.log('Exchanging code for token with App ID:', appId);

  const response = await fetch(
    `${META_GRAPH_URL}/oauth/access_token?` +
    `client_id=${appId}&` +
    `client_secret=${appSecret}&` +
    `code=${code}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Token exchange error:', error);
    throw new Error(error.error?.message || 'Failed to exchange code for token');
  }

  return await response.json();
}

// Get long-lived access token
async function getLongLivedToken(shortLivedToken: string): Promise<TokenResponse> {
  const appId = Deno.env.get('VITE_META_APP_ID');
  const appSecret = Deno.env.get('META_APP_SECRET');

  console.log('Exchanging for long-lived token...');

  const response = await fetch(
    `${META_GRAPH_URL}/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${appId}&` +
    `client_secret=${appSecret}&` +
    `fb_exchange_token=${shortLivedToken}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Long-lived token exchange error:', error);
    // Return short-lived token if long-lived exchange fails
    return { access_token: shortLivedToken, token_type: 'bearer' };
  }

  return await response.json();
}

// Debug/validate access token
async function debugToken(accessToken: string): Promise<DebugTokenResponse> {
  const appId = Deno.env.get('VITE_META_APP_ID');
  const appSecret = Deno.env.get('META_APP_SECRET');

  const response = await fetch(
    `${META_GRAPH_URL}/debug_token?` +
    `input_token=${accessToken}&` +
    `access_token=${appId}|${appSecret}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to debug token');
  }

  return await response.json();
}

// Get shared WABAs from the embedded signup response
async function getSharedWABAs(accessToken: string): Promise<WABAInfo[]> {
  console.log('Fetching shared WhatsApp Business Accounts...');

  // First, get the user's shared WABA IDs
  const response = await fetch(
    `${META_GRAPH_URL}/me?fields=id,name`,
    { 
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Error fetching user info:', error);
    throw new Error(error.error?.message || 'Failed to fetch user info');
  }

  // Get debug token info to find WABA scopes
  const debugInfo = await debugToken(accessToken);
  console.log('Token debug info:', JSON.stringify(debugInfo, null, 2));

  // Extract WABA IDs from granular scopes
  const wabaIds: string[] = [];
  for (const scope of debugInfo.data.granular_scopes || []) {
    if (scope.scope === 'whatsapp_business_management' && scope.target_ids) {
      wabaIds.push(...scope.target_ids);
    }
    if (scope.scope === 'whatsapp_business_messaging' && scope.target_ids) {
      wabaIds.push(...scope.target_ids);
    }
  }

  // Deduplicate WABA IDs
  const uniqueWabaIds = [...new Set(wabaIds)];
  console.log('Found WABA IDs:', uniqueWabaIds);

  if (uniqueWabaIds.length === 0) {
    throw new Error('No WhatsApp Business Accounts found. Please make sure you shared a WABA during signup.');
  }

  // Fetch details for each WABA
  const wabas: WABAInfo[] = [];
  for (const wabaId of uniqueWabaIds) {
    try {
      const wabaResponse = await fetch(
        `${META_GRAPH_URL}/${wabaId}?fields=id,name,phone_numbers{id,display_phone_number,verified_name}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (wabaResponse.ok) {
        const wabaData = await wabaResponse.json();
        wabas.push(wabaData);
        console.log('WABA details:', JSON.stringify(wabaData, null, 2));
      }
    } catch (error) {
      console.error(`Error fetching WABA ${wabaId}:`, error);
    }
  }

  return wabas;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, code, tenant_id } = await req.json();

    console.log('Auth action:', action, 'Tenant:', tenant_id);

    // Check if Meta credentials are configured
    if (action === 'check_config') {
      const appId = Deno.env.get('VITE_META_APP_ID');
      const appSecret = Deno.env.get('META_APP_SECRET');
      const configId = Deno.env.get('VITE_META_CONFIG_ID');
      
      const isConfigured = !!(appId && appSecret && configId);
      
      console.log('Config check - App ID:', !!appId, 'Secret:', !!appSecret, 'Config ID:', !!configId);
      
      return new Response(
        JSON.stringify({
          success: true,
          configured: isConfigured,
          app_id: appId || null,
          config_id: configId || null,
          // Never expose the secret, just confirm it exists
          has_secret: !!appSecret,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'exchange_code') {
      if (!code) {
        return new Response(
          JSON.stringify({ success: false, error: 'Authorization code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!tenant_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Tenant ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 1: Exchange code for short-lived token
      console.log('Step 1: Exchanging code for token...');
      const tokenResponse = await exchangeCodeForToken(code);
      console.log('Short-lived token obtained');

      // Step 2: Get long-lived token
      console.log('Step 2: Getting long-lived token...');
      const longLivedToken = await getLongLivedToken(tokenResponse.access_token);
      console.log('Long-lived token obtained');

      // Step 3: Get shared WABAs and phone numbers
      console.log('Step 3: Fetching shared WABAs...');
      const wabas = await getSharedWABAs(longLivedToken.access_token);

      if (wabas.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No WhatsApp Business Accounts found. Please complete the embedded signup and share a WABA.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get first WABA and first phone number
      const primaryWaba = wabas[0];
      const phoneNumbers = primaryWaba.phone_numbers?.data || [];
      
      if (phoneNumbers.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No phone numbers found in the shared WABA. Please add a phone number to your WhatsApp Business Account.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const primaryPhone = phoneNumbers[0];

      // Step 4: Update tenant with Meta credentials
      console.log('Step 4: Updating tenant with credentials...');
      const { error: updateError } = await supabase
        .from('tenants')
        .update({
          waba_id: primaryWaba.id,
          phone_number_id: primaryPhone.id,
          meta_access_token: longLivedToken.access_token,
          bsp_provider: 'meta_direct',
          business_name: primaryPhone.verified_name || primaryWaba.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tenant_id);

      if (updateError) {
        console.error('Failed to update tenant:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to save credentials to database' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully connected Meta Direct for tenant:', tenant_id);

      return new Response(
        JSON.stringify({
          success: true,
          waba_id: primaryWaba.id,
          waba_name: primaryWaba.name,
          phone_number_id: primaryPhone.id,
          display_phone_number: primaryPhone.display_phone_number,
          verified_name: primaryPhone.verified_name,
          available_wabas: wabas.map(w => ({
            id: w.id,
            name: w.name,
            phone_numbers: w.phone_numbers?.data?.length || 0
          })),
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'debug_connection') {
      // Debug existing connection
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('waba_id, phone_number_id, meta_access_token, bsp_provider, business_name')
        .eq('id', tenant_id)
        .single();

      if (error || !tenant?.meta_access_token) {
        return new Response(
          JSON.stringify({ success: false, error: 'No Meta connection found for this tenant' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      try {
        const debugInfo = await debugToken(tenant.meta_access_token);
        return new Response(
          JSON.stringify({
            success: true,
            connection: {
              waba_id: tenant.waba_id,
              phone_number_id: tenant.phone_number_id,
              business_name: tenant.business_name,
              provider: tenant.bsp_provider,
            },
            token_info: {
              is_valid: debugInfo.data.is_valid,
              expires_at: debugInfo.data.expires_at,
              scopes: debugInfo.data.scopes,
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (tokenError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Access token is invalid or expired',
            connection: {
              waba_id: tenant.waba_id,
              phone_number_id: tenant.phone_number_id,
            }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'disconnect') {
      const { error: updateError } = await supabase
        .from('tenants')
        .update({
          waba_id: null,
          phone_number_id: null,
          meta_access_token: null,
          meta_app_secret: null,
          meta_webhook_verify_token: null,
          bsp_provider: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tenant_id);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to disconnect' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Meta connection disconnected' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
