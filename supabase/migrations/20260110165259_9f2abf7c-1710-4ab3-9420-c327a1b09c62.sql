-- Add columns for storing Meta-specific credentials per tenant
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS meta_access_token TEXT,
ADD COLUMN IF NOT EXISTS meta_app_secret TEXT,
ADD COLUMN IF NOT EXISTS meta_webhook_verify_token TEXT,
ADD COLUMN IF NOT EXISTS bsp_provider TEXT DEFAULT 'meta_direct',
ADD COLUMN IF NOT EXISTS bsp_credentials JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.tenants.meta_access_token IS 'Meta permanent access token for WhatsApp Cloud API';
COMMENT ON COLUMN public.tenants.meta_app_secret IS 'Meta app secret for webhook signature verification';
COMMENT ON COLUMN public.tenants.meta_webhook_verify_token IS 'Token used for webhook URL verification';
COMMENT ON COLUMN public.tenants.bsp_provider IS 'BSP provider: meta_direct, aisensy, twilio, 360dialog, gupshup';
COMMENT ON COLUMN public.tenants.bsp_credentials IS 'JSON object storing BSP-specific credentials';