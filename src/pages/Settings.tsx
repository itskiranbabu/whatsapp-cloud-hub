import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MessageSquare, CreditCard } from "lucide-react";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { TeamManagement } from "@/components/settings/TeamManagement";
import { WhatsAppConfig } from "@/components/settings/WhatsAppConfig";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { SettingsHelp, WorkspaceHelp, TeamHelp, WhatsAppHelp, BillingHelp } from "@/components/help/SettingsHelp";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <DashboardLayout title="Settings" subtitle="Manage your workspace and preferences">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="workspace" className="gap-2">
                <Building2 className="w-4 h-4" />
                Workspace
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="w-4 h-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            {/* Contextual Help Button */}
            <SettingsHelp tab={activeTab as "workspace" | "team" | "whatsapp" | "billing"} />
          </div>

          <TabsContent value="workspace" className="space-y-6">
            <WorkspaceHelp />
            <WorkspaceSettings />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamHelp />
            <TeamManagement />
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppHelp />
            <WhatsAppConfig />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingHelp />
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
