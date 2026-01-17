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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  RefreshCw,
  Link2,
  Unlink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useMetaAds } from "@/hooks/useMetaAds";
import { useAds } from "@/hooks/useAds";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-700" },
  PAUSED: { label: "Paused", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  draft: { label: "Draft", color: "bg-blue-100 text-blue-700" },
};

const AdsManager = () => {
  const { 
    isConnected, 
    isLoading: isMetaLoading, 
    isFBSDKLoaded,
    adAccounts,
    campaigns: metaCampaigns,
    selectedAdAccount,
    setSelectedAdAccount,
    connectMeta,
    disconnectMeta,
    syncCampaigns,
    createCampaign,
  } = useMetaAds();
  
  const { ads, isLoading: isAdsLoading, stats, createAd, deleteAd, toggleAdStatus } = useAds();
  
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

  const isLoading = isMetaLoading || isAdsLoading;

  const filteredAds = ads.filter(ad =>
    ad.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectMeta();
      setShowConnectDialog(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    await disconnectMeta.mutateAsync();
  };

  const handleSync = async () => {
    if (selectedAdAccount) {
      await syncCampaigns.mutateAsync(selectedAdAccount);
    }
  };

  const handleCreateAd = async () => {
    if (!newAd.name.trim()) return;
    
    // If connected to Meta, create on Meta first
    if (isConnected && selectedAdAccount) {
      await createCampaign.mutateAsync({
        adAccountId: selectedAdAccount,
        name: newAd.name,
        objective: "MESSAGES",
        status: "PAUSED",
      });
    } else {
      // Otherwise create locally
      await createAd.mutateAsync({
        name: newAd.name,
        platform: newAd.platform,
        budget: parseFloat(newAd.budget) || 0,
        status: "draft",
      });
    }
    
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

  // Not connected state
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
            Connect your Meta Business account to create and manage Click-to-WhatsApp ads directly from your dashboard. 
            Sync campaigns and track performance in real-time.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setShowConnectDialog(true)} 
              className="gap-2"
              disabled={!isFBSDKLoaded}
            >
              <Facebook className="w-5 h-5" />
              Connect Facebook
            </Button>
            
            {!isFBSDKLoaded && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Facebook SDK...
              </p>
            )}
          </div>

          {/* Connect Dialog */}
          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Connect Meta Business
                </DialogTitle>
                <DialogDescription>
                  Authorize access to manage your Facebook and Instagram ads
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Permissions Required:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Read and manage ad campaigns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Access ad performance insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Manage business assets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Create Click-to-WhatsApp ads</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>
                      Make sure you have admin access to the Facebook Business Manager 
                      and Ad Accounts you want to connect.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={isConnecting || !isFBSDKLoaded}>
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

  // Connected state with full Ads Manager
  return (
    <DashboardLayout title="Ads Manager" subtitle="Create and manage Click-to-WhatsApp ads">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Connection Status Card */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    Meta Ads Connected
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {adAccounts.length} ad account{adAccounts.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSync}
                  disabled={syncCampaigns.isPending || !selectedAdAccount}
                >
                  {syncCampaigns.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sync
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnectMeta.isPending}
                >
                  <Unlink className="w-4 h-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Account Selector */}
        {adAccounts.length > 0 && (
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Ad Account:</Label>
            <Select value={selectedAdAccount || ""} onValueChange={setSelectedAdAccount}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select an ad account" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
                    WhatsApp conversations
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
                  <p className="text-xs text-muted-foreground mt-1">Cost efficiency</p>
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

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            {filteredAds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Target className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-lg">No campaigns yet</h3>
                <p className="text-muted-foreground mt-1 text-center max-w-md">
                  {selectedAdAccount 
                    ? "Click 'Sync' to import existing campaigns from Meta, or create a new campaign"
                    : "Select an ad account above to get started"}
                </p>
                {selectedAdAccount && (
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={handleSync} disabled={syncCampaigns.isPending}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync from Meta
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Campaign
                    </Button>
                  </div>
                )}
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
                        <Badge className={statusConfig[ad.status]?.color || "bg-gray-100 text-gray-700"}>
                          {statusConfig[ad.status]?.label || ad.status}
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
                {isConnected 
                  ? "Create a new campaign that will be synced to Meta Ads Manager"
                  : "Set up a new Facebook/Instagram ad campaign"}
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
              {!isConnected && (
                <>
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
                </>
              )}
              <div className="space-y-2">
                <Label>Campaign Objective</Label>
                <Textarea 
                  placeholder="Describe what you want to achieve..."
                  value={newAd.objective}
                  onChange={(e) => setNewAd({ ...newAd, objective: e.target.value })}
                />
              </div>
              
              {isConnected && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                  <p className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    This campaign will be created in your Meta Ads Manager
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateAd} 
                disabled={createAd.isPending || createCampaign.isPending || !newAd.name.trim()}
              >
                {(createAd.isPending || createCampaign.isPending) ? (
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
