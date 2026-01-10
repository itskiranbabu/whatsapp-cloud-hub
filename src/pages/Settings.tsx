import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <DashboardLayout title="Settings" subtitle="Manage your workspace and preferences.">
      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coming next: team management, billing, WhatsApp provider configuration, and
            API keys.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
