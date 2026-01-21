import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Bot,
  Zap,
  MessageSquare,
  GitBranch,
  Clock,
  Play,
  Pause,
  Settings,
  MoreVertical,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  FlaskConical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlowBuilder } from "@/components/automation/FlowBuilder";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { useAutomations } from "@/hooks/useAutomations";
import { useAutomationExecution } from "@/hooks/useAutomationExecution";
import { useTenantRealtimeSubscriptions } from "@/hooks/useRealtimeSubscription";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";
import type { FlowNode } from "@/components/automation/FlowBuilder";

const Automation = () => {
  const { automations, isLoading, createAutomation, updateAutomation, toggleAutomation, deleteAutomation } = useAutomations();
  const { testAutomation, executeAutomation } = useAutomationExecution();
  const { currentTenantId } = useTenants();
  const { toast } = useToast();
  
  // Enable real-time updates for automations
  useTenantRealtimeSubscriptions(currentTenantId);
  
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<string | null>(null);
  const [flowName, setFlowName] = useState("New Automation");
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testingAutomationId, setTestingAutomationId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const activeAutomations = automations.filter(a => a.is_active);
  const totalExecutions = automations.reduce((sum, a) => sum + (a.executions_count || 0), 0);

  const handleCreateNew = () => {
    setEditingAutomation(null);
    setFlowName("New Automation");
    setFlowNodes([]);
    setShowFlowBuilder(true);
  };

  const handleEditAutomation = (automationId: string) => {
    const automation = automations.find(a => a.id === automationId);
    if (!automation) return;
    
    setEditingAutomation(automationId);
    setFlowName(automation.name);
    setFlowNodes((automation.flow_data as unknown as FlowNode[]) || []);
    setShowFlowBuilder(true);
  };

  const handleSaveFlow = async () => {
    try {
      const triggerNode = flowNodes.find(n => n.type === "trigger");
      const triggerType = (triggerNode?.config as { triggerType?: string })?.triggerType || "manual";

      if (editingAutomation) {
        await updateAutomation.mutateAsync({
          id: editingAutomation,
          name: flowName,
          trigger_type: triggerType,
          trigger_config: triggerNode?.config as Json,
          flow_data: flowNodes as unknown as Json,
        });
      } else {
        await createAutomation.mutateAsync({
          name: flowName,
          trigger_type: triggerType,
          trigger_config: triggerNode?.config as Json,
          flow_data: flowNodes as unknown as Json,
          is_active: false,
        });
      }
      
      setShowFlowBuilder(false);
      toast({
        title: editingAutomation ? "Automation updated" : "Automation created",
        description: `"${flowName}" has been saved successfully.`,
      });
    } catch (error) {
      console.error("Error saving automation:", error);
    }
  };

  const handleTestFlow = async () => {
    if (!editingAutomation) {
      toast({
        title: "Save First",
        description: "Please save the automation before testing.",
      });
      return;
    }
    
    setTestingAutomationId(editingAutomation);
    setTestResult(null);
    setTestDialogOpen(true);
    
    try {
      const result = await testAutomation.mutateAsync({
        automationId: editingAutomation,
      });
      
      setTestResult({
        success: result.success,
        message: result.success 
          ? `Flow validated successfully. ${result.nodes_processed} nodes would be processed.`
          : result.error || "Test failed",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Test failed",
      });
    }
  };

  const handleRunAutomation = async (automationId: string) => {
    try {
      await executeAutomation.mutateAsync({
        automationId,
        triggerData: { manual: true },
      });
    } catch (error) {
      console.error("Failed to run automation:", error);
    }
  };

  const handleToggleStatus = async (automationId: string, currentStatus: boolean) => {
    await toggleAutomation.mutateAsync({
      id: automationId,
      isActive: !currentStatus,
    });
  };

  const handleDelete = async (automationId: string) => {
    await deleteAutomation.mutateAsync(automationId);
  };

  if (showFlowBuilder) {
    return (
      <DashboardLayout
        title="Flow Builder"
        subtitle="Design your automation workflow"
      >
        <div className="h-[calc(100vh-180px)]">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setShowFlowBuilder(false)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Automations
            </Button>
          </div>
          <div className="h-full border rounded-xl bg-card">
            <FlowBuilder
              flowName={flowName}
              onFlowNameChange={setFlowName}
              nodes={flowNodes}
              onNodesChange={setFlowNodes}
              onSave={handleSaveFlow}
              onTest={handleTestFlow}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Automation"
      subtitle="Build chatbots and automated workflows"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Contextual Help */}
        <ContextualHelp
          title="Automation & Chatbot Builder"
          description="Create automated workflows to handle common queries, send welcome messages, and nurture leads automatically."
          variant="guide"
          tips={[
            "Start with a trigger (e.g., message received, keyword detected) to initiate the flow",
            "Use conditions to branch logic based on user responses",
            "Add delays between messages to make conversations feel natural",
            "Test your automation before activating to ensure it works as expected",
          ]}
          defaultExpanded={false}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="metric-card-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Flows</p>
                  <p className="text-2xl font-bold">{activeAutomations.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                  <p className="text-2xl font-bold">{totalExecutions.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Automations</p>
                  <p className="text-2xl font-bold">{automations.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft Flows</p>
                  <p className="text-2xl font-bold">{automations.filter(a => !a.is_active).length}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Automations</h2>
            <p className="text-sm text-muted-foreground">
              Build no-code chatbots and automated workflows
            </p>
          </div>
          <Button className="btn-whatsapp gap-2" onClick={handleCreateNew}>
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          /* Automation Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automations.map((automation, index) => {
              const flowData = automation.flow_data as unknown as FlowNode[] | null;
              const nodeCount = flowData?.length || 0;
              
              return (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            automation.is_active
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{automation.name}</CardTitle>
                            <span className={`text-xs font-medium inline-flex items-center gap-1 mt-1 ${
                              automation.is_active
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}>
                              {automation.is_active ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                              {automation.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAutomation(automation.id)}>
                              <Settings className="w-4 h-4 mr-2" />
                              Edit Flow
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRunAutomation(automation.id)}
                              disabled={!automation.is_active}
                            >
                              <FlaskConical className="w-4 h-4 mr-2" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(automation.id, automation.is_active || false)}
                            >
                              {automation.is_active ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(automation.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="mt-2">
                        {automation.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => handleEditAutomation(automation.id)}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Trigger:</span>
                          <span className="truncate capitalize">{automation.trigger_type.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                            <span>{nodeCount} nodes</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span>{(automation.executions_count || 0).toLocaleString()} runs</span>
                          </div>
                        </div>
                        {automation.last_executed_at && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Last Run</span>
                              <span className="text-foreground">
                                {new Date(automation.last_executed_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Create New Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: automations.length * 0.1 }}
            >
              <Card 
                className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                onClick={handleCreateNew}
              >
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
                  <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Create New Automation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build a chatbot or automated workflow
                  </p>
                  <Button variant="outline" className="gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Test Result Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              Automation Test
            </DialogTitle>
            <DialogDescription>
              Validate your automation flow without sending real messages.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {testAutomation.isPending ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Testing automation...</p>
              </div>
            ) : testResult ? (
              <div className="flex flex-col items-center gap-4">
                {testResult.success ? (
                  <CheckCircle className="w-12 h-12 text-primary" />
                ) : (
                  <XCircle className="w-12 h-12 text-destructive" />
                )}
                <p className={testResult.success ? "text-foreground" : "text-destructive"}>
                  {testResult.message}
                </p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Automation;
