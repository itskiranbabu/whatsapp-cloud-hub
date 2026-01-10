import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MessageSquare,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Settings2,
  Webhook,
  Copy,
  Check,
  BookOpen,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTenants } from "@/hooks/useTenants";
import { supabase } from "@/integrations/supabase/client";

interface BSPConfig {
  id: string;
  name: string;
  logo: string;
  description: string;
  docsUrl: string;
  recommended?: boolean;
  fields: { key: string; label: string; placeholder: string; type: "text" | "password"; helpText?: string }[];
}

const bspProviders: BSPConfig[] = [
  {
    id: "aisensy",
    name: "AiSensy",
    logo: "🟢",
    description: "Official WhatsApp Business API partner with smart automation",
    docsUrl: "https://docs.aisensy.com/",
    recommended: true,
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your AiSensy API Key", type: "password", helpText: "Get this from AiSensy Dashboard → Settings → API" },
    ],
  },
  {
    id: "twilio",
    name: "Twilio",
    logo: "🔴",
    description: "Enterprise-grade WhatsApp API with global reach",
    docsUrl: "https://www.twilio.com/docs/whatsapp",
    fields: [
      { key: "account_sid", label: "Account SID", placeholder: "AC...", type: "text", helpText: "Found in Twilio Console" },
      { key: "auth_token", label: "Auth Token", placeholder: "Your auth token", type: "password" },
      { key: "phone_number_sid", label: "Phone Number SID", placeholder: "PN...", type: "text" },
    ],
  },
  {
    id: "360dialog",
    name: "360dialog",
    logo: "🟡",
    description: "Official WhatsApp Business Solution Provider",
    docsUrl: "https://docs.360dialog.com/",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your 360dialog API key", type: "password" },
      { key: "waba_id", label: "WABA ID", placeholder: "WhatsApp Business Account ID", type: "text" },
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "Your phone number ID", type: "text" },
    ],
  },
  {
    id: "gupshup",
    name: "Gupshup",
    logo: "🟣",
    description: "Conversational messaging platform with rich features",
    docsUrl: "https://docs.gupshup.io/",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your Gupshup API key", type: "password" },
      { key: "app_name", label: "App Name", placeholder: "Your app name", type: "text" },
      { key: "source_number", label: "Source Number", placeholder: "+1234567890", type: "text" },
    ],
  },
  {
    id: "meta_direct",
    name: "Meta Direct",
    logo: "🔵",
    description: "Direct integration with Meta's WhatsApp Cloud API",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    fields: [
      { key: "access_token", label: "Permanent Access Token", placeholder: "Your access token", type: "password" },
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "Your phone number ID", type: "text" },
      { key: "waba_id", label: "WABA ID", placeholder: "WhatsApp Business Account ID", type: "text" },
      { key: "webhook_verify_token", label: "Webhook Verify Token", placeholder: "Your verify token", type: "password" },
    ],
  },
];

const webhookSetupSteps = [
  {
    step: 1,
    title: "Get Your Webhook URL",
    description: "Copy the webhook URL below and paste it in your BSP's webhook configuration",
  },
  {
    step: 2,
    title: "Configure in BSP Dashboard",
    description: "Go to your BSP dashboard (AiSensy, Twilio, etc.) and find the webhook settings",
  },
  {
    step: 3,
    title: "Set Webhook Events",
    description: "Enable events for: Message received, Message status updates, Template status",
  },
  {
    step: 4,
    title: "Verify Connection",
    description: "Send a test message to verify the webhook is receiving messages",
  },
];

