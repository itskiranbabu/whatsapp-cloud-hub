import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  Circle,
  ChevronRight,
  ExternalLink,
  X,
  Building2,
  Phone,
  Shield,
  CreditCard,
  MessageSquare,
  Users,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PrerequisiteItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  helpUrl?: string;
  steps?: string[];
}

const prerequisites: PrerequisiteItem[] = [
  {
    id: "meta-business",
    title: "Meta Business Account",
    description: "Create a Meta Business account to access WhatsApp Business API",
    icon: Building2,
    required: true,
    helpUrl: "https://business.facebook.com",
    steps: [
      "Go to business.facebook.com",
      "Click 'Create Account'",
      "Enter your business name and email",
      "Verify your email address",
      "Complete your business profile",
    ],
  },
  {
    id: "phone-number",
    title: "Dedicated Phone Number",
    description: "A phone number not currently registered with WhatsApp",
    icon: Phone,
    required: true,
    steps: [
      "Get a phone number that can receive SMS or calls",
      "Ensure it's not registered with any WhatsApp account",
      "Consider using a business landline or virtual number",
      "Keep the number accessible for verification",
    ],
  },
  {
    id: "business-verification",
    title: "Business Verification",
    description: "Complete Meta's business verification process",
    icon: Shield,
    required: true,
    helpUrl: "https://www.facebook.com/business/help/2058515294227817",
    steps: [
      "Go to Meta Business Suite → Settings → Business Info",
      "Click 'Start Verification'",
      "Upload required business documents",
      "Wait for review (usually 1-5 business days)",
      "Check email for verification status",
    ],
  },
  {
    id: "payment-method",
    title: "Payment Method",
    description: "Add a payment method for WhatsApp conversation charges",
    icon: CreditCard,
    required: true,
    steps: [
      "WhatsApp charges per conversation (24-hour window)",
      "Rates vary by country and conversation type",
      "Add credit card or PayPal in billing settings",
      "Set up spending limits if needed",
    ],
  },
];

interface QuickStartStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  route: string;
}

const quickStartSteps: QuickStartStep[] = [
  {
    id: "connect-api",
    title: "Connect WhatsApp API",
    description: "Link your WhatsApp Business API credentials",
    icon: MessageSquare,
    action: "Go to Settings",
    route: "/settings",
  },
  {
    id: "import-contacts",
    title: "Import Contacts",
    description: "Add your customer contacts via CSV or manually",
    icon: Users,
    action: "Manage Contacts",
    route: "/contacts",
  },
  {
    id: "create-template",
    title: "Create First Template",
    description: "Design a message template for WhatsApp approval",
    icon: FileText,
    action: "Create Template",
    route: "/templates",
  },
  {
    id: "setup-automation",
    title: "Set Up Automation",
    description: "Create automated welcome messages or replies",
    icon: Zap,
    action: "Build Automation",
    route: "/automation",
  },
];

interface GettingStartedGuideProps {
  completedPrerequisites?: string[];
  completedSteps?: string[];
}

export const GettingStartedGuide = ({
  completedPrerequisites = [],
  completedSteps = [],
}: GettingStartedGuideProps) => {
  const [expandedPrereq, setExpandedPrereq] = useState<string | null>(null);
  const [showFullGuide, setShowFullGuide] = useState(false);

  const prerequisiteProgress =
    (completedPrerequisites.length / prerequisites.length) * 100;
  const quickStartProgress =
    (completedSteps.length / quickStartSteps.length) * 100;
  const overallProgress =
    ((completedPrerequisites.length + completedSteps.length) /
      (prerequisites.length + quickStartSteps.length)) *
    100;

  return (
    <Dialog open={showFullGuide} onOpenChange={setShowFullGuide}>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete these steps to start messaging
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-2 mt-3" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prerequisites Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Prerequisites
              </h4>
              <span className="text-xs text-muted-foreground">
                {completedPrerequisites.length}/{prerequisites.length} completed
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {prerequisites.slice(0, 4).map((prereq) => {
                const isComplete = completedPrerequisites.includes(prereq.id);
                return (
                  <div
                    key={prereq.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                      isComplete
                        ? "bg-success/10 text-success"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    <span className="truncate">{prereq.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Quick Start Steps */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              Quick Start
            </h4>
            {quickStartSteps.slice(0, 2).map((step, index) => {
              const isComplete = completedSteps.includes(step.id);
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isComplete
                      ? "bg-success/5 border-success/20"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isComplete
                        ? "bg-success text-success-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </p>
                  </div>
                  {!isComplete && (
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                      <a href={step.route}>
                        {step.action}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="sm">
              View Full Guide
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Complete Getting Started Guide
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-100px)] pr-4">
          <div className="space-y-6">
            {/* Prerequisites Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Prerequisites
                </h3>
                <Progress value={prerequisiteProgress} className="w-32 h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Complete these requirements before you can start using WhatsApp
                Business API.
              </p>

              <div className="space-y-3">
                {prerequisites.map((prereq) => {
                  const isComplete = completedPrerequisites.includes(prereq.id);
                  const isExpanded = expandedPrereq === prereq.id;
                  const Icon = prereq.icon;

                  return (
                    <Card
                      key={prereq.id}
                      className={`transition-colors ${
                        isComplete ? "border-success/30 bg-success/5" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div
                          className="flex items-start gap-3 cursor-pointer"
                          onClick={() =>
                            setExpandedPrereq(isExpanded ? null : prereq.id)
                          }
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isComplete
                                ? "bg-success/10 text-success"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{prereq.title}</h4>
                              {prereq.required && (
                                <Badge variant="outline" className="text-[10px]">
                                  Required
                                </Badge>
                              )}
                              {isComplete && (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {prereq.description}
                            </p>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        <AnimatePresence>
                          {isExpanded && prereq.steps && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <Separator className="my-3" />
                              <div className="space-y-2 pl-11">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Steps to Complete
                                </p>
                                {prereq.steps.map((step, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    {step}
                                  </div>
                                ))}
                                {prereq.helpUrl && (
                                  <a
                                    href={prereq.helpUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                  >
                                    Open Resource
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Quick Start Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Start Steps
                </h3>
                <Progress value={quickStartProgress} className="w-32 h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Once prerequisites are complete, follow these steps to start
                messaging.
              </p>

              <div className="space-y-3">
                {quickStartSteps.map((step, index) => {
                  const isComplete = completedSteps.includes(step.id);
                  const Icon = step.icon;

                  return (
                    <Card
                      key={step.id}
                      className={`transition-colors ${
                        isComplete ? "border-success/30 bg-success/5" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              isComplete
                                ? "bg-success text-success-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <h4 className="font-medium">{step.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={step.route}>
                              {step.action}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
