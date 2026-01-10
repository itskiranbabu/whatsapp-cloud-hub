import { PageHelp } from "./PageHelp";
import { ContextualHelp } from "./ContextualHelp";
import {
  inboxHelp,
  campaignsHelp,
  templatesHelp,
  contactsHelp,
  automationHelp,
  analyticsHelp,
  integrationsHelp,
} from "@/config/helpContent";

// ==================== PAGE HELP COMPONENTS ====================

export const InboxPageHelp = () => (
  <PageHelp
    title={inboxHelp.title}
    description={inboxHelp.description}
    features={inboxHelp.features}
    tips={inboxHelp.tips}
    faqs={inboxHelp.faqs}
    resources={inboxHelp.resources}
  />
);

export const CampaignsPageHelp = () => (
  <PageHelp
    title={campaignsHelp.title}
    description={campaignsHelp.description}
    features={campaignsHelp.features}
    tips={campaignsHelp.tips}
    faqs={campaignsHelp.faqs}
    resources={campaignsHelp.resources}
  />
);

export const TemplatesPageHelp = () => (
  <PageHelp
    title={templatesHelp.title}
    description={templatesHelp.description}
    features={templatesHelp.features}
    tips={templatesHelp.tips}
    faqs={templatesHelp.faqs}
    resources={templatesHelp.resources}
  />
);

export const ContactsPageHelp = () => (
  <PageHelp
    title={contactsHelp.title}
    description={contactsHelp.description}
    features={contactsHelp.features}
    tips={contactsHelp.tips}
    faqs={contactsHelp.faqs}
    resources={contactsHelp.resources}
  />
);

export const AutomationPageHelp = () => (
  <PageHelp
    title={automationHelp.title}
    description={automationHelp.description}
    features={automationHelp.features}
    tips={automationHelp.tips}
    faqs={automationHelp.faqs}
    resources={automationHelp.resources}
  />
);

export const AnalyticsPageHelp = () => (
  <PageHelp
    title={analyticsHelp.title}
    description={analyticsHelp.description}
    features={analyticsHelp.features}
    tips={analyticsHelp.tips}
    faqs={analyticsHelp.faqs}
    resources={analyticsHelp.resources}
  />
);

export const IntegrationsPageHelp = () => (
  <PageHelp
    title={integrationsHelp.title}
    description={integrationsHelp.description}
    features={integrationsHelp.features}
    tips={integrationsHelp.tips}
    faqs={integrationsHelp.faqs}
    resources={integrationsHelp.resources}
  />
);

// ==================== CONTEXTUAL HELP CARDS ====================

export const InboxContextualHelp = () => (
  <ContextualHelp
    title="Quick Inbox Tips"
    description="Manage conversations efficiently with keyboard shortcuts and AI-powered replies."
    variant="tip"
    tips={inboxHelp.tips.slice(0, 3)}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const CampaignsContextualHelp = () => (
  <ContextualHelp
    title="Campaign Best Practices"
    description="Maximize your campaign success with these proven strategies."
    variant="guide"
    tips={campaignsHelp.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const TemplatesContextualHelp = () => (
  <ContextualHelp
    title="Template Tips"
    description="Create templates that get approved and drive engagement."
    variant="tip"
    tips={templatesHelp.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const ContactsContextualHelp = () => (
  <ContextualHelp
    title="Contact Management"
    description="Organize your contacts effectively for better targeting and compliance."
    variant="info"
    tips={contactsHelp.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const AutomationContextualHelp = () => (
  <ContextualHelp
    title="Automation Guide"
    description="Build powerful chatbots and workflows to engage customers 24/7."
    variant="guide"
    steps={[
      { title: "Choose a Trigger", description: "Start with message, keyword, or scheduled trigger" },
      { title: "Add Flow Steps", description: "Add messages, conditions, and delays" },
      { title: "Test Your Flow", description: "Verify everything works before activating" },
      { title: "Activate & Monitor", description: "Turn on and track performance" },
    ]}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const AnalyticsContextualHelp = () => (
  <ContextualHelp
    title="Analytics Overview"
    description="Track key metrics to optimize your WhatsApp marketing strategy."
    variant="info"
    tips={analyticsHelp.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const IntegrationsContextualHelp = () => (
  <ContextualHelp
    title="Integration Tips"
    description="Connect your favorite tools to automate workflows and sync data."
    variant="tip"
    tips={integrationsHelp.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);
