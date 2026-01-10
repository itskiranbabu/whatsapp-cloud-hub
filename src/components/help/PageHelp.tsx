import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FAQ {
  question: string;
  answer: string;
}

interface Resource {
  title: string;
  description: string;
  type: "article" | "video" | "doc";
  url: string;
}

interface PageHelpProps {
  title: string;
  description: string;
  features?: string[];
  faqs?: FAQ[];
  resources?: Resource[];
  tips?: string[];
}

const resourceIcons = {
  article: BookOpen,
  video: Video,
  doc: FileText,
};

export const PageHelp = ({
  title,
  description,
  features = [],
  faqs = [],
  resources = [],
  tips = [],
}: PageHelpProps) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[450px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {title} Help
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Key Features */}
            {features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  Key Features
                </h4>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tips */}
            {tips.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    Pro Tips
                  </h4>
                  <div className="space-y-2">
                    {tips.map((tip, index) => (
                      <Card
                        key={index}
                        className="border-warning/20 bg-warning/5"
                      >
                        <CardContent className="p-3">
                          <p className="text-sm">{tip}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Frequently Asked Questions
                  </h4>
                  <div className="space-y-2">
                    {faqs.map((faq, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() =>
                          setExpandedFaq(expandedFaq === index ? null : index)
                        }
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">{faq.question}</p>
                            <ChevronRight
                              className={`h-4 w-4 text-muted-foreground transition-transform ${
                                expandedFaq === index ? "rotate-90" : ""
                              }`}
                            />
                          </div>
                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Resources
                  </h4>
                  <div className="space-y-2">
                    {resources.map((resource, index) => {
                      const Icon = resourceIcons[resource.type];
                      return (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Card className="transition-colors hover:bg-muted/50 hover:border-primary/30">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                      {resource.title}
                                    </p>
                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {resource.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Contact Support */}
            <Separator />
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Still need help?</p>
                    <p className="text-xs text-muted-foreground">
                      Contact our support team or use the AI Assistant
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
