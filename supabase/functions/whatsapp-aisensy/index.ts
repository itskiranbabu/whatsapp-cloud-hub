import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AiSensy API Base URL
const AISENSY_API_BASE = 'https://backend.aisensy.com/campaign/t1/api/v2';

interface AiSensyMessageRequest {
  tenant_id: string;
  contact_id: string;
  conversation_id: string;
  message_type: 'text' | 'template' | 'media';
  content?: string;
  template_name?: string;
  template_variables?: Record<string, string>;
  media_url?: string;
  media_type?: 'image' | 'video' | 'document';
}

interface AiSensyTemplateParams {
  name: string;
  language: string;
  header_values?: string[];
  body_values?: string[];
  button_values?: string[];
}

// Send template message via AiSensy
async function sendTemplateMessage(
  apiKey: string,
  destination: string,
  userName: string,
  templateParams: AiSensyTemplateParams,
  mediaUrl?: string,
  mediaType?: string
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  const url = `${AISENSY_API_BASE}`;
  
  const payload: Record<string, unknown> = {
    apiKey,
    campaignName: templateParams.name,
    destination,
    userName,
    templateParams: templateParams.body_values || [],
    source: "direct_api",
    media: mediaUrl ? {
      url: mediaUrl,
      filename: `media.${mediaType === 'document' ? 'pdf' : mediaType === 'video' ? 'mp4' : 'jpg'}`
    } : undefined
  };

  console.log('AiSensy API request:', { url, destination, template: templateParams.name });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('AiSensy API response:', data);

    if (response.ok && data.status !== 'error') {
      return { 
        success: true, 
        message_id: data.data?.messageId || data.messageId || `aisensy_${Date.now()}` 
      };
    } else {
      return { 
        success: false, 
        error: data.message || data.error || 'Failed to send via AiSensy' 
      };
    }
  } catch (error: unknown) {
    console.error('AiSensy request error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Send direct text message (session message)
async function sendSessionMessage(
  apiKey: string,
  destination: string,
  content: string,
  mediaUrl?: string,
  mediaType?: string
): Promise<{ success: boolean; message_id?: string; error?: string }> {
  // AiSensy uses different endpoint for session messages
  const url = `${AISENSY_API_BASE}/direct`;
  
  const payload: Record<string, unknown> = {
    apiKey,
    destination,
    message: content,
    type: mediaUrl ? mediaType || 'image' : 'text',
    media: mediaUrl ? { url: mediaUrl } : undefined
  };

  console.log('AiSensy session message:', { destination, type: payload.type });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok && data.status !== 'error') {
      return { 
        success: true, 
        message_id: data.messageId || `aisensy_session_${Date.now()}` 
      };
    } else {
      return { 
        success: false, 
        error: data.message || 'Session message not allowed - use template' 
      };
    }
  } catch (error: unknown) {
    console.error('AiSensy session error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get AiSensy account info and templates
async function getAccountInfo(apiKey: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const url = `https://backend.aisensy.com/project/t1/api/v2/project`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Failed to get account info' };
    }
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get templates from AiSensy
async function getTemplates(apiKey: string): Promise<{ success: boolean; templates?: unknown[]; error?: string }> {
  const url = `https://backend.aisensy.com/campaign/t1/api/v2/getTemplates`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.data) {
      return { success: true, templates: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to get templates' };
    }
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const aiSensyApiKey = Deno.env.get('AISENSY_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'send';

    // Handle different actions
    if (action === 'test-connection') {
      if (!aiSensyApiKey) {
        return new Response(
          JSON.stringify({ success: false, error: 'AiSensy API key not configured' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getAccountInfo(aiSensyApiKey);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get-templates') {
      if (!aiSensyApiKey) {
        return new Response(
          JSON.stringify({ success: false, error: 'AiSensy API key not configured' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await getTemplates(aiSensyApiKey);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: send message
    // Verify JWT
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

    if (!aiSensyApiKey) {
      return new Response(
        JSON.stringify({ error: 'AiSensy API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: AiSensyMessageRequest = await req.json();
    const { 
      tenant_id, 
      contact_id, 
      conversation_id, 
      message_type, 
      content, 
      template_name, 
      template_variables,
      media_url,
      media_type
    } = requestData;

    console.log('Processing AiSensy message:', { tenant_id, contact_id, message_type });

    // Verify tenant access
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

    // Get contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('phone, name')
      .eq('id', contact_id)
      .eq('tenant_id', tenant_id)
      .single();

    if (contactError || !contact) {
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create pending message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        tenant_id,
        contact_id,
        conversation_id,
        direction: 'outbound',
        message_type,
        content: content || template_name || null,
        status: 'pending'
      })
      .select()
      .single();

    if (messageError) {
      console.error('Failed to create message:', messageError);
      return new Response(
        JSON.stringify({ error: 'Failed to create message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send via AiSensy
    let result: { success: boolean; message_id?: string; error?: string };

    if (message_type === 'template' && template_name) {
      // Template message
      const bodyValues = template_variables 
        ? Object.values(template_variables) 
        : [];
      
      result = await sendTemplateMessage(
        aiSensyApiKey,
        contact.phone,
        contact.name || 'Customer',
        {
          name: template_name,
          language: 'en',
          body_values: bodyValues
        },
        media_url,
        media_type
      );
    } else {
      // Session message (text/media)
      result = await sendSessionMessage(
        aiSensyApiKey,
        contact.phone,
        content || '',
        media_url,
        media_type
      );
    }

    // Update message status
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

    // Update conversation
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error, message_id: message.id }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AiSensy message sent:', result.message_id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: message.id,
        whatsapp_message_id: result.message_id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('AiSensy function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
