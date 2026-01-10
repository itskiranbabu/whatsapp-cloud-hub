/**
 * Centralized Help Content Configuration
 * This file contains all help documentation, FAQs, tips, and guides for the application
 */

export interface FAQ {
  question: string;
  answer: string;
}

export interface Resource {
  title: string;
  description: string;
  type: "article" | "video" | "doc";
  url: string;
}

export interface HelpStep {
  title: string;
  description: string;
  link?: string;
}

export interface PageHelpContent {
  title: string;
  description: string;
  features: string[];
  tips: string[];
  faqs: FAQ[];
  resources: Resource[];
}

// ==================== SETTINGS PAGE HELP ====================

export const settingsHelp = {
  workspace: {
    title: "Workspace Settings",
    description: "Configure your business profile and branding to create a professional presence on WhatsApp.",
    features: [
      "Set up your business profile with logo and contact details",
      "Customize your brand colors for consistent appearance",
      "Add business description visible to customers",
      "Configure contact information for customer reach",
    ],
    tips: [
      "Use a square logo (512x512px) for best display quality on WhatsApp",
      "Keep your business description under 256 characters for optimal visibility",
      "Update your primary color to match your brand identity",
      "Ensure your phone number matches your WhatsApp Business number",
    ],
    faqs: [
      {
        question: "How do I change my business logo?",
        answer: "Click the upload button next to your current logo or avatar. Select a square image (recommended 512x512px) and it will be automatically uploaded to your WhatsApp Business profile.",
      },
      {
        question: "Will customers see my business profile?",
        answer: "Yes! Your business name, logo, and description appear when customers view your WhatsApp Business profile. Make sure it's professional and accurate.",
      },
      {
        question: "Can I have multiple workspaces?",
        answer: "Yes, enterprise plans support multiple workspaces. Each workspace can have its own branding, team, and WhatsApp number.",
      },
    ],
    resources: [
      {
        title: "Business Profile Best Practices",
        description: "Learn how to optimize your WhatsApp Business profile",
        type: "article" as const,
        url: "#",
      },
      {
        title: "Branding Guidelines",
        description: "Tips for consistent brand appearance",
        type: "doc" as const,
        url: "#",
      },
    ],
  },
  team: {
    title: "Team Management",
    description: "Add team members, assign roles, and manage access permissions for your workspace.",
    features: [
      "Invite unlimited team members via email",
      "Assign roles: Super Admin, Admin, or Agent",
      "Manage permissions and access levels",
      "Track team member activity and status",
    ],
    tips: [
      "Assign Admin role to managers who need full access to settings",
      "Use Agent role for team members who only handle conversations",
      "Pending invitations expire after 7 days - remind members to accept",
      "Super Admins cannot be removed - transfer ownership if needed",
    ],
    faqs: [
      {
        question: "What's the difference between Admin and Agent?",
        answer: "Admins have full access to workspace settings, billing, and team management. Agents can only view and respond to conversations, manage contacts, and use templates.",
      },
      {
        question: "How do I remove a team member?",
        answer: "Click the three dots menu next to the team member and select 'Remove'. Their conversations will remain in the system but they'll lose access immediately.",
      },
      {
        question: "Can I change someone's role after inviting them?",
        answer: "Yes! Click the three dots menu next to any team member (except Super Admins) to change their role between Admin and Agent.",
      },
    ],
    resources: [
      {
        title: "Team Setup Guide",
        description: "Step-by-step guide to building your team",
        type: "video" as const,
        url: "#",
      },
      {
        title: "Role Permissions Matrix",
        description: "Detailed breakdown of role capabilities",
        type: "doc" as const,
        url: "#",
      },
    ],
  },
  whatsapp: {
    title: "WhatsApp Configuration",
    description: "Connect and configure your WhatsApp Business API for messaging.",
    features: [
      "Connect directly to Meta Cloud API (recommended)",
      "Support for multiple BSP providers (AiSensy, Twilio, etc.)",
      "Automatic webhook configuration",
      "Real-time message delivery and status updates",
    ],
    tips: [
      "Meta Direct gives you FREE webhooks and 0% message markup - best value!",
      "Save your webhook verify token securely - you'll need it for Meta setup",
      "Test your connection after setup to ensure messages flow correctly",
      "BSPs like AiSensy charge extra for webhooks - consider Meta Direct instead",
    ],
    faqs: [
      {
        question: "What is a BSP and do I need one?",
        answer: "A Business Solution Provider (BSP) is a third-party service that provides WhatsApp API access. With our Meta Direct integration, you don't need a BSP - connect directly to Meta for free webhooks and lower costs!",
      },
      {
        question: "Why is Meta Direct recommended?",
        answer: "Meta Direct gives you: FREE webhook access (BSPs charge ₹2,399+/month), 0% message markup (BSPs add 10-20%), full white-label control, and direct support from Meta.",
      },
      {
        question: "How do I get my Meta credentials?",
        answer: "1) Create a Meta Developer account, 2) Create a business app, 3) Add WhatsApp product, 4) Get your Phone Number ID and WABA ID from the WhatsApp Manager, 5) Generate a permanent access token from System Users.",
      },
      {
        question: "What happens if my connection fails?",
        answer: "Check your credentials are correct, ensure your access token hasn't expired, verify webhook URL is correctly configured, and test the connection again. Contact support if issues persist.",
      },
    ],
    resources: [
      {
        title: "Meta Direct Setup Guide",
        description: "Complete walkthrough of Meta Cloud API setup",
        type: "video" as const,
        url: "#",
      },
      {
        title: "Webhook Configuration",
        description: "How to set up webhooks for real-time messaging",
        type: "article" as const,
        url: "#",
      },
      {
        title: "Troubleshooting Connection Issues",
        description: "Common problems and solutions",
        type: "doc" as const,
        url: "#",
      },
    ],
  },
  billing: {
    title: "Billing & Subscription",
    description: "Manage your subscription, view usage, and upgrade your plan.",
    features: [
      "Flexible pricing plans for all business sizes",
      "Quarterly and yearly discounts (up to 10% off)",
      "Real-time usage tracking and analytics",
      "Easy plan upgrades and add-on management",
    ],
    tips: [
      "Choose yearly billing to save 10% on your subscription",
      "Monitor your MUC (Monthly Unique Conversations) to avoid overages",
      "Add Flow Builder add-on for powerful chatbot automation",
      "Download invoices for accounting and tax purposes",
    ],
    faqs: [
      {
        question: "What counts as a Monthly Unique Conversation (MUC)?",
        answer: "A MUC is counted when you start a new conversation with a unique phone number in a billing month. Multiple messages to the same number within 24 hours count as one conversation.",
      },
      {
        question: "Can I downgrade my plan?",
        answer: "Yes, you can downgrade at any time. Changes take effect at the start of your next billing cycle. You'll keep your current features until then.",
      },
      {
        question: "What happens if I exceed my plan limits?",
        answer: "You'll receive notifications as you approach limits. If exceeded, you can upgrade your plan or purchase additional capacity. Messaging won't be interrupted.",
      },
      {
        question: "How do I cancel my subscription?",
        answer: "Contact our support team to cancel. Your data remains accessible until the end of your billing period. We recommend exporting important data before cancellation.",
      },
    ],
    resources: [
      {
        title: "Pricing Comparison",
        description: "Compare all plans and features",
        type: "doc" as const,
        url: "#",
      },
      {
        title: "Understanding WhatsApp Pricing",
        description: "How Meta charges for conversations",
        type: "article" as const,
        url: "#",
      },
    ],
  },
};

