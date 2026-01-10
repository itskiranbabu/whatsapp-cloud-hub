import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

interface SendMessageRequest {
  tenant_id: string;
  contact_id: string;
  conversation_id: string;
  message_type: 'text' | 'template' | 'image' | 'document' | 'video' | 'audio';
  content?: string;
  template_name?: string;
  template_language?: string;
  template_components?: any[];
  media_url?: string;
  media_caption?: string;
}

// Send text message via Meta Cloud API
async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
): Promise<any> {
  const response = await fetch(`${META_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: true,
        body: text,
      },
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to send text message');
  }
  
  return data;
}

// Send template message via Meta Cloud API
async function sendTemplateMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  templateName: string,
  languageCode: string,
  components?: any[]
): Promise<any> {
  const payload: any = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
    },
  };

  if (components && components.length > 0) {
    payload.template.components = components;
  }

  const response = await fetch(`${META_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to send template message');
  }
  
  return data;
}

// Send media message via Meta Cloud API
async function sendMediaMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  mediaType: 'image' | 'document' | 'video' | 'audio',
  mediaUrl: string,
  caption?: string
): Promise<any> {
  const mediaPayload: any = {
    link: mediaUrl,
  };

  if (caption && (mediaType === 'image' || mediaType === 'video' || mediaType === 'document')) {
    mediaPayload.caption = caption;
  }

  const response = await fetch(`${META_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: mediaType,
      [mediaType]: mediaPayload,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to send media message');
  }
  
  return data;
}

// Mark message as read
async function markAsRead(
  phoneNumberId: string,
  accessToken: string,
  messageId: string
): Promise<any> {
  const response = await fetch(`${META_API_BASE}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  });

  return await response.json();
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

    // Get authorization header for user verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body: SendMessageRequest = await req.json();
    const { tenant_id, contact_id, conversation_id, message_type } = body;

    console.log('Meta Send Request:', { tenant_id, contact_id, message_type });

    // Verify user has tenant access
    const { data: hasAccess } = await supabase.rpc('has_tenant_access', {
      _tenant_id: tenant_id,
      _user_id: user.id,
    });

    if (!hasAccess) {
      throw new Error('Access denied to this tenant');
    }

    // Get tenant with Meta credentials
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenant_id)
      .single();

    if (tenantError || !tenant) {
      throw new Error('Tenant not found');
    }

    // Check if Meta Direct is configured
    if (!tenant.phone_number_id || !tenant.meta_access_token) {
      throw new Error('Meta Cloud API not configured for this tenant. Please configure your Meta credentials.');
    }

    // Get contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contact_id)
      .single();

    if (contactError || !contact) {
      throw new Error('Contact not found');
    }

    // Create pending message record
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        tenant_id,
        conversation_id,
        contact_id,
        direction: 'outbound',
        status: 'pending',
        message_type,
        content: body.content || body.template_name || '',
        media_url: body.media_url || null,
      })
      .select()
      .single();

    if (msgError) {
      console.error('Failed to create message record:', msgError);
      throw new Error('Failed to create message record');
    }

    let result;
    const phone = contact.phone.replace(/\D/g, ''); // Remove non-digits

    try {
      switch (message_type) {
        case 'text':
          result = await sendTextMessage(
            tenant.phone_number_id,
            tenant.meta_access_token,
            phone,
            body.content!
          );
          break;

        case 'template':
          result = await sendTemplateMessage(
            tenant.phone_number_id,
            tenant.meta_access_token,
            phone,
            body.template_name!,
            body.template_language || 'en',
            body.template_components
          );
          break;

        case 'image':
        case 'document':
        case 'video':
        case 'audio':
          result = await sendMediaMessage(
            tenant.phone_number_id,
            tenant.meta_access_token,
            phone,
            message_type,
            body.media_url!,
            body.media_caption
          );
          break;

        default:
          throw new Error(`Unsupported message type: ${message_type}`);
      }

      console.log('Meta API Response:', result);

      // Update message with WhatsApp message ID and status
      const whatsappMessageId = result.messages?.[0]?.id;
      await supabase
        .from('messages')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          whatsapp_message_id: whatsappMessageId,
        })
        .eq('id', message.id);

      // Update conversation
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          is_session_active: true,
        })
        .eq('id', conversation_id);

      return new Response(
        JSON.stringify({
          success: true,
          message_id: message.id,
          whatsapp_message_id: whatsappMessageId,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (sendError) {
      console.error('Failed to send message:', sendError);
      const errorMessage = sendError instanceof Error ? sendError.message : 'Unknown error';

      // Update message as failed
      await supabase
        .from('messages')
        .update({
          status: 'failed',
          failed_reason: errorMessage,
        })
        .eq('id', message.id);

      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Error in whatsapp-meta-send:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
