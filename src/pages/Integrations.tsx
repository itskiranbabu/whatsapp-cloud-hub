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
} from "lucide-react";
import { useIntegrations, integrationsCatalog } from "@/hooks/useIntegrations";
import { IntegrationsPageHelp, IntegrationsContextualHelp } from "@/components/help/PageHelpComponents";

const categories = [
  { id: "all", label: "All", icon: Plug },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "productivity", label: "Productivity", icon: FileSpreadsheet },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "crm", label: "CRM", icon: MessageCircle },
  { id: "ai", label: "AI & Bots", icon: Bot },
];

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrationsCatalog[0] | null>(null);
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
    
    await connectIntegration.mutateAsync({
      integrationType: selectedIntegration.type,
      name: selectedIntegration.name,
      config: {},
      credentials: {},
    });
    
    setSelectedIntegration(null);
  };

  const handleDisconnect = async (integrationId: string) => {
    await disconnectIntegration.mutateAsync(integrationId);
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => integration.dbRecord && handleDisconnect(integration.dbRecord.id)}
                              >
                                Disconnect
                              </Button>
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
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
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

                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <Label className="text-muted-foreground text-sm">
                    You'll be redirected to {selectedIntegration.name} to authorize the connection
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={connectIntegration.isPending}>
                  {connectIntegration.isPending ? (
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