// ==================== INBOX PAGE HELP ====================

export const inboxHelp: PageHelpContent = {
  title: "Inbox",
  description: "Manage all your WhatsApp conversations in one unified inbox with smart features.",
  features: [
    "Real-time message synchronization across all devices",
    "AI-powered smart reply suggestions",
    "Quick template insertion for faster responses",
    "Conversation assignment and team collaboration",
    "Contact details and history at a glance",
  ],
  tips: [
    "Use keyboard shortcuts: Enter to send, Shift+Enter for new line",
    "Click AI Smart Reply for intelligent response suggestions",
    "Assign conversations to specific team members for accountability",
    "Use templates for common responses to save time",
    "Star important conversations to find them easily later",
  ],
  faqs: [
    {
      question: "Why can't I send a message?",
      answer: "The 24-hour messaging window may have expired. After 24 hours of customer inactivity, you need to use an approved template message to re-engage.",
    },
    {
      question: "How do AI Smart Replies work?",
      answer: "Our AI analyzes the conversation context and customer message to suggest relevant, professional responses. Click any suggestion to edit and send.",
    },
    {
      question: "Can I see message delivery status?",
      answer: "Yes! Each message shows delivery status: Sent (single check), Delivered (double check), Read (blue checks), or Failed (with error details).",
    },
  ],
  resources: [
    {
      title: "Inbox Mastery Guide",
      description: "Tips for efficient conversation management",
      type: "video" as const,
      url: "#",
    },
    {
      title: "24-Hour Window Explained",
      description: "Understanding WhatsApp's messaging rules",
      type: "article" as const,
      url: "#",
    },
  ],
};

