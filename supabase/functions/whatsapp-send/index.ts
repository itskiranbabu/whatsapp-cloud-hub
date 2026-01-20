import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendMessageRequest {
  tenant_id: string;
  contact_id: string;
  conversation_id: string;
  message_type: 'text' | 'template' | 'media';
  content?: string;
  template_name?: string;
  template_variables?: string[];
  media_url?: string;
  bsp_provider?: 'twilio' | '360dialog' | 'gupshup';
}

interface BSPConfig {
  provider: string;
  phone_number_id: string;
  access_token: string;
  account_sid?: string; // Twilio
  auth_token?: string; // Twilio
  api_key?: string; // 360dialog/Gupshup
}

async function sendViaTwilio(
  config: BSPConfig,
  to: string,
  message: SendMessageRequest
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  const { account_sid, auth_token, phone_number_id } = config;
  
  if (!account_sid || !auth_token) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${account_sid}/Messages.json`;
  
  const formData = new URLSearchParams();
  formData.append('From', `whatsapp:+${phone_number_id}`);
  formData.append('To', `whatsapp:+${to}`);
  
  if (message.message_type === 'text' && message.content) {
    formData.append('Body', message.content);
  } else if (message.message_type === 'template' && message.template_name) {
    // Twilio uses ContentSid for templates
    formData.append('ContentSid', message.template_name);
    if (message.template_variables) {
      formData.append('ContentVariables', JSON.stringify(
        Object.fromEntries(message.template_variables.map((v, i) => [(i + 1).toString(), v]))
      ));
    }
  } else if (message.message_type === 'media' && message.media_url) {
    formData.append('MediaUrl', message.media_url);
    if (message.content) {
      formData.append('Body', message.content);
    }
  }

  try {
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${account_sid}:${auth_token}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, message_id: data.sid };
    } else {
      console.error('Twilio error:', data);
      return { success: false, error: data.message || 'Failed to send via Twilio' };
    }
  } catch (error: unknown) {
    console.error('Twilio request error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendVia360Dialog(
  config: BSPConfig,
  to: string,
  message: SendMessageRequest
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  const { api_key, phone_number_id } = config;
  
  if (!api_key) {
    return { success: false, error: "360dialog API key not configured" };
  }

  const dialogUrl = 'https://waba.360dialog.io/v1/messages';
  
  let payload: Record<string, unknown> = {
    to: to,
    type: message.message_type,
  };

  if (message.message_type === 'text' && message.content) {
    payload.text = { body: message.content };
  } else if (message.message_type === 'template' && message.template_name) {
    payload.template = {
      namespace: phone_number_id,
      name: message.template_name,
      language: { code: 'en', policy: 'deterministic' },
      components: message.template_variables?.map((v, i) => ({
        type: 'body',
        parameters: [{ type: 'text', text: v }]
      })) || []
    };
  } else if (message.message_type === 'media' && message.media_url) {
    payload.image = { link: message.media_url, caption: message.content || undefined };
  }

  try {
    const response = await fetch(dialogUrl, {
      method: 'POST',
      headers: {
        'D360-API-KEY': api_key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok && data.messages?.[0]?.id) {
      return { success: true, message_id: data.messages[0].id };
    } else {
      console.error('360dialog error:', data);
      return { success: false, error: data.error?.message || 'Failed to send via 360dialog' };
    }
  } catch (error: unknown) {
    console.error('360dialog request error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendViaGupshup(
  config: BSPConfig,
  to: string,
  message: SendMessageRequest
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  const { api_key, phone_number_id } = config;
  
  if (!api_key) {
    return { success: false, error: "Gupshup API key not configured" };
  }

  const gupshupUrl = 'https://api.gupshup.io/sm/api/v1/msg';
  
  const formData = new URLSearchParams();
  formData.append('channel', 'whatsapp');
  formData.append('source', phone_number_id);
  formData.append('destination', to);
  formData.append('src.name', 'WhatsFlow');

  if (message.message_type === 'text' && message.content) {
    formData.append('message', JSON.stringify({ type: 'text', text: message.content }));
  } else if (message.message_type === 'template' && message.template_name) {
    formData.append('message', JSON.stringify({
      type: 'template',
      template: {
        id: message.template_name,
        params: message.template_variables || []
      }
    }));
  } else if (message.message_type === 'media' && message.media_url) {
    formData.append('message', JSON.stringify({
      type: 'image',
      originalUrl: message.media_url,
      caption: message.content || ''
    }));
  }

  try {
    const response = await fetch(gupshupUrl, {
      method: 'POST',
      headers: {
        'apikey': api_key,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    
    if (response.ok && data.status === 'submitted') {
      return { success: true, message_id: data.messageId };
    } else {
      console.error('Gupshup error:', data);
      return { success: false, error: data.message || 'Failed to send via Gupshup' };
    }
  } catch (error: unknown) {
    console.error('Gupshup request error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT and get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: SendMessageRequest = await req.json();
    const { tenant_id, contact_id, conversation_id, message_type, content, template_name, template_variables, media_url, bsp_provider } = requestData;

    console.log('Sending WhatsApp message:', { tenant_id, contact_id, message_type });

    // Verify user has access to tenant
    const { data: hasAccess } = await supabase.rpc('has_tenant_access', {
      _user_id: user.id,
      _tenant_id: tenant_id
    });

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Access denied to tenant' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========== RATE LIMITING: Check message quota ==========
    const { data: quotaAllowed, error: quotaError } = await supabase.rpc('check_and_increment_quota', {
      _tenant_id: tenant_id,
      _quota_type: 'messages'
    });

    if (quotaError) {
      console.error('Quota check error:', quotaError);
      // Don't block on quota errors, just log
    } else if (!quotaAllowed) {
      console.log('Rate limit exceeded for tenant:', tenant_id);
      return new Response(
        JSON.stringify({ 
          error: 'Daily message quota exceeded. Please upgrade your plan or try again tomorrow.',
          code: 'QUOTA_EXCEEDED'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ========== END RATE LIMITING ==========

    // Get tenant configuration
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenant_id)
      .single();

    if (tenantError || !tenant) {
      return new Response(
        JSON.stringify({ error: 'Tenant not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get contact phone number
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('phone')
      .eq('id', contact_id)
      .eq('tenant_id', tenant_id)
      .single();

    if (contactError || !contact) {
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create message record with pending status
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        tenant_id,
        contact_id,
        conversation_id,
        direction: 'outbound',
        message_type,
        content: content || null,
        status: 'pending'
      })
      .select()
      .single();

    if (messageError) {
      console.error('Failed to create message record:', messageError);
      return new Response(
        JSON.stringify({ error: 'Failed to create message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine BSP provider and get credentials
    // In production, these would come from tenant configuration or secrets
    const provider = bsp_provider || 'twilio';
    
    // Get BSP credentials from environment (in production, fetch from tenant config)
    const bspConfig: BSPConfig = {
      provider,
      phone_number_id: tenant.phone_number_id || '',
      access_token: '',
      account_sid: Deno.env.get('TWILIO_ACCOUNT_SID'),
      auth_token: Deno.env.get('TWILIO_AUTH_TOKEN'),
      api_key: Deno.env.get('DIALOG360_API_KEY') || Deno.env.get('GUPSHUP_API_KEY'),
    };

    // Send message via appropriate BSP
    let result: { success: boolean; message_id?: string; error?: string };
    
    switch (provider) {
      case 'twilio':
        result = await sendViaTwilio(bspConfig, contact.phone, requestData);
        break;
      case '360dialog':
        result = await sendVia360Dialog(bspConfig, contact.phone, requestData);
        break;
      case 'gupshup':
        result = await sendViaGupshup(bspConfig, contact.phone, requestData);
        break;
      default:
        result = { success: false, error: 'Unknown BSP provider' };
    }

    // Update message status based on result
    const updateData = result.success
      ? { 
          status: 'sent' as const, 
          whatsapp_message_id: result.message_id, 
          sent_at: new Date().toISOString() 
        }
      : { 
          status: 'failed' as const, 
          failed_reason: result.error 
        };

    await supabase
      .from('messages')
      .update(updateData)
      .eq('id', message.id);

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id);

    if (!result.success) {
      console.error('Message send failed:', result.error);
      return new Response(
        JSON.stringify({ error: result.error, message_id: message.id }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Message sent successfully:', result.message_id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: message.id,
        whatsapp_message_id: result.message_id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in whatsapp-send function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});