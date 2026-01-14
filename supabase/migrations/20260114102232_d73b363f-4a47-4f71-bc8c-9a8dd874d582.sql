-- =====================================================
-- Phase 5: Partner & Affiliate System Database Schema
-- =====================================================

-- White-Label Partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_user_id UUID REFERENCES auth.users NOT NULL,
  custom_domain TEXT,
  branding JSONB DEFAULT '{"logo_url": null, "primary_color": "#25D366", "font_family": "Inter"}'::jsonb,
  commission_rate NUMERIC DEFAULT 0.20,
  revenue_share_model TEXT DEFAULT 'markup',
  payout_details JSONB,
  status TEXT DEFAULT 'pending',
  total_revenue NUMERIC DEFAULT 0,
  total_clients INTEGER DEFAULT 0,
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link tenants to partners
CREATE TABLE public.tenant_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants NOT NULL,
  partner_id UUID REFERENCES public.partners NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

-- Affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate NUMERIC DEFAULT 0.20,
  total_earnings NUMERIC DEFAULT 0,
  pending_payout NUMERIC DEFAULT 0,
  payout_details JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referral tracking
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliates NOT NULL,
  referred_tenant_id UUID REFERENCES public.tenants NOT NULL,
  status TEXT DEFAULT 'pending',
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Billing accounts
CREATE TABLE public.billing_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants NOT NULL UNIQUE,
  partner_id UUID REFERENCES public.partners,
  plan_id TEXT NOT NULL DEFAULT 'starter',
  credits_balance INTEGER DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly',
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  payment_method JSONB,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage logs for metering
CREATE TABLE public.usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants NOT NULL,
  event_type TEXT NOT NULL,
  credits_used INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Commission tracking
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners,
  affiliate_id UUID REFERENCES public.affiliates,
  source_tenant_id UUID REFERENCES public.tenants,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (partner_id IS NOT NULL OR affiliate_id IS NOT NULL)
);

-- Payouts
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners,
  affiliate_id UUID REFERENCES public.affiliates,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  razorpay_payout_id TEXT,
  payout_details JSONB,
  requested_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (partner_id IS NOT NULL OR affiliate_id IS NOT NULL)
);

-- Automation execution logs
CREATE TABLE public.automation_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES public.automations NOT NULL,
  tenant_id UUID REFERENCES public.tenants NOT NULL,
  conversation_id UUID REFERENCES public.conversations,
  contact_id UUID REFERENCES public.contacts,
  trigger_data JSONB,
  status TEXT DEFAULT 'running',
  current_node_id TEXT,
  execution_path JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;

-- Partners RLS policies
CREATE POLICY "Partners can view own data" ON public.partners
  FOR SELECT USING (owner_user_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage partners" ON public.partners
  FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can create own partner" ON public.partners
  FOR INSERT WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Partners can update own data" ON public.partners
  FOR UPDATE USING (owner_user_id = auth.uid());

-- Tenant Partners RLS
CREATE POLICY "Partners can view their clients" ON public.tenant_partners
  FOR SELECT USING (
    partner_id IN (SELECT id FROM public.partners WHERE owner_user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "Partners can add clients" ON public.tenant_partners
  FOR INSERT WITH CHECK (
    partner_id IN (SELECT id FROM public.partners WHERE owner_user_id = auth.uid())
  );

-- Affiliates RLS
CREATE POLICY "Affiliates can view own data" ON public.affiliates
  FOR SELECT USING (user_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Users can become affiliates" ON public.affiliates
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Affiliates can update own data" ON public.affiliates
  FOR UPDATE USING (user_id = auth.uid());

-- Referrals RLS
CREATE POLICY "Affiliates can view own referrals" ON public.referrals
  FOR SELECT USING (
    affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

-- Billing Accounts RLS
CREATE POLICY "Tenant members can view billing" ON public.billing_accounts
  FOR SELECT USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Super admins can manage billing" ON public.billing_accounts
  FOR ALL USING (is_super_admin(auth.uid()));

-- Usage Logs RLS
CREATE POLICY "Tenant members can view usage" ON public.usage_logs
  FOR SELECT USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "System can insert usage logs" ON public.usage_logs
  FOR INSERT WITH CHECK (has_tenant_access(auth.uid(), tenant_id));

-- Commissions RLS
CREATE POLICY "Partners/affiliates can view own commissions" ON public.commissions
  FOR SELECT USING (
    partner_id IN (SELECT id FROM public.partners WHERE owner_user_id = auth.uid())
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

-- Payouts RLS
CREATE POLICY "Partners/affiliates can view own payouts" ON public.payouts
  FOR SELECT USING (
    partner_id IN (SELECT id FROM public.partners WHERE owner_user_id = auth.uid())
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "Partners/affiliates can request payouts" ON public.payouts
  FOR INSERT WITH CHECK (
    partner_id IN (SELECT id FROM public.partners WHERE owner_user_id = auth.uid())
    OR affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

-- Automation Executions RLS
CREATE POLICY "Tenant members can view executions" ON public.automation_executions
  FOR SELECT USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "System can manage executions" ON public.automation_executions
  FOR ALL USING (has_tenant_access(auth.uid(), tenant_id));

-- Add triggers for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_accounts_updated_at BEFORE UPDATE ON public.billing_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_tenant_partners_partner ON public.tenant_partners(partner_id);
CREATE INDEX idx_referrals_affiliate ON public.referrals(affiliate_id);
CREATE INDEX idx_usage_logs_tenant ON public.usage_logs(tenant_id, created_at);
CREATE INDEX idx_commissions_partner ON public.commissions(partner_id);
CREATE INDEX idx_commissions_affiliate ON public.commissions(affiliate_id);
CREATE INDEX idx_automation_executions_automation ON public.automation_executions(automation_id);
CREATE INDEX idx_automation_executions_status ON public.automation_executions(status);