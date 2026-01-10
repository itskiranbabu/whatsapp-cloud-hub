import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Users,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const automations = [
  {
    id: 1,
    name: "Welcome Flow",
    description: "Greets new contacts and collects preferences",
    status: "active",
    triggers: "New contact created",
    nodes: 8,
    executions: 4520,
    successRate: 98.5,
  },
  {
    id: 2,
    name: "Order Status Bot",
    description: "Handles order tracking inquiries automatically",
    status: "active",
    triggers: "Keyword: order, tracking, status",
    nodes: 12,
    executions: 12340,
    successRate: 96.2,
  },
  {
    id: 3,
    name: "Abandoned Cart Recovery",
    description: "Sends reminders for abandoned carts",
    status: "active",
    triggers: "Cart abandoned for 1 hour",
    nodes: 5,
    executions: 2890,
    successRate: 94.8,
  },
  {
    id: 4,
    name: "FAQ Chatbot",
    description: "Answers common customer questions",
    status: "paused",
    triggers: "Any message",
    nodes: 24,
    executions: 8760,
    successRate: 89.3,
  },
  {
    id: 5,
    name: "Appointment Reminder",
    description: "Sends appointment reminders and confirmations",
    status: "draft",
    triggers: "24 hours before appointment",
    nodes: 6,
    executions: 0,
    successRate: 0,
  },
];

const Automation = () => {
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
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="metric-card-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Flows</p>
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">28,510</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                  <p className="text-2xl font-bold">94.7%</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Contacts Engaged</p>
                  <p className="text-2xl font-bold">8,450</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Users className="w-5 h-5 text-amber-600" />
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
          <Button className="btn-whatsapp gap-2">
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </div>

        {/* Automation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {automations.map((automation, index) => (
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
                        automation.status === "active"
                          ? "bg-primary/10 text-primary"
                          : automation.status === "paused"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{automation.name}</CardTitle>
                        <span className={`text-xs font-medium inline-flex items-center gap-1 mt-1 ${
                          automation.status === "active"
                            ? "text-green-600"
                            : automation.status === "paused"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }`}>
                          {automation.status === "active" && <Play className="w-3 h-3" />}
                          {automation.status === "paused" && <Pause className="w-3 h-3" />}
                          {automation.status === "draft" && <Clock className="w-3 h-3" />}
                          {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
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
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Flow
                        </DropdownMenuItem>
                        {automation.status === "active" && (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {automation.status === "paused" && (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="mt-2">
                    {automation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Trigger:</span>
                      <span className="truncate">{automation.triggers}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span>{automation.nodes} nodes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{automation.executions.toLocaleString()} runs</span>
                      </div>
                    </div>
                    {automation.executions > 0 && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Success Rate</span>
                          <span className="font-medium text-green-600">
                            {automation.successRate}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Create New Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: automations.length * 0.1 }}
          >
            <Card className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
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
      </motion.div>
    </DashboardLayout>
  );
};

export default Automation;
