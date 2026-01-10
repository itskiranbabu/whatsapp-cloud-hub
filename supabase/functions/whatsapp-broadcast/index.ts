import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BroadcastRequest {
  campaign_id: string;
  tenant_id: string;
  template_id: string;
  contact_ids?: string[];
  segment_filter?: {
    tags?: string[];
    opted_in?: boolean;
  };
  scheduled_at?: string;
}

interface ContactRecord {
  id: string;
  phone: string;
  name: string | null;
  attributes: Record<string, unknown> | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const requestData: BroadcastRequest = await req.json();
    const { campaign_id, tenant_id, template_id, contact_ids, segment_filter, scheduled_at } = requestData;

    console.log('Starting broadcast campaign:', { campaign_id, tenant_id });

    // Verify tenant access
    const { data: hasAccess } = await supabase.rpc('has_tenant_access', {
      _user_id: user.id,
      _tenant_id: tenant_id
    });

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .eq('tenant_id', tenant_id)
      .single();

    if (templateError || !template) {
      return new Response(
        JSON.stringify({ error: 'Template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (template.status !== 'approved') {
      return new Response(
        JSON.stringify({ error: 'Template not approved' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build contacts query
    let contactsQuery = supabase
      .from('contacts')
      .select('id, phone, name, attributes')
      .eq('tenant_id', tenant_id);

    if (contact_ids && contact_ids.length > 0) {
      contactsQuery = contactsQuery.in('id', contact_ids);
    }

    if (segment_filter) {
      if (segment_filter.opted_in !== undefined) {
        contactsQuery = contactsQuery.eq('opted_in', segment_filter.opted_in);
      }
      if (segment_filter.tags && segment_filter.tags.length > 0) {
        contactsQuery = contactsQuery.overlaps('tags', segment_filter.tags);
      }
    }

    const { data: contacts, error: contactsError } = await contactsQuery;

    if (contactsError) {
      console.error('Failed to fetch contacts:', contactsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch contacts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No contacts found matching criteria' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${contacts.length} contacts for broadcast`);

    // Update campaign with recipient count
    await supabase
      .from('campaigns')
      .update({
        total_recipients: contacts.length,
        status: scheduled_at ? 'scheduled' : 'running',
        scheduled_at: scheduled_at || null,
        started_at: scheduled_at ? null : new Date().toISOString(),
      })
      .eq('id', campaign_id);

    // If scheduled, return early
    if (scheduled_at) {
      return new Response(
        JSON.stringify({
          success: true,
          campaign_id,
          total_recipients: contacts.length,
          status: 'scheduled',
          scheduled_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process messages in batches
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 1000; // 1 second
    let sentCount = 0;
    let failedCount = 0;

    // Get tenant config for BSP
    const { data: tenant } = await supabase
      .from('tenants')
      .select('phone_number_id')
      .eq('id', tenant_id)
      .single();

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE) as ContactRecord[];
      
      const batchPromises = batch.map(async (contact) => {
        try {
          // Create or get conversation
          let { data: conversation } = await supabase
            .from('conversations')
            .select('id')
            .eq('tenant_id', tenant_id)
            .eq('contact_id', contact.id)
            .in('status', ['open', 'pending'])
            .single();

          if (!conversation) {
            const sessionExpiry = new Date();
            sessionExpiry.setHours(sessionExpiry.getHours() + 24);

            const { data: newConv } = await supabase
              .from('conversations')
              .insert({
                tenant_id,
                contact_id: contact.id,
                status: 'open',
                is_session_active: true,
                session_expires_at: sessionExpiry.toISOString(),
                last_message_at: new Date().toISOString(),
              })
              .select()
              .single();
            conversation = newConv;
          }

          if (!conversation) {
            throw new Error('Failed to create conversation');
          }

          // Replace template variables with contact data
          const variables = template.variables as string[] | null;
          const templateVariables: string[] = [];
          
          if (variables) {
            for (const variable of variables) {
              let value = '';
              if (variable === 'name' || variable === '{{name}}') {
                value = contact.name || 'Customer';
              } else if (contact.attributes && typeof contact.attributes === 'object') {
                value = (contact.attributes as Record<string, string>)[variable] || '';
              }
              templateVariables.push(value);
            }
          }

          // Create message record
          const { data: message, error: msgError } = await supabase
            .from('messages')
            .insert({
              tenant_id,
              contact_id: contact.id,
              conversation_id: conversation.id,
              direction: 'outbound',
              message_type: 'template',
              content: template.body,
              status: 'pending',
            })
            .select()
            .single();

          if (msgError) {
            throw msgError;
          }

          // In production, call the whatsapp-send function or BSP API directly
          // For now, simulate sending with random success/failure
          const success = Math.random() > 0.05; // 95% success rate simulation

          if (success) {
            await supabase
              .from('messages')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                whatsapp_message_id: `sim_${Date.now()}_${contact.id}`,
              })
              .eq('id', message.id);
            sentCount++;
          } else {
            await supabase
              .from('messages')
              .update({
                status: 'failed',
                failed_reason: 'Simulated failure for testing',
              })
              .eq('id', message.id);
            failedCount++;
          }

          // Update conversation
          await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversation.id);

          return success;
        } catch (error) {
          console.error(`Failed to send to contact ${contact.id}:`, error);
          failedCount++;
          return false;
        }
      });

      await Promise.all(batchPromises);

      // Update campaign progress
      await supabase
        .from('campaigns')
        .update({
          sent_count: sentCount,
          failed_count: failedCount,
        })
        .eq('id', campaign_id);

      // Delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < contacts.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Mark campaign as completed
    await supabase
      .from('campaigns')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        sent_count: sentCount,
        failed_count: failedCount,
      })
      .eq('id', campaign_id);

    console.log(`Broadcast completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        campaign_id,
        total_recipients: contacts.length,
        sent_count: sentCount,
        failed_count: failedCount,
        status: 'completed',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Broadcast error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
