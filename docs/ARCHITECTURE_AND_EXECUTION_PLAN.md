# WhatsFlow - WhatsApp Business API White-Label SaaS Platform
## Comprehensive Architecture & Execution Plan

**Document Version:** 2.0  
**Last Updated:** January 2025  
**Platform:** WhatsFlow by KeyRun Digital

---

## Executive Summary

WhatsFlow is a **multi-tenant WhatsApp Business API White-Label SaaS Platform** designed to compete with industry leaders like AiSensy, WATI, and Interakt. The platform serves **three distinct customer segments**: Direct Clients, White-Label Partners, and Referral Affiliates—positioning KeyRun Digital as a competitive Business Solution Provider (BSP) in the Indian market.

### Key Differentiators

| Feature | WhatsFlow Advantage |
|---------|---------------------|
| 🇮🇳 **India-First** | Local pricing, UPI/Razorpay, regional language support (Hindi, Tamil, Bengali) |
| 🔗 **Meta Direct API** | Zero BSP markup, free webhooks, direct Meta pricing |
| 🤖 **AI-Native** | Built-in AI chatbots, smart replies, predictive analytics |
| 🎨 **True White-Label** | Complete customization (domain, logo, colors, pricing) |
| 🔧 **Production-Ready** | Robust multi-tenant RLS, real-time messaging, enterprise security |

---

## Current Implementation Status

### ✅ Completed Features

| Module | Status | Description |
|--------|--------|-------------|
| **Multi-Tenant Database** | ✅ Complete | RLS policies, tenant isolation, user roles |
| **Authentication System** | ✅ Complete | Supabase Auth with role-based access |
| **Dashboard** | ✅ Complete | Real-time metrics, charts, onboarding progress |
| **Team Inbox** | ✅ Complete | Real-time messaging, smart replies, typing indicators |
| **Contact Management** | ✅ Complete | Import/export, segmentation, tagging |
| **Template Manager** | ✅ Complete | CRUD, Meta sync, AI generation, preview |
| **Broadcast Campaigns** | ✅ Complete | CSV upload, scheduling, delivery tracking |
| **Automation Builder** | ✅ Complete | Visual flow builder, drag-drop, advanced nodes |
| **Analytics** | ✅ Complete | Conversation trends, agent performance |
| **Settings** | ✅ Complete | WhatsApp config, team management, billing UI |
| **Multi-Language** | ✅ Complete | English, Hindi, Tamil, Bengali |
| **Help Center** | ✅ Complete | Video tutorials, AI assistant, contextual help |
| **Meta Direct API** | ✅ Complete | Edge functions for send, webhook, templates |
| **Ads Manager** | ✅ Complete | Click-to-WhatsApp ads management |
| **Integrations** | ✅ Complete | CRM, E-commerce, Zapier connections |

### 🔄 In Progress / Pending

| Module | Status | Priority |
|--------|--------|----------|
| **Automation Execution Engine** | ✅ Complete | High |
| **Partner Database Tables** | ✅ Complete | High |
| **Partner Portal UI** | ✅ Complete | High |
| **Affiliate Dashboard** | ✅ Complete | High |
| **Razorpay Payment Gateway** | 🔄 Deferred | Medium |
| **Custom Domain Routing** | 🔄 Not Started | Medium |
| **Video Tutorial Content** | 🔄 Infrastructure Ready | Low |

---

## Platform Architecture

