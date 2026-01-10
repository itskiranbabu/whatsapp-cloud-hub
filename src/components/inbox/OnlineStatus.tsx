import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: Date | null;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const OnlineStatus = ({ 
  isOnline, 
  lastSeen, 
  showLabel = false, 
  size = "md",
  className 
}: OnlineStatusProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const dotContent = (
    <span
      className={cn(
        "rounded-full inline-block border-2 border-card",
        isOnline ? "bg-green-500" : "bg-gray-400",
        sizeClasses[size],
        className
      )}
    />
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {dotContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {isOnline ? (
              "Online now"
            ) : lastSeen ? (
              `Last seen ${formatDistanceToNow(lastSeen, { addSuffix: true })}`
            ) : (
              "Offline"
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {dotContent}
      <span className="text-xs text-muted-foreground">
        {isOnline ? (
          "Online"
        ) : lastSeen ? (
          `Last seen ${formatDistanceToNow(lastSeen, { addSuffix: true })}`
        ) : (
          "Offline"
        )}
      </span>
    </div>
  );
};
