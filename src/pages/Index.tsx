import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentConversations } from "@/components/dashboard/RecentConversations";
import { CampaignPerformance } from "@/components/dashboard/CampaignPerformance";
import { ConversationChart } from "@/components/dashboard/ConversationChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MessageSquare, Users, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your WhatsApp Business overview."
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Conversations (MUC)"
            value="24,586"
            change={{ value: 12.5, trend: "up" }}
            icon={MessageSquare}
            variant="primary"
          />
          <MetricCard
            title="Active Contacts"
            value="18,234"
            change={{ value: 8.2, trend: "up" }}
            icon={Users}
            variant="success"
          />
          <MetricCard
            title="Messages Sent"
            value="156,789"
            change={{ value: 15.3, trend: "up" }}
            icon={Send}
            variant="info"
          />
          <MetricCard
            title="Delivery Rate"
            value="98.5%"
            change={{ value: 0.3, trend: "up" }}
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Charts & Conversations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConversationChart />
          <QuickActions />
        </div>

        {/* Conversations & Campaigns Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentConversations />
          <CampaignPerformance />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
