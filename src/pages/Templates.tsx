import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useTemplates, Template } from "@/hooks/useTemplates";
import { format } from "date-fns";
import { toast } from "sonner";

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

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    body: "",
    category: "utility" as "marketing" | "utility" | "authentication",
    language: "en",
  });

  const { templates, isLoading, createTemplate, deleteTemplate } = useTemplates();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || template.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.body.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createTemplate.mutateAsync({
        name: newTemplate.name,
        body: newTemplate.body,
        category: newTemplate.category,
        language: newTemplate.language,
        status: "pending",
      });
      toast.success("Template created and submitted for approval");
      setShowCreateDialog(false);
      setNewTemplate({ name: "", body: "", category: "utility", language: "en" });
    } catch (error) {
      toast.error("Failed to create template");
      console.error(error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("Template deleted");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Templates" subtitle="Create and manage your message templates">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <Button className="btn-whatsapp gap-2" onClick={() => setShowCreateDialog(true)}>
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
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No templates found</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create your first template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, index) => {
                  const category = categoryConfig[template.category as keyof typeof categoryConfig];
                  const status = statusConfig[template.status as keyof typeof statusConfig] || statusConfig.pending;

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
                                  {template.language || "en"} •{" "}
                                  {template.updated_at
                                    ? format(new Date(template.updated_at), "MMM d, yyyy")
                                    : ""}
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
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Preview */}
                          <div className="p-3 rounded-lg bg-muted/50 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Text message
                              </span>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2">
                              {template.body}
                            </p>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className={status.className}>
                              <status.icon className="w-3 h-3" />
                              {status.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {category.label}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g., order_confirmation"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Use lowercase letters, numbers, and underscores only
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value: "marketing" | "utility" | "authentication") =>
                  setNewTemplate({ ...newTemplate, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                placeholder="Hello {{1}}, your order #{{2}} is confirmed!"
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Use {"{{1}}"}, {"{{2}}"}, etc. for dynamic variables
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={createTemplate.isPending}>
              {createTemplate.isPending ? "Creating..." : "Submit for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Templates;
