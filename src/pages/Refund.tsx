import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Refund = () => {
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 10, 2024
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                1. Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This Refund & Cancellation Policy outlines the terms and
                conditions for refunds and cancellations of WhatsFlow
                subscription services. We aim to be fair and transparent in our
                refund practices while maintaining the sustainability of our
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                2. Subscription Plans
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                WhatsFlow offers the following subscription types:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Monthly subscription plans</li>
                <li>Annual subscription plans (billed yearly)</li>
                <li>
                  Pay-as-you-go plans based on Monthly Unique Conversations
                  (MUC)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. Free Trial Period
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 14-day free trial for new users. During this period:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>No payment information is required to start</li>
                <li>Full access to plan features is provided</li>
                <li>Cancel anytime without any charges</li>
                <li>
                  If not cancelled, the subscription automatically converts to a
                  paid plan
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                4. Refund Eligibility
              </h2>
              <h3 className="text-lg font-medium text-foreground mb-2">
                4.1 Eligible for Refund
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Within 7 Days:</strong> Full refund if requested
                  within 7 days of initial payment (first-time subscribers only)
                </li>
                <li>
                  <strong>Service Unavailability:</strong> Pro-rated refund for
                  extended service outages exceeding 24 hours
                </li>
                <li>
                  <strong>Billing Errors:</strong> Full refund for duplicate
                  charges or incorrect billing
                </li>
                <li>
                  <strong>Technical Issues:</strong> Refund considered if
                  service is unusable due to our technical issues
                </li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                4.2 Not Eligible for Refund
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Requests made after 7 days of purchase</li>
                <li>Partial month usage on monthly plans</li>
                <li>
                  Consumed MUC credits (pay-as-you-go)
                </li>
                <li>Account suspended due to Terms of Service violations</li>
                <li>
                  WhatsApp Business API restrictions imposed by Meta/WhatsApp
                </li>
                <li>Change of business requirements or personal reasons</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                5. Annual Plan Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For annual subscriptions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  Full refund within 14 days of purchase if service not utilized
                </li>
                <li>
                  After 14 days, no refunds but you may continue using the
                  service until the end of the billing period
                </li>
                <li>
                  Early cancellation does not qualify for pro-rated refunds
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                6. How to Request a Refund
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  Email us at{" "}
                  <a
                    href="mailto:support@whatsflow.com"
                    className="text-primary hover:underline"
                  >
                    support@whatsflow.com
                  </a>{" "}
                  with subject line "Refund Request"
                </li>
                <li>Include your registered email address and order ID</li>
                <li>Provide a brief reason for the refund request</li>
                <li>
                  Our team will review and respond within 3-5 business days
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                7. Refund Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Once a refund is approved:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>
                  Refunds will be processed to the original payment method
                </li>
                <li>
                  Processing time: 5-10 business days depending on your bank
                </li>
                <li>
                  For UPI/Net Banking: Refund within 5-7 business days
                </li>
                <li>
                  For Credit/Debit Cards: Refund within 7-10 business days
                </li>
                <li>You will receive email confirmation once refund is initiated</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                8. Subscription Cancellation
              </h2>
              <h3 className="text-lg font-medium text-foreground mb-2">
                8.1 How to Cancel
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Log into your WhatsFlow account</li>
                <li>Navigate to Settings → Billing → Cancel Subscription</li>
                <li>Follow the cancellation prompts</li>
                <li>Or email us at support@whatsflow.com</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                8.2 Cancellation Effects
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Service continues until the end of current billing period
                </li>
                <li>No further charges will be made</li>
                <li>
                  Data will be retained for 30 days post-cancellation
                </li>
                <li>After 30 days, data will be permanently deleted</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                9. Plan Downgrades
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you downgrade your plan:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
                <li>Changes take effect from the next billing cycle</li>
                <li>
                  No refund for the current billing period
                </li>
                <li>
                  Features exceeding the new plan limits may be restricted
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Exceptional Circumstances
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                In exceptional circumstances (natural disasters, medical
                emergencies), we may consider refund requests on a case-by-case
                basis. Please contact our support team with relevant
                documentation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For refund or cancellation queries:
              </p>
              <div className="mt-2 text-muted-foreground">
                <p>
                  Email:{" "}
                  <a
                    href="mailto:support@whatsflow.com"
                    className="text-primary hover:underline"
                  >
                    support@whatsflow.com
                  </a>
                </p>
                <p>Phone: +91 1800-XXX-XXXX (Mon-Sat, 9 AM - 6 PM IST)</p>
                <p>Response Time: Within 24-48 hours</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                12. Policy Updates
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify this policy at any time. Changes
                will be effective immediately upon posting to our website.
                Continued use of the service constitutes acceptance of the
                updated policy.
              </p>
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
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
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

export default Refund;
