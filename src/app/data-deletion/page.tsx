import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Digital Catalogue",
  description:
    "Learn how to request deletion of your personal data from Digital Catalogue.",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Data Deletion Instructions
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Your Right to Data Deletion
            </h2>
            <p>
              At Digital Catalogue, we respect your privacy and your right to
              control your personal data. You have the right to request deletion
              of your personal information at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              What Data Can Be Deleted
            </h2>
            <p className="mb-2">
              You can request deletion of the following types of data:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Account information (name, email, phone number)</li>
              <li>Order history and transaction records</li>
              <li>Delivery addresses</li>
              <li>Communication preferences</li>
              <li>WhatsApp message history</li>
              <li>Any other personal data we have collected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Data We May Retain
            </h2>
            <p className="mb-2">
              Please note that we may be required to retain certain information
              for legal, tax, or regulatory purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Transaction records for tax compliance (typically 7 years)
              </li>
              <li>
                Information required for ongoing legal disputes or
                investigations
              </li>
              <li>
                Anonymized data used for analytics (cannot be linked back to
                you)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              How to Request Data Deletion
            </h2>
            <p className="mb-4">
              You can request deletion of your data through any of the following
              methods:
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Method 1: Email Request
              </h3>
              <p className="mb-2">Send an email to:</p>
              <p className="font-semibold text-blue-600">
                privacy@digitalcatalogue.com
              </p>
              <p className="mt-2 text-sm">Include in your email:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm mt-1">
                <li>Your full name</li>
                <li>Email address associated with your account</li>
                <li>Phone number (if applicable)</li>
                <li>Subject line: "Data Deletion Request"</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Method 2: WhatsApp Request
              </h3>
              <p className="mb-2">
                Send a message to our WhatsApp Business number:
              </p>
              <p className="font-semibold text-green-600">+91 XXXXXXXXXX</p>
              <p className="mt-2 text-sm">Include in your message:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm mt-1">
                <li>Your full name</li>
                <li>Email address associated with your account</li>
                <li>Message: "I request deletion of my personal data"</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Method 3: Phone Request
              </h3>
              <p className="mb-2">Call our customer support:</p>
              <p className="font-semibold text-purple-600">+91 XXXXXXXXXX</p>
              <p className="mt-2 text-sm">
                Our support hours: Monday - Saturday, 9 AM - 6 PM IST
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Verification Process
            </h2>
            <p>
              To protect your privacy and security, we will verify your identity
              before processing any data deletion request. We may ask you to
              provide additional information to confirm you are the account
              holder.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Processing Timeline
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">
                    Step 1:
                  </span>
                  <span>We will acknowledge your request within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">
                    Step 2:
                  </span>
                  <span>We will verify your identity (1-2 business days)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">
                    Step 3:
                  </span>
                  <span>We will process the deletion (5-10 business days)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">
                    Step 4:
                  </span>
                  <span>
                    We will send you confirmation once deletion is complete
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              What Happens After Deletion
            </h2>
            <p className="mb-2">Once your data is deleted:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your account will be permanently closed</li>
              <li>You will no longer receive any communications from us</li>
              <li>
                Your order history will be removed (except what's legally
                required)
              </li>
              <li>
                You will need to create a new account if you wish to use our
                services again
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Facebook/Meta Data
            </h2>
            <p>
              If you've interacted with us through Facebook or WhatsApp, you may
              also want to delete data stored by Meta. You can do this by:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
              <li>Going to your Facebook Settings & Privacy</li>
              <li>Clicking on "Settings"</li>
              <li>Selecting "Apps and Websites"</li>
              <li>Finding "Digital Catalogue" and clicking "Remove"</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Questions or Concerns
            </h2>
            <p>
              If you have any questions about data deletion or our privacy
              practices, please contact us:
            </p>
            <div className="mt-2 ml-4">
              <p>Email: privacy@digitalcatalogue.com</p>
              <p>Phone: +91 XXXXXXXXXX</p>
              <p>WhatsApp: +91 XXXXXXXXXX</p>
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              ⚠️ Important Note
            </h2>
            <p className="font-semibold">
              Data deletion is permanent and cannot be undone. Please make sure
              you want to proceed before submitting your request. If you only
              want to deactivate your account temporarily, please contact our
              support team for alternative options.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
