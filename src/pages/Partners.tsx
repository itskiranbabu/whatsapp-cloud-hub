import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePartners, useAffiliates, useCommissions, usePayouts } from "@/hooks/usePartners";
import { CustomDomainSetup } from "@/components/partners/CustomDomainSetup";
import { PartnerBrandingSettings } from "@/components/partners/PartnerBrandingSettings";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Copy, 
  ExternalLink,
  Wallet,
  UserPlus,
  Link,
  Percent,
  Palette
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Partners() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreatePartnerOpen, setIsCreatePartnerOpen] = useState(false);
  const [selectedPartnerForBranding, setSelectedPartnerForBranding] = useState<string | null>(null);
  const [newPartner, setNewPartner] = useState({ name: "", slug: "", custom_domain: "", revenue_share_model: "markup" });
  
  const { partners, isLoading: partnersLoading, createPartner, isCreating } = usePartners();
  const { affiliates, isLoading: affiliatesLoading, createAffiliate, isCreating: isCreatingAffiliate } = useAffiliates();
  const { commissions, isLoading: commissionsLoading } = useCommissions();
  const { payouts, isLoading: payoutsLoading, requestPayout, isRequesting } = usePayouts();
  const { toast } = useToast();

  const totalPartnerRevenue = partners.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const totalClients = partners.reduce((sum, p) => sum + (p.total_clients || 0), 0);
  const activePartners = partners.filter(p => p.status === "active").length;
  const pendingCommissions = commissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);

  const handleCreatePartner = () => {
    if (!newPartner.name || !newPartner.slug) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createPartner(newPartner);
    setIsCreatePartnerOpen(false);
    setNewPartner({ name: "", slug: "", custom_domain: "", revenue_share_model: "markup" });
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`);
    toast({ title: "Referral link copied to clipboard" });
  };

  return (
    <DashboardLayout title="Partner & Affiliate Portal" subtitle="Manage white-label partners and affiliate program">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Affiliates
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{partners.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activePartners} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  via partners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Partner Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalPartnerRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  all time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{pendingCommissions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  to be paid
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Commissions</CardTitle>
                <CardDescription>Latest commission transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionsLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : commissions.length === 0 ? (
                  <p className="text-muted-foreground">No commissions yet</p>
                ) : (
                  <div className="space-y-3">
                    {commissions.slice(0, 5).map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">₹{commission.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground capitalize">{commission.type}</p>
                        </div>
                        <Badge variant={commission.status === "paid" ? "default" : "secondary"}>
                          {commission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
                <CardDescription>Latest payout requests</CardDescription>
              </CardHeader>
              <CardContent>
                {payoutsLoading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : payouts.length === 0 ? (
                  <p className="text-muted-foreground">No payouts yet</p>
                ) : (
                  <div className="space-y-3">
                    {payouts.slice(0, 5).map((payout) => (
                      <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">₹{payout.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {payout.requested_at ? format(new Date(payout.requested_at), "MMM d, yyyy") : "N/A"}
                          </p>
                        </div>
                        <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                          {payout.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">White-Label Partners</h3>
              <p className="text-sm text-muted-foreground">Manage partner organizations and their branding</p>
            </div>
            <Dialog open={isCreatePartnerOpen} onOpenChange={setIsCreatePartnerOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Partner</DialogTitle>
                  <DialogDescription>Add a new white-label partner to the platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Partner Name *</Label>
                    <Input 
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                      placeholder="Agency Name"
                    />
                  </div>
                  <div>
                    <Label>Slug *</Label>
                    <Input 
                      value={newPartner.slug}
                      onChange={(e) => setNewPartner({ ...newPartner, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                      placeholder="agency-name"
                    />
                  </div>
                  <div>
                    <Label>Custom Domain</Label>
                    <Input 
                      value={newPartner.custom_domain}
                      onChange={(e) => setNewPartner({ ...newPartner, custom_domain: e.target.value })}
                      placeholder="app.agency.com"
                    />
                  </div>
                  <div>
                    <Label>Revenue Model</Label>
                    <Select 
                      value={newPartner.revenue_share_model}
                      onValueChange={(value) => setNewPartner({ ...newPartner, revenue_share_model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markup">Markup (Partner sets own pricing)</SelectItem>
                        <SelectItem value="revenue_share">Revenue Share (60/40 split)</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Platform fee + usage)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatePartnerOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePartner} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Partner"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {partnersLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading partners...</p>
              </CardContent>
            </Card>
          ) : partners.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Partners Yet</h3>
                <p className="text-muted-foreground mb-4">Start building your partner network</p>
                <Button onClick={() => setIsCreatePartnerOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Partner
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {partners.map((partner) => (
                <Card key={partner.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{partner.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {partner.custom_domain || `${partner.slug}.whatsflow.com`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{partner.total_clients || 0} clients</p>
                          <p className="text-sm text-muted-foreground">₹{(partner.total_revenue || 0).toLocaleString()} revenue</p>
                        </div>
                        <Badge variant={partner.status === "active" ? "default" : "secondary"}>
                          {partner.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">White-Label Branding</h3>
              <p className="text-sm text-muted-foreground">Customize domain and branding for your white-label instance</p>
            </div>
            {partners.length > 1 && (
              <Select 
                value={selectedPartnerForBranding || partners[0]?.id} 
                onValueChange={setSelectedPartnerForBranding}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {partnersLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : partners.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Partners Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create a partner first to configure branding and custom domains
                </p>
                <Button onClick={() => { setActiveTab("partners"); setIsCreatePartnerOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Partner
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {(() => {
                const partner = partners.find(p => p.id === (selectedPartnerForBranding || partners[0]?.id));
                if (!partner) return null;
                return (
                  <>
                    <CustomDomainSetup 
                      partnerId={partner.id}
                      partnerSlug={partner.slug}
                      currentDomain={partner.custom_domain}
                    />
                    <PartnerBrandingSettings 
                      partnerId={partner.id}
                      currentBranding={partner.branding}
                    />
                  </>
                );
              })()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Affiliate Program</h3>
              <p className="text-sm text-muted-foreground">Earn 20% recurring commission on referrals</p>
            </div>
            <Button onClick={() => createAffiliate()} disabled={isCreatingAffiliate}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isCreatingAffiliate ? "Creating..." : "Become an Affiliate"}
            </Button>
          </div>

          {affiliatesLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ) : affiliates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Link className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Start Earning with Referrals</h3>
                <p className="text-muted-foreground mb-4">
                  Earn 20% recurring commission for 12 months on every referral
                </p>
                <Button onClick={() => createAffiliate()} disabled={isCreatingAffiliate}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Affiliate Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {affiliates.map((affiliate) => (
                <Card key={affiliate.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Affiliate Account</span>
                      <Badge variant={affiliate.status === "active" ? "default" : "secondary"}>
                        {affiliate.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-2xl font-bold">₹{(affiliate.total_earnings || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Pending Payout</p>
                        <p className="text-2xl font-bold">₹{(affiliate.pending_payout || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Commission Rate</p>
                        <p className="text-2xl font-bold">{(affiliate.commission_rate * 100)}%</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/50">
                      <Label className="text-sm">Your Referral Link</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input 
                          value={`${window.location.origin}/?ref=${affiliate.referral_code}`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyReferralCode(affiliate.referral_code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {affiliate.pending_payout >= 1000 && (
                      <Button 
                        onClick={() => requestPayout({ amount: affiliate.pending_payout, affiliateId: affiliate.id })}
                        disabled={isRequesting}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Request Payout (₹{affiliate.pending_payout.toLocaleString()})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Payout History</h3>
            <p className="text-sm text-muted-foreground">Track your payout requests and processing status</p>
          </div>

          {payoutsLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Loading payouts...</p>
              </CardContent>
            </Card>
          ) : payouts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Payouts Yet</h3>
                <p className="text-muted-foreground">
                  Payouts will appear here once you earn commissions
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b last:border-0">
                        <td className="p-4">
                          {payout.requested_at ? format(new Date(payout.requested_at), "MMM d, yyyy") : "N/A"}
                        </td>
                        <td className="p-4 font-semibold">₹{payout.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                            {payout.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {payout.processed_at ? format(new Date(payout.processed_at), "MMM d, yyyy") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
