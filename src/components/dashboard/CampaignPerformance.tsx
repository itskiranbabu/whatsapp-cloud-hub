import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ArrowRight, CheckCircle2, Clock, XCircle, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { format } from "date-fns";

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "status-approved",
  },
  running: {
    icon: Play,
    label: "Running",
    className: "status-pending",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className: "status-draft",
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

export const CampaignPerformance = () => {
  const { campaigns, isLoading } = useCampaigns();

  // Get latest 3 campaigns
  const recentCampaigns = campaigns.slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Campaign Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Recent broadcast campaigns</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Campaign Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Recent broadcast campaigns</p>
          </div>
        </div>
        <Link
          to="/campaigns"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <Send className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No campaigns yet</p>
            <Link
              to="/campaigns"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Create your first campaign
            </Link>
          </div>
        ) : (
          recentCampaigns.map((campaign, index) => {
            const status = statusConfig[campaign.status as keyof typeof statusConfig] || statusConfig.draft;
            const sent = campaign.sent_count || 0;
            const delivered = campaign.delivered_count || 0;
            const read = campaign.read_count || 0;
            const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : "0";
            const readRate = delivered > 0 ? ((read / delivered) * 100).toFixed(1) : "0";

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{campaign.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {campaign.created_at ? format(new Date(campaign.created_at), "MMM d, yyyy") : ""}
                    </p>
                  </div>
                  <span className={status.className}>
                    <status.icon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="text-lg font-semibold text-foreground">
                      {sent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Rate</p>
                    <p className="text-lg font-semibold text-green-600">{deliveryRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Read Rate</p>
                    <p className="text-lg font-semibold text-blue-600">{readRate}%</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
