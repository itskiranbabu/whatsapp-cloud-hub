import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Headphones,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const supportChannels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    availability: "24/7",
    action: "Start Chat",
    primary: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email",
    availability: "Response within 4 hours",
    action: "Send Email",
    primary: false,
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our team",
    availability: "Mon-Fri, 9AM-6PM",
    action: "Call Now",
    primary: false,
  },
];

const quickLinks = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Comprehensive guides and API docs",
    href: "/help",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    href: "/help",
  },
  {
    icon: FileText,
    title: "FAQs",
    description: "Answers to common questions",
    href: "/help",
  },
];

const Support = () => {
  const [ticketData, setTicketData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate ticket submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Support ticket submitted! We'll get back to you shortly.");
    setTicketData({ subject: "", category: "", priority: "", description: "" });
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Get help, contact support, or browse our knowledge base"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* AI Assistant Banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Try our AI Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get instant answers 24/7 - Click the chat button in the
                    bottom right corner
                  </p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Available Now
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Help Center Link */}
        <Link to="/help">
          <Card className="border-info/20 bg-info/5 hover:bg-info/10 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10 text-info">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Help Center</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse articles, tutorials, and FAQs
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Card
                key={index}
                className={`transition-all hover:shadow-md ${
                  channel.primary ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`p-3 rounded-xl ${
                        channel.primary
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {channel.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {channel.availability}
                    </div>
                    <Button
                      variant={channel.primary ? "default" : "outline"}
                      className="w-full"
                    >
                      {channel.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit Ticket Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Submit a Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={ticketData.subject}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, subject: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={ticketData.category}
                        onValueChange={(value) =>
                          setTicketData({ ...ticketData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="api">API & Integration</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={ticketData.priority}
                      onValueChange={(value) =>
                        setTicketData({ ...ticketData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                        <SelectItem value="high">High - Critical issue</SelectItem>
                        <SelectItem value="urgent">Urgent - System down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                      rows={5}
                      value={ticketData.description}
                      onChange={(e) =>
                        setTicketData({ ...ticketData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Average response time: 2-4 hours
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link key={index} to={link.href}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{link.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-success/20 bg-success/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">System Status</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All systems operational
                    </p>
                    <a
                      href="#"
                      className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      View status page
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Support;
