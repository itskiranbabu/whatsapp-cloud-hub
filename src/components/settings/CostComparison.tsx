import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  TrendingDown,
  MessageSquare,
  Zap,
  Shield,
  Gift,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CostComparisonProps {
  className?: string;
}

// Pricing data based on market research
const bspPricing = {
  aisensy: {
    name: "AiSensy",
    basePlan: 1425, // Basic plan monthly
    webhookCost: 2399, // Per month for webhook access
    markupPercent: 15, // Estimated markup on Meta pricing
    additionalCosts: ["₹2,399/mo for webhooks", "₹7,125/quarter for Flow Builder"],
  },
  wati: {
    name: "WATI",
    basePlan: 3999, // Starter plan monthly
    webhookCost: 0, // Included
    markupPercent: 20,
    additionalCosts: ["₹3,999/mo base fee", "Limited API access on basic"],
  },
  interakt: {
    name: "Interakt",
    basePlan: 2499, // Starter plan
    webhookCost: 0,
    markupPercent: 18,
    additionalCosts: ["₹2,499/mo minimum", "Per-message charges on top"],
  },
  meta_direct: {
    name: "Meta Direct (Our Platform)",
    basePlan: 0, // Our platform fee - adjust based on your pricing
    webhookCost: 0, // Free webhooks
    markupPercent: 0, // Direct Meta pricing
    additionalCosts: ["Platform subscription only", "No hidden fees"],
  },
};

// Meta's official conversation pricing (India, in INR)
const metaPricing = {
  marketing: 0.86, // per conversation
  utility: 0.19,
  authentication: 0.19,
  service: 0, // Free for first 1000/month
};

export const CostComparison = ({ className }: CostComparisonProps) => {
  const [monthlyConversations, setMonthlyConversations] = useState(5000);
  const [marketingPercent, setMarketingPercent] = useState(40);
  const [utilityPercent, setUtilityPercent] = useState(50);
  const [authPercent, setAuthPercent] = useState(10);

  // Calculate costs
  const calculateMetaCost = () => {
    const marketing = (monthlyConversations * marketingPercent / 100) * metaPricing.marketing;
    const utility = (monthlyConversations * utilityPercent / 100) * metaPricing.utility;
    const auth = (monthlyConversations * authPercent / 100) * metaPricing.authentication;
    return marketing + utility + auth;
  };

  const calculateBSPCost = (bsp: keyof typeof bspPricing) => {
    const metaCost = calculateMetaCost();
    const markup = metaCost * (bspPricing[bsp].markupPercent / 100);
    const base = bspPricing[bsp].basePlan;
    const webhook = bspPricing[bsp].webhookCost;
    return metaCost + markup + base + webhook;
  };

  const metaDirectCost = calculateMetaCost();
  const aiSensyCost = calculateBSPCost("aisensy");
  const watiCost = calculateBSPCost("wati");
  const savings = Math.round(((aiSensyCost - metaDirectCost) / aiSensyCost) * 100);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Cost Comparison Calculator</CardTitle>
              <CardDescription>
                See how much you can save with Meta Direct vs BSPs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Monthly Conversations</Label>
                <Input
                  type="number"
                  value={monthlyConversations}
                  onChange={(e) => setMonthlyConversations(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Conversation Mix (%)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Marketing</span>
                  <Input
                    type="number"
                    value={marketingPercent}
                    onChange={(e) => setMarketingPercent(Number(e.target.value))}
                    className="font-mono text-sm"
                    max={100}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Utility</span>
                  <Input
                    type="number"
                    value={utilityPercent}
                    onChange={(e) => setUtilityPercent(Number(e.target.value))}
                    className="font-mono text-sm"
                    max={100}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Auth</span>
                  <Input
                    type="number"
                    value={authPercent}
                    onChange={(e) => setAuthPercent(Number(e.target.value))}
                    className="font-mono text-sm"
                    max={100}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meta Direct */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-primary bg-primary/5 h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Meta Direct</h3>
                    <p className="text-sm text-muted-foreground">via Our Platform</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-3xl font-bold">{Math.round(metaDirectCost).toLocaleString()}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>FREE webhooks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>0% markup</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Full control</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AiSensy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">BSP</Badge>
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AiSensy</h3>
                    <p className="text-sm text-muted-foreground">Third-party BSP</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-3xl font-bold">{Math.round(aiSensyCost).toLocaleString()}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• ₹2,399/mo for webhooks</p>
                    <p>• ~15% message markup</p>
                    <p>• ₹1,425/mo base plan</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* WATI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">BSP</Badge>
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">WATI</h3>
                    <p className="text-sm text-muted-foreground">Third-party BSP</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span className="text-3xl font-bold">{Math.round(watiCost).toLocaleString()}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• ₹3,999/mo base fee</p>
                    <p>• ~20% message markup</p>
                    <p>• Limited API access</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Savings Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Your Estimated Savings</h4>
                    <p className="text-sm text-green-600">
                      Save up to <strong>₹{Math.round(aiSensyCost - metaDirectCost).toLocaleString()}</strong> per month ({savings}%)
                    </p>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 gap-2">
                  Switch to Meta Direct
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center">
            * Calculations based on Meta's official pricing for India (as of 2024). 
            Actual costs may vary based on conversation types and volume.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
