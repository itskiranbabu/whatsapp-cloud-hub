import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Send,
  Users,
  Calendar,
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

const campaigns = [
  {
    id: 1,
    name: "Flash Sale - Winter Collection",
    template: "winter_sale_promo",
    status: "active",
    sent: 15420,
    delivered: 15280,
    read: 12340,
    replied: 2450,
    scheduledDate: "Jan 10, 2026 10:00 AM",
    audience: "All Customers",
    progress: 75,
  },
  {
    id: 2,
    name: "Order Confirmation Reminder",
    template: "order_confirm_v2",
    status: "completed",
    sent: 8750,
    delivered: 8720,
    read: 7890,
    replied: 890,
    scheduledDate: "Jan 9, 2026 2:00 PM",
    audience: "Recent Purchases",
    progress: 100,
  },
  {
    id: 3,
    name: "Abandoned Cart Recovery",
    template: "cart_recovery",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    scheduledDate: "Jan 11, 2026 9:00 AM",
    audience: "Cart Abandoners",
    progress: 0,
  },
  {
    id: 4,
    name: "New Product Launch",
    template: "product_launch_jan",
    status: "draft",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    scheduledDate: "Not scheduled",
    audience: "VIP Customers",
    progress: 0,
  },
  {
    id: 5,
    name: "Customer Feedback Survey",
    template: "feedback_request",
    status: "paused",
    sent: 3200,
    delivered: 3150,
    read: 2100,
    replied: 450,
    scheduledDate: "Jan 8, 2026 11:00 AM",
    audience: "Post-Purchase",
    progress: 45,
  },
];

const statusConfig = {
  active: {
    icon: Play,
    label: "Active",
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
  paused: {
    icon: Pause,
    label: "Paused",
    className: "status-rejected",
  },
};

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.delivered, 0);
  const totalRead = campaigns.reduce((acc, c) => acc + c.read, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

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
                  <p className="text-2xl font-bold">{totalSent.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">{totalDelivered.toLocaleString()}</p>
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
                    {totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) : 0}%
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
                  <p className="text-2xl font-bold">{activeCampaigns}</p>
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
          <Button className="btn-whatsapp gap-2">
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
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
                  const status = statusConfig[campaign.status as keyof typeof statusConfig];
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
                            {campaign.template} • {campaign.scheduledDate}
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
                          <span className="text-sm">{campaign.audience}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {campaign.sent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {campaign.delivered.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {campaign.read.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={campaign.progress} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {campaign.progress}%
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
                            {campaign.status === "active" && (
                              <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            {campaign.status === "paused" && (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
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
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Campaigns;
