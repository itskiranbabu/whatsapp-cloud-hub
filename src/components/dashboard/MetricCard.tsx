import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "info";
  description?: string;
}

const variantStyles = {
  primary: {
    card: "metric-card-primary",
    icon: "bg-primary/10 text-primary",
  },
  success: {
    card: "metric-card-success",
    icon: "bg-green-500/10 text-green-600",
  },
  warning: {
    card: "metric-card-warning",
    icon: "bg-amber-500/10 text-amber-600",
  },
  info: {
    card: "metric-card-info",
    icon: "bg-blue-500/10 text-blue-600",
  },
};

export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  variant = "primary",
  description,
}: MetricCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.card}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  change.trend === "up" ? "text-green-600" : "text-red-500"
                )}
              >
                {change.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{Math.abs(change.value)}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
