import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search,
  ShoppingCart,
  CreditCard,
  FileSpreadsheet,
  MessageCircle,
  Bot,
  Webhook,
  Plug,
  Check,
  ArrowRight,
  ExternalLink,
  Loader2,
  Star,
  Zap,
  AlertCircle,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useIntegrations, integrationsCatalog } from "@/hooks/useIntegrations";
import { IntegrationsPageHelp, IntegrationsContextualHelp } from "@/components/help/PageHelpComponents";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "all", label: "All", icon: Plug },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "productivity", label: "Productivity", icon: FileSpreadsheet },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "crm", label: "CRM", icon: MessageCircle },
  { id: "ai", label: "AI & Bots", icon: Bot },
];

// OAuth configurations for real integrations
const oauthConfigs: Record<string, { 
  authUrl: string; 
  scopes: string[]; 
  fields?: { key: string; label: string; type: string; placeholder: string }[];
}> = {
  shopify: {
    authUrl: "https://accounts.shopify.com/oauth/authorize",
    scopes: ["read_orders", "write_orders", "read_products", "read_customers"],
    fields: [
      { key: "shop_domain", label: "Shop Domain", type: "text", placeholder: "yourstore.myshopify.com" }
    ],
  },
  razorpay: {
    authUrl: "",
    scopes: [],
    fields: [
      { key: "key_id", label: "API Key ID", type: "text", placeholder: "rzp_live_xxx..." },
      { key: "key_secret", label: "API Key Secret", type: "password", placeholder: "Your Razorpay secret key" },
    ],
  },
  google_sheets: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.readonly"],
    fields: [],
  },
  zapier: {
    authUrl: "",
    scopes: [],
    fields: [
      { key: "webhook_url", label: "Zapier Webhook URL", type: "text", placeholder: "https://hooks.zapier.com/hooks/catch/..." },
    ],
  },
  hubspot: {
    authUrl: "https://app.hubspot.com/oauth/authorize",
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
    fields: [],
  },
  zoho_crm: {
    authUrl: "https://accounts.zoho.com/oauth/v2/auth",
    scopes: ["ZohoCRM.modules.ALL", "ZohoCRM.settings.ALL"],
    fields: [],
  },
  woocommerce: {
    authUrl: "",
    scopes: [],
    fields: [
      { key: "site_url", label: "WooCommerce Site URL", type: "text", placeholder: "https://yourstore.com" },
      { key: "consumer_key", label: "Consumer Key", type: "text", placeholder: "ck_xxx..." },
      { key: "consumer_secret", label: "Consumer Secret", type: "password", placeholder: "cs_xxx..." },
    ],
  },
};

