import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small businesses",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    features: [
      "1,000 conversations/month",
      "1 Team member",
      "5 Message templates",
      "Basic automation",
      "Email support",
    ],
    mucLimit: 1000,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹2,999",
    period: "/month",
    description: "For growing businesses",
    icon: Rocket,
    color: "from-emerald-500 to-emerald-600",
    popular: true,
    features: [
      "5,000 conversations/month",
      "5 Team members",
      "Unlimited templates",
      "Advanced automation",
      "API access",
      "Priority support",
    ],
    mucLimit: 5000,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹9,999",
    period: "/month",
    description: "For large organizations",
    icon: Building2,
    color: "from-purple-500 to-purple-600",
    features: [
      "Unlimited conversations",
      "Unlimited team members",
      "Unlimited templates",
      "Custom automation flows",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
    mucLimit: -1,
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
];

export const BillingSettings = () => {
  const { currentTenant } = useTenants();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = plans.find(p => p.id === (currentTenant?.plan || "starter")) || plans[0];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeDialog(true);
  };

  const handleConfirmUpgrade = () => {
    // Here you would integrate with Razorpay/Stripe
    setShowUpgradeDialog(false);
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
              <p className="text-3xl font-bold">{currentPlan.price}<span className="text-base font-normal text-muted-foreground">{currentPlan.period}</span></p>
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
            {usageMetrics.map((metric, index) => {
              const percentage = metric.limit > 0 ? (metric.used / metric.limit) * 100 : 0;
              const MetricIcon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <MetricIcon className="w-4 h-4 text-muted-foreground" />
                      {metric.label}
                    </span>
                    <span className="font-medium">
                      {metric.used.toLocaleString()} / {metric.limit.toLocaleString()}
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

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button variant="outline">
              View Invoices
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">
              Update Payment Method
              <CreditCard className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>
            Choose a plan that fits your business needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => {
              const PlanIcon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan.id;
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
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${isCurrentPlan ? "" : `bg-gradient-to-r ${plan.color}`}`}
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      <>
                        Upgrade
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
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
          <div className="py-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span>New Plan</span>
                <span className="font-bold">
                  {plans.find(p => p.id === selectedPlan)?.price}
                  {plans.find(p => p.id === selectedPlan)?.period}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
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
    </div>
  );
};
