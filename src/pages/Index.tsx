import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentConversations } from "@/components/dashboard/RecentConversations";
import { CampaignPerformance } from "@/components/dashboard/CampaignPerformance";
import { ConversationChart } from "@/components/dashboard/ConversationChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { APIStatusCard } from "@/components/dashboard/APIStatusCard";
import { OnboardingProgress } from "@/components/dashboard/OnboardingProgress";
import { BusinessProfileCard } from "@/components/dashboard/BusinessProfileCard";
import { CreditsCard } from "@/components/dashboard/CreditsCard";
import { MessageSquare, Users, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

const Index = () => {
  const { data, isLoading } = useDashboardMetrics();

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
        {/* API Status Bar */}
        <APIStatusCard />

        {/* Onboarding Progress */}
        <OnboardingProgress />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Monthly Conversations"
                value={isLoading ? "—" : (data?.monthlyConversations ?? 0).toLocaleString()}
                icon={MessageSquare}
                variant="primary"
                description="This month"
              />
              <MetricCard
                title="Active Contacts"
                value={isLoading ? "—" : (data?.activeContacts ?? 0).toLocaleString()}
                icon={Users}
                variant="success"
              />
              <MetricCard
                title="Messages Sent"
                value={isLoading ? "—" : (data?.messagesSent ?? 0).toLocaleString()}
                icon={Send}
                variant="info"
                description="Outbound this month"
              />
              <MetricCard
                title="Delivery Rate"
                value={isLoading ? "—" : `${(data?.deliveryRate ?? 0).toFixed(1)}%`}
                icon={CheckCircle}
                variant="success"
                description="Outbound delivered"
              />
            </div>

            {/* Charts & Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversationChart />
              <QuickActions />
            </div>

            {/* Conversations & Campaigns Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentConversations />
              <CampaignPerformance />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <BusinessProfileCard />
            <CreditsCard />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
