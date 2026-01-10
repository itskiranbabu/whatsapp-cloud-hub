import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 10, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using WhatsFlow ("the Service"), you accept and
                agree to be bound by the terms and provisions of this agreement.
                If you do not agree to abide by these terms, please do not use
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                WhatsFlow is a WhatsApp Business API platform that provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>WhatsApp Business messaging capabilities</li>
                <li>Broadcast campaign management</li>
                <li>Chatbot automation tools</li>
                <li>Contact management and segmentation</li>
                <li>Analytics and reporting</li>
                <li>Multi-agent inbox functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. User Registration and Account
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To use the Service, you must register for an account. You agree
                to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                4. WhatsApp Business Policy Compliance
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Users must comply with WhatsApp's Business Policy and Commerce
                Policy. This includes but is not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Obtaining proper opt-in consent before messaging users</li>
                <li>
                  Not sending spam, promotional messages without consent, or
                  prohibited content
                </li>
                <li>Respecting user privacy and data protection regulations</li>
                <li>Following WhatsApp's message template guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                5. Subscription and Billing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service operates on a subscription basis. By subscribing,
                you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  Pay the applicable subscription fees as per your chosen plan
                </li>
                <li>
                  Billing is based on Monthly Unique Conversations (MUC) or
                  fixed plans
                </li>
                <li>
                  Subscriptions auto-renew unless cancelled before the renewal
                  date
                </li>
                <li>
                  All fees are non-refundable except as stated in our Refund
                  Policy
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                6. Acceptable Use Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree NOT to use the Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Send unsolicited messages or spam</li>
                <li>
                  Transmit any harmful, threatening, or illegal content
                </li>
                <li>Violate any applicable laws or regulations</li>
                <li>
                  Infringe on intellectual property rights of others
                </li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>
                  Use the service for any fraudulent or deceptive purpose
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                7. Data Privacy and Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We take data privacy seriously. Your use of the Service is also
                governed by our Privacy Policy. We implement industry-standard
                security measures to protect your data, including encryption,
                secure data centers, and regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Service are
                owned by WhatsFlow and are protected by intellectual property
                laws. You may not copy, modify, distribute, or create derivative
                works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                9. Service Availability and Modifications
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain 99.9% uptime but do not guarantee
                uninterrupted service. We reserve the right to modify, suspend,
                or discontinue any part of the Service with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, WhatsFlow shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of or relating to your use of the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                11. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account immediately, without
                prior notice, for conduct that we believe violates these Terms
                or is harmful to other users, us, or third parties, or for any
                other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                12. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of India. Any disputes arising under these Terms
                shall be subject to the exclusive jurisdiction of the courts in
                Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                13. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions regarding these Terms, please contact us at:
              </p>
              <div className="mt-2 text-muted-foreground">
                <p>Email: legal@whatsflow.com</p>
                <p>Phone: +91 1800-XXX-XXXX</p>
                <p>Address: [Your Business Address], Mumbai, India</p>
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

export default Terms;
