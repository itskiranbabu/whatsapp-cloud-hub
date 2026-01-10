import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  X,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HelpItem {
  title: string;
  description: string;
  link?: string;
}

interface ContextualHelpProps {
  title: string;
  description: string;
  tips?: string[];
  steps?: HelpItem[];
  learnMoreUrl?: string;
  variant?: "info" | "tip" | "guide";
  defaultExpanded?: boolean;
  dismissible?: boolean;
}

export const ContextualHelp = ({
  title,
  description,
  tips,
  steps,
  learnMoreUrl,
  variant = "info",
  defaultExpanded = false,
  dismissible = true,
}: ContextualHelpProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const variantStyles = {
    info: {
      bg: "bg-info/5 border-info/20",
      icon: Info,
      iconColor: "text-info",
      badge: "bg-info/10 text-info border-info/20",
    },
    tip: {
      bg: "bg-warning/5 border-warning/20",
      icon: Lightbulb,
      iconColor: "text-warning",
      badge: "bg-warning/10 text-warning border-warning/20",
    },
    guide: {
      bg: "bg-primary/5 border-primary/20",
      icon: BookOpen,
      iconColor: "text-primary",
      badge: "bg-primary/10 text-primary border-primary/20",
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <Card className={`${style.bg} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${style.badge}`}>
            <Icon className={`h-4 w-4 ${style.iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{title}</h4>
                <Badge variant="outline" className={`text-[10px] ${style.badge}`}>
                  {variant === "info" ? "Info" : variant === "tip" ? "Pro Tip" : "Guide"}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                {(tips || steps) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsDismissed(true)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-1">{description}</p>

            <AnimatePresence>
              {isExpanded && (tips || steps) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {tips && tips.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {tips.map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}

                  {steps && steps.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-2 rounded-lg bg-background/50"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{step.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                Learn more
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
