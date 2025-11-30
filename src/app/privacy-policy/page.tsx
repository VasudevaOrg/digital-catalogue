import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Digital Catalogue",
  description:
    "Privacy Policy for Digital Catalogue - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to Digital Catalogue. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              will inform you about how we look after your personal data when
              you visit our website and tell you about your privacy rights and
              how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We may collect, use, store and transfer different kinds of
              personal data about you:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Identity Data:</strong> Name, username or similar
                identifier
              </li>
              <li>
                <strong>Contact Data:</strong> Email address, phone number,
                delivery address
              </li>
              <li>
                <strong>Transaction Data:</strong> Details about payments and
                products you have purchased
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type,
                device information
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our
                website and services
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To process and deliver your orders</li>
              <li>
                To send you order confirmations and updates via WhatsApp or
                email
              </li>
              <li>To manage your account and provide customer support</li>
              <li>To improve our website and services</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. WhatsApp Communications
            </h2>
            <p>
              We use WhatsApp Business API to send you order confirmations and
              updates. By providing your phone number and placing an order, you
              consent to receive transactional messages via WhatsApp. These
              messages include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Order confirmations</li>
              <li>Shipping updates</li>
              <li>Delivery notifications</li>
            </ul>
            <p className="mt-2">
              You can opt out of WhatsApp communications at any time by
              contacting us or blocking our WhatsApp number.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Data Security
            </h2>
            <p>
              We have implemented appropriate security measures to prevent your
              personal data from being accidentally lost, used, or accessed in
              an unauthorized way. We limit access to your personal data to
              those employees, agents, contractors, and other third parties who
              have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Data Retention
            </h2>
            <p>
              We will only retain your personal data for as long as necessary to
              fulfill the purposes we collected it for, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Your Rights
            </h2>
            <p className="mb-2">
              Under data protection laws, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Third-Party Services
            </h2>
            <p className="mb-2">
              We may share your data with the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Payment Processors:</strong> To process your payments
                securely
              </li>
              <li>
                <strong>WhatsApp Business API:</strong> To send order
                confirmations and updates
              </li>
              <li>
                <strong>Analytics Services:</strong> To understand how our
                website is used
              </li>
              <li>
                <strong>Hosting Providers:</strong> To host our website and
                database
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              9. Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              11. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
            </p>
            <div className="mt-2 ml-4">
              <p>Email: privacy@digitalcatalogue.com</p>
              <p>Phone: +91 XXXXXXXXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
