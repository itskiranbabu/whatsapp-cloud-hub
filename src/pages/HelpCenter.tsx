import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Video,
  MessageCircle,
  FileText,
  ChevronRight,
  ExternalLink,
  Rocket,
  Zap,
  Users,
  Mail,
  Shield,
  CreditCard,
  Settings,
  HelpCircle,
  Lightbulb,
  PlayCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  popular?: boolean;
}

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail?: string;
  category: string;
}

const categories = [
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "messaging", label: "Messaging", icon: MessageCircle },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with WhatsBiz",
    description: "Learn how to set up your account and send your first message",
    category: "getting-started",
    readTime: "5 min",
    popular: true,
  },
  {
    id: "2",
    title: "Understanding WhatsApp Business API Prerequisites",
    description: "Everything you need before connecting to WhatsApp Business API",
    category: "getting-started",
    readTime: "8 min",
    popular: true,
  },
  {
    id: "3",
    title: "Creating Your First Message Template",
    description: "Step-by-step guide to creating and submitting templates",
    category: "templates",
    readTime: "6 min",
    popular: true,
  },
  {
    id: "4",
    title: "Template Best Practices",
    description: "Tips to get your templates approved quickly",
    category: "templates",
    readTime: "4 min",
  },
  {
    id: "5",
    title: "Setting Up Automated Responses",
    description: "Create welcome messages and auto-replies",
    category: "automation",
    readTime: "7 min",
    popular: true,
  },
  {
    id: "6",
    title: "Importing Contacts from CSV",
    description: "Bulk import your customer contacts",
    category: "contacts",
    readTime: "3 min",
  },
  {
    id: "7",
    title: "Understanding Conversation Pricing",
    description: "How WhatsApp conversation billing works",
    category: "billing",
    readTime: "5 min",
  },
  {
    id: "8",
    title: "Managing Team Access",
    description: "Add team members and set permissions",
    category: "settings",
    readTime: "4 min",
  },
];

const videoTutorials: VideoTutorial[] = [
  {
    id: "1",
    title: "Platform Overview & Dashboard Tour",
    duration: "12:30",
    category: "getting-started",
  },
  {
    id: "2",
    title: "Connecting WhatsApp Business API",
    duration: "8:45",
    category: "getting-started",
  },
  {
    id: "3",
    title: "Creating Templates That Get Approved",
    duration: "15:20",
    category: "templates",
  },
  {
    id: "4",
    title: "Building Your First Automation Flow",
    duration: "18:00",
    category: "automation",
  },
  {
    id: "5",
    title: "Running Your First Campaign",
    duration: "10:15",
    category: "messaging",
  },
];

const faqs = [
  {
    category: "General",
    items: [
      {
        question: "What is WhatsBiz?",
        answer:
          "WhatsBiz is a comprehensive WhatsApp Business API platform that helps businesses send messages at scale, automate conversations, and manage customer communications efficiently.",
      },
      {
        question: "Do I need a WhatsApp Business Account?",
        answer:
          "Yes, you need a Meta Business account and WhatsApp Business API access. We guide you through the setup process when you connect your account.",
      },
      {
        question: "How long does setup take?",
        answer:
          "Basic setup takes about 15 minutes. However, WhatsApp business verification may take 1-5 business days, and template approval typically takes 24-48 hours.",
      },
    ],
  },
  {
    category: "Templates",
    items: [
      {
        question: "Why was my template rejected?",
        answer:
          "Common reasons include: promotional content in utility templates, missing opt-out options, policy violations, or unclear business purpose. Check the rejection reason and submit a revised version.",
      },
      {
        question: "How long does template approval take?",
        answer:
          "Usually 24-48 hours. Marketing templates may take longer than utility templates. You'll receive an email notification when approved or rejected.",
      },
      {
        question: "Can I use images in templates?",
        answer:
          "Yes! You can add images, videos, or documents in the template header. This is great for product showcases, catalogs, and visual content.",
      },
    ],
  },
  {
    category: "Messaging",
    items: [
      {
        question: "What is the 24-hour messaging window?",
        answer:
          "When a customer messages you, you have 24 hours to send free-form messages. After 24 hours, you must use approved templates to initiate conversation.",
      },
      {
        question: "How do I increase delivery rates?",
        answer:
          "Ensure contacts have opted in, avoid spammy content, personalize messages, and maintain a good sender reputation. Monitor analytics for insights.",
      },
      {
        question: "What are conversation charges?",
        answer:
          "WhatsApp charges per conversation (24-hour window), not per message. Rates vary by country and conversation type (marketing, utility, authentication, service).",
      },
    ],
  },
  {
    category: "Automation",
    items: [
      {
        question: "What can I automate?",
        answer:
          "Welcome messages, keyword-triggered responses, scheduled messages, abandoned cart reminders, appointment confirmations, and more.",
      },
      {
        question: "Can automation send template messages?",
        answer:
          "Yes, automation can send both free-form messages (within 24-hour window) and template messages (outside the window).",
      },
    ],
  },
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = articles.filter((a) => a.popular);

  return (
    <DashboardLayout
      title="Help Center"
      subtitle="Find answers, tutorials, and resources to help you succeed"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Search Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="py-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">How can we help you?</h2>
              <p className="text-muted-foreground">
                Search our knowledge base or browse categories below
              </p>
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for articles, tutorials, and more..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{category.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {articles.filter((a) => a.category === category.id).length} articles
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="articles" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Articles List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {selectedCategory === "all"
                      ? "All Articles"
                      : categories.find((c) => c.id === selectedCategory)?.label}
                  </h3>
                  <Badge variant="outline">
                    {filteredArticles.length} articles
                  </Badge>
                </div>

                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {filteredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{article.title}</h4>
                                {article.popular && (
                                  <Badge className="bg-warning/10 text-warning border-warning/20">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {article.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {categories.find((c) => c.id === article.category)?.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {article.readTime} read
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-warning" />
                      Popular Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {popularArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{article.title}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">Need more help?</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact our support team for personalized assistance
                      </p>
                      <Button className="w-full">Contact Support</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoTutorials.map((video) => (
                <Card
                  key={video.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 overflow-hidden"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <PlayCircle className="h-12 w-12 text-primary" />
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1">{video.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {categories.find((c) => c.id === video.category)?.label}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            {faqs.map((section) => (
              <Card key={section.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, index) => (
                      <AccordionItem key={index} value={`${section.category}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default HelpCenter;
