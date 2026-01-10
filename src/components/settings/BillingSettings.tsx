import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  CreditCard,
  Zap,
  Check,
  Star,
  Rocket,
  Building2,
  MessageSquare,
  Users,
  Bot,
  ArrowRight,
  ExternalLink,
  Crown,
  Tag,
  BarChart3,
  Download,
  Headphones,
  Webhook,
  Cloud,
  Puzzle,
  Gauge,
  X,
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";

// Pricing based on AiSensy structure
const plans = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 1425,
    quarterlyPrice: 1354, // 5% off
    yearlyPrice: 1283, // 10% off
    description: "Perfect for small businesses starting with WhatsApp",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    features: [
      { text: "Upto 10 Tags", included: true },
      { text: "Upto 5 Custom Attributes", included: true },
      { text: "Unlimited Users", included: true },
      { text: "Unlimited Agent Login", included: true },
      { text: "Multi-Agent Live Chat", included: true },
      { text: "Retargeting Campaigns", included: true },
      { text: "Smart Campaign Manager", included: true },
      { text: "Template Message APIs", included: true },
      { text: "1200 message/min", included: true },
    ],
    mucLimit: 1000,
    limits: {
      tags: 10,
      attributes: 5,
      users: "Unlimited",
      agents: "Unlimited",
      messageRate: 1200,
    }
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 3040,
    quarterlyPrice: 2888, // 5% off
    yearlyPrice: 2736, // 10% off
    description: "For growing businesses with advanced needs",
    icon: Rocket,
    color: "from-emerald-500 to-emerald-600",
    popular: true,
    features: [
      { text: "All in Basic", included: true },
      { text: "Upto 100 Tags", included: true },
      { text: "Upto 20 Custom Attributes", included: true },
      { text: "Campaign Scheduler", included: true },
      { text: "Campaign Click Tracking", included: true },
      { text: "Campaign Budget & Analytics", included: true },
      { text: "Project APIs", included: true },
      { text: "Upto 5GB cloud storage", included: true },
    ],
    mucLimit: 5000,
    limits: {
      tags: 100,
      attributes: 20,
      users: "Unlimited",
      agents: "Unlimited",
      messageRate: 1200,
      storage: "5GB",
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null, // Contact sales
    quarterlyPrice: null,
    yearlyPrice: null,
    description: "For large organizations with custom requirements",
    icon: Building2,
    color: "from-purple-500 to-purple-600",
    features: [
      { text: "All in PRO", included: true },
      { text: "Unlimited Tags", included: true },
      { text: "Unlimited Attributes", included: true },
      { text: "Downloadable Reports", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Priority Customer Support", included: true },
      { text: "Webhooks", included: true },
      { text: "Higher Messaging Speed", included: true },
      { text: "Upto 10GB cloud storage", included: true },
    ],
    mucLimit: -1,
    limits: {
      tags: "Unlimited",
      attributes: "Unlimited",
      users: "Unlimited",
      agents: "Unlimited",
      messageRate: 3000,
      storage: "10GB",
    }
  },
];

// Add-ons based on AiSensy
const addOns = [
  {
    id: "flow_builder",
    name: "Flow Builder",
    price: 7125,
    period: "quarter",
    description: "Drag & Drop Chatbot builder",
    icon: Puzzle,
    features: [
      "Drag & Drop Chatbot builder",
      "Showcase & Sell products on Whatsapp",
      "Whatsapp Cart Management",
      "Integrated with Shopify checkout",
      "Share Catalogs & Products on Whatsapp",
    ],
    quantities: [5, 10, 20, 40, 80],
    quantityLabel: "No. of flows",
  },
  {
    id: "agent_seats",
    name: "Agent Seats",
    price: 0,
    period: "month",
    description: "Multi-agent collaboration",
    icon: Users,
    features: [
      "Multi-agent collaboration",
      "Individual agent performance tracking",
      "Agent-specific automation rules",
      "Role-based access control",
      "Agent workload distribution",
    ],
    quantities: [1, 5, 10],
    quantityLabel: "No. of agent seats",
  },
];

