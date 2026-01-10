import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { globalTips, onboardingChecklist } from "@/config/helpContent";

export const GlobalHelpButton = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const quickLinks = [
    { label: "Getting Started", icon: BookOpen, href: "/help" },
    { label: "Video Tutorials", icon: Video, href: "/help" },
    { label: "Documentation", icon: FileText, href: "/help" },
    { label: "Contact Support", icon: Headphones, href: "/support" },
  ];

  const tipCategories = [
    { key: "whatsapp", label: "WhatsApp Tips", tips: globalTips.whatsapp },
    { key: "productivity", label: "Productivity Tips", tips: globalTips.productivity },
    { key: "marketing", label: "Marketing Tips", tips: globalTips.marketing },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px] p-0">
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <SheetTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            Help & Resources
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Everything you need to get the most out of our platform
          </p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <a key={link.label} href={link.href}>
                    <Card className="hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <link.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{link.label}</span>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pro Tips by Category */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Pro Tips
              </h4>
              <div className="space-y-2">
                {tipCategories.map((category) => (
                  <Card
                    key={category.key}
                    className="cursor-pointer transition-all hover:border-primary/30"
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.key ? null : category.key
                      )
                    }
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {category.label}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedCategory === category.key ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {expandedCategory === category.key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-3 space-y-2 pt-3 border-t">
                              {category.tips.map((tip, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-primary mt-0.5">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Setup Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Quick Setup Checklist
              </h4>
              <div className="space-y-2">
                {onboardingChecklist.setup.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Support Card */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Need more help?</p>
                    <p className="text-xs text-muted-foreground">
                      Our AI Assistant and support team are here for you
                    </p>
                  </div>
                  <a href="/support">
                    <Button size="sm">
                      Get Help
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Video Tutorials Coming Soon */}
            <Card className="border-dashed border-2">
              <CardContent className="p-4 text-center">
                <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium text-sm">Video Tutorials</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Step-by-step video guides coming soon!
                </p>
                <Badge variant="secondary" className="mt-2">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
