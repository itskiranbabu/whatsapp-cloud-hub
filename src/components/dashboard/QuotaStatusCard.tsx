import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, MessageSquare, Bot, Zap, Image } from "lucide-react";
import { useQuotaStatus } from "@/hooks/useQuotaStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const quotaConfig = {
  messages: {
    label: "Messages",
    icon: MessageSquare,
    description: "Daily message sending limit",
  },
  ai: {
    label: "AI Calls",
    icon: Bot,
    description: "AI assistant and smart reply calls",
  },
  automations: {
    label: "Automations",
    icon: Zap,
    description: "Daily automation executions",
  },
  templates: {
    label: "Templates",
    icon: Activity,
    description: "Template API calls",
  },
  ads: {
    label: "Ads",
    icon: Image,
    description: "Meta Ads API calls",
  },
} as const;

type QuotaType = keyof typeof quotaConfig;

export const QuotaStatusCard = () => {
  const { quotaStatus, isLoading, getUsagePercentage, isNearLimit, isAtLimit } = useQuotaStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Usage Quotas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const displayQuotas: QuotaType[] = ["messages", "automations", "ai"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Usage Quotas</CardTitle>
          <Badge variant="outline" className="text-xs">
            Resets daily
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayQuotas.map((type) => {
          const config = quotaConfig[type];
          const Icon = config.icon;
          const percentage = getUsagePercentage(type);
          const nearLimit = isNearLimit(type);
          const atLimit = isAtLimit(type);
          const quota = quotaStatus?.[type];

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                  <Icon className={cn(
                    "w-4 h-4",
                    atLimit ? "text-destructive" : nearLimit ? "text-warning" : "text-muted-foreground"
                  )} />
                  <span className="font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {atLimit && (
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <span className={cn(
                    "text-xs",
                    atLimit ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {quota?.used || 0} / {quota?.limit || 0}
                  </span>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={cn(
                  "h-2",
                  atLimit && "[&>div]:bg-destructive",
                  nearLimit && !atLimit && "[&>div]:bg-warning"
                )}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
