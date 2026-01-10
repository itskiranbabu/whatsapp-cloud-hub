-- Create ads table for production-ready Ads Manager
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'completed', 'draft')),
  platform TEXT NOT NULL DEFAULT 'facebook' CHECK (platform IN ('facebook', 'instagram')),
  budget DECIMAL(10,2) DEFAULT 0,
  spent DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  cost_per_message DECIMAL(10,2) DEFAULT 0,
  ad_account_id TEXT,
  campaign_id TEXT,
  meta_ad_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integrations table for production-ready Integrations page
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'pending', 'error')),
  config JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, integration_type)
);

-- Enable RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for ads
CREATE POLICY "Users can view ads for their tenant"
  ON public.ads FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create ads for their tenant"
  ON public.ads FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ads for their tenant"
  ON public.ads FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ads for their tenant"
  ON public.ads FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

-- RLS policies for integrations
CREATE POLICY "Users can view integrations for their tenant"
  ON public.integrations FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create integrations for their tenant"
  ON public.integrations FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update integrations for their tenant"
  ON public.integrations FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete integrations for their tenant"
  ON public.integrations FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenants.id FROM tenants
      JOIN user_roles ON user_roles.tenant_id = tenants.id
      WHERE user_roles.user_id = auth.uid()
    )
  );

-- Create update trigger for updated_at
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.ads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.integrations;