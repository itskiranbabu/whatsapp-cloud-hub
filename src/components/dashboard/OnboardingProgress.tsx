import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Rocket,
  ChevronRight,
  Settings,
  MessageSquare,
  Users,
  FileText,
  Zap,
  Trophy
} from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { useContacts } from "@/hooks/useContacts";
import { useTemplates } from "@/hooks/useTemplates";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isComplete: boolean;
}

export const OnboardingProgress = () => {
  const { currentTenant } = useTenants();
  const { contacts } = useContacts();
  const { templates } = useTemplates();
  const { campaigns } = useCampaigns();
  const [isExpanded, setIsExpanded] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: "api",
      title: "Connect WhatsApp API",
      description: "Set up your WhatsApp Business API credentials",
      icon: Settings,
      path: "/settings",
      isComplete: !!(currentTenant?.phone_number_id && currentTenant?.waba_id),
    },
    {
      id: "profile",
      title: "Setup Business Profile",
      description: "Complete your business information",
      icon: MessageSquare,
      path: "/settings",
      isComplete: !!currentTenant?.business_name,
    },
    {
      id: "contacts",
      title: "Import Contacts",
      description: "Add or import your customer contacts",
      icon: Users,
      path: "/contacts",
      isComplete: contacts.length > 0,
    },
    {
      id: "template",
      title: "Create First Template",
      description: "Design your first message template",
      icon: FileText,
      path: "/templates",
      isComplete: templates.length > 0,
    },
    {
      id: "campaign",
      title: "Send First Campaign",
      description: "Launch your first broadcast campaign",
      icon: Zap,
      path: "/campaigns",
      isComplete: campaigns.length > 0,
    },
  ];

  const completedSteps = steps.filter((s) => s.isComplete).length;
  const progress = (completedSteps / steps.length) * 100;
  const allComplete = completedSteps === steps.length;

  // Find next incomplete step
  const nextStep = steps.find((s) => !s.isComplete);

  if (allComplete) {
    return (
      <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">Setup Complete! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                You've completed all the setup steps. Start engaging with your customers!
              </p>
            </div>
            <Link to="/campaigns">
              <Button className="btn-whatsapp">
                Launch Campaign
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Complete Setup & Win 200 Free Credits
                <Badge variant="secondary" className="font-normal">
                  {completedSteps}/{steps.length} Complete
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Finish these steps to get the most out of WhatsFlow
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide" : "Show"} Steps
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-4 mt-4">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              {/* Steps */}
              <div className="relative">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isNext = nextStep?.id === step.id;

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-[18px] top-10 w-0.5 h-10 ${
                            step.isComplete ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}

                      <Link to={step.path}>
                        <motion.div
                          className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                            isNext
                              ? "bg-primary/5 border border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          whileHover={{ x: 4 }}
                        >
                          {/* Status Icon */}
                          <div
                            className={`relative z-10 p-2 rounded-full ${
                              step.isComplete
                                ? "bg-primary text-primary-foreground"
                                : isNext
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-medium ${
                                  step.isComplete
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground"
                                }`}
                              >
                                Step {index + 1}: {step.title}
                              </p>
                              {step.isComplete && (
                                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                  Complete
                                </Badge>
                              )}
                              {isNext && (
                                <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                                  Next
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>

                          {/* Action */}
                          {!step.isComplete && (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </motion.div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
