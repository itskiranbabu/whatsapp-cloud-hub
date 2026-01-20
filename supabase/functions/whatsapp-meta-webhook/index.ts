import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256',
};

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string; sha256: string; caption?: string };
          document?: { id: string; filename: string; mime_type: string; sha256: string; caption?: string };
          video?: { id: string; mime_type: string; sha256: string; caption?: string };
          audio?: { id: string; mime_type: string; sha256: string };
          button?: { payload: string; text: string };
          interactive?: { type: string; button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string; description?: string } };
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

// Verify webhook signature from Meta
function verifySignature(payload: string, signature: string, appSecret: string): boolean {
  if (!signature || !appSecret) {
    console.log('Missing signature or app secret for verification');
    return false;
  }

  try {
    const expectedSignature = 'sha256=' + createHmac('sha256', appSecret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  const url = new URL(req.url);
  const tenantId = url.searchParams.get('tenant');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle webhook verification (GET request from Meta)
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    console.log('Webhook verification request:', { mode, token, tenantId });

    if (mode === 'subscribe') {
      // We need to verify against the tenant's verify token
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      if (tenantId) {
        const { data: tenant } = await supabase
          .from('tenants')
          .select('meta_webhook_verify_token')
          .eq('id', tenantId)
          .single();

        if (tenant?.meta_webhook_verify_token === token) {
          console.log('Webhook verified for tenant:', tenantId);
          return new Response(challenge, { status: 200 });
        }
      }

      // Fallback to environment variable for global verify token
      const globalVerifyToken = Deno.env.get('WEBHOOK_VERIFY_TOKEN');
      if (globalVerifyToken && token === globalVerifyToken) {
        console.log('Webhook verified with global token');
        return new Response(challenge, { status: 200 });
      }

      console.log('Webhook verification failed');
      return new Response('Verification failed', { status: 403 });
    }

    return new Response('Invalid mode', { status: 400 });
  }

  // Handle incoming webhooks (POST request)
  if (req.method === 'POST') {
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const rawBody = await req.text();
      const payload: WhatsAppWebhookPayload = JSON.parse(rawBody);

      console.log('Webhook received:', JSON.stringify(payload, null, 2));

      // SECURITY: Always enforce signature validation
      const signature = req.headers.get('x-hub-signature-256');
      
      // Require signature header for all webhook requests
      if (!signature) {
        console.error('Missing x-hub-signature-256 header - rejecting request');
        return new Response('Missing signature header', { status: 401 });
      }

      // Get app secret from secure tenant_credentials table or global fallback
      let appSecret: string | null = null;
      
      if (tenantId) {
        // First try secure tenant_credentials table
        const { data: credentials } = await supabase
          .from('tenant_credentials')
          .select('meta_app_secret')
          .eq('tenant_id', tenantId)
          .single();
        
        appSecret = credentials?.meta_app_secret || null;
        
        // Fallback to tenants table for backwards compatibility
        if (!appSecret) {
          const { data: tenant } = await supabase
            .from('tenants')
            .select('meta_app_secret')
            .eq('id', tenantId)
            .single();
          
          appSecret = tenant?.meta_app_secret || null;
        }
      }
      
      // Fallback to global app secret if tenant-specific not available
      if (!appSecret) {
        appSecret = Deno.env.get('META_APP_SECRET') || null;
      }
      
      // Reject if no app secret is configured anywhere
      if (!appSecret) {
        console.error('No app secret configured for webhook validation');
        return new Response('Webhook security not configured', { status: 401 });
      }
      
      // Validate signature
      const isValid = verifySignature(rawBody, signature, appSecret);
      if (!isValid) {
        console.error('Invalid webhook signature - possible forgery attempt');
        return new Response('Invalid signature', { status: 401 });
      }
      
      console.log('✅ Webhook signature validated successfully');

      if (payload.object !== 'whatsapp_business_account') {
        return new Response('OK', { status: 200 });
      }

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field !== 'messages') continue;

          const value = change.value;
          const phoneNumberId = value.metadata.phone_number_id;

          // Find tenant by phone_number_id if not provided in URL
          let resolvedTenantId = tenantId;
          if (!resolvedTenantId) {
            const { data: tenant } = await supabase
              .from('tenants')
              .select('id')
              .eq('phone_number_id', phoneNumberId)
              .single();

            if (tenant) {
              resolvedTenantId = tenant.id;
            } else {
              console.log('No tenant found for phone_number_id:', phoneNumberId);
              continue;
            }
          }

          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log('Processing status update:', status);

              const updateData: any = {
                status: status.status,
              };

              if (status.status === 'sent') {
                updateData.sent_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
              } else if (status.status === 'delivered') {
                updateData.delivered_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
              } else if (status.status === 'read') {
                updateData.read_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
              } else if (status.status === 'failed') {
                updateData.failed_reason = status.errors?.[0]?.title || 'Unknown error';
              }

              await supabase
                .from('messages')
                .update(updateData)
                .eq('whatsapp_message_id', status.id);
            }
          }

          // Handle incoming messages
          if (value.messages && value.contacts) {
            for (const message of value.messages) {
              const contactInfo = value.contacts[0];
              const senderPhone = message.from;
              const senderName = contactInfo.profile.name;

              console.log('Processing incoming message from:', senderName, senderPhone);

              // Find or create contact
              let { data: contact } = await supabase
                .from('contacts')
                .select('*')
                .eq('tenant_id', resolvedTenantId)
                .eq('phone', senderPhone)
                .single();

              if (!contact) {
                const { data: newContact, error: contactError } = await supabase
                  .from('contacts')
                  .insert({
                    tenant_id: resolvedTenantId,
                    phone: senderPhone,
                    name: senderName,
                    opted_in: true,
                    opted_in_at: new Date().toISOString(),
                  })
                  .select()
                  .single();

                if (contactError) {
                  console.error('Failed to create contact:', contactError);
                  continue;
                }
                contact = newContact;
              } else if (contact.name !== senderName) {
                // Update name if changed
                await supabase
                  .from('contacts')
                  .update({ name: senderName })
                  .eq('id', contact.id);
              }

              // Find or create conversation
              let { data: conversation } = await supabase
                .from('conversations')
                .select('*')
                .eq('tenant_id', resolvedTenantId)
                .eq('contact_id', contact.id)
                .single();

              if (!conversation) {
                const { data: newConversation, error: convError } = await supabase
                  .from('conversations')
                  .insert({
                    tenant_id: resolvedTenantId,
                    contact_id: contact.id,
                    status: 'open',
                    is_session_active: true,
                    session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    last_message_at: new Date().toISOString(),
                    unread_count: 1,
                  })
                  .select()
                  .single();

                if (convError) {
                  console.error('Failed to create conversation:', convError);
                  continue;
                }
                conversation = newConversation;
              } else {
                // Update existing conversation
                await supabase
                  .from('conversations')
                  .update({
                    status: 'open',
                    is_session_active: true,
                    session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    last_message_at: new Date().toISOString(),
                    unread_count: (conversation.unread_count || 0) + 1,
                  })
                  .eq('id', conversation.id);
              }

              // Extract message content
              let content = '';
              let messageType = message.type;
              let mediaUrl = null;

              switch (message.type) {
                case 'text':
                  content = message.text?.body || '';
                  break;
                case 'image':
                  content = message.image?.caption || '[Image]';
                  mediaUrl = message.image?.id; // Store media ID for later retrieval
                  break;
                case 'document':
                  content = message.document?.caption || `[Document: ${message.document?.filename}]`;
                  mediaUrl = message.document?.id;
                  break;
                case 'video':
                  content = message.video?.caption || '[Video]';
                  mediaUrl = message.video?.id;
                  break;
                case 'audio':
                  content = '[Audio]';
                  mediaUrl = message.audio?.id;
                  break;
                case 'button':
                  content = message.button?.text || message.button?.payload || '[Button Reply]';
                  break;
                case 'interactive':
                  content = message.interactive?.button_reply?.title || 
                            message.interactive?.list_reply?.title || 
                            '[Interactive Reply]';
                  break;
                default:
                  content = `[${message.type}]`;
              }

              // Create message record
              const { error: msgError } = await supabase
                .from('messages')
                .insert({
                  tenant_id: resolvedTenantId,
                  conversation_id: conversation.id,
                  contact_id: contact.id,
                  direction: 'inbound',
                  status: 'delivered',
                  message_type: messageType,
                  content,
                  media_url: mediaUrl,
                  whatsapp_message_id: message.id,
                  delivered_at: new Date(parseInt(message.timestamp) * 1000).toISOString(),
                });

              if (msgError) {
                console.error('Failed to create message:', msgError);
              }

              // Update contact's last_message_at
              await supabase
                .from('contacts')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', contact.id);

              // ============ AUTOMATION TRIGGER ============
              // Check for keyword-based automations on incoming messages
              if (content) {
                try {
                  const automationResponse = await fetch(
                    `${supabaseUrl}/functions/v1/automation-engine`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseServiceKey}`,
                      },
                      body: JSON.stringify({
                        action: 'trigger_match',
                        tenant_id: resolvedTenantId,
                        trigger_data: {
                          message_content: content,
                          contact_phone: senderPhone,
                          contact_name: senderName,
                        },
                      }),
                    }
                  );

                  const automationResult = await automationResponse.json();
                  console.log('Automation trigger check:', automationResult);

                  // Execute matched automations
                  if (automationResult.matched_automations?.length > 0) {
                    for (const automationId of automationResult.matched_automations) {
                      await fetch(
                        `${supabaseUrl}/functions/v1/automation-engine`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${supabaseServiceKey}`,
                          },
                          body: JSON.stringify({
                            action: 'execute',
                            automation_id: automationId,
                            tenant_id: resolvedTenantId,
                            conversation_id: conversation.id,
                            contact_id: contact.id,
                            trigger_data: {
                              message_content: content,
                              contact_phone: senderPhone,
                              contact_name: senderName,
                            },
                          }),
                        }
                      );
                    }
                  }
                } catch (automationError) {
                  console.error('Automation trigger error:', automationError);
                  // Don't fail the webhook for automation errors
                }
              }
              // ============ END AUTOMATION TRIGGER ============
            }
          }
        }
      }

      return new Response('OK', { 
        status: 200,
        headers: corsHeaders,
      });

    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('OK', { status: 200 }); // Always return 200 to Meta
    }
  }

  return new Response('Method not allowed', { status: 405 });
});
