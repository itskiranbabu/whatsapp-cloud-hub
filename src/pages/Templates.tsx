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
  Plus,
  Search,
  RefreshCw,
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
  File,
  BookOpen,
  Link2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTemplates, Template } from "@/hooks/useTemplates";
import { WhatsAppPhonePreview } from "@/components/whatsapp/WhatsAppPhonePreview";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { TemplateBuilder } from "@/components/templates/TemplateBuilder";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { PageHelp } from "@/components/help/PageHelp";
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

const quickGuideLinks = [
  { icon: BookOpen, label: "How to Create WhatsApp Template Message?", url: "#" },
  { icon: Link2, label: "Add Quick Reply to WhatsApp Template Message", url: "#" },
  { icon: FileText, label: "Use chatbot parameters for leads", url: "#" },
  { icon: FileText, label: "Message formatting guideline (Bold, Italic & more)", url: "#" },
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("explore");
  const [showCreateMode, setShowCreateMode] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [initialTemplateData, setInitialTemplateData] = useState<any>(null);

  const { templates, isLoading, createTemplate, deleteTemplate, stats } = useTemplates();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      activeTab === "explore" ||
      (activeTab === "draft" && template.status === "pending") ||
      (activeTab === "pending" && template.status === "pending") ||
      (activeTab === "approved" && template.status === "approved") ||
      (activeTab === "rejected" && template.status === "rejected");
    return matchesSearch && matchesTab;
  });

  const handleCreateTemplate = async (templateData: any) => {
    try {
      await createTemplate.mutateAsync({
        name: templateData.name,
        body: templateData.body,
        category: templateData.category,
        language: templateData.language,
        header_type: templateData.header_type,
        header_content: templateData.header_content,
        footer: templateData.footer,
        buttons: templateData.buttons,
        variables: templateData.variables,
        status: "pending",
      });
      toast.success("Template created and submitted for approval");
      setShowCreateMode(false);
      setInitialTemplateData(null);
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

  const handleSelectGalleryTemplate = (template: any) => {
    setInitialTemplateData({
      name: template.name.toLowerCase().replace(/\s+/g, "_"),
      body: template.body,
      category: "marketing",
      headerType: template.headerType,
      buttons: template.buttons,
      footer: template.footer,
    });
    setShowCreateMode(true);
    setActiveTab("all");
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

  // Show Template Builder
  if (showCreateMode) {
    return (
      <DashboardLayout
        title="New Template Message"
        subtitle="Create a new WhatsApp message template"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              setShowCreateMode(false);
              setInitialTemplateData(null);
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>

          <TemplateBuilder
            initialData={initialTemplateData}
            onSave={handleCreateTemplate}
            onCancel={() => {
              setShowCreateMode(false);
              setInitialTemplateData(null);
            }}
            isSaving={createTemplate.isPending}
          />
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Template Messages"
      subtitle="Create and manage your message templates"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Contextual Help */}
        <ContextualHelp
          title="Template Messages Guide"
          description="Templates are pre-approved message formats required to initiate conversations outside the 24-hour window."
          variant="guide"
          tips={[
            "Use variables like {{1}}, {{2}} for personalization - they get replaced with actual values when sending",
            "Marketing templates take longer to approve - utility templates are usually faster",
            "Always include an opt-out option in marketing templates to comply with WhatsApp policy",
            "Test your templates with the live preview before submitting for approval",
          ]}
          defaultExpanded={false}
        />
        {/* AI Generation Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
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
            <Button className="btn-whatsapp gap-2" onClick={() => setShowCreateMode(true)}>
              <Sparkles className="w-4 h-4" />
              Generate Now
            </Button>
          </CardContent>
        </Card>

        {/* Quick Guide */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">Quick Guide</h4>
            <p className="text-sm text-muted-foreground mb-3">
              You can initiate a Conversation with users on WhatsApp using these template messages.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickGuideLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates (status, name etc.)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync Status
            </Button>
            <Button className="btn-whatsapp gap-2" onClick={() => setShowCreateMode(true)}>
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="explore" className="gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Action Required ({stats.rejected})</TabsTrigger>
          </TabsList>

          {/* Explore Tab - Template Gallery */}
          <TabsContent value="explore" className="mt-6">
            <TemplateGallery onSelectTemplate={handleSelectGalleryTemplate} />
          </TabsContent>

          {/* Other Tabs - Template List */}
          {["all", "draft", "pending", "approved", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No templates found</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setShowCreateMode(true)}
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
                                  <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
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
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPreviewTemplate(template)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{previewTemplate?.name}</DialogTitle>
            </DialogHeader>
            {previewTemplate && (
              <div className="flex justify-center py-4">
                <WhatsAppPhonePreview
                  headerType={previewTemplate.header_type as "text" | "image" | "video" | "document" | null}
                  headerContent={previewTemplate.header_content}
                  body={previewTemplate.body}
                  footer={previewTemplate.footer}
                  buttons={previewTemplate.buttons as Array<{ type: string; text: string; url?: string }> || []}
                  variables={{ "1": "John", "2": "50", "3": "SAVE50" }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default Templates;
