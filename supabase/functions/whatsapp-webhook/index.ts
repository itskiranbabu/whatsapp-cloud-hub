import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256, x-twilio-signature',
};

interface TwilioWebhookPayload {
  MessageSid: string;
  AccountSid: string;
  From: string;
  To: string;
  Body?: string;
  MediaUrl0?: string;
  MediaContentType0?: string;
  MessageStatus?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}

interface Dialog360WebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: Array<{
          id: string;
          from: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; caption?: string };
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
          errors?: Array<{ code: number; title: string }>;
        }>;
      };
      field: string;
    }>;
  }>;
}

async function handleTwilioWebhook(
  supabase: ReturnType<typeof createClient>,
  payload: TwilioWebhookPayload,
  isStatusCallback: boolean
) {
  console.log('Processing Twilio webhook:', { isStatusCallback, MessageSid: payload.MessageSid });

  if (isStatusCallback && payload.MessageStatus) {
    const statusMap: Record<string, string> = {
      'queued': 'pending', 'sent': 'sent', 'delivered': 'delivered', 'read': 'read', 'failed': 'failed', 'undelivered': 'failed',
    };
    const status = statusMap[payload.MessageStatus] || 'pending';
    
    await (supabase as any).from('messages').update({ 
      status,
      ...(status === 'delivered' && { delivered_at: new Date().toISOString() }),
      ...(status === 'read' && { read_at: new Date().toISOString() }),
      ...(status === 'failed' && { failed_reason: payload.ErrorMessage || `Error: ${payload.ErrorCode}` }),
    }).eq('whatsapp_message_id', payload.MessageSid);

    return { processed: 'status_update', message_sid: payload.MessageSid };
  } else {
    const fromPhone = payload.From.replace('whatsapp:+', '');
    const toPhone = payload.To.replace('whatsapp:+', '');

    const { data: tenant } = await (supabase as any).from('tenants').select('id').eq('phone_number_id', toPhone).single();
    if (!tenant) return { error: 'Tenant not found' };

    let { data: contact } = await (supabase as any).from('contacts').select('id').eq('tenant_id', tenant.id).eq('phone', fromPhone).single();
    if (!contact) {
      const { data: newContact } = await (supabase as any).from('contacts').insert({ tenant_id: tenant.id, phone: fromPhone, last_message_at: new Date().toISOString() }).select().single();
      contact = newContact;
    }
    if (!contact) return { error: 'Failed to create contact' };

    let { data: conversation } = await (supabase as any).from('conversations').select('id').eq('tenant_id', tenant.id).eq('contact_id', contact.id).in('status', ['open', 'pending']).single();
    if (!conversation) {
      const sessionExpiry = new Date(); sessionExpiry.setHours(sessionExpiry.getHours() + 24);
      const { data: newConv } = await (supabase as any).from('conversations').insert({ tenant_id: tenant.id, contact_id: contact.id, status: 'open', is_session_active: true, session_expires_at: sessionExpiry.toISOString(), last_message_at: new Date().toISOString() }).select().single();
      conversation = newConv;
    }
    if (!conversation) return { error: 'Failed to create conversation' };

    await (supabase as any).from('messages').insert({
      tenant_id: tenant.id, contact_id: contact.id, conversation_id: conversation.id,
      direction: 'inbound', message_type: payload.MediaUrl0 ? 'image' : 'text',
      content: payload.Body || null, media_url: payload.MediaUrl0 || null,
      whatsapp_message_id: payload.MessageSid, status: 'delivered', delivered_at: new Date().toISOString(),
    });

    await (supabase as any).from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
    await (supabase as any).from('contacts').update({ last_message_at: new Date().toISOString() }).eq('id', contact.id);

    return { processed: 'inbound_message', message_sid: payload.MessageSid };
  }
}

async function handle360DialogWebhook(supabase: ReturnType<typeof createClient>, payload: Dialog360WebhookPayload) {
  console.log('Processing 360dialog webhook');

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      const { value } = change;
      const phoneNumberId = value.metadata?.phone_number_id;

      const { data: tenant } = await (supabase as any).from('tenants').select('id').eq('phone_number_id', phoneNumberId).single();
      if (!tenant) continue;

      if (value.statuses) {
        for (const status of value.statuses) {
          await (supabase as any).from('messages').update({ 
            status: status.status,
            ...(status.status === 'delivered' && { delivered_at: new Date(parseInt(status.timestamp) * 1000).toISOString() }),
            ...(status.status === 'read' && { read_at: new Date(parseInt(status.timestamp) * 1000).toISOString() }),
            ...(status.status === 'failed' && status.errors?.[0] && { failed_reason: status.errors[0].title }),
          }).eq('whatsapp_message_id', status.id);
        }
      }

      if (value.messages) {
        for (const msg of value.messages) {
          const fromPhone = msg.from;
          const contactName = value.contacts?.[0]?.profile?.name;

          let { data: contact } = await (supabase as any).from('contacts').select('id').eq('tenant_id', tenant.id).eq('phone', fromPhone).single();
          if (!contact) {
            const { data: newContact } = await (supabase as any).from('contacts').insert({ tenant_id: tenant.id, phone: fromPhone, name: contactName, last_message_at: new Date().toISOString() }).select().single();
            contact = newContact;
          }
          if (!contact) continue;

          let { data: conversation } = await (supabase as any).from('conversations').select('id').eq('tenant_id', tenant.id).eq('contact_id', contact.id).in('status', ['open', 'pending']).single();
          if (!conversation) {
            const sessionExpiry = new Date(); sessionExpiry.setHours(sessionExpiry.getHours() + 24);
            const { data: newConv } = await (supabase as any).from('conversations').insert({ tenant_id: tenant.id, contact_id: contact.id, status: 'open', is_session_active: true, session_expires_at: sessionExpiry.toISOString(), last_message_at: new Date().toISOString() }).select().single();
            conversation = newConv;
          }
          if (!conversation) continue;

          await (supabase as any).from('messages').insert({
            tenant_id: tenant.id, contact_id: contact.id, conversation_id: conversation.id,
            direction: 'inbound', message_type: msg.type, content: msg.text?.body || msg.image?.caption || null,
            whatsapp_message_id: msg.id, status: 'delivered', delivered_at: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
          });

          await (supabase as any).from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversation.id);
          await (supabase as any).from('contacts').update({ last_message_at: new Date().toISOString() }).eq('id', contact.id);
        }
      }
    }
  }
  return { processed: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const provider = url.searchParams.get('provider') || 'twilio';

  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    const verifyToken = Deno.env.get('WEBHOOK_VERIFY_TOKEN') || 'whatsflow_verify';

    if (mode === 'subscribe' && token === verifyToken) {
      return new Response(challenge, { status: 200, headers: corsHeaders });
    }
    return new Response('Verification failed', { status: 403, headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (provider === 'twilio') {
      const formData = await req.formData();
      const payload: TwilioWebhookPayload = Object.fromEntries(formData.entries()) as unknown as TwilioWebhookPayload;
      await handleTwilioWebhook(supabase, payload, !!payload.MessageStatus);
      return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', { headers: { ...corsHeaders, 'Content-Type': 'application/xml' } });
    } else if (provider === '360dialog') {
      const payload: Dialog360WebhookPayload = await req.json();
      const result = await handle360DialogWebhook(supabase, payload);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown provider' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
