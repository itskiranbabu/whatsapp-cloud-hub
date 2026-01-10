-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'tenant_admin', 'agent');

-- Create enum for template status
CREATE TYPE public.template_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for template category
CREATE TYPE public.template_category AS ENUM ('marketing', 'utility', 'authentication');

-- Create enum for campaign status
CREATE TYPE public.campaign_status AS ENUM ('draft', 'scheduled', 'running', 'completed', 'failed');

-- Create enum for conversation status
CREATE TYPE public.conversation_status AS ENUM ('open', 'pending', 'resolved', 'expired');

-- Create enum for message direction
CREATE TYPE public.message_direction AS ENUM ('inbound', 'outbound');

-- Create enum for message status
CREATE TYPE public.message_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#25D366',
  waba_id TEXT,
  phone_number_id TEXT,
  business_name TEXT,
  is_active BOOLEAN DEFAULT true,
  plan TEXT DEFAULT 'starter',
  muc_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- USER ROLES TABLE (for RBAC)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'agent',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  attributes JSONB DEFAULT '{}',
  opted_in BOOLEAN DEFAULT false,
  opted_in_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, phone)
);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status conversation_status DEFAULT 'open',
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  is_session_active BOOLEAN DEFAULT true,
  session_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  direction message_direction NOT NULL,
  message_type TEXT DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  whatsapp_message_id TEXT,
  status message_status DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category template_category NOT NULL,
  language TEXT DEFAULT 'en',
  header_type TEXT,
  header_content TEXT,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB DEFAULT '[]',
  variables JSONB DEFAULT '[]',
  status template_status DEFAULT 'pending',
  whatsapp_template_id TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status campaign_status DEFAULT 'draft',
  target_audience JSONB DEFAULT '{}',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AUTOMATIONS TABLE
-- ============================================
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  flow_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  executions_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- Function to get user's tenant IDs
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.user_roles
  WHERE user_id = _user_id AND tenant_id IS NOT NULL
$$;

-- Function to check tenant access
CREATE OR REPLACE FUNCTION public.has_tenant_access(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND (role = 'super_admin' OR tenant_id = _tenant_id)
  )
$$;

-- ============================================
-- RLS POLICIES - TENANTS
-- ============================================
CREATE POLICY "Super admins can manage all tenants"
  ON public.tenants FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Users can view their tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (id IN (SELECT public.get_user_tenant_ids(auth.uid())));

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Super admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- ============================================
-- RLS POLICIES - USER ROLES
-- ============================================
CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Tenant admins can manage their tenant roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (
    public.has_tenant_access(auth.uid(), tenant_id)
    AND public.has_role(auth.uid(), 'tenant_admin')
  );

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - CONTACTS
-- ============================================
CREATE POLICY "Users can view tenant contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage contacts"
  ON public.contacts FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- RLS POLICIES - CONVERSATIONS
-- ============================================
CREATE POLICY "Users can view tenant conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage conversations"
  ON public.conversations FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================
CREATE POLICY "Users can view tenant messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage messages"
  ON public.messages FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- RLS POLICIES - TEMPLATES
-- ============================================
CREATE POLICY "Users can view tenant templates"
  ON public.templates FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage templates"
  ON public.templates FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- RLS POLICIES - CAMPAIGNS
-- ============================================
CREATE POLICY "Users can view tenant campaigns"
  ON public.campaigns FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage campaigns"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- RLS POLICIES - AUTOMATIONS
-- ============================================
CREATE POLICY "Users can view tenant automations"
  ON public.automations FOR SELECT
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Tenant members can manage automations"
  ON public.automations FOR ALL
  TO authenticated
  USING (public.has_tenant_access(auth.uid(), tenant_id));

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for conversations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;