// ==================== CAMPAIGNS PAGE HELP ====================

export const campaignsHelp: PageHelpContent = {
  title: "Campaigns",
  description: "Create, schedule, and analyze broadcast campaigns to engage your audience at scale.",
  features: [
    "Bulk messaging to segmented contact lists",
    "Scheduled campaigns for optimal timing",
    "Real-time delivery and read analytics",
    "Template-based messaging for compliance",
    "A/B testing for message optimization",
  ],
  tips: [
    "Segment your audience for better engagement rates",
    "Schedule campaigns for when your audience is most active",
    "Use personalization variables like {{name}} for higher open rates",
    "Start with smaller batches to test message performance",
    "Monitor delivery rates and adjust timing if needed",
  ],
  faqs: [
    {
      question: "What's the maximum number of recipients per campaign?",
      answer: "This depends on your plan and WhatsApp tier. Basic plans support up to 1,000 recipients, Pro up to 5,000, and Enterprise has unlimited capacity.",
    },
    {
      question: "Can I cancel a scheduled campaign?",
      answer: "Yes, you can cancel any scheduled campaign before it starts. Once sending begins, you cannot cancel but can pause (not available for all plans).",
    },
    {
      question: "Why did some messages fail?",
      answer: "Common reasons: invalid phone numbers, opted-out contacts, WhatsApp account issues, or daily sending limits. Check the campaign report for specific failure reasons.",
    },
  ],
  resources: [
    {
      title: "Campaign Best Practices",
      description: "Maximize your campaign effectiveness",
      type: "article" as const,
      url: "#",
    },
    {
      title: "Segmentation Strategies",
      description: "Target the right audience",
      type: "video" as const,
      url: "#",
    },
  ],
};

// ==================== TEMPLATES PAGE HELP ====================

export const templatesHelp: PageHelpContent = {
  title: "Templates",
  description: "Create and manage WhatsApp message templates for broadcasts and automated responses.",
  features: [
    "Visual template builder with live preview",
    "AI-powered template generation",
    "Header, body, footer, and button support",
    "Variable placeholders for personalization",
    "Direct submission to WhatsApp for approval",
  ],
  tips: [
    "Keep templates concise - shorter messages get better engagement",
    "Use AI Template Generator for quick, compliant templates",
    "Add call-to-action buttons for higher response rates",
    "Test templates with a small group before large campaigns",
    "Utility templates get approved faster than marketing templates",
  ],
  faqs: [
    {
      question: "How long does template approval take?",
      answer: "Meta typically reviews templates within 24-48 hours. Utility templates are often approved faster than marketing templates.",
    },
    {
      question: "Why was my template rejected?",
      answer: "Common reasons: promotional content in utility templates, policy violations, or formatting issues. Check Meta's template guidelines and resubmit with corrections.",
    },
    {
      question: "What are template categories?",
      answer: "Marketing: promotional messages, offers. Utility: transactional updates, confirmations. Authentication: OTP, verification codes. Each has different pricing and approval criteria.",
    },
  ],
  resources: [
    {
      title: "Template Writing Guide",
      description: "Create templates that get approved",
      type: "article" as const,
      url: "#",
    },
    {
      title: "Template Examples Gallery",
      description: "Inspiration from successful templates",
      type: "doc" as const,
      url: "#",
    },
  ],
};

