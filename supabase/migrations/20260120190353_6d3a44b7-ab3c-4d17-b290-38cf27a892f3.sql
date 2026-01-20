-- Drop the overly permissive policy and replace with service-role specific one
DROP POLICY IF EXISTS "Service role can manage all quotas" ON public.tenant_quotas;

-- Create a more restrictive policy that only allows super admins to manage quotas (service role bypasses RLS anyway)
CREATE POLICY "Super admins can manage all quotas"
ON public.tenant_quotas
FOR ALL
USING (public.is_super_admin(auth.uid()))