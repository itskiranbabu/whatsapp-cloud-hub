import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useTemplates } from "@/hooks/useTemplates";
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

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    template_id: "",
  });

  const { campaigns, isLoading, stats, createCampaign, deleteCampaign, updateCampaign } = useCampaigns();
  const { templates } = useTemplates();

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        status: "draft",
      });
      toast.success("Campaign created successfully");
      setShowCreateDialog(false);
      setNewCampaign({ name: "", description: "", template_id: "" });
    } catch (error) {
      toast.error("Failed to create campaign");
      console.error(error);
    }
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
          </div>
          <Button className="btn-whatsapp gap-2" onClick={() => setShowCreateDialog(true)}>
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
                  onClick={() => setShowCreateDialog(true)}
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

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
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
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={newCampaign.template_id}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, template_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.filter(t => t.status === "approved").map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
              {createCampaign.isPending ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaigns;