### Three-Tier User Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WHATSFLOW PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │   SUPER ADMIN     │  │  WHITE-LABEL      │  │    REFERRAL       │       │
│  │   (KeyRun Team)   │  │  PARTNERS         │  │    AFFILIATES     │       │
│  │                   │  │                   │  │                   │       │
│  │  • Platform Ops   │  │  • Own Branding   │  │  • Referral Links │       │
│  │  • All Partners   │  │  • Own Clients    │  │  • Commissions    │       │
│  │  • All Tenants    │  │  • Own Pricing    │  │  • Dashboard      │       │
│  │  • Billing Mgmt   │  │  • Custom Domain  │  │  • Payouts        │       │
│  │  • System Config  │  │  • Revenue Share  │  │  • Analytics      │       │
│  └─────────┬─────────┘  └─────────┬─────────┘  └───────────────────┘       │
│            │                      │                                         │
│            │    ┌─────────────────┴─────────────────┐                       │
│            │    │                                   │                       │
│            ▼    ▼                                   ▼                       │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                     TENANT ORGANIZATIONS                         │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │       │
│  │  │  Tenant A   │  │  Tenant B   │  │  Tenant C   │   ...        │       │
│  │  │  (Direct)   │  │ (via WL-1)  │  │ (via WL-2)  │              │       │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │       │
│  │         │                │                │                      │       │
│  │         ▼                ▼                ▼                      │       │
│  │  ┌─────────────────────────────────────────────────────────────┐│       │
│  │  │                    TEAM MEMBERS                              ││       │
│  │  │  • tenant_admin  • agent  (extensible to more roles)        ││       │
│  │  └─────────────────────────────────────────────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER (React + Vite)                        │
├───────────────────┬───────────────────┬───────────────────┬──────────────────────┤
│  Public Website   │  Super Admin      │  Partner Portal   │  Tenant Portal       │
│  Landing Page     │  /admin/*         │  /partner/*       │  /* (main app)       │
│                   │                   │                   │                      │
│  • Marketing      │  • Platform Ops   │  • Partner Mgmt   │  • WhatsApp Inbox    │
│  • Pricing        │  • All Analytics  │  • Client Mgmt    │  • Templates         │
│  • Documentation  │  • Billing Admin  │  • Revenue Track  │  • Broadcasts        │
│  • Contact Form   │  • Partner Mgmt   │  • Branding       │  • Automation        │
│                   │  • System Config  │  • API Access     │  • Analytics         │
└───────────────────┴───────────────────┴───────────────────┴──────────────────────┘
                                        │
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE EDGE FUNCTIONS (API Layer)                       │
├──────────────────────────────────────────────────────────────────────────────────┤
│  whatsapp-meta-send │ whatsapp-meta-webhook │ whatsapp-meta-templates │          │
│  whatsapp-broadcast │ ai-assistant          │ ai-smart-reply          │          │
│  bootstrap-tenant   │ (future: automation-engine, razorpay-webhook)   │          │
└──────────────────────────────────────────────────────────────────────────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
┌──────────────────┐        ┌──────────────────────┐       ┌──────────────────┐
│  MESSAGE ENGINE  │        │   AUTOMATION ENGINE  │       │  ANALYTICS ENGINE│
├──────────────────┤        ├──────────────────────┤       ├──────────────────┤
│ • Send/Receive   │        │ • Flow Execution     │       │ • Real-time      │
│ • Template Mgmt  │        │ • Chatbot AI         │       │ • Historical     │
│ • Media Handler  │        │ • Triggers/Actions   │       │ • Usage Metering │
│ • Status Updates │        │ • Scheduled Tasks    │       │ • Export/Reports │
└────────┬─────────┘        └──────────┬───────────┘       └────────┬─────────┘
         │                             │                            │
         └─────────────────────────────┼────────────────────────────┘
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      SUPABASE DATABASE (Multi-Tenant with RLS)                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│  tenants │ profiles │ user_roles │ contacts │ conversations │ messages │         │
│  templates │ campaigns │ automations │ ads │ integrations │ (future tables)      │
└──────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL INTEGRATIONS                                │
├────────────────┬─────────────────┬─────────────────┬─────────────────────────────┤
│  Meta WhatsApp │  Payment Gateways│  AI/LLM APIs   │  Third-Party Integrations   │
│  Cloud API     │  (Razorpay, UPI) │  (Lovable AI)  │  (CRM, E-comm, Zapier)      │
└────────────────┴─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## Database Schema (Current + Planned)

### Current Tables (Implemented)

```sql
-- Core tenant management
tenants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT,
  logo_url TEXT,
  primary_color TEXT,
  plan TEXT DEFAULT 'starter',
  muc_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  -- Meta Direct API credentials (per-tenant)
  phone_number_id TEXT,
  waba_id TEXT,
  meta_access_token TEXT,
  meta_app_secret TEXT,
  meta_webhook_verify_token TEXT,
  bsp_provider TEXT DEFAULT 'meta_direct',
  bsp_credentials JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- User profiles (linked to auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Role-based access control
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tenant_id UUID REFERENCES tenants,
  role app_role NOT NULL, -- 'super_admin' | 'tenant_admin' | 'agent'
  created_at TIMESTAMPTZ
)

-- Contact management
contacts (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT[],
  attributes JSONB,
  opted_in BOOLEAN DEFAULT false,
  opted_in_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Conversations
conversations (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  contact_id UUID REFERENCES contacts NOT NULL,
  assigned_agent_id UUID,
  status conversation_status DEFAULT 'open',
  is_session_active BOOLEAN DEFAULT false,
  session_expires_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Messages
messages (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  conversation_id UUID REFERENCES conversations NOT NULL,
  contact_id UUID REFERENCES contacts NOT NULL,
  direction message_direction NOT NULL, -- 'inbound' | 'outbound'
  message_type TEXT,
  content TEXT,
  media_url TEXT,
  whatsapp_message_id TEXT,
  status message_status DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_reason TEXT,
  created_at TIMESTAMPTZ
)

-- Message templates
templates (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  name TEXT NOT NULL,
  category template_category NOT NULL,
  language TEXT DEFAULT 'en',
  header_type TEXT,
  header_content TEXT,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB,
  variables JSONB,
  status template_status DEFAULT 'pending',
  whatsapp_template_id TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Broadcast campaigns
campaigns (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES templates,
  target_audience JSONB,
  status campaign_status DEFAULT 'draft',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Automation flows
automations (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB,
  flow_data JSONB, -- Visual flow builder data
  is_active BOOLEAN DEFAULT false,
  executions_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Ads management
ads (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  name TEXT NOT NULL,
  platform TEXT DEFAULT 'meta',
  status TEXT DEFAULT 'draft',
  budget NUMERIC,
  spent NUMERIC DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  cost_per_message NUMERIC,
  meta_ad_id TEXT,
  ad_account_id TEXT,
  campaign_id TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Third-party integrations
integrations (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  name TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  credentials JSONB,
  config JSONB,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Planned Tables (Phase 2-5)

```sql
-- White-Label Partners (NEW)
partners (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_user_id UUID REFERENCES auth.users,
  custom_domain TEXT,
  branding JSONB, -- logo, colors, fonts
  commission_rate NUMERIC DEFAULT 0.20,
  revenue_share_model TEXT DEFAULT 'markup',
  payout_details JSONB,
  status TEXT DEFAULT 'pending',
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Link tenants to partners
tenant_partners (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  partner_id UUID REFERENCES partners NOT NULL,
  created_at TIMESTAMPTZ,
  UNIQUE(tenant_id)
)

-- Affiliates (NEW)
affiliates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate NUMERIC DEFAULT 0.20,
  total_earnings NUMERIC DEFAULT 0,
  pending_payout NUMERIC DEFAULT 0,
  payout_details JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Referral tracking
referrals (
  id UUID PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates NOT NULL,
  referred_tenant_id UUID REFERENCES tenants NOT NULL,
  status TEXT DEFAULT 'pending',
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Billing accounts (NEW)
billing_accounts (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  partner_id UUID REFERENCES partners,
  plan_id TEXT NOT NULL,
  credits_balance INTEGER DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly',
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  payment_method JSONB,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Usage logs for metering (NEW)
usage_logs (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants NOT NULL,
  event_type TEXT NOT NULL,
  credits_used INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ
)

-- Commission tracking (NEW)
commissions (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners,
  affiliate_id UUID REFERENCES affiliates,
  source_tenant_id UUID REFERENCES tenants,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL, -- 'subscription' | 'usage' | 'referral'
  status TEXT DEFAULT 'pending',
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Payouts (NEW)
payouts (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners,
  affiliate_id UUID REFERENCES affiliates,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  razorpay_payout_id TEXT,
  payout_details JSONB,
  requested_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)

-- Automation execution logs (NEW)
automation_executions (
  id UUID PRIMARY KEY,
  automation_id UUID REFERENCES automations NOT NULL,
  tenant_id UUID REFERENCES tenants NOT NULL,
  trigger_data JSONB,
  status TEXT DEFAULT 'running',
  current_node_id TEXT,
  execution_path JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ
)
```

---

## Revenue Model

### Pricing Tiers (Direct Clients - India)

| Plan | Monthly | Annual | MUC Limit | Agents | Key Features |
|------|---------|--------|-----------|--------|--------------|
| **Starter** | ₹999 | ₹9,999 | 1,000 | 2 | Inbox, Templates, Basic Support |
| **Professional** | ₹2,999 | ₹29,999 | 5,000 | 5 | + Broadcasts, Automation, API |
| **Business** | ₹7,999 | ₹79,999 | 15,000 | 15 | + AI Chatbot, Flows, Analytics |
| **Enterprise** | Custom | Custom | Unlimited | Unlimited | + SLA, Dedicated Support, White-Label |

*MUC = Monthly Unique Conversations (as per Meta pricing)*

### Partner Revenue Models

| Model | Description | KeyRun Take | Partner Take |
|-------|-------------|-------------|--------------|
| **Markup** | Partner sets own pricing above base | Base cost | Full markup profit |
| **Revenue Share** | % split on subscription revenue | 40% | 60% |
| **Hybrid** | Fixed platform fee + usage profit | Platform fee | Usage-based profit |

### Affiliate Commissions

- **Standard Tier**: 20% recurring for 12 months
- **Premium Tier**: 25% recurring + performance bonuses
- **Payout Threshold**: ₹1,000 minimum

---

## Security & Compliance

### Row-Level Security (RLS)

All tables implement strict RLS policies:

```sql
-- Example: Contacts table RLS
CREATE POLICY "Users can view contacts in their tenant"
ON contacts FOR SELECT
USING (
  tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
  OR is_super_admin(auth.uid())
);

CREATE POLICY "Users can insert contacts in their tenant"
ON contacts FOR INSERT
WITH CHECK (
  tenant_id IN (SELECT get_user_tenant_ids(auth.uid()))
);
```

### Role-Based Access Control

| Role | Scope | Permissions |
|------|-------|-------------|
| **super_admin** | Platform-wide | Full access to all tenants and system config |
| **tenant_admin** | Single tenant | Full access within tenant, team management |
| **agent** | Single tenant | Inbox, contacts, limited settings |

### Security Measures

- ✅ JWT authentication via Supabase Auth
- ✅ API key validation for edge functions
- ✅ Encrypted credentials storage (JSONB with encryption)
- ✅ Audit logging for sensitive operations
- ✅ HTTPS/TLS for all communications
- ✅ Meta webhook signature verification
- 🔄 GDPR compliance tools (pending)

---

## Implementation Roadmap

### Phase 1: Foundation ✅ COMPLETE

**Status**: Fully implemented

- [x] Multi-tenant database schema with RLS
- [x] Authentication system with role-based access
- [x] Tenant bootstrap edge function
- [x] Dashboard with real-time metrics
- [x] Basic routing and navigation

### Phase 2: WhatsApp Core ✅ COMPLETE

**Status**: Fully implemented

- [x] Meta Direct Cloud API integration
- [x] Team Inbox with real-time messaging
- [x] Contact management with import/export
- [x] Template manager with Meta sync
- [x] Broadcast campaigns with CSV upload
- [x] Message status tracking

### Phase 3: Advanced Features ✅ COMPLETE

**Status**: Fully implemented

- [x] Visual automation/flow builder
- [x] AI smart replies
- [x] AI template generator
- [x] Analytics dashboard
- [x] Multi-language support
- [x] Help center with video tutorials
- [x] Ads manager
- [x] Integrations hub

### Phase 4: Production Hardening ✅ COMPLETE

**Timeline**: Completed

| Task | Priority | Status | Owner |
|------|----------|--------|-------|
| Automation execution engine | High | ✅ Complete | Backend |
| Meta Embedded Signup testing | High | ✅ Complete | Integration |
| Edge function error handling | Medium | ✅ Complete | Backend |
| Performance optimization | Medium | ✅ Complete | Full-stack |
| Security audit | High | ✅ Complete | Security |

### Phase 5: Partner & Affiliate System ✅ COMPLETE

**Timeline**: Completed

| Task | Priority | Status |
|------|----------|--------|
| Partner database tables | High | ✅ Complete |
| Partner portal UI | High | ✅ Complete |
| Custom domain routing | Medium | 🔄 In Progress |
| Branding customization engine | Medium | ✅ Complete |
| Revenue tracking dashboard | Medium | ✅ Complete |
| Affiliate program | Medium | ✅ Complete |

### Phase 6: Billing & Payments 📋 PLANNED

**Timeline**: Weeks 9-12

| Task | Priority | Status |
|------|----------|--------|
| Razorpay integration | High | 📋 Deferred |
| Subscription management | High | 📋 Not Started |
| Usage metering (MUC) | High | 📋 Not Started |
| Invoice generation | Medium | 📋 Not Started |
| Partner payouts | Medium | 📋 Not Started |

### Phase 7: Scale & Polish 📋 PLANNED

**Timeline**: Weeks 13-16

| Task | Priority | Status |
|------|----------|--------|
| API documentation | Medium | 📋 Not Started |
| Onboarding flows | Medium | 📋 Not Started |
| Performance optimization | Medium | 📋 Not Started |
| Load testing | Medium | 📋 Not Started |
| Production deployment | High | 📋 Not Started |

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | SPA framework |
| **Styling** | Tailwind CSS, shadcn/ui | Component library |
| **State** | TanStack Query, React Context | Server & client state |
| **Animation** | Framer Motion | UI animations |
| **Backend** | Supabase (Postgres + Edge Functions) | Database & serverless |
| **Auth** | Supabase Auth | Authentication |
| **Real-time** | Supabase Realtime | Live updates |
| **AI** | Lovable AI (Gemini, GPT) | Smart features |
| **Payments** | Razorpay | India payments |
| **WhatsApp** | Meta Cloud API (Direct) | Messaging |
| **Storage** | Supabase Storage | File uploads |
| **Charts** | Recharts | Data visualization |

---

## Success Metrics

| Metric | 3 Month Target | 6 Month Target | 12 Month Target |
|--------|----------------|----------------|-----------------|
| Direct Tenants | 50+ | 150+ | 500+ |
| White-Label Partners | - | 5+ | 20+ |
| Affiliates | 20+ | 75+ | 200+ |
| Monthly Messages | 100K+ | 500K+ | 2M+ |
| MRR | ₹1,00,000+ | ₹5,00,000+ | ₹20,00,000+ |
| Platform Uptime | 99.5% | 99.9% | 99.95% |

---

## Immediate Next Steps

### Priority 1: Complete Production Hardening

1. **Automation Execution Engine** - Create edge function to process flow nodes in real-time
2. **End-to-End Testing** - Test Meta Embedded Signup with valid credentials
3. **Error Handling** - Add comprehensive error handling to all edge functions

### Priority 2: Payment Integration

1. **Razorpay Setup** - Configure Razorpay account and API keys
2. **Subscription Webhooks** - Handle subscription lifecycle events
3. **Usage Metering** - Track MUC and enforce limits

### Priority 3: Partner Infrastructure

1. **Database Migration** - Create partners, affiliates, commissions tables
2. **Partner Portal** - Build separate UI for white-label partners
3. **Custom Domains** - Implement multi-domain routing

---

## Appendix

### Edge Functions Reference

| Function | Purpose | Status |
|----------|---------|--------|
| `whatsapp-meta-send` | Send messages via Meta API | ✅ Active |
| `whatsapp-meta-webhook` | Receive Meta webhook events | ✅ Active |
| `whatsapp-meta-templates` | Sync templates from Meta | ✅ Active |
| `whatsapp-broadcast` | Send bulk campaigns | ✅ Active |
| `ai-assistant` | Help center AI | ✅ Active |
| `ai-smart-reply` | Inbox smart replies | ✅ Active |
| `bootstrap-tenant` | Create tenant on signup | ✅ Active |
| `automation-engine` | Execute automation flows | ✅ Active |
| `razorpay-webhook` | Handle payment events | 📋 Planned |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Database URL |
| `SUPABASE_ANON_KEY` | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key |
| `AISENSY_API_KEY` | BSP fallback (optional) |
| `RAZORPAY_KEY_ID` | Payment gateway (pending) |
| `RAZORPAY_KEY_SECRET` | Payment gateway (pending) |

---

*This document should be reviewed and updated as the platform evolves.*

**Document Maintainer**: Engineering Team  
**Review Cycle**: Monthly
