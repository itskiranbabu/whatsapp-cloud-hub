import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Support = () => {
  return (
    <DashboardLayout title="Help & Support" subtitle="Get help and contact support.">
      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coming next: knowledge base, ticketing, and SLA support.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Support;