const usageMetrics = [
  { 
    label: "Monthly Unique Conversations", 
    used: 847, 
    limit: 5000, 
    icon: MessageSquare,
    color: "bg-primary" 
  },
  { 
    label: "Team Members", 
    used: 3, 
    limit: 5, 
    icon: Users,
    color: "bg-blue-500" 
  },
  { 
    label: "Automation Runs", 
    used: 234, 
    limit: 1000, 
    icon: Bot,
    color: "bg-purple-500" 
  },
  { 
    label: "Tags Used", 
    used: 45, 
    limit: 100, 
    icon: Tag,
    color: "bg-amber-500" 
  },
  { 
    label: "Cloud Storage", 
    used: 2.3, 
    limit: 5, 
    icon: Cloud,
    color: "bg-green-500",
    unit: "GB"
  },
];

type BillingCycle = "monthly" | "quarterly" | "yearly";

export const BillingSettings = () => {
  const { currentTenant } = useTenants();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("quarterly");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showAddOnDialog, setShowAddOnDialog] = useState(false);
  const [selectedAddOn, setSelectedAddOn] = useState<typeof addOns[0] | null>(null);
  const [addOnQuantity, setAddOnQuantity] = useState(5);
  const [activeAddOns, setActiveAddOns] = useState<string[]>(["flow_builder"]);

  const currentPlan = plans.find(p => p.id === (currentTenant?.plan || "basic")) || plans[0];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) return null;
    switch (billingCycle) {
      case "monthly": return plan.monthlyPrice;
      case "quarterly": return plan.quarterlyPrice;
      case "yearly": return plan.yearlyPrice;
    }
  };

  const getDiscount = () => {
    switch (billingCycle) {
      case "quarterly": return "5% Off";
      case "yearly": return "10% Off";
      default: return null;
    }
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeDialog(true);
  };

  const handleConfirmUpgrade = () => {
    toast({
      title: "Upgrade initiated",
      description: "Redirecting to payment gateway...",
    });
    setShowUpgradeDialog(false);
  };

  const handleAddOnSelect = (addOn: typeof addOns[0]) => {
    setSelectedAddOn(addOn);
    setShowAddOnDialog(true);
  };

  const handleAddOnConfirm = () => {
    if (selectedAddOn) {
      if (activeAddOns.includes(selectedAddOn.id)) {
        setActiveAddOns(prev => prev.filter(id => id !== selectedAddOn.id));
        toast({
          title: "Add-on removed",
          description: `${selectedAddOn.name} has been removed from your subscription`,
        });
      } else {
        setActiveAddOns(prev => [...prev, selectedAddOn.id]);
        toast({
          title: "Add-on added",
          description: `${selectedAddOn.name} has been added to your subscription`,
        });
      }
    }
    setShowAddOnDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your subscription and billing details
              </CardDescription>
            </div>
            <Badge className={`bg-gradient-to-r ${currentPlan.color} text-white`}>
              <Crown className="w-3 h-3 mr-1" />
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div>
              <p className="text-3xl font-bold">
                ₹{currentPlan.monthlyPrice?.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="font-medium">February 15, 2026</p>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="space-y-4">
            <h4 className="font-medium">Usage This Month</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {usageMetrics.map((metric, index) => {
                const percentage = metric.limit > 0 ? (metric.used / metric.limit) * 100 : 0;
                const MetricIcon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border bg-card space-y-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <MetricIcon className="w-4 h-4 text-muted-foreground" />
                        {metric.label}
                      </span>
                      <span className="font-medium">
                        {metric.used.toLocaleString()}{metric.unit || ''} / {metric.limit.toLocaleString()}{metric.unit || ''}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Add-ons */}
          {activeAddOns.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">Active Add-ons</h4>
                <div className="flex flex-wrap gap-2">
                  {activeAddOns.map(addOnId => {
                    const addOn = addOns.find(a => a.id === addOnId);
                    if (!addOn) return null;
                    const AddOnIcon = addOn.icon;
                    return (
                      <Badge key={addOnId} variant="secondary" className="px-3 py-1">
                        <AddOnIcon className="w-3 h-3 mr-1" />
                        {addOn.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              View Invoices
            </Button>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Choose a plan that fits your business needs
              </CardDescription>
            </div>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((cycle) => (
                <Button
                  key={cycle}
                  variant={billingCycle === cycle ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingCycle(cycle)}
                  className="relative"
                >
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                  {cycle !== "monthly" && (
                    <Badge className="absolute -top-2 -right-2 text-[10px] px-1 py-0 bg-green-500">
                      {cycle === "quarterly" ? "5%" : "10%"}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => {
              const PlanIcon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan.id;
              const price = getPrice(plan);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isCurrentPlan 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  } ${plan.popular ? "ring-2 ring-primary ring-offset-2" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                  
                  <div className="mt-4">
                    {price !== null ? (
                      <>
                        <span className="text-3xl font-bold">₹{price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : billingCycle === "quarterly" ? "qtr" : "yr"}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">Contact Sales</span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-2">
                    {plan.features.slice(0, 6).map((feature) => (
                      <li key={feature.text} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-sm text-muted-foreground pl-6">
                        +{plan.features.length - 6} more features
                      </li>
                    )}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${isCurrentPlan ? "" : `bg-gradient-to-r ${plan.color}`}`}
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => plan.monthlyPrice ? handleUpgrade(plan.id) : window.open('mailto:sales@example.com', '_blank')}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.monthlyPrice ? (
                      <>
                        Upgrade
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Contact Sales
                        <Headphones className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-primary" />
            Add-ons
          </CardTitle>
          <CardDescription>
            Enhance your plan with powerful add-ons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addOn, index) => {
              const AddOnIcon = addOn.icon;
              const isActive = activeAddOns.includes(addOn.id);
              return (
                <motion.div
                  key={addOn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isActive ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <AddOnIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{addOn.name}</h4>
                          <Badge variant="outline" className="text-xs">Add-On</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{addOn.description}</p>
                      </div>
                    </div>
                    <Button
                      variant={isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleAddOnSelect(addOn)}
                    >
                      {isActive ? (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">
                      ₹{addOn.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/{addOn.period}</span>
                    {addOn.price === 0 && (
                      <Badge variant="secondary" className="ml-2">Starting Free</Badge>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {addOn.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {plans.find(p => p.id === selectedPlan)?.name}</DialogTitle>
            <DialogDescription>
              You're about to upgrade your plan. You'll be redirected to our secure payment gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span>New Plan</span>
                <span className="font-bold">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Billing Cycle</span>
                <span className="font-medium capitalize">{billingCycle}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ₹{getPrice(plans.find(p => p.id === selectedPlan) || plans[0])?.toLocaleString()}
                  /{billingCycle === "monthly" ? "mo" : billingCycle === "quarterly" ? "qtr" : "yr"}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              By proceeding, you agree to our terms of service. The new plan will be activated immediately after payment.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpgrade}>
              Proceed to Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add-on Dialog */}
      <Dialog open={showAddOnDialog} onOpenChange={setShowAddOnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeAddOns.includes(selectedAddOn?.id || '') ? 'Remove' : 'Add'} {selectedAddOn?.name}
            </DialogTitle>
            <DialogDescription>
              {activeAddOns.includes(selectedAddOn?.id || '') 
                ? 'Are you sure you want to remove this add-on?'
                : 'Configure this add-on for your subscription'
              }
            </DialogDescription>
          </DialogHeader>
          {selectedAddOn && !activeAddOns.includes(selectedAddOn.id) && (
            <div className="py-4 space-y-4">
              <div>
                <Label>{selectedAddOn.quantityLabel}</Label>
                <div className="flex gap-2 mt-2">
                  {selectedAddOn.quantities.map(qty => (
                    <Button
                      key={qty}
                      variant={addOnQuantity === qty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAddOnQuantity(qty)}
                    >
                      {qty > 0 ? `+${qty}` : qty}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="font-bold">
                    ₹{selectedAddOn.price.toLocaleString()}/{selectedAddOn.period}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowAddOnDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={activeAddOns.includes(selectedAddOn?.id || '') ? "destructive" : "default"}
              onClick={handleAddOnConfirm}
            >
              {activeAddOns.includes(selectedAddOn?.id || '') ? 'Remove Add-on' : 'Add to Subscription'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
