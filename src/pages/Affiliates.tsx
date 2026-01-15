import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  TableRow 
} from "@/components/ui/table";
import { 
  Link2, 
  Copy, 
  DollarSign, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Download
} from "lucide-react";
import { useAffiliates } from "@/hooks/usePartners";
import { useToast } from "@/hooks/use-toast";

const Affiliates = () => {
  const { toast } = useToast();
  const { affiliates, referrals, isLoading } = useAffiliates();
  const [referralLink] = useState("https://whatsflow.app/ref/YOUR_CODE");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  // Calculate metrics
  const totalEarnings = affiliates.reduce((sum, a) => sum + (a.total_earnings || 0), 0);
  const pendingPayout = affiliates.reduce((sum, a) => sum + (a.pending_payout || 0), 0);
  const totalReferrals = referrals.length;
  const convertedReferrals = referrals.filter(r => r.status === 'converted').length;

  return (
    <DashboardLayout title="Affiliate Dashboard" subtitle="Earn commissions by referring new customers to WhatsFlow">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            Request Payout
          </Button>
        </div>

        {/* Referral Link Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  Your Referral Link
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share this link with potential customers to earn 20% commission on their first year's subscription
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input 
                  value={referralLink}
                  readOnly
                  className="bg-background min-w-[300px]"
                />
                <Button variant="outline" onClick={() => copyToClipboard(referralLink)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-500" />
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payout
              </CardTitle>
              <RefreshCw className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{pendingPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum ₹1,000 to request payout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Referrals
              </CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {convertedReferrals} converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalReferrals > 0 ? Math.round((convertedReferrals / totalReferrals) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Industry avg: 15%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="referrals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Track your referred customers and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : referrals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-1">No referrals yet</h3>
                    <p className="text-sm">Share your referral link to start earning commissions</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">
                            {referral.referred_tenant_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant={referral.status === 'converted' ? 'default' : 'secondary'}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(referral.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {referral.status === 'converted' ? '₹500' : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
                <CardDescription>Your earned commissions from referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-1">No commissions yet</h3>
                  <p className="text-sm">Commissions appear here when your referrals convert</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Track your payout requests and transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-1">No payouts yet</h3>
                  <p className="text-sm">Request a payout when you reach ₹1,000 in earnings</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Earn money by referring businesses to WhatsFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-2">1. Share Your Link</h4>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral link with potential customers
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-2">2. They Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  When they sign up using your link, you get credited
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-2">3. Earn Commission</h4>
                <p className="text-sm text-muted-foreground">
                  Earn 20% commission on their subscription for 12 months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Affiliates;
