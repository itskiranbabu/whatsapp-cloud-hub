-- Create tenant quotas table for rate limiting
CREATE TABLE public.tenant_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  messages_sent_today INTEGER NOT NULL DEFAULT 0,
  messages_limit_daily INTEGER NOT NULL DEFAULT 1000,
  ai_calls_today INTEGER NOT NULL DEFAULT 0,
  ai_calls_limit_daily INTEGER NOT NULL DEFAULT 100,
  template_calls_today INTEGER NOT NULL DEFAULT 0,
  template_calls_limit_daily INTEGER NOT NULL DEFAULT 50,
  ads_calls_today INTEGER NOT NULL DEFAULT 0,
  ads_calls_limit_daily INTEGER NOT NULL DEFAULT 100,
  automation_runs_today INTEGER NOT NULL DEFAULT 0,
  automation_runs_limit_daily INTEGER NOT NULL DEFAULT 500,
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on tenant_quotas
ALTER TABLE public.tenant_quotas ENABLE ROW LEVEL SECURITY;

-- RLS policy: Service role (edge functions) can read/write all quotas
CREATE POLICY "Service role can manage all quotas"
ON public.tenant_quotas
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policy: Tenant members can view their own quota
CREATE POLICY "Tenant members can view their own quota"
ON public.tenant_quotas
FOR SELECT
USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Function to check and increment quota (atomic operation)
CREATE OR REPLACE FUNCTION public.check_and_increment_quota(
  _tenant_id UUID,
  _quota_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  quota_record tenant_quotas%ROWTYPE;
  current_usage INTEGER;
  max_limit INTEGER;
BEGIN
  -- Get or create quota record
  INSERT INTO tenant_quotas (tenant_id)
  VALUES (_tenant_id)
  ON CONFLICT (tenant_id) DO NOTHING;
  
  -- Lock the row for update
  SELECT * INTO quota_record
  FROM tenant_quotas
  WHERE tenant_id = _tenant_id
  FOR UPDATE;
  
  -- Reset quotas if last reset was more than 24 hours ago
  IF quota_record.last_reset_at < now() - INTERVAL '24 hours' THEN
    UPDATE tenant_quotas
    SET messages_sent_today = 0,
        ai_calls_today = 0,
        template_calls_today = 0,
        ads_calls_today = 0,
        automation_runs_today = 0,
        last_reset_at = now(),
        updated_at = now()
    WHERE tenant_id = _tenant_id;
    
    -- Refresh the record
    SELECT * INTO quota_record
    FROM tenant_quotas
    WHERE tenant_id = _tenant_id;
  END IF;
  
  -- Determine which quota to check
  CASE _quota_type
    WHEN 'messages' THEN
      current_usage := quota_record.messages_sent_today;
      max_limit := quota_record.messages_limit_daily;
    WHEN 'ai' THEN
      current_usage := quota_record.ai_calls_today;
      max_limit := quota_record.ai_calls_limit_daily;
    WHEN 'templates' THEN
      current_usage := quota_record.template_calls_today;
      max_limit := quota_record.template_calls_limit_daily;
    WHEN 'ads' THEN
      current_usage := quota_record.ads_calls_today;
      max_limit := quota_record.ads_calls_limit_daily;
    WHEN 'automations' THEN
      current_usage := quota_record.automation_runs_today;
      max_limit := quota_record.automation_runs_limit_daily;
    ELSE
      RETURN FALSE;
  END CASE;
  
  -- Check if limit exceeded
  IF current_usage >= max_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment the appropriate counter
  CASE _quota_type
    WHEN 'messages' THEN
      UPDATE tenant_quotas SET messages_sent_today = messages_sent_today + 1, updated_at = now() WHERE tenant_id = _tenant_id;
    WHEN 'ai' THEN
      UPDATE tenant_quotas SET ai_calls_today = ai_calls_today + 1, updated_at = now() WHERE tenant_id = _tenant_id;
    WHEN 'templates' THEN
      UPDATE tenant_quotas SET template_calls_today = template_calls_today + 1, updated_at = now() WHERE tenant_id = _tenant_id;
    WHEN 'ads' THEN
      UPDATE tenant_quotas SET ads_calls_today = ads_calls_today + 1, updated_at = now() WHERE tenant_id = _tenant_id;
    WHEN 'automations' THEN
      UPDATE tenant_quotas SET automation_runs_today = automation_runs_today + 1, updated_at = now() WHERE tenant_id = _tenant_id;
  END CASE;
  
  RETURN TRUE;
END;
$$;

-- Function to get quota status
CREATE OR REPLACE FUNCTION public.get_quota_status(_tenant_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  quota_record tenant_quotas%ROWTYPE;
BEGIN
  SELECT * INTO quota_record
  FROM tenant_quotas
  WHERE tenant_id = _tenant_id;
  
  IF quota_record IS NULL THEN
    RETURN json_build_object(
      'messages', json_build_object('used', 0, 'limit', 1000),
      'ai', json_build_object('used', 0, 'limit', 100),
      'templates', json_build_object('used', 0, 'limit', 50),
      'ads', json_build_object('used', 0, 'limit', 100),
      'automations', json_build_object('used', 0, 'limit', 500)
    );
  END IF;
  
  RETURN json_build_object(
    'messages', json_build_object('used', quota_record.messages_sent_today, 'limit', quota_record.messages_limit_daily),
    'ai', json_build_object('used', quota_record.ai_calls_today, 'limit', quota_record.ai_calls_limit_daily),
    'templates', json_build_object('used', quota_record.template_calls_today, 'limit', quota_record.template_calls_limit_daily),
    'ads', json_build_object('used', quota_record.ads_calls_today, 'limit', quota_record.ads_calls_limit_daily),
    'automations', json_build_object('used', quota_record.automation_runs_today, 'limit', quota_record.automation_runs_limit_daily)
  );
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_tenant_quotas_updated_at
BEFORE UPDATE ON public.tenant_quotas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();