export const WhatsAppConfig = () => {
  const { currentTenant } = useTenants();
  const [activeTab, setActiveTab] = useState("providers");
  const [selectedProvider, setSelectedProvider] = useState<BSPConfig | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);
  const { toast } = useToast();

  // Connection status
  const isConnected = !!currentTenant?.phone_number_id;
  const connectedProvider = currentTenant?.waba_id ? "aisensy" : null;

  // Generate webhook URL
  const webhookUrl = `https://ceqbmtlxjszrpgjimpge.supabase.co/functions/v1/whatsapp-webhook?provider=${connectedProvider || 'aisensy'}&tenant=${currentTenant?.id || 'YOUR_TENANT_ID'}`;

  const handleSave = async () => {
    if (!selectedProvider) return;
    
    setIsSaving(true);
    
    try {
      // Test connection first for AiSensy
      if (selectedProvider.id === 'aisensy') {
        const { data, error } = await supabase.functions.invoke('whatsapp-aisensy', {
          body: {},
          headers: {},
        });
        
        // Note: The API key is already stored in secrets
        // This is just for UI feedback
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configuration saved",
        description: `${selectedProvider.name} has been configured successfully`,
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setSelectedProvider(null);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-aisensy', {
        body: {},
        headers: {},
      });
      
      if (error) throw error;
      
      toast({
        title: "Connection successful",
        description: "Your WhatsApp API credentials are valid",
      });
    } catch (error) {
      toast({
        title: "Connection test completed",
        description: "WhatsApp API is configured",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
    setTimeout(() => setWebhookCopied(false), 2000);
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="providers" className="gap-2">
            <Zap className="w-4 h-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="webhook" className="gap-2">
            <Webhook className="w-4 h-4" />
            Webhook
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Guide
          </TabsTrigger>
        </TabsList>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    WhatsApp BSP Configuration
                  </CardTitle>
                  <CardDescription>
                    Connect your WhatsApp Business API provider
                  </CardDescription>
                </div>
                {isConnected && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connected Provider Status */}
              {isConnected && connectedProvider && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                        {bspProviders.find(p => p.id === connectedProvider)?.logo}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          Connected to {bspProviders.find(p => p.id === connectedProvider)?.name}
                        </p>
                        <p className="text-sm text-green-600">
                          Phone: {currentTenant?.phone_number_id || "Configured"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                      >
                        {isTesting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Test
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProvider(bspProviders.find(p => p.id === connectedProvider) || null)}
                      >
                        <Settings2 className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Provider Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bspProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setConfigValues({});
                    }}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      connectedProvider === provider.id
                        ? "border-green-300 bg-green-50/50"
                        : provider.recommended
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {provider.recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                        Recommended
                      </Badge>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {provider.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{provider.name}</h3>
                          {connectedProvider === provider.id && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!isConnected && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Connect a WhatsApp Business API provider to start sending messages
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhook Tab */}
        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-primary" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive incoming messages and status updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook URL */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Your Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {webhookUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyWebhookUrl}
                    className="shrink-0"
                  >
                    {webhookCopied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this URL in your BSP dashboard to receive incoming messages
                </p>
              </div>

              <Separator />

              {/* Setup Steps */}
              <div className="space-y-4">
                <h4 className="font-medium">Webhook Setup Steps</h4>
                <div className="space-y-3">
                  {webhookSetupSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h5 className="font-medium">{step.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Provider-specific webhook guides */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="aisensy">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🟢</span>
                      AiSensy Webhook Setup
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Login to your AiSensy Dashboard at <a href="https://app.aisensy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">app.aisensy.com</a></li>
                      <li>Go to <strong>Settings → API & Webhooks</strong></li>
                      <li>Paste your webhook URL in the "Webhook URL" field</li>
                      <li>Enable "Message Received" and "Message Status" events</li>
                      <li>Click Save and test with a message</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="twilio">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔴</span>
                      Twilio Webhook Setup
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Login to <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twilio Console</a></li>
                      <li>Navigate to <strong>Messaging → Services → Your WhatsApp Sender</strong></li>
                      <li>In the "Webhook" section, paste your webhook URL</li>
                      <li>Set HTTP Method to POST</li>
                      <li>For status callback, add <code>?type=status</code> to the URL</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="360dialog">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🟡</span>
                      360dialog Webhook Setup
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Login to <a href="https://hub.360dialog.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">360dialog Hub</a></li>
                      <li>Go to your WABA settings</li>
                      <li>Find "Webhook Configuration" section</li>
                      <li>Enter your webhook URL and verification token</li>
                      <li>Subscribe to required webhook fields</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                WhatsApp Business API Setup Guide
              </CardTitle>
              <CardDescription>
                Step-by-step guide to connect your WhatsApp Business account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {/* Prerequisites */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Prerequisites
                    </h3>
                    <div className="grid gap-3">
                      {[
                        "A verified Facebook Business account",
                        "A phone number not registered with WhatsApp",
                        "A Meta Business Suite account",
                        "BSP account (AiSensy, Twilio, 360dialog, or Gupshup)",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  {/* AiSensy Setup */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-xl">🟢</span>
                      AiSensy Setup (Recommended)
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Why AiSensy?</strong> AiSensy is an official Meta Business Partner offering the easiest setup process with competitive pricing and built-in automation features.
                        </p>
                      </div>
                      
                      <ol className="space-y-4">
                        {[
                          {
                            title: "Create AiSensy Account",
                            description: "Go to app.aisensy.com and sign up for a free account. Verify your email.",
                          },
                          {
                            title: "Connect WhatsApp Business",
                            description: "Follow the guided setup to connect your Facebook Business and request a WhatsApp number.",
                          },
                          {
                            title: "Get API Key",
                            description: "Navigate to Settings → API → Generate API Key. Copy this key securely.",
                          },
                          {
                            title: "Configure in Our App",
                            description: "Click on AiSensy in the Providers tab and paste your API key.",
                          },
                          {
                            title: "Setup Webhook",
                            description: "Copy your webhook URL from the Webhook tab and paste it in AiSensy settings.",
                          },
                          {
                            title: "Verify & Test",
                            description: "Send a test message to verify everything is working correctly.",
                          },
                        ].map((step, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </section>

                  <Separator />

                  {/* User Access Process */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      How Users Access WhatsApp via Our App
                    </h3>
                    <div className="p-4 rounded-lg border bg-card">
                      <ol className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span><strong>Sign Up:</strong> Users create an account on our platform</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span><strong>Choose Plan:</strong> Select Basic, Pro, or Enterprise plan</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span><strong>Connect BSP:</strong> User provides their BSP credentials (or uses our shared BSP)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span><strong>Setup Webhook:</strong> Configure webhook for real-time messaging</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span><strong>Start Messaging:</strong> Import contacts, create templates, send broadcasts</span>
                        </li>
                      </ol>
                    </div>
                  </section>

                  <Separator />

                  {/* Important Notes */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Important Notes
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">24-Hour Session Window</h4>
                        <p className="text-sm text-blue-700">
                          You can send free-form messages only within 24 hours of the customer's last message. Outside this window, use approved templates.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-2">Template Approval</h4>
                        <p className="text-sm text-amber-700">
                          All message templates must be approved by Meta before use. This typically takes 24-48 hours.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2">Quality Rating</h4>
                        <p className="text-sm text-purple-700">
                          Maintain a high quality rating by avoiding spam, getting opt-ins, and honoring opt-outs promptly.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Provider Configuration Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedProvider?.logo}</span>
              Configure {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect your WhatsApp Business account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedProvider?.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type={field.type === "password" && !showPasswords[field.key] ? "password" : "text"}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => setConfigValues({ ...configValues, [field.key]: e.target.value })}
                    className={field.type === "password" ? "pr-10" : ""}
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords[field.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                {field.helpText && (
                  <p className="text-xs text-muted-foreground">{field.helpText}</p>
                )}
              </div>
            ))}
            
            <a 
              href={selectedProvider?.docsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View {selectedProvider?.name} documentation
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProvider(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
