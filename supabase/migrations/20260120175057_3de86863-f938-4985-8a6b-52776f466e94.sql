-- Create a safe view for integrations that excludes the sensitive credentials column
-- This view will be used by the frontend for read operations
CREATE OR REPLACE VIEW public.integrations_safe 
WITH (security_invoker=on) AS
SELECT 
  id, 
  tenant_id, 
  integration_type, 
  name, 
  status, 
  config, 
  last_sync_at, 
  error_message, 
  created_at, 
  updated_at
FROM public.integrations;

-- Grant SELECT access to the view for authenticated users
GRANT SELECT ON public.integrations_safe TO authenticated;
GRANT SELECT ON public.integrations_safe TO anon;