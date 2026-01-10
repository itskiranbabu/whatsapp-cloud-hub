import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const campaigns = [
  {
    id: 1,
    name: "Flash Sale Announcement",
    template: "promotional_flash_sale",
    sent: 12500,
    delivered: 12345,
    read: 8765,
    status: "completed",
    date: "Jan 8, 2026",
  },
  {
    id: 2,
    name: "Order Confirmation",
    template: "order_confirmation_v2",
    sent: 3420,
    delivered: 3415,
    read: 2890,
    status: "active",
    date: "Jan 9, 2026",
  },
  {
    id: 3,
    name: "Abandoned Cart Reminder",
    template: "cart_reminder",
    sent: 890,
    delivered: 885,
    read: 450,
    status: "scheduled",
    date: "Jan 10, 2026",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "status-approved",
  },
  active: {
    icon: Clock,
    label: "Active",
    className: "status-pending",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className: "status-draft",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "status-rejected",
  },
};

export const CampaignPerformance = () => {
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
        {campaigns.map((campaign, index) => {
          const status = statusConfig[campaign.status as keyof typeof statusConfig];
          const deliveryRate = ((campaign.delivered / campaign.sent) * 100).toFixed(1);
          const readRate = ((campaign.read / campaign.delivered) * 100).toFixed(1);

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
                    {campaign.template} • {campaign.date}
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
                    {campaign.sent.toLocaleString()}
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
        })}
      </CardContent>
    </Card>
  );
};
