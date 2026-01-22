import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Database, 
  Shield, 
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useAppHealth } from "@/hooks/useAppHealth";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const SystemHealthCard = () => {
  const { data: health, isLoading, refetch } = useAppHealth();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "degraded":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  if (isLoading || !health) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted animate-pulse">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAllHealthy = 
    health.database === "healthy" && 
    health.auth === "healthy" && 
    health.whatsapp === "connected";

  return (
    <Card className={cn(
      "transition-colors",
      isAllHealthy ? "border-green-200 dark:border-green-800" : "border-amber-200 dark:border-amber-800"
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isAllHealthy ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
            )}>
              <Activity className={cn(
                "w-5 h-5",
                isAllHealthy ? "text-green-600" : "text-amber-600"
              )} />
            </div>
            <div>
              <h3 className="font-semibold">System Health</h3>
              <p className="text-sm text-muted-foreground">
                All systems {isAllHealthy ? "operational" : "need attention"}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refetch()}
            className="h-8 w-8"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Database Status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Database</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(health.database)}>
              {getStatusIcon(health.database)}
              <span className="ml-1.5 capitalize">{health.database}</span>
            </Badge>
          </div>

          {/* Auth Status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Authentication</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(health.auth)}>
              {getStatusIcon(health.auth)}
              <span className="ml-1.5 capitalize">{health.auth}</span>
            </Badge>
          </div>

          {/* WhatsApp Status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">WhatsApp API</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(health.whatsapp)}>
              {getStatusIcon(health.whatsapp)}
              <span className="ml-1.5 capitalize">{health.whatsapp}</span>
            </Badge>
          </div>
        </div>

        {!isAllHealthy && (
          <Button 
            variant="outline" 
            className="w-full mt-4 gap-2"
            onClick={() => navigate("/production-checklist")}
          >
            View Production Checklist
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
