import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 10, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                WhatsFlow ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                WhatsApp Business API platform service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-lg font-medium text-foreground mb-2">
                2.1 Personal Information
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Name, email address, phone number, and business information
                </li>
                <li>Billing and payment information</li>
                <li>Account credentials and preferences</li>
                <li>Communication records with our support team</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                2.2 Business Data
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Contact lists and customer information you upload</li>
                <li>Message templates and content</li>
                <li>Campaign data and analytics</li>
                <li>Chatbot configurations and flows</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                2.3 Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Device information (IP address, browser type, OS)</li>
                <li>Usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log files and access times</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the collected information for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Providing and maintaining our Service</li>
                <li>Processing transactions and billing</li>
                <li>Sending service-related communications</li>
                <li>Improving and personalizing user experience</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who
                  assist in operating our Service (payment processors, cloud
                  hosting, analytics)
                </li>
                <li>
                  <strong>WhatsApp/Meta:</strong> As required for WhatsApp
                  Business API functionality
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with
                  mergers, acquisitions, or asset sales
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do NOT sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                5. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement robust security measures including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>256-bit SSL/TLS encryption for data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure data centers with SOC 2 compliance</li>
                <li>Employee security training and background checks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                6. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data for as long as your account is active or as
                needed to provide services. Upon account deletion request, we
                will delete your personal data within 30 days, except where
                retention is required for legal or business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                7. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  <strong>Access:</strong> Request copies of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate or
                  incomplete data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a portable
                  format
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your
                  personal data
                </li>
                <li>
                  <strong>Withdrawal:</strong> Withdraw consent where processing
                  is based on consent
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                8. Cookies Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Maintain your session and preferences</li>
                <li>Analyze traffic and usage patterns</li>
                <li>Improve our Service functionality</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookie preferences through your browser
                settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries other
                than India. We ensure appropriate safeguards are in place for
                such transfers, including standard contractual clauses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for individuals under 18 years of
                age. We do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                12. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related inquiries, please contact our Data
                Protection Officer:
              </p>
              <div className="mt-2 text-muted-foreground">
                <p>Email: privacy@whatsflow.com</p>
                <p>Phone: +91 1800-XXX-XXXX</p>
                <p>Address: [Your Business Address], Mumbai, India</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                13. Grievance Officer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In accordance with Information Technology Act 2000 and rules
                made thereunder, the name and contact details of the Grievance
                Officer are:
              </p>
              <div className="mt-2 text-muted-foreground">
                <p>Name: [Grievance Officer Name]</p>
                <p>Email: grievance@whatsflow.com</p>
                <p>Phone: +91 1800-XXX-XXXX</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 WhatsFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                to="/refund"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Refund Policy
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
