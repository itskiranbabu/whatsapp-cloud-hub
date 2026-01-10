import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Sparkles, 
  TrendingUp,
  ShoppingCart
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { Link } from "react-router-dom";

export const CreditsCard = () => {
  const { currentTenant } = useTenants();

  // Mock credit data - in production this would come from a billing service
  const aiCredits = 500;
  const adCredits = 500;
  const mucLimit = currentTenant?.muc_limit || 1000;
  const mucUsed = 0; // Would come from actual usage tracking
  const mucPercentage = (mucUsed / mucLimit) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            Credits & Usage
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Credits */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">AI Credits</p>
              <p className="text-lg font-bold">₹ {aiCredits.toFixed(2)}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Buy Credits
          </Button>
        </div>

        {/* Advertisement Credits */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Advertisement Credits</p>
              <p className="text-lg font-bold">₹ {adCredits.toFixed(2)}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Buy Credits
          </Button>
        </div>

        {/* MUC Usage */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Monthly Unique Conversations</p>
              <p className="text-xs text-muted-foreground">MUC limit resets every month</p>
            </div>
            <span className="text-sm font-medium">{mucUsed.toLocaleString()} / {mucLimit.toLocaleString()}</span>
          </div>
          <Progress value={mucPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {mucLimit - mucUsed} conversations remaining
            </span>
            <span className="text-primary">Unlimited</span>
          </div>
        </div>

        {/* WhatsApp Credits */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingCart className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">WhatsApp Credits (WCC)</p>
              <p className="text-lg font-bold text-primary">₹ 50.00</p>
            </div>
          </div>
          <Button size="sm" className="btn-whatsapp">
            Buy More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
