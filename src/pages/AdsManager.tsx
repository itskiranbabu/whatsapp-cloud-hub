import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Facebook,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Eye,
  MousePointer,
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Ad {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  platform: "facebook" | "instagram";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  messages: number;
  costPerMessage: number;
  createdAt: string;
}

const demoAds: Ad[] = [
  {
    id: "1",
    name: "Summer Sale - Click to WhatsApp",
    status: "active",
    platform: "facebook",
    budget: 5000,
    spent: 2340,
    impressions: 45600,
    clicks: 1230,
    messages: 456,
    costPerMessage: 5.13,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "New Product Launch",
    status: "active",
    platform: "instagram",
    budget: 3000,
    spent: 1890,
    impressions: 32100,
    clicks: 890,
    messages: 234,
    costPerMessage: 8.08,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Holiday Promotion",
    status: "completed",
    platform: "facebook",
    budget: 10000,
    spent: 10000,
    impressions: 156000,
    clicks: 4500,
    messages: 1234,
    costPerMessage: 8.10,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Lead Generation Q1",
    status: "paused",
    platform: "facebook",
    budget: 2000,
    spent: 450,
    impressions: 8900,
    clicks: 234,
    messages: 67,
    costPerMessage: 6.72,
    createdAt: "2024-02-01",
  },
];

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
  draft: { label: "Draft", color: "bg-blue-100 text-blue-700" },
};

const AdsManager = () => {
  const [ads, setAds] = useState<Ad[]>(demoAds);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
  const totalMessages = ads.reduce((sum, ad) => sum + ad.messages, 0);
  const avgCpm = totalMessages > 0 ? totalSpent / totalMessages : 0;
  const activeAds = ads.filter(ad => ad.status === "active").length;

  const filteredAds = ads.filter(ad =>
    ad.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    setIsConnected(true);
    setShowConnectDialog(false);
    toast({
      title: "Facebook connected",
      description: "Your Meta Business account has been connected successfully",
    });
  };

  const handleToggleStatus = (id: string) => {
    setAds(ads.map(ad => {
      if (ad.id === id) {
        const newStatus = ad.status === "active" ? "paused" : "active";
        return { ...ad, status: newStatus };
      }
      return ad;
    }));
    toast({
      title: "Ad status updated",
      description: "The ad status has been changed",
    });
  };

  const handleDelete = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
    toast({
      title: "Ad deleted",
      description: "The ad has been removed",
    });
  };

  if (!isConnected) {
    return (
      <DashboardLayout
        title="Ads Manager"
        subtitle="Create and manage Click-to-WhatsApp ads"
      >
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
    <DashboardLayout
      title="Ads Manager"
      subtitle="Create and manage Click-to-WhatsApp ads"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +12% this month
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
                  <p className="text-2xl font-bold">{totalMessages.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +23% this month
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
                  <p className="text-2xl font-bold">₹{avgCpm.toFixed(2)}</p>
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <ArrowDownRight className="w-3 h-3" />
                    -5% this month
                  </p>
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
                  <p className="text-2xl font-bold">{activeAds}</p>
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
                          ad.platform === "facebook" ? "bg-blue-100" : "bg-gradient-to-br from-purple-500 to-pink-500"
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
                            Created {format(new Date(ad.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[ad.status].color}>
                        {statusConfig[ad.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">₹{ad.budget.toLocaleString()}</TableCell>
                    <TableCell>₹{ad.spent.toLocaleString()}</TableCell>
                    <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                    <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-primary">{ad.messages}</TableCell>
                    <TableCell>₹{ad.costPerMessage.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(ad.id)}>
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
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(ad.id)}
                          >
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
                <Input placeholder="e.g., Summer Sale Promotion" />
              </div>
              <div className="space-y-2">
                <Label>Daily Budget (₹)</Label>
                <Input type="number" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea 
                  placeholder="Hi! Thanks for your interest. How can I help you today?"
                  rows={3}
                />
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  After creating, you'll be redirected to Facebook Ads Manager to complete your ad setup including targeting, creative, and placement.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button>
                Create & Continue
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdsManager;