// ==================== CONTACTS PAGE HELP ====================

export const contactsHelp: PageHelpContent = {
  title: "Contacts",
  description: "Manage your WhatsApp contacts, import lists, and organize with tags and segments.",
  features: [
    "Bulk import from CSV/Excel files",
    "Smart tagging and segmentation",
    "Custom attributes for rich profiles",
    "Opt-in/opt-out management",
    "Export contacts for backup",
  ],
  tips: [
    "Always ensure contacts have opted in before messaging",
    "Use tags to organize contacts by interest, source, or status",
    "Keep phone numbers in international format (+country code)",
    "Regular cleanup of invalid numbers improves delivery rates",
    "Segment contacts for targeted, relevant campaigns",
  ],
  faqs: [
    {
      question: "What format should my import file be?",
      answer: "Use CSV or Excel format with columns: phone (required), name (optional), email (optional), tags (optional, comma-separated). Phone numbers should include country code.",
    },
    {
      question: "How do I handle opt-outs?",
      answer: "Contacts who reply with STOP are automatically marked as opted-out. You can also manually update opt-in status. Opted-out contacts won't receive broadcast campaigns.",
    },
    {
      question: "Can I merge duplicate contacts?",
      answer: "Yes! Our system automatically detects potential duplicates. You can review and merge them from the Contacts page, choosing which data to keep.",
    },
  ],
  resources: [
    {
      title: "Contact Import Guide",
      description: "Step-by-step import instructions",
      type: "video" as const,
      url: "#",
    },
    {
      title: "Segmentation Best Practices",
      description: "Organize contacts effectively",
      type: "article" as const,
      url: "#",
    },
  ],
};

// ==================== AUTOMATION PAGE HELP ====================

export const automationHelp: PageHelpContent = {
  title: "Automation",
  description: "Build intelligent chatbots and automated workflows to engage customers 24/7.",
  features: [
    "Visual drag-and-drop flow builder",
    "Keyword-triggered responses",
    "Multi-step conversation flows",
    "Integration with external systems",
    "Analytics and performance tracking",
  ],
  tips: [
    "Start simple - create a welcome message and FAQ responses first",
    "Test automations thoroughly before activating",
    "Provide easy handoff to human agents for complex queries",
    "Use delays between messages for natural conversation flow",
    "Monitor automation performance and optimize regularly",
  ],
  faqs: [
    {
      question: "What triggers can start an automation?",
      answer: "You can trigger automations with: keywords in messages, new contact creation, tag assignment, scheduled times, or webhook events from external systems.",
    },
    {
      question: "Can automations send to opted-out contacts?",
      answer: "No, automations respect opt-out status. Opted-out contacts won't receive automated messages.",
    },
    {
      question: "How do I test an automation?",
      answer: "Use the 'Test' button in the flow builder to simulate the automation. You can also create a test contact to run through the complete flow.",
    },
  ],
  resources: [
    {
      title: "Automation 101",
      description: "Getting started with chatbots",
      type: "video" as const,
      url: "#",
    },
    {
      title: "Advanced Flow Patterns",
      description: "Complex automation strategies",
      type: "doc" as const,
      url: "#",
    },
  ],
};

// ==================== ANALYTICS PAGE HELP ====================

export const analyticsHelp: PageHelpContent = {
  title: "Analytics",
  description: "Track performance metrics, analyze trends, and optimize your WhatsApp strategy.",
  features: [
    "Real-time dashboard with key metrics",
    "Conversation and message analytics",
    "Campaign performance reports",
    "Agent productivity tracking",
    "Custom date range analysis",
  ],
  tips: [
    "Check analytics weekly to identify trends",
    "Compare periods to measure improvement",
    "Focus on delivery rate - aim for 95%+",
    "Monitor response time for customer satisfaction",
    "Use insights to optimize send times and content",
  ],
  faqs: [
    {
      question: "How often is data updated?",
      answer: "Most metrics update in real-time. Some aggregate reports refresh every hour. Historical data is fully accurate after 24 hours.",
    },
    {
      question: "Can I export analytics data?",
      answer: "Yes! Pro and Enterprise plans can export data in CSV format. Click the export button on any report to download.",
    },
    {
      question: "What's a good delivery rate?",
      answer: "Industry benchmark is 95%+. If your rate is lower, check for invalid numbers, ensure contacts are active on WhatsApp, and verify your quality rating.",
    },
  ],
  resources: [
    {
      title: "Analytics Deep Dive",
      description: "Understanding your metrics",
      type: "video" as const,
      url: "#",
    },
    {
      title: "Benchmarking Guide",
      description: "Industry standards and goals",
      type: "article" as const,
      url: "#",
    },
  ],
};

