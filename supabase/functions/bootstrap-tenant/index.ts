import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await admin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If roles already exist, do nothing.
    const { data: existingRoles, error: rolesErr } = await admin
      .from("user_roles")
      .select("id, tenant_id, role")
      .eq("user_id", user.id);

    if (rolesErr) throw rolesErr;

    const firstTenant = existingRoles?.find((r) => r.tenant_id)?.tenant_id ?? null;
    if (firstTenant) {
      return new Response(JSON.stringify({ ok: true, tenant_id: firstTenant, created: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a default tenant + assign tenant_admin role
    const baseName =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Workspace";

    const slug = `ws-${crypto.randomUUID().slice(0, 8)}`;

    const { data: tenant, error: tenantErr } = await admin
      .from("tenants")
      .insert({
        name: baseName,
        slug,
        plan: "starter",
        is_active: true,
      })
      .select("id")
      .single();

    if (tenantErr) throw tenantErr;

    const { error: roleErr } = await admin.from("user_roles").insert({
      user_id: user.id,
      tenant_id: tenant.id,
      role: "tenant_admin",
    });

    if (roleErr) throw roleErr;

    return new Response(JSON.stringify({ ok: true, tenant_id: tenant.id, created: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("bootstrap-tenant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
