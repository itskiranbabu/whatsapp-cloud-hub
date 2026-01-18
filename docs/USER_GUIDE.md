# WhatsFlow User Guide

## Complete End-to-End Guide for White-Label WhatsApp Business API Platform

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [WhatsApp API Connection](#whatsapp-api-connection)
3. [Dashboard Overview](#dashboard-overview)
4. [Inbox - Managing Conversations](#inbox---managing-conversations)
5. [Campaigns - Broadcast Messaging](#campaigns---broadcast-messaging)
6. [Templates - Message Templates](#templates---message-templates)
7. [Contacts - Customer Management](#contacts---customer-management)
8. [Automation - Chatbots & Flows](#automation---chatbots--flows)
9. [Analytics - Performance Tracking](#analytics---performance-tracking)
10. [Ads Manager - Click-to-WhatsApp Ads](#ads-manager---click-to-whatsapp-ads)
11. [Integrations - Third-Party Apps](#integrations---third-party-apps)
12. [Settings - Configuration](#settings---configuration)
13. [Partner Portal - White-Label Management](#partner-portal---white-label-management)
14. [Troubleshooting](#troubleshooting)
15. [Production Deployment Checklist](#production-deployment-checklist)

---

## Getting Started

### 1. Create Your Account

1. Navigate to the WhatsFlow landing page
2. Click "Get Started" or "Sign Up"
3. Enter your email and create a password
4. Verify your email address
5. Complete the onboarding wizard

### 2. Initial Setup Checklist

- [ ] Create your organization/workspace
- [ ] Connect WhatsApp Business API
- [ ] Import your contacts
- [ ] Create message templates
- [ ] Set up your first automation
- [ ] Configure team members

---

## WhatsApp API Connection

### Option 1: Meta Direct (Recommended)

The fastest and most cost-effective way to connect. **Benefits:**
- ✅ FREE webhook access (saves ₹2,399+/month)
- ✅ 0% message markup - pay direct Meta pricing
- ✅ Full white-label control

**Steps:**
1. Go to **Settings → WhatsApp**
2. Click **"Connect with Meta"** button
3. Log in with your Meta Business Account
4. Select your WhatsApp Business Account
5. Grant permissions
6. Done! Your account is connected

### Option 2: Third-Party BSPs

You can also connect via:
- **AiSensy** - Official WhatsApp partner
- **Twilio** - Enterprise-grade solution
- **360dialog** - Official BSP
- **Gupshup** - Rich feature messaging

**For BSP Setup:**
1. Go to **Settings → WhatsApp → Providers**
2. Select your BSP provider
3. Enter API credentials
4. Configure webhook URL
5. Test connection

### Webhook Configuration

1. Copy your webhook URL from **Settings → WhatsApp → Webhook**
2. Paste in your BSP dashboard's webhook configuration
3. Enable events: Message received, Status updates, Template status
4. Verify connection with test message

---

## Dashboard Overview

The dashboard provides a real-time overview of your WhatsApp business:

### Key Metrics
- **Active Conversations** - Live customer chats
- **Messages Sent** - Total outbound messages
- **Delivery Rate** - Message delivery success
- **Response Time** - Average reply speed

### Quick Actions
- **New Message** - Start a new conversation
- **Send Campaign** - Launch broadcast
- **View Inbox** - Manage conversations

### Business Profile Card
Shows your connected WhatsApp number and business verification status.

---

## Inbox - Managing Conversations

The Inbox is your real-time messaging center.

### Features
1. **Conversation List** - All active chats with contact info
2. **Real-time Updates** - Messages appear instantly
3. **Smart Replies** - AI-powered response suggestions
4. **Status Indicators** - Online/typing/last seen

### Sending Messages
1. Select a conversation
2. Type your message or use smart reply
3. Press Enter or click Send
4. View delivery status (sent → delivered → read)

### Smart Reply (AI-Powered)
- Click "Show AI Suggestions" to see contextual replies
- One-click to use suggested response
- AI learns from your conversation patterns

### Filtering Conversations
- **All** - View all conversations
- **Unread** - Only unread messages
- **Status** - Filter by open/pending/resolved

---

## Campaigns - Broadcast Messaging

Send bulk WhatsApp messages to your audience.

### Creating a Campaign

1. Go to **Campaigns**
2. Click **"Create Campaign"**
3. Enter campaign name and description
4. Select target audience:
   - All contacts
   - Specific tags
   - Custom segments
5. Choose message template (required for first contact)
6. Schedule or send immediately

### Uploading Recipients via CSV

1. Download CSV template from **Campaigns → Upload CSV**
2. Fill in: phone, name, email, tags, variables
3. Upload file
4. Map columns to contact fields
5. Preview and confirm

### Campaign Analytics
- **Sent** - Messages dispatched
- **Delivered** - Successfully received
- **Read** - Opened by recipient
- **Failed** - Delivery failures with reasons

---

## Templates - Message Templates

WhatsApp requires pre-approved templates for initiating conversations.

### Template Categories
- **Marketing** - Promotions, offers, announcements
- **Utility** - Order updates, confirmations
- **Authentication** - OTPs, verification codes

### Creating a Template

1. Go to **Templates → Create Template**
2. Enter template name (lowercase, underscores)
3. Select category and language
4. Write template body with variables: `{{1}}`, `{{2}}`
5. Add header (optional): text, image, video, document
6. Add footer (optional)
7. Add buttons (optional): Quick reply, URL, Phone
8. Preview in phone mockup
9. Submit for approval

### Template Variables
Use dynamic placeholders:
```
Hello {{1}}, your order {{2}} has been shipped!
```
- `{{1}}` = Customer name
- `{{2}}` = Order number

### Template Status
- **Pending** - Under review (24-48 hours)
- **Approved** - Ready to use
- **Rejected** - Needs revision (see reason)

---

## Contacts - Customer Management

Manage your customer database effectively.

### Importing Contacts

1. Go to **Contacts → Import**
2. Download template CSV
3. Fill in contact data
4. Upload and map fields
5. Review and import

### Contact Fields
- **Name** - Customer name
- **Phone** - WhatsApp number (with country code)
- **Email** - Optional email
- **Tags** - For segmentation
- **Attributes** - Custom fields (JSON)

### Segmentation
Create segments based on:
- Tags
- Last message date
- Opt-in status
- Custom attributes

### Exporting Contacts
1. Select contacts or "All"
2. Click Export
3. Choose format (CSV)

---

## Automation - Chatbots & Flows

Build automated conversations without code.

### Automation Triggers
- **Keyword** - When customer sends specific word
- **New Contact** - First message from new customer
- **Opt-in** - Customer opts in
- **Tag Added** - When tag is applied
- **Scheduled** - Time-based triggers

### Building a Flow

1. Go to **Automation → Create Flow**
2. Select trigger type
3. Add nodes:
   - **Send Message** - Reply with text
   - **Send Template** - Use approved template
   - **Wait** - Delay execution
   - **Condition** - Branch logic
   - **Add Tag** - Tag contact
   - **Webhook** - Call external API
4. Connect nodes
5. Save and activate

### Example: Welcome Flow
1. Trigger: `Keyword = "hi" OR "hello"`
2. Send Message: "Welcome to [Business]!"
3. Wait: 2 seconds
4. Send Message: "How can I help you?"

---

## Analytics - Performance Tracking

Track your WhatsApp business performance.

### Conversation Analytics
- Messages sent/received over time
- Peak activity hours
- Response time trends

### Campaign Performance
- Delivery rates by campaign
- Open/read rates
- Failure analysis

### Agent Performance
- Messages handled per agent
- Average response time
- Customer satisfaction

### Exporting Reports
Download analytics as CSV/PDF for reporting.

---

## Ads Manager - Click-to-WhatsApp Ads

Manage Meta Click-to-WhatsApp advertising campaigns.

### Connecting Meta Ads

1. Go to **Ads Manager**
2. Click **"Connect Meta Business"**
3. Authenticate with Facebook
4. Select Ad Account
5. Sync campaigns

### Features
- View campaign performance
- Create new CTWA campaigns
- Sync with Meta Ads Manager
- Track ad-to-conversation conversion

---

## Integrations - Third-Party Apps

Connect WhatsFlow with your existing tools.

### Available Integrations

| Integration | Type | Purpose |
|-------------|------|---------|
| Shopify | E-commerce | Order notifications |
| WooCommerce | E-commerce | Order alerts |
| HubSpot | CRM | Contact sync |
| Razorpay | Payments | Payment alerts |
| Google Sheets | Data | Contact import/export |
| Zapier | Automation | 5000+ app connections |
| Webhooks | Custom | Any HTTP integration |

### Connecting an Integration

1. Go to **Integrations**
2. Find integration card
3. Click **"Connect"**
4. Enter credentials/API key
5. Configure settings
6. Test connection

---

## Settings - Configuration

### Workspace Settings
- Organization name and logo
- Primary branding colors
- Business details

### Team Management
- Invite team members
- Assign roles: Admin, Agent
- Manage permissions

### WhatsApp Configuration
- BSP provider settings
- Webhook URLs
- Connection testing

### Billing
- View current plan
- Credit balance
- Usage history
- Upgrade options

### Language
- Interface language selection
- Timezone configuration

---

## Partner Portal - White-Label Management

For white-label partners managing multiple clients.

### Partner Features
- **Custom Branding** - Your logo, colors, favicon
- **Custom Domain** - app.yourbrand.com
- **Client Management** - Multiple tenants
- **Revenue Tracking** - Commission/revenue share
- **Billing Override** - Custom pricing

### Setting Up Custom Domain

1. Go to **Partners → Custom Domain**
2. Enter your domain
3. Configure DNS:
   ```
   CNAME: app.yourdomain.com → whatsflow.app
   ```
4. Verify DNS propagation
5. Activate domain

### Managing Clients
- View all client organizations
- Monitor client usage
- Support dashboard
- Revenue reports

---

## Troubleshooting

### Messages Not Sending
1. Check WhatsApp connection status
2. Verify template approval
3. Check recipient opt-in status
4. Review error logs

### Webhook Not Receiving Messages
1. Verify webhook URL is correct
2. Check BSP webhook configuration
3. Test with webhook.site
4. Review edge function logs

### Template Rejected
- Ensure no promotional content in utility category
- Avoid placeholder-only templates
- Follow Meta content guidelines
- Appeal with modifications

### Session Expired
WhatsApp sessions expire after 24 hours. To re-engage:
1. Use an approved template
2. Customer must initiate conversation

---

## Production Deployment Checklist

### ✅ WhatsApp API Connection
- [ ] Meta Direct or BSP connected
- [ ] Webhook receiving messages
- [ ] Test message sent successfully
- [ ] Status updates working

### ✅ Templates
- [ ] At least one approved template
- [ ] Welcome template configured
- [ ] Variables working correctly

### ✅ Automation
- [ ] Welcome flow active
- [ ] Keyword responses configured
- [ ] Out-of-office flow (optional)

### ✅ Team Setup
- [ ] Team members invited
- [ ] Roles assigned
- [ ] Training completed

### ✅ Contacts
- [ ] Initial contacts imported
- [ ] Segments created
- [ ] Opt-in compliance verified

### ✅ Branding (Partners)
- [ ] Logo uploaded
- [ ] Colors configured
- [ ] Custom domain (if applicable)

### ✅ Billing
- [ ] Payment method added
- [ ] Plan selected
- [ ] Usage alerts configured

---

## Support

### Getting Help
1. **Help Center** - In-app help articles
2. **AI Assistant** - Ask the AI for help
3. **Video Tutorials** - Step-by-step guides
4. **Email Support** - support@whatsflow.app

### Reporting Issues
Use **Help Center → Submit Ticket** with:
- Detailed description
- Screenshots
- Steps to reproduce
- Expected vs actual behavior

---

## Feature Summary & Production Readiness

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Ready | Email/password login |
| Multi-tenancy | ✅ Ready | Full isolation |
| Dashboard | ✅ Ready | Real-time metrics |
| Inbox | ✅ Ready | Real-time messaging |
| Campaigns | ✅ Ready | CSV upload, scheduling |
| Templates | ✅ Ready | Full template builder |
| Contacts | ✅ Ready | Import/export, tags |
| Automation | ✅ Ready | Visual flow builder |
| Analytics | ✅ Ready | Charts, exports |
| Ads Manager | ✅ Ready | Meta Ads integration |
| Integrations | ✅ Ready | OAuth + API key flows |
| Settings | ✅ Ready | All configurations |
| Partner Portal | ✅ Ready | White-label, domains |
| Help System | ✅ Ready | AI assistant, guides |

### Production Requirements Met
- ✅ Meta Direct WhatsApp API
- ✅ Real-time messaging
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ✅ Secure credential storage
- ✅ White-label branding
- ✅ Edge functions deployed
- ✅ Database RLS policies

---

*Last Updated: January 2026*
*Version: 1.0.0*
