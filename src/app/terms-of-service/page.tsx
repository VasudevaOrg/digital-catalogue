import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Digital Catalogue",
  description:
    "Terms of Service for Digital Catalogue - Read our terms and conditions for using our services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using Digital Catalogue, you accept and agree to
              be bound by the terms and provisions of this agreement. If you do
              not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Use of Our Service
            </h2>
            <p className="mb-2">
              You agree to use our service only for lawful purposes and in
              accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Use the service in any way that violates any applicable law or
                regulation
              </li>
              <li>
                Impersonate or attempt to impersonate the company, another user,
                or any other person or entity
              </li>
              <li>
                Engage in any conduct that restricts or inhibits anyone's use or
                enjoyment of the service
              </li>
              <li>
                Use any robot, spider, or other automatic device to access the
                service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Account Registration
            </h2>
            <p>
              To access certain features of our service, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Products and Services
            </h2>
            <p>
              All products and services are subject to availability. We reserve
              the right to discontinue any product or service at any time.
              Prices for our products are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Orders and Payments
            </h2>
            <p className="mb-2">When you place an order:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                You agree to provide current, complete, and accurate purchase
                and account information
              </li>
              <li>
                You agree to promptly update your account and payment
                information
              </li>
              <li>
                We reserve the right to refuse or cancel any order for any
                reason
              </li>
              <li>Payment must be received before we process your order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Shipping and Delivery
            </h2>
            <p>
              We will make reasonable efforts to deliver products within the
              estimated timeframe. However, we are not responsible for delays
              caused by circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Returns and Refunds
            </h2>
            <p>
              Our return and refund policy allows you to return products within
              a specified period. Please contact our customer service for
              detailed information about returns and refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. WhatsApp Communications
            </h2>
            <p>
              By providing your phone number and placing an order, you consent
              to receive transactional messages via WhatsApp, including order
              confirmations, shipping updates, and delivery notifications. You
              may opt out at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Intellectual Property
            </h2>
            <p>
              The service and its original content, features, and functionality
              are owned by Digital Catalogue and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              In no event shall Digital Catalogue, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Disclaimer
            </h2>
            <p>
              Your use of the service is at your sole risk. The service is
              provided on an "AS IS" and "AS AVAILABLE" basis. The service is
              provided without warranties of any kind, whether express or
              implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of your jurisdiction, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              13. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days'
              notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              14. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-2 ml-4">
              <p>Email: support@digitalcatalogue.com</p>
              <p>Phone: +91 XXXXXXXXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
