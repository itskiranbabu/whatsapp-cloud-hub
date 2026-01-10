import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Zap,
  BarChart3,
  Shield,
  Globe,
  Check,
  ArrowRight,
  Play,
  Star,
  Headphones,
  Bot,
  Send,
  Clock,
  TrendingUp,
  Menu,
  X,
  Sparkles,
  Target,
  Rocket,
  BadgeCheck,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingCart,
  MessageCircle,
  Megaphone,
  PieChart,
  Settings,
  FileText,
  Workflow,
  Database,
  Cloud,
  Lock,
  Smartphone,
  LayoutDashboard,
  Brain,
} from "lucide-react";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroHighlights = [
    { icon: Zap, text: "AI-Powered Automation" },
    { icon: Rocket, text: "10x Faster Growth" },
    { icon: Shield, text: "Enterprise Security" },
  ];

  const services = [
    {
      icon: MessageSquare,
      title: "WhatsApp Business API",
      description: "Official API access with unlimited messaging, verified badge, and enterprise features. Connect with 2B+ users globally.",
      features: ["Official Green Tick Badge", "Unlimited Messaging", "Multi-Agent Support", "24/7 Reliability"],
      gradient: "from-emerald-500 to-green-600",
    },
    {
      icon: Bot,
      title: "AI Chatbot Builder",
      description: "Build intelligent chatbots with drag-and-drop flow builder. No coding required. 24/7 customer support automation.",
      features: ["Visual Flow Builder", "AI-Powered Responses", "Human Handoff", "Multi-Language Support"],
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Megaphone,
      title: "Broadcast Campaigns",
      description: "Send personalized bulk messages to millions. Target segments, schedule campaigns, and track performance in real-time.",
      features: ["Bulk Messaging", "Smart Segmentation", "Campaign Analytics", "Template Library"],
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Integration",
      description: "Seamless catalog sharing, order notifications, payment collection, and customer support via WhatsApp.",
      features: ["Product Catalogs", "Payment Integration", "Order Tracking", "Cart Recovery"],
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Brain,
      title: "Marketing Automation",
      description: "Automate your entire marketing funnel from lead capture to conversion with AI-powered workflows.",
      features: ["Lead Scoring", "Drip Campaigns", "Behavior Triggers", "CRM Integration"],
      gradient: "from-indigo-500 to-violet-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive dashboards with real-time metrics, conversation analytics, and business intelligence.",
      features: ["Real-Time Dashboard", "Custom Reports", "ROI Tracking", "Team Performance"],
      gradient: "from-teal-500 to-emerald-600",
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Unified Inbox",
      description: "Manage all WhatsApp conversations in one powerful inbox with team collaboration features.",
    },
    {
      icon: Send,
      title: "Broadcast Campaigns",
      description: "Send personalized bulk messages to thousands of customers with detailed analytics.",
    },
    {
      icon: Bot,
      title: "Chatbot Automation",
      description: "Build no-code chatbots with drag-and-drop flow builder for 24/7 customer support.",
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize contacts with tags, segments, and custom attributes for targeted messaging.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track delivery rates, response times, and campaign performance in real-time.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption with GDPR compliance and role-based access control.",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹2,499",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "1,000 Monthly Conversations",
        "2 Team Members",
        "Basic Chatbot",
        "Email Support",
        "Basic Analytics",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹7,999",
      period: "/month",
      description: "For growing businesses with advanced needs",
      features: [
        "10,000 Monthly Conversations",
        "10 Team Members",
        "Advanced Chatbot Builder",
        "Priority Support",
        "Advanced Analytics",
        "API Access",
        "Custom Integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom requirements",
      features: [
        "Unlimited Conversations",
        "Unlimited Team Members",
        "Custom Chatbot Development",
        "24/7 Dedicated Support",
        "White-label Solution",
        "SLA Guarantee",
        "On-premise Deployment",
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "CEO, TechStartup India",
      content: "This platform transformed our customer communication. We've seen a 40% increase in response rates since switching.",
      rating: 5,
      company: "TechStartup",
    },
    {
      name: "Priya Sharma",
      role: "Marketing Head, RetailCo",
      content: "The broadcast feature is incredible. We can now reach thousands of customers instantly with personalized messages.",
      rating: 5,
      company: "RetailCo",
    },
    {
      name: "Amit Patel",
      role: "Operations Manager, E-commerce Giant",
      content: "The automation features saved us 20+ hours per week. Our team can now focus on high-value conversations.",
      rating: 5,
      company: "ShopEasy",
    },
  ];

  const stats = [
    { value: "10M+", label: "Messages Sent Daily", icon: Send },
    { value: "5,000+", label: "Happy Businesses", icon: Users },
    { value: "99.9%", label: "Uptime SLA", icon: Shield },
    { value: "<1s", label: "Avg Response Time", icon: Clock },
  ];

  const integrations = [
    "Shopify", "WooCommerce", "Razorpay", "PayU", "Zoho CRM", "HubSpot", 
    "Freshdesk", "Zendesk", "Google Sheets", "Zapier", "Make", "Pabbly"
  ];

  const useCases = [
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Abandoned cart recovery, order updates, and customer support",
    },
    {
      icon: CreditCard,
      title: "FinTech",
      description: "Payment reminders, transaction alerts, and KYC verification",
    },
    {
      icon: FileText,
      title: "EdTech",
      description: "Course updates, student engagement, and admission queries",
    },
    {
      icon: Smartphone,
      title: "Healthcare",
      description: "Appointment scheduling, health tips, and prescription reminders",
    },
    {
      icon: Globe,
      title: "Travel",
      description: "Booking confirmations, itinerary updates, and support",
    },
    {
      icon: LayoutDashboard,
      title: "Real Estate",
      description: "Property listings, virtual tours, and lead qualification",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f1a]/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">
                WhatsFlow
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Services
              </a>
              <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Testimonials
              </a>
              <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Book a Demo
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-white/10 bg-[#0a0f1a]"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <div className="flex flex-col gap-3">
                  {["Services", "Features", "Pricing", "Testimonials"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-sm font-medium text-gray-400 hover:text-white py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </Link>
                  <Link to="/contact" className="text-sm font-medium text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </Link>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Book a Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Dark Theme */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-5xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-2 text-sm font-medium text-primary mb-6">
                <BadgeCheck className="h-4 w-4" />
                Official WhatsApp Business Solution Provider
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              Scale Your Business with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">
                WhatsApp Automation
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-400 sm:text-xl max-w-3xl mx-auto"
            >
              Transform customer engagement with AI-powered chatbots, bulk messaging, and seamless CRM integration. 
              Join 5,000+ businesses driving 10x growth with India's #1 WhatsApp Business Platform.
            </motion.p>

            {/* Hero Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6"
            >
              {heroHighlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 rounded-xl shadow-lg shadow-primary/25"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 h-14 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-sm text-gray-500"
            >
              ✓ No credit card required &nbsp; ✓ 14-day free trial &nbsp; ✓ Cancel anytime
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-gray-500" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#0d1220]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              Our Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              Complete WhatsApp Business Suite
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Everything you need to automate, engage, and grow your business on WhatsApp
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-[#0a0f1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              Industries We Serve
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Trusted Across Industries
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-center group"
              >
                <useCase.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-white mb-1">{useCase.title}</h4>
                <p className="text-xs text-gray-400">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0d1220]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              Platform Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Everything You Need to Scale
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Powerful features designed for businesses of all sizes
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/5 border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-[#0a0f1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl font-semibold text-white mb-2">Seamless Integrations</h3>
            <p className="text-gray-400">Connect with your favorite tools</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:border-primary/50 hover:text-primary transition-all"
              >
                {integration}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0d1220]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              Pricing Plans
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? "border-primary bg-primary/5" : "bg-white/5 border-white/10"}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/auth" className="mt-auto">
                      <Button
                        className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-white/10 hover:bg-white/20 text-white"}`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#0a0f1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Loved by Businesses Everywhere
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0d1220]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-teal-600 p-8 md:p-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
            <div className="relative z-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
              >
                Ready to Transform Your Business?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-white/80 max-w-2xl mx-auto"
              >
                Join 5,000+ businesses already using WhatsFlow to engage customers and drive 10x growth.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="text-lg px-8 h-14 rounded-xl">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 h-14 rounded-xl border-white/30 text-white hover:bg-white/10"
                  >
                    Talk to Sales
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0f1a] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-white">WhatsFlow</span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                India's leading WhatsApp Business API platform. Helping businesses engage customers and drive growth.
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+91 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>support@whatsflow.in</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#services" className="text-sm text-gray-400 hover:text-white">Services</a></li>
                <li><Link to="/auth" className="text-sm text-gray-400 hover:text-white">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-sm text-gray-400 hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 WhatsFlow by{" "}
              <a href="https://keyrundigital.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                KeyRun Digital
              </a>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
