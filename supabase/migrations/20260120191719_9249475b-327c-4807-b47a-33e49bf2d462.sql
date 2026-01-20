-- Update integrations RLS policies to block client-side credential writes
-- This prevents credentials from being sent from browser DevTools

-- Drop the existing INSERT and UPDATE policies
DROP POLICY IF EXISTS "Admins can create integrations for their tenant" ON public.integrations;
DROP POLICY IF EXISTS "Admins can update integrations for their tenant" ON public.integrations;

-- Create new INSERT policy that blocks credentials
CREATE POLICY "Admins can create integrations without credentials"
  ON public.integrations FOR INSERT
  WITH CHECK (
    is_tenant_admin(auth.uid(), tenant_id) 
    AND credentials IS NULL  -- Block any client-side credential writes
  );

-- Create new UPDATE policy that prevents credential modification
CREATE POLICY "Admins can update integrations config only"
  ON public.integrations FOR UPDATE
  USING (is_tenant_admin(auth.uid(), tenant_id))
  WITH CHECK (
    is_tenant_admin(auth.uid(), tenant_id)
    AND (credentials IS NULL OR credentials = '{}'::jsonb)  -- Block credential updates from client
  );

-- Add comment explaining the security design
COMMENT ON TABLE public.integrations IS 'Integration configurations. Credentials can only be stored via edge functions (service role), never from client-side.';