import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  TrendingUp,
  Gauge,
  RefreshCw
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { useState } from "react";

interface APIStatusCardProps {
  className?: string;
}

export const APIStatusCard = ({ className }: APIStatusCardProps) => {
  const { currentTenant } = useTenants();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Determine API status based on tenant configuration
  const hasPhoneNumber = !!currentTenant?.phone_number_id;
  const hasWABA = !!currentTenant?.waba_id;
  const isConnected = hasPhoneNumber && hasWABA;

  // Mock quality rating - in production this would come from the WhatsApp Business API
  const qualityRating = isConnected ? "High" : "Not Connected";
  const getQualityColor = (rating: string) => {
    switch (rating) {
      case "High": return "bg-green-500";
      case "Medium": return "bg-amber-500";
      case "Low": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };
  const qualityColor = getQualityColor(qualityRating);

  // Mock remaining quota
  const remainingQuota = currentTenant?.muc_limit || 1000;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-6">
          {/* API Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">WhatsApp Business API Status</span>
              {isConnected ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1">
                  <Wifi className="w-3 h-3" />
                  LIVE
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <WifiOff className="w-3 h-3" />
                  Not Connected
                </Badge>
              )}
            </div>
          </div>

          {/* Quality Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Quality Rating</span>
            <Badge className={`${qualityColor} text-white`}>
              {qualityRating}
            </Badge>
          </div>

          {/* Messaging Tier */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Messaging Tier</span>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Tier 1 (1K/24h)
            </Badge>
          </div>

          {/* Remaining Quota */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Remaining Quota</span>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <span className="text-xl font-bold text-foreground">{remainingQuota.toLocaleString()}</span>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
