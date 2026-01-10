import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Send,
  Users,
  TrendingUp,
  Eye,
  Copy,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  MessageSquare,
  Megaphone,
  Zap,
  Target,
  RefreshCw,
  Calendar,
  FileText,
} from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useTemplates } from "@/hooks/useTemplates";
import { useContacts } from "@/hooks/useContacts";
import { WhatsAppPhonePreview } from "@/components/whatsapp/WhatsAppPhonePreview";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig = {
  running: {
    icon: Play,
    label: "Running",
    className: "status-approved",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className: "status-pending",
  },
  draft: {
    icon: Clock,
    label: "Draft",
    className: "status-draft",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "status-rejected",
  },
};

const campaignTypes = [
  {
    id: "broadcast",
    title: "Broadcast Campaign",
    description: "Select and filter among your existing audience & broadcast customized Template or Regular messages.",
    icon: Megaphone,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "api",
    title: "API Campaign",
    description: "Select a template and connect your existing systems with our API to automate messages.",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    id: "csv",
    title: "CSV Broadcast",
    description: "Upload your audience from CSV & Broadcast customized Template or Regular messages simultaneously.",
    icon: Upload,
    color: "bg-purple-500/10 text-purple-600",
    badge: "NEW",
  },
  {
    id: "meta_ads",
    title: "Meta Ads",
    description: "Target Click To WhatsApp Ads to your Facebook and Instagram audience to generate leads for retargeting.",
    icon: Target,
    color: "bg-amber-500/10 text-amber-600",
    badge: "NEW",
  },
];

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    template_id: "",
    scheduled_at: "",
    target_audience: { tags: [] as string[], all_contacts: false },
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
    "1": "Customer",
    "2": "12345",
    "3": "Tomorrow",
  });

  const { campaigns, isLoading, stats, createCampaign, deleteCampaign, updateCampaign } = useCampaigns();
  const { templates } = useTemplates();
  const { contacts } = useContacts();

  const approvedTemplates = templates.filter(t => t.status === "approved");
  const selectedTemplate = templates.find(t => t.id === newCampaign.template_id);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCampaignType = (typeId: string) => {
    setSelectedCampaignType(typeId);
    setShowTypeSelector(false);
    setShowCreateDialog(true);
    setCurrentStep(1);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    try {
      await createCampaign.mutateAsync({
        name: newCampaign.name,
        description: newCampaign.description || null,
        template_id: newCampaign.template_id || null,
        status: newCampaign.scheduled_at ? "scheduled" : "draft",
        scheduled_at: newCampaign.scheduled_at || null,
        target_audience: newCampaign.target_audience,
        total_recipients: newCampaign.target_audience.all_contacts ? contacts.length : selectedContacts.length,
      });
      toast.success("Campaign created successfully");
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to create campaign");
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setShowTypeSelector(false);
    setSelectedCampaignType(null);
    setCurrentStep(1);
    setNewCampaign({
      name: "",
      description: "",
      template_id: "",
      scheduled_at: "",
      target_audience: { tags: [], all_contacts: false },
    });
    setSelectedContacts([]);
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign.mutateAsync(id);
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };

  const handlePauseCampaign = async (id: string) => {
    try {
      await updateCampaign.mutateAsync({ id, status: "draft" });
      toast.success("Campaign paused");
    } catch (error) {
      toast.error("Failed to pause campaign");
    }
  };

  const handleResumeCampaign = async (id: string) => {
    try {
      await updateCampaign.mutateAsync({ id, status: "running" });
      toast.success("Campaign resumed");
    } catch (error) {
      toast.error("Failed to resume campaign");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Campaign Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="Enter campaign name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Template</h3>
            {approvedTemplates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No approved templates available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a template first and wait for approval
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                {approvedTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      newCampaign.template_id === template.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setNewCampaign({ ...newCampaign, template_id: template.id })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Audience</h3>
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  newCampaign.target_audience.all_contacts
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setNewCampaign({
                  ...newCampaign,
                  target_audience: { ...newCampaign.target_audience, all_contacts: true }
                })}
              >
                <Checkbox checked={newCampaign.target_audience.all_contacts} />
                <div>
                  <p className="font-medium">All Contacts</p>
                  <p className="text-sm text-muted-foreground">
                    Send to all {contacts.length} contacts
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  !newCampaign.target_audience.all_contacts
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setNewCampaign({
                  ...newCampaign,
                  target_audience: { ...newCampaign.target_audience, all_contacts: false }
                })}
              >
                <Checkbox checked={!newCampaign.target_audience.all_contacts} />
                <div>
                  <p className="font-medium">Select Specific Contacts</p>
                  <p className="text-sm text-muted-foreground">
                    Choose contacts by tags or manually
                  </p>
                </div>
              </div>
            </div>

            {!newCampaign.target_audience.all_contacts && (
              <div className="mt-4 max-h-[200px] overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.slice(0, 20).map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContacts([...selectedContacts, contact.id]);
                              } else {
                                setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>{contact.name || "Unknown"}</TableCell>
                        <TableCell className="font-mono text-sm">{contact.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Schedule & Review</h3>
            <div className="space-y-2">
              <Label>When to send?</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    !newCampaign.scheduled_at
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setNewCampaign({ ...newCampaign, scheduled_at: "" })}
                >
                  <Checkbox checked={!newCampaign.scheduled_at} />
                  <div>
                    <p className="font-medium">Send Now</p>
                    <p className="text-sm text-muted-foreground">
                      Launch immediately
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    newCampaign.scheduled_at
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setNewCampaign({ ...newCampaign, scheduled_at: new Date().toISOString().slice(0, 16) })}
                >
                  <Checkbox checked={!!newCampaign.scheduled_at} />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-sm text-muted-foreground">
                      Send at a specific time
                    </p>
                  </div>
                </div>
              </div>
              {newCampaign.scheduled_at && (
                <Input
                  type="datetime-local"
                  value={newCampaign.scheduled_at}
                  onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 mt-4">
              <h4 className="font-medium">Campaign Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{newCampaign.name || "-"}</span>
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium">{selectedTemplate?.name || "-"}</span>
                <span className="text-muted-foreground">Recipients:</span>
                <span className="font-medium">
                  {newCampaign.target_audience.all_contacts
                    ? `All contacts (${contacts.length})`
                    : `${selectedContacts.length} selected`}
                </span>
                <span className="text-muted-foreground">Schedule:</span>
                <span className="font-medium">
                  {newCampaign.scheduled_at
                    ? format(new Date(newCampaign.scheduled_at), "MMM d, yyyy h:mm a")
                    : "Immediately"}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Campaigns" subtitle="Create and manage your broadcast campaigns">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Campaigns"
      subtitle="Create and manage your broadcast campaigns"
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
                  <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Send className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{stats.totalDelivered.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Read Rate</p>
                  <p className="text-2xl font-bold">
                    {stats.totalDelivered > 0 ? ((stats.totalRead / stats.totalDelivered) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
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
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          <Button className="btn-whatsapp gap-2" onClick={() => setShowTypeSelector(true)}>
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <Send className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No campaigns found</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setShowTypeSelector(true)}
                >
                  Create your first campaign
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead className="text-right">Sent</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Read</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign, index) => {
                    const status = statusConfig[campaign.status as keyof typeof statusConfig] || statusConfig.draft;
                    const sent = campaign.sent_count || 0;
                    const total = campaign.total_recipients || sent || 1;
                    const progress = total > 0 ? Math.round((sent / total) * 100) : 0;

                    return (
                      <motion.tr
                        key={campaign.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/50 cursor-pointer"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {campaign.created_at ? format(new Date(campaign.created_at), "MMM d, yyyy h:mm a") : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={status.className}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{campaign.total_recipients || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {(campaign.delivered_count || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {(campaign.read_count || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              {campaign.status === "running" && (
                                <DropdownMenuItem onClick={() => handlePauseCampaign(campaign.id)}>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </DropdownMenuItem>
                              )}
                              {(campaign.status === "draft" || campaign.status === "scheduled") && (
                                <DropdownMenuItem onClick={() => handleResumeCampaign(campaign.id)}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteCampaign(campaign.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Campaign Type Selector Dialog */}
      <Dialog open={showTypeSelector} onOpenChange={setShowTypeSelector}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Select Campaign Type
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {campaignTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-all h-full"
                  onClick={() => handleSelectCampaignType(type.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl ${type.color}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      {type.badge && (
                        <Badge className="bg-primary text-primary-foreground">{type.badge}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    <Button className="w-full mt-4 gap-2" variant="outline">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Wizard Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Create {campaignTypes.find(t => t.id === selectedCampaignType)?.title || "Campaign"}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 py-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-1 rounded ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 text-xs text-muted-foreground mb-4">
            <span className={currentStep === 1 ? "text-primary font-medium" : ""}>Details</span>
            <span className={currentStep === 2 ? "text-primary font-medium" : ""}>Template</span>
            <span className={currentStep === 3 ? "text-primary font-medium" : ""}>Audience</span>
            <span className={currentStep === 4 ? "text-primary font-medium" : ""}>Review</span>
          </div>

          <div className="flex gap-6 overflow-hidden">
            {/* Form Section */}
            <div className="flex-1 overflow-y-auto max-h-[50vh] pr-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Live Preview Section */}
            {currentStep >= 2 && selectedTemplate && (
              <div className="flex-shrink-0 border-l pl-6">
                <WhatsAppPhonePreview
                  headerType={selectedTemplate.header_type as any}
                  headerContent={selectedTemplate.header_content}
                  body={selectedTemplate.body}
                  footer={selectedTemplate.footer}
                  buttons={Array.isArray(selectedTemplate.buttons) ? selectedTemplate.buttons as any : []}
                  variables={previewVariables}
                  businessName="Your Business"
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              {currentStep < 4 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending} className="btn-whatsapp">
                  {createCampaign.isPending ? "Creating..." : "Launch Campaign"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaigns;
