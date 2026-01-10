import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  Book,
  Lightbulb,
  ChevronRight,
  Loader2,
  HelpCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  query: string;
}

const quickActions: QuickAction[] = [
  {
    icon: Book,
    label: "Getting Started",
    query: "How do I get started with this platform?",
  },
  {
    icon: MessageCircle,
    label: "Send First Message",
    query: "How do I send my first WhatsApp message?",
  },
  {
    icon: Lightbulb,
    label: "Create Template",
    query: "How do I create a WhatsApp message template?",
  },
  {
    icon: Zap,
    label: "Set Up Automation",
    query: "How do I set up automated messages?",
  },
];

// Comprehensive app knowledge base
const APP_KNOWLEDGE = `
You are WhatsBiz AI Assistant - an intelligent, friendly, and professional helper for the WhatsBiz WhatsApp Business API Platform. Your role is to guide users through every feature and answer any questions they have.

## About WhatsBiz Platform
WhatsBiz is a comprehensive WhatsApp Business API platform that helps businesses:
- Send and receive WhatsApp messages at scale
- Create and manage message templates approved by WhatsApp
- Build automated conversation flows
- Run marketing campaigns
- Manage contacts and segments
- Analyze messaging performance
- Integrate with CRM, e-commerce, and other business tools

## Prerequisites to Get Started
1. **Meta Business Account**: Create one at business.facebook.com
2. **WhatsApp Business API Access**: Apply through Meta or use a BSP (Business Solution Provider)
3. **Verified Business**: Complete Meta's business verification process
4. **Phone Number**: A dedicated phone number not registered with WhatsApp
5. **Payment Method**: For WhatsApp conversation fees

## Main Features & How to Use Them

### 📊 Dashboard
- Overview of all your messaging metrics
- Quick access to recent conversations
- Campaign performance at a glance
- API connection status
- Credits and usage tracking

### 💬 Inbox
- View all customer conversations in one place
- AI-powered smart reply suggestions (Formal, Friendly, Empathetic tones)
- Assign conversations to team members
- Mark as resolved or pending
- Real-time message updates
- Use Command+K or Ctrl+K for quick actions

### 📋 Templates
- **Explore Gallery**: Browse pre-built templates by category (E-commerce, Healthcare, Real Estate, etc.)
- **AI Generator**: Create templates with AI assistance - choose style (Normal, Poetic, Exciting, Funny) and optimize for click or reply rates
- **Template Builder**: 
  - Choose category: Marketing, Utility, or Authentication
  - Add header (Text, Image, Video, Document)
  - Write message body with variables like {{1}}, {{2}}
  - Add footer and interactive buttons (URL, Phone, Quick Reply)
  - Live preview shows exactly how it will look on WhatsApp
- **Approval Process**: Templates must be approved by WhatsApp (usually 24-48 hours)
- **Status Tracking**: Monitor Pending, Approved, or Rejected status

### 👥 Contacts
- Import contacts via CSV upload
- Add contacts manually with name, phone, email, tags
- Create segments based on tags and attributes
- View opt-in status and last activity
- Export contacts for backup or other tools
- Bulk actions for efficiency

### 📢 Campaigns
- **Create Campaign**: Name, description, and objective
- **Select Audience**: Choose contacts, segments, or upload CSV
- **Choose Template**: Pick an approved template
- **Schedule**: Send immediately or schedule for later
- **Track Performance**: Sent, Delivered, Read, and Failed counts
- **Best Practices**: Send during business hours, personalize with variables

### 🤖 Automation
- **Triggers**: 
  - Message received
  - Keyword detected
  - Contact created
  - Scheduled time
- **Actions**:
  - Send template message
  - Add/remove tags
  - Assign to agent
  - Wait/delay
- **Use Cases**: Welcome messages, abandoned cart recovery, appointment reminders

### 📈 Analytics
- Message delivery rates
- Response times
- Agent performance
- Conversation trends
- Campaign ROI
- Export reports

### ⚙️ Settings
- **Workspace**: Business name, logo, branding colors
- **Team**: Invite members, assign roles (Admin, Agent)
- **WhatsApp Config**: Connect BSP (Twilio, 360dialog, Gupshup, or Meta Direct)
- **Billing**: View plan, usage, upgrade options

### 🔗 Integrations
- Shopify, WooCommerce for e-commerce
- Razorpay for payments
- Google Sheets for data sync
- Zapier for automation
- HubSpot, Salesforce for CRM
- Custom webhooks

### 📱 Ads Manager
- Connect Meta Business account
- Create Click-to-WhatsApp ads
- Track ad performance
- Manage budgets

## Common Questions & Answers

**Q: How long does template approval take?**
A: Usually 24-48 hours. Marketing templates may take longer than utility templates.

**Q: Why was my template rejected?**
A: Common reasons: promotional content in utility category, missing opt-out option, policy violations. Check rejection reason and resubmit.

**Q: How do I increase delivery rates?**
A: Ensure contacts have opted in, avoid spammy content, maintain good sender reputation.

**Q: What's the 24-hour messaging window?**
A: After a customer messages you, you have 24 hours to send free-form messages. After that, you must use approved templates.

**Q: How do variables work in templates?**
A: Use {{1}}, {{2}}, etc. as placeholders. When sending, replace with actual values like customer name, order number.

**Q: Can I send media in templates?**
A: Yes! Headers can include images, videos, or documents. Great for product catalogs or PDFs.

**Q: How do I handle customer opt-outs?**
A: Always include opt-out option. When someone opts out, immediately stop messaging them.

**Q: What are conversation credits?**
A: WhatsApp charges per conversation (24-hour window). Rates vary by country and conversation type (marketing, utility, authentication, service).

## Tips for Success
1. Always get explicit opt-in before messaging
2. Personalize messages with variables
3. Test templates before campaigns
4. Monitor analytics and optimize
5. Respond quickly to incoming messages
6. Use automation for common queries
7. Keep contact lists clean and updated
8. Follow WhatsApp Commerce Policy

## Need More Help?
- Check the Help Center in the Support section
- Contact support for technical issues
- Join our community for tips and best practices

When responding:
- Be friendly, professional, and helpful
- Give step-by-step instructions when explaining how to do something
- Use emojis sparingly for friendliness
- If you don't know something specific, admit it and suggest contacting support
- Always encourage users to explore features
- Format responses clearly with bullet points or numbered steps when appropriate
`;

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke("ai-assistant", {
        body: {
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: content.trim() },
          ],
          systemPrompt: APP_KNOWLEDGE,
        },
      });

      if (response.error) throw new Error(response.error.message);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data?.content || "I apologize, but I encountered an issue. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Here are some quick tips:\n\n• **Dashboard**: View your metrics and recent activity\n• **Inbox**: Manage customer conversations\n• **Templates**: Create WhatsApp message templates\n• **Campaigns**: Send bulk messages\n• **Contacts**: Manage your contact list\n\nFor detailed help, visit the Help Center in Settings > Support.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
            <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
          </span>
        </span>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
                    <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-primary"></span>
                </div>
                <div>
                  <h3 className="font-semibold">WhatsBiz AI Assistant</h3>
                  <p className="text-xs opacity-80">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">
                      Hi! I'm your AI Assistant
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      I know everything about this platform. Ask me anything or
                      try a quick action below!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                      Quick Actions
                    </p>
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.query)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <action.icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-medium">
                          {action.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Powered by AI • Available 24/7</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            message.role === "user"
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                AI responses are for guidance. Verify important actions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
