import { settingsHelp } from "@/config/helpContent";
import { ContextualHelp } from "./ContextualHelp";
import { PageHelp } from "./PageHelp";

interface SettingsHelpProps {
  tab: "workspace" | "team" | "whatsapp" | "billing";
}

export const SettingsHelp = ({ tab }: SettingsHelpProps) => {
  const content = settingsHelp[tab];

  return (
    <PageHelp
      title={content.title}
      description={content.description}
      features={content.features}
      tips={content.tips}
      faqs={content.faqs}
      resources={content.resources}
    />
  );
};

// Individual contextual help cards for each settings section
export const WorkspaceHelp = () => (
  <ContextualHelp
    title="Business Profile Setup"
    description="Your business profile is displayed to customers on WhatsApp. Keep it professional and up-to-date."
    variant="guide"
    tips={settingsHelp.workspace.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const TeamHelp = () => (
  <ContextualHelp
    title="Team Collaboration"
    description="Invite team members with appropriate roles to manage conversations efficiently."
    variant="info"
    steps={[
      { title: "Invite Members", description: "Send email invitations to your team" },
      { title: "Assign Roles", description: "Choose Admin for full access or Agent for conversation management" },
      { title: "Manage Access", description: "Change roles or remove members as needed" },
    ]}
    defaultExpanded={false}
    dismissible={true}
  />
);

export const WhatsAppHelp = () => (
  <ContextualHelp
    title="WhatsApp API Connection"
    description="Connect directly to Meta Cloud API (recommended) for free webhooks and 0% message markup, or use a BSP."
    variant="tip"
    tips={[
      "Meta Direct: FREE webhooks, 0% markup - Best value!",
      "BSPs charge extra for webhooks (₹2,399+/month)",
      "Direct Meta connection gives you full control",
      "Test your connection after setup",
    ]}
    defaultExpanded={true}
    dismissible={true}
  />
);

export const BillingHelp = () => (
  <ContextualHelp
    title="Subscription & Usage"
    description="Monitor your usage and choose the right plan for your business needs."
    variant="info"
    tips={settingsHelp.billing.tips}
    defaultExpanded={false}
    dismissible={true}
  />
);
