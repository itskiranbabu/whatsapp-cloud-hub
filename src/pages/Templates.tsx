import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Copy,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
  Bell,
  UserCheck,
  Sparkles,
  Eye,
  X,
  Link2,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTemplates, Template } from "@/hooks/useTemplates";
import { WhatsAppPhonePreview } from "@/components/whatsapp/WhatsAppPhonePreview";
import { format } from "date-fns";
import { toast } from "sonner";

const categoryConfig = {
  marketing: {
    icon: ShoppingBag,
    label: "Marketing",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    description: "Promotional messages, offers, and announcements",
  },
  utility: {
    icon: Bell,
    label: "Utility",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    description: "Order updates, confirmations, and reminders",
  },
  authentication: {
    icon: UserCheck,
    label: "Authentication",
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    description: "OTP codes and verification messages",
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

const headerTypes = [
  { value: "none", label: "None", icon: FileText },
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "document", label: "Document", icon: File },
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    body: "",
    category: "utility" as "marketing" | "utility" | "authentication",
    language: "en",
    header_type: "none" as string,
    header_content: "",
    footer: "",
    buttons: [] as Array<{ type: string; text: string; url?: string }>,
  });
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
    "1": "John",
    "2": "12345",
    "3": "Tomorrow",
  });

  const { templates, isLoading, createTemplate, deleteTemplate, stats } = useTemplates();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                       activeTab === template.category ||
                       (activeTab === "approved" && template.status === "approved") ||
                       (activeTab === "pending" && template.status === "pending") ||
                       (activeTab === "rejected" && template.status === "rejected");
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
        header_type: newTemplate.header_type === "none" ? null : newTemplate.header_type,
        header_content: newTemplate.header_content || null,
        footer: newTemplate.footer || null,
        buttons: newTemplate.buttons.length > 0 ? newTemplate.buttons : null,
        status: "pending",
      });
      toast.success("Template created and submitted for approval");
      setShowCreateDialog(false);
      resetNewTemplate();
    } catch (error) {
      toast.error("Failed to create template");
      console.error(error);
    }
  };

  const resetNewTemplate = () => {
    setNewTemplate({
      name: "",
      body: "",
      category: "utility",
      language: "en",
      header_type: "none",
      header_content: "",
      footer: "",
      buttons: [],
    });
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("Template deleted");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const addButton = () => {
    if (newTemplate.buttons.length < 3) {
      setNewTemplate({
        ...newTemplate,
        buttons: [...newTemplate.buttons, { type: "URL", text: "", url: "" }],
      });
    }
  };

  const removeButton = (index: number) => {
    setNewTemplate({
      ...newTemplate,
      buttons: newTemplate.buttons.filter((_, i) => i !== index),
    });
  };

  const updateButton = (index: number, field: string, value: string) => {
    const updatedButtons = [...newTemplate.buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    setNewTemplate({ ...newTemplate, buttons: updatedButtons });
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
        {/* AI Generation Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Introducing AI-powered Magic: Generate Powerful WhatsApp Templates in seconds!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Smarter. Faster. Zero guesswork.
                </p>
              </div>
            </div>
            <Button className="btn-whatsapp gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Now
            </Button>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="metric-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Category/Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
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
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
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
                            {template.header_type && (
                              <div className="flex items-center gap-2 mb-2">
                                {template.header_type === "image" && <Image className="w-3.5 h-3.5 text-muted-foreground" />}
                                {template.header_type === "video" && <Video className="w-3.5 h-3.5 text-muted-foreground" />}
                                {template.header_type === "document" && <File className="w-3.5 h-3.5 text-muted-foreground" />}
                                <span className="text-xs text-muted-foreground capitalize">
                                  {template.header_type} header
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-foreground line-clamp-3">
                              {template.body}
                            </p>
                            {template.footer && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                {template.footer}
                              </p>
                            )}
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

      {/* Create Template Dialog with Live Preview */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-6 overflow-hidden">
            {/* Form Section */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] pr-4">
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., order_confirmation"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                />
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and underscores only
                </p>
              </div>

              {/* Category & Language */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
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
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="w-4 h-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={newTemplate.language}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Header Type */}
              <div className="space-y-2">
                <Label>Header (Optional)</Label>
                <div className="flex gap-2">
                  {headerTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={newTemplate.header_type === type.value ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                      onClick={() => setNewTemplate({ ...newTemplate, header_type: type.value, header_content: "" })}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </Button>
                  ))}
                </div>
                {newTemplate.header_type !== "none" && (
                  <Input
                    placeholder={
                      newTemplate.header_type === "text" 
                        ? "Enter header text" 
                        : `Enter ${newTemplate.header_type} URL or description`
                    }
                    value={newTemplate.header_content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, header_content: e.target.value })}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <Label htmlFor="body">Message Body *</Label>
                <Textarea
                  id="body"
                  placeholder="Hello {{1}}, your order #{{2}} is confirmed! Expected delivery: {{3}}"
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  className="min-h-[120px]"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Use {"{{1}}"}, {"{{2}}"}, etc. for dynamic variables. Supports *bold*, _italic_, ~strikethrough~
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {newTemplate.body.length}/1024
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-2">
                <Label htmlFor="footer">Footer (Optional)</Label>
                <Input
                  id="footer"
                  placeholder="e.g., Reply STOP to unsubscribe"
                  value={newTemplate.footer}
                  onChange={(e) => setNewTemplate({ ...newTemplate, footer: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Buttons (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addButton}
                    disabled={newTemplate.buttons.length >= 3}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Button
                  </Button>
                </div>
                {newTemplate.buttons.map((button, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Input
                      placeholder="Button text"
                      value={button.text}
                      onChange={(e) => updateButton(index, "text", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="https://..."
                      value={button.url || ""}
                      onChange={(e) => updateButton(index, "url", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeButton(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Preview Variables */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-dashed">
                <Label className="text-muted-foreground">Test Variables (for preview)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <Input
                      key={num}
                      placeholder={`Variable ${num}`}
                      value={previewVariables[num.toString()] || ""}
                      onChange={(e) => setPreviewVariables({ ...previewVariables, [num.toString()]: e.target.value })}
                      className="text-sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="flex-shrink-0 border-l pl-6">
              <WhatsAppPhonePreview
                headerType={newTemplate.header_type === "none" ? null : newTemplate.header_type as any}
                headerContent={newTemplate.header_content}
                body={newTemplate.body || "Your message preview will appear here..."}
                footer={newTemplate.footer}
                buttons={newTemplate.buttons}
                variables={previewVariables}
                businessName="Your Business"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
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
