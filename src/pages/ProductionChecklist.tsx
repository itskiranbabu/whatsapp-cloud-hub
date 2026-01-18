import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Loader2,
  MessageSquare,
  Users,
  FileText,
  Zap,
  Settings,
  Shield,
  Globe,
  CreditCard,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { useTemplates } from "@/hooks/useTemplates";
import { useContacts } from "@/hooks/useContacts";
import { useAutomations } from "@/hooks/useAutomations";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "warning";
  category: string;
  action?: {
    label: string;
    path: string;
  };
}

const ProductionChecklist = () => {
  const { currentTenant } = useTenants();
  const { templates } = useTemplates();
  const { contacts } = useContacts();
  const { automations } = useAutomations();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateChecklist = async () => {
      setIsLoading(true);
      
      const tenant = currentTenant as typeof currentTenant & { 
        meta_access_token?: string;
        bsp_provider?: string;
      };
      
      const items: ChecklistItem[] = [
        // WhatsApp Connection
        {
          id: "whatsapp-connection",
          title: "WhatsApp API Connected",
          description: "Connect Meta Direct or a BSP provider",
          status: tenant?.phone_number_id ? "completed" : "pending",
          category: "WhatsApp",
          action: { label: "Configure", path: "/settings" },
        },
        {
          id: "webhook-configured",
          title: "Webhook Configured",
          description: "Set up webhook to receive incoming messages",
          status: tenant?.phone_number_id ? "completed" : "pending",
          category: "WhatsApp",
          action: { label: "Setup Webhook", path: "/settings" },
        },
        
        // Templates
        {
          id: "template-created",
          title: "Message Templates Created",
          description: "Create at least one approved template",
          status: templates.length > 0 ? "completed" : "pending",
          category: "Templates",
          action: { label: "Create Template", path: "/templates" },
        },
        {
          id: "template-approved",
          title: "Templates Approved",
          description: "Have at least one approved template for broadcasts",
          status: templates.some(t => t.status === "approved") ? "completed" : 
                  templates.length > 0 ? "warning" : "pending",
          category: "Templates",
          action: { label: "View Templates", path: "/templates" },
        },
        
        // Contacts
        {
          id: "contacts-imported",
          title: "Contacts Imported",
          description: "Import your customer contact list",
          status: contacts.length > 0 ? "completed" : "pending",
          category: "Contacts",
          action: { label: "Import Contacts", path: "/contacts" },
        },
        
        // Automation
        {
          id: "automation-created",
          title: "Automation Flow Created",
          description: "Set up automated responses",
          status: automations.length > 0 ? "completed" : "pending",
          category: "Automation",
          action: { label: "Create Flow", path: "/automation" },
        },
        {
          id: "automation-active",
          title: "Automation Activated",
          description: "Activate at least one automation",
          status: automations.some(a => a.is_active) ? "completed" : 
                  automations.length > 0 ? "warning" : "pending",
          category: "Automation",
          action: { label: "Activate", path: "/automation" },
        },
        
        // Team & Settings
        {
          id: "workspace-configured",
          title: "Workspace Configured",
          description: "Set up your business profile",
          status: tenant?.business_name ? "completed" : "pending",
          category: "Settings",
          action: { label: "Configure", path: "/settings" },
        },
        
        // Security
        {
          id: "auth-enabled",
          title: "Authentication Enabled",
          description: "User authentication is configured",
          status: "completed", // Always true if they're logged in
          category: "Security",
        },
      ];

      setChecklist(items);
      setIsLoading(false);
    };

    generateChecklist();
  }, [currentTenant, templates, contacts, automations]);

  const completedCount = checklist.filter(item => item.status === "completed").length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categories = [...new Set(checklist.map(item => item.category))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "WhatsApp": return <MessageSquare className="w-5 h-5" />;
      case "Templates": return <FileText className="w-5 h-5" />;
      case "Contacts": return <Users className="w-5 h-5" />;
      case "Automation": return <Zap className="w-5 h-5" />;
      case "Settings": return <Settings className="w-5 h-5" />;
      case "Security": return <Shield className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout
      title="Production Readiness"
      subtitle="Complete these steps before going live"
    >
      <div className="space-y-6">
        {/* Progress Overview */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {completedCount} of {totalCount} Complete
                  </h2>
                  <p className="text-muted-foreground">
                    {progressPercent === 100 
                      ? "🎉 Your platform is production ready!" 
                      : "Complete all items to go live"}
                  </p>
                </div>
              </div>
              <Badge 
                variant={progressPercent === 100 ? "default" : "secondary"}
                className="text-lg px-4 py-2"
              >
                {Math.round(progressPercent)}%
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="font-medium">WhatsApp</span>
                </div>
                {currentTenant?.phone_number_id ? (
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Templates</span>
                </div>
                <Badge variant="secondary">{templates.length}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Contacts</span>
                </div>
                <Badge variant="secondary">{contacts.length}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">Automations</span>
                </div>
                <Badge variant="secondary">
                  {automations.filter(a => a.is_active).length} active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checklist by Category */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category}</CardTitle>
                      <CardDescription>
                        {checklist.filter(i => i.category === category && i.status === "completed").length} of{" "}
                        {checklist.filter(i => i.category === category).length} complete
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checklist
                    .filter(item => item.category === category)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          item.status === "completed" 
                            ? "border-green-200 bg-green-50/50" 
                            : item.status === "warning"
                            ? "border-amber-200 bg-amber-50/50"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className={`font-medium ${
                              item.status === "completed" ? "text-green-700" : ""
                            }`}>
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {item.action && item.status !== "completed" && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={item.action.path}>
                              {item.action.label}
                              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Production Ready Banner */}
        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-green-100">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-800">
                      🎉 Congratulations! Your Platform is Production Ready!
                    </h3>
                    <p className="text-green-700 mt-1">
                      All critical components are configured. You can now start serving customers
                      and selling your white-label WhatsApp solution.
                    </p>
                  </div>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Globe className="w-4 h-4 mr-2" />
                    Go Live
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Documentation Link */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    View our comprehensive user guide and documentation
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="/help">Help Center</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/docs/USER_GUIDE.md" target="_blank">
                    User Guide
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProductionChecklist;
