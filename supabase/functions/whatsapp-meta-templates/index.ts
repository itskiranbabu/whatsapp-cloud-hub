import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: any;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

interface CreateTemplateRequest {
  tenant_id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  components: TemplateComponent[];
}

// Get all templates from WABA
async function getTemplates(wabaId: string, accessToken: string): Promise<any> {
  const response = await fetch(
    `${META_API_BASE}/${wabaId}/message_templates?limit=100`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch templates');
  }
  
  return data;
}

// Create a new template
async function createTemplate(
  wabaId: string,
  accessToken: string,
  name: string,
  category: string,
  language: string,
  components: TemplateComponent[]
): Promise<any> {
  const response = await fetch(
    `${META_API_BASE}/${wabaId}/message_templates`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        category,
        language,
        components,
      }),
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to create template');
  }
  
  return data;
}

// Delete a template
async function deleteTemplate(
  wabaId: string,
  accessToken: string,
  templateName: string
): Promise<any> {
  const response = await fetch(
    `${META_API_BASE}/${wabaId}/message_templates?name=${templateName}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to delete template');
  }
  
  return data;
}

// Get template by name
async function getTemplateByName(
  wabaId: string,
  accessToken: string,
  templateName: string
): Promise<any> {
  const response = await fetch(
    `${META_API_BASE}/${wabaId}/message_templates?name=${templateName}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch template');
  }
  
  return data;
}

// Sync templates from Meta to local database
async function syncTemplates(supabase: any, tenantId: string, wabaId: string, accessToken: string): Promise<any> {
  const metaTemplates = await getTemplates(wabaId, accessToken);
  
  if (!metaTemplates.data) {
    return { synced: 0, templates: [] };
  }

  const syncedTemplates = [];
  
  for (const template of metaTemplates.data) {
    // Map Meta status to our status
    let status: 'pending' | 'approved' | 'rejected' = 'pending';
    if (template.status === 'APPROVED') status = 'approved';
    else if (template.status === 'REJECTED') status = 'rejected';

    // Map Meta category to our category
    let category: 'marketing' | 'utility' | 'authentication' = 'utility';
    if (template.category === 'MARKETING') category = 'marketing';
    else if (template.category === 'AUTHENTICATION') category = 'authentication';

    // Extract body and other components
    let body = '';
    let header_type = null;
    let header_content = null;
    let footer = null;
    let buttons: any[] = [];
    let variables: any[] = [];

    for (const component of template.components || []) {
      if (component.type === 'BODY') {
        body = component.text || '';
        // Extract variables from body
        const varMatches = body.match(/\{\{\d+\}\}/g) || [];
        variables = varMatches.map((v: string, idx: number) => ({
          index: idx + 1,
          example: component.example?.body_text?.[0]?.[idx] || '',
        }));
      } else if (component.type === 'HEADER') {
        header_type = component.format?.toLowerCase() || 'text';
        header_content = component.text || '';
      } else if (component.type === 'FOOTER') {
        footer = component.text || '';
      } else if (component.type === 'BUTTONS') {
        buttons = component.buttons || [];
      }
    }

    // Upsert template
    const { data: upserted, error } = await supabase
      .from('templates')
      .upsert({
        tenant_id: tenantId,
        name: template.name,
        category,
        status,
        language: template.language,
        body,
        header_type,
        header_content,
        footer,
        buttons: buttons,
        variables,
        whatsapp_template_id: template.id,
        rejection_reason: template.rejected_reason || null,
      }, {
        onConflict: 'tenant_id,name',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (!error && upserted) {
      syncedTemplates.push(upserted);
    } else if (error) {
      console.error('Failed to upsert template:', template.name, error);
    }
  }

  return { synced: syncedTemplates.length, templates: syncedTemplates };
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    let body: any = {};
    if (req.method === 'POST' || req.method === 'DELETE') {
      body = await req.json();
    }

    const tenantId = body.tenant_id || url.searchParams.get('tenant_id');
    
    if (!tenantId) {
      throw new Error('tenant_id is required');
    }

    // Verify tenant access
    const { data: hasAccess } = await supabase.rpc('has_tenant_access', {
      _tenant_id: tenantId,
      _user_id: user.id,
    });

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    // Get tenant non-sensitive info from tenants table
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('waba_id, phone_number_id')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      throw new Error('Tenant not found');
    }

    if (!tenant.waba_id) {
      throw new Error('Meta Cloud API not configured. Please set up your WABA ID.');
    }

    // Get credentials from secure tenant_credentials table only
    const { data: credentials, error: credentialsError } = await supabase
      .from('tenant_credentials')
      .select('meta_access_token')
      .eq('tenant_id', tenantId)
      .single();

    if (credentialsError || !credentials?.meta_access_token) {
      throw new Error('Meta Cloud API not configured. Please configure your Meta credentials.');
    }

    const accessToken = credentials.meta_access_token;

    let result;

    switch (action) {
      case 'list':
        result = await getTemplates(tenant.waba_id, accessToken);
        break;

      case 'get':
        const templateName = body.name || url.searchParams.get('name');
        if (!templateName) {
          throw new Error('Template name is required');
        }
        result = await getTemplateByName(tenant.waba_id, accessToken, templateName);
        break;

      case 'create':
        result = await createTemplate(
          tenant.waba_id,
          accessToken,
          body.name,
          body.category,
          body.language || 'en',
          body.components
        );
        break;

      case 'delete':
        const nameToDelete = body.name;
        if (!nameToDelete) {
          throw new Error('Template name is required');
        }
        result = await deleteTemplate(tenant.waba_id, accessToken, nameToDelete);
        break;

      case 'sync':
        result = await syncTemplates(supabase, tenantId, tenant.waba_id, accessToken);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in whatsapp-meta-templates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
