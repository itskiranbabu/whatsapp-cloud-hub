import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  ArrowLeft,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Building2,
  Globe,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Customer First",
      description:
        "Every decision we make starts with how it benefits our customers.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "We protect your data with enterprise-grade security and transparency.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously evolve to bring you cutting-edge messaging solutions.",
    },
    {
      icon: Heart,
      title: "Simplicity",
      description:
        "Complex technology made simple, accessible to businesses of all sizes.",
    },
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Started with a vision to democratize WhatsApp marketing" },
    { year: "2021", title: "1,000 Customers", description: "Reached our first 1,000 paying customers" },
    { year: "2022", title: "Series A", description: "Raised $5M to accelerate product development" },
    { year: "2023", title: "5,000+ Businesses", description: "Trusted by businesses across 20+ industries" },
    { year: "2024", title: "10M+ Messages", description: "Processed over 10 million messages monthly" },
  ];

  const team = [
    { name: "Founder & CEO", role: "Leading the vision and strategy" },
    { name: "CTO", role: "Building robust and scalable technology" },
    { name: "VP Product", role: "Crafting user-centric experiences" },
    { name: "VP Sales", role: "Growing partnerships and revenue" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                WhatsFlow
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            >
              About WhatsFlow
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              We're on a mission to help businesses connect with their customers
              through the world's most popular messaging platform.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-primary/20">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize WhatsApp Business API access, enabling
                    businesses of all sizes to engage customers effectively,
                    automate support, and drive growth through conversational
                    commerce.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-primary/20">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted WhatsApp Business Platform,
                    powering meaningful conversations between a million
                    businesses and their customers by 2030.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Our Story
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg">
                WhatsFlow was born in 2020 when our founders recognized a
                significant gap in the market. While WhatsApp had become the
                primary communication channel for billions of people, businesses
                struggled to leverage its potential due to technical complexity
                and high costs.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                We set out to build a platform that makes WhatsApp Business API
                accessible to everyone—from small retailers to large
                enterprises. Today, we're proud to serve over 5,000 businesses
                across India, helping them send millions of messages and
                transform their customer engagement.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                Our team of passionate engineers, designers, and customer
                success professionals work tirelessly to deliver a product that
                combines powerful features with intuitive design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Journey
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-border md:-translate-x-1/2" />
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="text-sm font-medium text-primary">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Company Details
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Registered Office
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    KeyRun Digital
                    <br />
                    MSME Registered Digital Agency
                    <br />
                    Hyderabad, Telangana
                    <br />
                    India
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Registration Details
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    MSME Registered
                    <br />
                    Official WhatsApp BSP Partner
                    <br />
                    AI-Powered Automation Experts
                    <br />
                    Trusted by 5,000+ Businesses
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of businesses already using WhatsFlow to transform
              their customer communication.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="px-8">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 WhatsFlow by KeyRun Digital. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                to="/refund"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
