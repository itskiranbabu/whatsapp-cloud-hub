import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  ExternalLink,
  Facebook,
  TrendingUp,
  MessageSquare,
  Eye,
  Pause,
  Play,
  Trash2,
  Copy,
  BarChart3,
  Target,
  Wallet,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAds } from "@/hooks/useAds";
import { useTenants } from "@/hooks/useTenants";
import { format } from "date-fns";

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  draft: { label: "Draft", color: "bg-blue-100 text-blue-700" },
};

const AdsManager = () => {
  const { ads, isLoading, stats, createAd, deleteAd, toggleAdStatus } = useAds();
  const { currentTenant } = useTenants();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newAd, setNewAd] = useState({
    name: "",
    platform: "facebook" as "facebook" | "instagram",
    budget: "",
    objective: "",
  });

  // Check if Meta is connected via tenant settings
  const isConnected = !!currentTenant?.waba_id;

  const filteredAds = ads.filter(ad =>
    ad.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async () => {
    setIsConnecting(true);
    // This would redirect to Meta OAuth in production
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    setShowConnectDialog(false);
    // Would update tenant with Meta credentials
  };

  const handleCreateAd = async () => {
    if (!newAd.name.trim()) return;
    
    await createAd.mutateAsync({
      name: newAd.name,
      platform: newAd.platform,
      budget: parseFloat(newAd.budget) || 0,
      status: "draft",
    });
    
    setShowCreateDialog(false);
    setNewAd({ name: "", platform: "facebook", budget: "", objective: "" });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await toggleAdStatus.mutateAsync({ id, currentStatus });
  };

  const handleDelete = async (id: string) => {
    await deleteAd.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Ads Manager" subtitle="Create and manage Click-to-WhatsApp ads">
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

  if (!isConnected) {
    return (
      <DashboardLayout title="Ads Manager" subtitle="Create and manage Click-to-WhatsApp ads">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
            <Facebook className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Meta Business</h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Connect your Meta Business account to create and manage Click-to-WhatsApp ads directly from your dashboard
          </p>
          <Button size="lg" onClick={() => setShowConnectDialog(true)} className="gap-2">
            <Facebook className="w-5 h-5" />
            Connect Facebook
          </Button>

          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Connect Meta Business
                </DialogTitle>
                <DialogDescription>
                  You'll be redirected to Meta to authorize access to your ad accounts
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">We'll request access to:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Ad accounts and campaigns
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Ad performance metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Click-to-WhatsApp ad creation
                    </li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Continue with Facebook
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Ads Manager" subtitle="Create and manage Click-to-WhatsApp ads">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    Track your ad spend
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    WhatsApp conversations started
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Cost/Message</p>
                  <p className="text-2xl font-bold">₹{stats.avgCostPerMessage.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Cost efficiency metric</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-bold">{stats.activeAds}</p>
                  <p className="text-xs text-muted-foreground mt-1">of {ads.length} total</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        {/* Ads Table */}
        <Card>
          <CardContent className="p-0">
            {filteredAds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Target className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-lg">No campaigns yet</h3>
                <p className="text-muted-foreground mt-1">Create your first Click-to-WhatsApp ad campaign</p>
                <Button onClick={() => setShowCreateDialog(true)} className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>CPM</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.map((ad, index) => (
                    <motion.tr
                      key={ad.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            ad.platform === "facebook" 
                              ? "bg-blue-100" 
                              : "bg-gradient-to-br from-purple-500 to-pink-500"
                          }`}>
                            {ad.platform === "facebook" ? (
                              <Facebook className="w-4 h-4 text-blue-600" />
                            ) : (
                              <span className="text-white text-xs font-bold">IG</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{ad.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Created {format(new Date(ad.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[ad.status].color}>
                          {statusConfig[ad.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{Number(ad.budget).toLocaleString()}</TableCell>
                      <TableCell>₹{Number(ad.spent).toLocaleString()}</TableCell>
                      <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                      <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-primary">{ad.messages}</TableCell>
                      <TableCell>₹{Number(ad.cost_per_message).toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(ad.id, ad.status)}>
                              {ad.status === "active" ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(ad.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Campaign Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Click-to-WhatsApp Campaign</DialogTitle>
              <DialogDescription>
                Set up a new Facebook/Instagram ad that drives conversations to WhatsApp
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input 
                  placeholder="e.g., Summer Sale Promotion"
                  value={newAd.name}
                  onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={newAd.platform}
                  onValueChange={(v: "facebook" | "instagram") => setNewAd({ ...newAd, platform: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Daily Budget (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="500"
                  value={newAd.budget}
                  onChange={(e) => setNewAd({ ...newAd, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Campaign Objective</Label>
                <Textarea 
                  placeholder="Describe what you want to achieve..."
                  value={newAd.objective}
                  onChange={(e) => setNewAd({ ...newAd, objective: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAd} disabled={createAd.isPending}>
                {createAd.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdsManager;
