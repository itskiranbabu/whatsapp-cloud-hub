-- Create secure tenant_credentials table for storing API credentials
-- This table has NO client-side SELECT policy - only service role can access

CREATE TABLE IF NOT EXISTS public.tenant_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE NOT NULL,
  meta_access_token TEXT,
  meta_app_secret TEXT,
  meta_webhook_verify_token TEXT,
  bsp_credentials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_credentials ENABLE ROW LEVEL SECURITY;

-- CRITICAL: No SELECT policy for regular users - only super admins can access via dashboard
-- Edge functions use service role key which bypasses RLS
CREATE POLICY "Super admins can manage credentials"
  ON public.tenant_credentials FOR ALL
  USING (is_super_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_tenant_credentials_updated_at
  BEFORE UPDATE ON public.tenant_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing credentials from tenants table to tenant_credentials
-- This safely copies data without deleting the original columns yet
INSERT INTO public.tenant_credentials (tenant_id, meta_access_token, meta_app_secret, meta_webhook_verify_token, bsp_credentials)
SELECT 
  id as tenant_id,
  meta_access_token,
  meta_app_secret,
  meta_webhook_verify_token,
  COALESCE(bsp_credentials, '{}'::jsonb)
FROM public.tenants
WHERE meta_access_token IS NOT NULL 
   OR meta_app_secret IS NOT NULL 
   OR meta_webhook_verify_token IS NOT NULL 
   OR bsp_credentials IS NOT NULL
ON CONFLICT (tenant_id) DO UPDATE SET
  meta_access_token = EXCLUDED.meta_access_token,
  meta_app_secret = EXCLUDED.meta_app_secret,
  meta_webhook_verify_token = EXCLUDED.meta_webhook_verify_token,
  bsp_credentials = EXCLUDED.bsp_credentials,
  updated_at = now();

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenant_credentials_tenant_id ON public.tenant_credentials(tenant_id);