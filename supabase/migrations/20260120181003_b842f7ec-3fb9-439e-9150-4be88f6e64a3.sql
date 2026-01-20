-- Create a safe view for tenants that excludes sensitive credential columns
-- This view will be used by the frontend for read operations
CREATE OR REPLACE VIEW public.tenants_safe 
WITH (security_invoker=on) AS
SELECT 
  id, 
  name, 
  slug, 
  logo_url, 
  primary_color,
  waba_id, 
  phone_number_id, 
  business_name,
  is_active, 
  plan, 
  muc_limit,
  bsp_provider,
  created_at, 
  updated_at
  -- Excluded: meta_access_token, meta_app_secret, 
  --           meta_webhook_verify_token, bsp_credentials
FROM public.tenants;

-- Grant SELECT access to the tenants_safe view
GRANT SELECT ON public.tenants_safe TO authenticated;
GRANT SELECT ON public.tenants_safe TO anon;

-- Create a helper function to check if user is a tenant admin
CREATE OR REPLACE FUNCTION public.is_tenant_admin(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND tenant_id = _tenant_id
    AND role IN ('tenant_admin', 'super_admin')
  ) OR public.is_super_admin(_user_id)
$$;

-- Update RLS policies for ads table to restrict modifications to admins only
DROP POLICY IF EXISTS "Users can create ads for their tenant" ON public.ads;
DROP POLICY IF EXISTS "Users can update ads for their tenant" ON public.ads;
DROP POLICY IF EXISTS "Users can delete ads for their tenant" ON public.ads;

-- Create admin-only policies for ads modifications
CREATE POLICY "Admins can create ads for their tenant"
ON public.ads FOR INSERT
WITH CHECK (
  is_tenant_admin(auth.uid(), tenant_id)
);

CREATE POLICY "Admins can update ads for their tenant"
ON public.ads FOR UPDATE
USING (
  is_tenant_admin(auth.uid(), tenant_id)
);

CREATE POLICY "Admins can delete ads for their tenant"
ON public.ads FOR DELETE
USING (
  is_tenant_admin(auth.uid(), tenant_id)
);

-- Update RLS policies for integrations table to restrict modifications to admins only
DROP POLICY IF EXISTS "Users can create integrations for their tenant" ON public.integrations;
DROP POLICY IF EXISTS "Users can update integrations for their tenant" ON public.integrations;
DROP POLICY IF EXISTS "Users can delete integrations for their tenant" ON public.integrations;

-- Create admin-only policies for integrations modifications
CREATE POLICY "Admins can create integrations for their tenant"
ON public.integrations FOR INSERT
WITH CHECK (
  is_tenant_admin(auth.uid(), tenant_id)
);

CREATE POLICY "Admins can update integrations for their tenant"
ON public.integrations FOR UPDATE
USING (
  is_tenant_admin(auth.uid(), tenant_id)
);

CREATE POLICY "Admins can delete integrations for their tenant"
ON public.integrations FOR DELETE
USING (
  is_tenant_admin(auth.uid(), tenant_id)
);