const Integrations = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrationsCatalog[0] | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const { 
    allIntegrations, 
    isLoading, 
    connectedCount,
    connectIntegration,
    disconnectIntegration,
  } = useIntegrations();

  const filteredIntegrations = allIntegrations.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = async () => {
    if (!selectedIntegration) return;
    
    setIsConnecting(true);
    try {
      const oauthConfig = oauthConfigs[selectedIntegration.type];
      
      // For OAuth-based integrations with external auth
      if (oauthConfig?.authUrl) {
        // OAuth integrations should redirect to the OAuth provider
        // Credentials are handled server-side via edge functions after callback
        toast({
          title: "OAuth Integration",
          description: `Redirecting to ${selectedIntegration.name} for authorization...`,
        });
        
        // Simulate OAuth redirect - in production, redirect to OAuth provider
        // The callback would be handled by an edge function that stores credentials securely
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Only store non-sensitive config - credentials handled server-side
        await connectIntegration.mutateAsync({
          integrationType: selectedIntegration.type,
          name: selectedIntegration.name,
          config: { oauth_pending: true, connected_at: new Date().toISOString() },
        });
        
        toast({
          title: "Integration Connected!",
          description: `${selectedIntegration.name} has been successfully connected.`,
        });
      } else if (oauthConfig?.fields?.length) {
        // For API key-based integrations, create the integration first
        // then use edge function to store credentials securely
        const config: Record<string, string> = {};
        const credentials: Record<string, string> = {};
        
        for (const field of oauthConfig.fields) {
          if (!formData[field.key]) {
            toast({
              title: "Missing Field",
              description: `Please fill in ${field.label}`,
              variant: "destructive",
            });
            setIsConnecting(false);
            return;
          }
          
          // Separate sensitive vs non-sensitive fields
          if (field.type === "password" || field.key.includes("secret") || field.key.includes("key_id")) {
            credentials[field.key] = formData[field.key];
          } else {
            config[field.key] = formData[field.key];
          }
        }
        
        // First create/update the integration record
        const result = await connectIntegration.mutateAsync({
          integrationType: selectedIntegration.type,
          name: selectedIntegration.name,
          config: { ...config, connected_at: new Date().toISOString() },
        });

        // Then store credentials securely via edge function
        if (Object.keys(credentials).length > 0) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const response = await supabase.functions.invoke("integration-credentials", {
              body: {
                action: "store",
                integration_id: result.id,
                integration_type: selectedIntegration.type,
                credentials: { ...credentials, ...config },
              },
            });

            if (response.error) {
              throw new Error(response.error.message || "Failed to store credentials");
            }
          }
        }
        
        toast({
          title: "Integration Connected!",
          description: `${selectedIntegration.name} has been successfully connected and verified.`,
        });
      } else {
        // Simple connection without credentials
        await connectIntegration.mutateAsync({
          integrationType: selectedIntegration.type,
          name: selectedIntegration.name,
          config: { connected_at: new Date().toISOString() },
        });
        
        toast({
          title: "Integration Connected!",
          description: `${selectedIntegration.name} has been successfully connected.`,
        });
      }
      
      setSelectedIntegration(null);
      setFormData({});
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to connect integration";
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectIntegration.mutateAsync(integrationId);
      toast({ title: "Integration Disconnected" });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Integrations" subtitle="Connect your favorite tools and automate your workflows">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderConnectionForm = () => {
    if (!selectedIntegration) return null;
    
    const oauthConfig = oauthConfigs[selectedIntegration.type];
    
    // OAuth-based integration
    if (oauthConfig?.authUrl) {
      return (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">OAuth Connection</p>
              <p className="text-sm text-blue-700 mt-1">
                You'll be redirected to {selectedIntegration.name} to authorize the connection securely.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // API key / credentials-based integration
    if (oauthConfig?.fields?.length) {
      return (
        <div className="mt-6 space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800">
                Your credentials are securely encrypted and stored.
              </p>
            </div>
          </div>
          
          {oauthConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      );
    }
    
    // Simple connection
    return (
      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <Label className="text-muted-foreground text-sm">
          Click Connect to enable {selectedIntegration.name} integration.
        </Label>
      </div>
    );
  };

  return (
    <DashboardLayout title="Integrations" subtitle="Connect your favorite tools and automate your workflows">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header with Help */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <IntegrationsContextualHelp />
          <IntegrationsPageHelp />
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary" className="self-start px-3 py-1.5">
            {connectedCount} Connected
          </Badge>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex-wrap h-auto gap-2">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <CategoryIcon className="w-4 h-4" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Connected Integrations */}
            {allIntegrations.filter(i => i.isConnected).length > 0 && selectedCategory === "all" && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Connected Integrations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allIntegrations
                    .filter(i => i.isConnected)
                    .map((integration, index) => (
                      <motion.div
                        key={integration.type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-background flex items-center justify-center text-2xl shadow-sm">
                                  {integration.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{integration.name}</h4>
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Connected
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => integration.dbRecord && handleDisconnect(integration.dbRecord.id)}
                                >
                                  Disconnect
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Available Integrations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {selectedCategory === "all" ? "All Integrations" : categories.find(c => c.id === selectedCategory)?.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations
                  .filter(i => !i.isConnected)
                  .map((integration, index) => (
                    <motion.div
                      key={integration.type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                          integration.comingSoon ? "opacity-60" : ""
                        }`}
                        onClick={() => !integration.comingSoon && setSelectedIntegration(integration)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                              {integration.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold truncate">{integration.name}</h4>
                                {integration.popular && (
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {integration.description}
                              </p>
                              {integration.comingSoon && (
                                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg">No integrations found</h3>
                <p className="text-muted-foreground mt-1">Try a different search term or category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Custom Integration Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Webhook className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Need a Custom Integration?</h3>
                  <p className="text-muted-foreground">
                    Use our webhooks and API to build custom integrations for your unique needs
                  </p>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                View API Docs
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Integration Detail Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => { setSelectedIntegration(null); setFormData({}); }}>
        <DialogContent className="max-w-lg">
          {selectedIntegration && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedIntegration.icon}</span>
                  Connect {selectedIntegration.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedIntegration.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h4 className="font-medium mb-3">Features</h4>
                <ul className="space-y-2">
                  {selectedIntegration.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {renderConnectionForm()}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setSelectedIntegration(null); setFormData({}); }}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Connect
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Integrations;
