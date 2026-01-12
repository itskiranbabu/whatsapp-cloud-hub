import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MessageSquare, CreditCard, Globe } from "lucide-react";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { TeamManagement } from "@/components/settings/TeamManagement";
import { WhatsAppConfig } from "@/components/settings/WhatsAppConfig";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { SettingsHelp, WorkspaceHelp, TeamHelp, WhatsAppHelp, BillingHelp } from "@/components/help/SettingsHelp";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <DashboardLayout title="Settings" subtitle="Manage your workspace and preferences">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="grid w-full max-w-3xl grid-cols-5">
              <TabsTrigger value="workspace" className="gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Workspace</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Language</span>
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

          <TabsContent value="language" className="space-y-6">
            <LanguageSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