// ==================== INTEGRATIONS PAGE HELP ====================

export const integrationsHelp: PageHelpContent = {
  title: "Integrations",
  description: "Connect your favorite tools and platforms to automate workflows and sync data.",
  features: [
    "Pre-built integrations for popular platforms",
    "Zapier connection for 5000+ apps",
    "REST API for custom integrations",
    "Webhook support for real-time events",
    "CRM synchronization",
  ],
  tips: [
    "Start with high-impact integrations like CRM and e-commerce",
    "Use Zapier for quick, no-code integrations",
    "Test integrations in sandbox mode before production",
    "Set up error notifications for failed syncs",
    "Review API rate limits to avoid throttling",
  ],
  faqs: [
    {
      question: "Which integrations are available?",
      answer: "We offer native integrations with Shopify, WooCommerce, HubSpot, Salesforce, Zoho, and more. Plus, connect to 5000+ apps via Zapier or use our REST API.",
    },
    {
      question: "Is there an API for custom development?",
      answer: "Yes! Our REST API provides full access to contacts, conversations, campaigns, and templates. API access is available on Pro and Enterprise plans.",
    },
    {
      question: "How do I troubleshoot integration issues?",
      answer: "Check the integration logs in settings, verify API credentials are correct, ensure webhooks are receiving events, and contact support for complex issues.",
    },
  ],
  resources: [
    {
      title: "API Documentation",
      description: "Complete API reference",
      type: "doc" as const,
      url: "#",
    },
    {
      title: "Integration Tutorials",
      description: "Step-by-step connection guides",
      type: "video" as const,
      url: "#",
    },
  ],
};

// ==================== QUICK TIPS FOR GLOBAL DISPLAY ====================

export const globalTips = {
  whatsapp: [
    "WhatsApp has a 24-hour messaging window - reply to customer messages within this time for free messaging",
    "Use templates for outbound messages after the 24-hour window expires",
    "Quality rating affects your messaging limits - maintain high quality to send more messages",
  ],
  productivity: [
    "Use keyboard shortcuts to navigate faster: Cmd/Ctrl + K for quick search",
    "Set up canned responses for frequently asked questions",
    "Assign conversations to balance workload across your team",
  ],
  marketing: [
    "Personalize messages with customer names for higher engagement",
    "A/B test different message templates to optimize performance",
    "Schedule campaigns for optimal timing in your audience's timezone",
  ],
};

// ==================== ONBOARDING CHECKLIST ====================

export const onboardingChecklist = {
  prerequisites: [
    { id: "meta-business", label: "Create Meta Business Account", description: "Required to access WhatsApp Business API" },
    { id: "phone-number", label: "Verify Phone Number", description: "A dedicated business phone number for WhatsApp" },
    { id: "business-verification", label: "Complete Business Verification", description: "Verify your business with Meta for full API access" },
    { id: "payment-method", label: "Add Payment Method", description: "Required for WhatsApp conversation charges" },
  ],
  setup: [
    { id: "connect-api", label: "Connect WhatsApp API", description: "Configure Meta Direct or BSP credentials" },
    { id: "business-profile", label: "Set Up Business Profile", description: "Add logo, description, and contact info" },
    { id: "import-contacts", label: "Import Contacts", description: "Upload your contact list to get started" },
    { id: "create-template", label: "Create First Template", description: "Design a template message for broadcasts" },
  ],
  advanced: [
    { id: "invite-team", label: "Invite Team Members", description: "Add agents and admins to your workspace" },
    { id: "setup-automation", label: "Set Up Automation", description: "Create your first chatbot flow" },
    { id: "launch-campaign", label: "Launch First Campaign", description: "Send your first broadcast message" },
  ],
};
