import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image,
  Video,
  Link2,
  Copy,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  ShoppingBag,
  Bell,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const templates = [
  {
    id: 1,
    name: "Welcome Message",
    category: "utility",
    status: "approved",
    language: "English",
    lastEdited: "Jan 8, 2026",
    type: "text",
    preview: "Hi {{1}}! 👋 Welcome to our store. We're excited to have you here!",
    usageCount: 15420,
  },
  {
    id: 2,
    name: "Order Confirmation",
    category: "utility",
    status: "approved",
    language: "English",
    lastEdited: "Jan 7, 2026",
    type: "text",
    preview: "Your order #{{1}} has been confirmed! ✅ Expected delivery: {{2}}",
    usageCount: 8750,
  },
  {
    id: 3,
    name: "Flash Sale Promo",
    category: "marketing",
    status: "approved",
    language: "English",
    lastEdited: "Jan 6, 2026",
    type: "image",
    preview: "🔥 FLASH SALE! Get up to {{1}}% off on selected items. Shop now!",
    usageCount: 25600,
  },
  {
    id: 4,
    name: "Cart Reminder",
    category: "marketing",
    status: "pending",
    language: "English",
    lastEdited: "Jan 9, 2026",
    type: "text",
    preview: "Hey {{1}}, you left items in your cart! Complete your purchase now.",
    usageCount: 0,
  },
  {
    id: 5,
    name: "OTP Verification",
    category: "authentication",
    status: "approved",
    language: "English",
    lastEdited: "Jan 5, 2026",
    type: "text",
    preview: "Your verification code is {{1}}. Valid for 10 minutes.",
    usageCount: 45200,
  },
  {
    id: 6,
    name: "Feedback Request",
    category: "utility",
    status: "rejected",
    language: "English",
    lastEdited: "Jan 4, 2026",
    type: "text",
    preview: "Hi {{1}}, how was your experience? We'd love to hear from you!",
    usageCount: 0,
  },
];

const categoryConfig = {
  marketing: {
    icon: ShoppingBag,
    label: "Marketing",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  },
  utility: {
    icon: Bell,
    label: "Utility",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  authentication: {
    icon: UserCheck,
    label: "Authentication",
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  service: {
    icon: MessageSquare,
    label: "Service",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
};

const statusConfig = {
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    className: "status-approved",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "status-pending",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "status-rejected",
  },
};

const typeIcons = {
  text: FileText,
  image: Image,
  video: Video,
  link: Link2,
};

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || template.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <DashboardLayout
      title="Templates"
      subtitle="Create and manage your message templates"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <Button className="btn-whatsapp gap-2">
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="utility">Utility</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template, index) => {
                const category = categoryConfig[template.category as keyof typeof categoryConfig];
                const status = statusConfig[template.status as keyof typeof statusConfig];
                const TypeIcon = typeIcons[template.type as keyof typeof typeIcons];

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30">
                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${category.color}`}>
                              <category.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {template.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {template.language} • {template.lastEdited}
                              </p>
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
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Preview */}
                        <div className="p-3 rounded-lg bg-muted/50 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground capitalize">
                              {template.type} message
                            </span>
                          </div>
                          <p className="text-sm text-foreground line-clamp-2">
                            {template.preview}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className={status.className}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {template.usageCount.toLocaleString()} uses
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Templates;
