import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | MRV Grocery Store",
  description:
    "Terms and conditions for using MRV Grocery Store digital catalogue services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          Terms & Conditions – MRV Grocery Store (Arsikere, Karnataka)
        </h1>

        <p className="mb-8 text-gray-600 italic">
          Effective date: August 14, 2025
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1) Who We Are
            </h2>
            <p>
              <strong>MRV Grocery Store</strong> (“we”, “us”, “our”) provides
              customer support and order-status notifications via WhatsApp in
              addition to our website/app.
            </p>
            <p className="mt-2">
              <strong>Registered office:</strong> SHOP No. 11, APMC Yard,
              ARSIKERE, 573103, Karnataka, India.
              <br />
              <strong>Contact:</strong> mrvstoresvps@gmail.com | +91 94481 32930
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2) Scope
            </h2>
            <p>
              These Terms govern any interaction with us over WhatsApp,
              including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>“Click to WhatsApp” chat from our website/app or ads</li>
              <li>Order status, delivery notifications and issue-resolution</li>
              <li>Customer support and product enquiries</li>
            </ul>
            <p className="mt-2">
              Transactions (prices, payment, delivery, cancellations, refunds)
              are governed by our Website Terms of Sale and Returns Policy at:{" "}
              <a href="/refund" className="text-blue-600 hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3) Eligibility
            </h2>
            <p>
              You must be at least 18 years old (or the age required by local
              law) to use WhatsApp with us. If you contact us for a business,
              you confirm you are authorised to do so.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4) Opt-In & Consent (DPDP Act, 2023)
            </h2>
            <p>
              By clicking “Chat on WhatsApp”, submitting your number in a form,
              or sending us a WhatsApp message, you consent to receive WhatsApp
              messages from us on the number you provide. We may send:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Service messages (order confirmations, status updates, delivery
                alerts)
              </li>
              <li>Customer-support replies</li>
              <li>
                Marketing messages only if you separately opt in to marketing
              </li>
            </ul>
            <p className="mt-2">
              Message frequency varies based on your activity. Standard charges
              from your carrier may apply. You can withdraw consent at any time
              (see Clause 5).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5) Opt-Out / Withdraw Consent
            </h2>
            <p>
              Reply STOP or UNSUBSCRIBE in WhatsApp to opt out. You can also
              block our number or email <strong>mrvstoresvps@gmail.com</strong>{" "}
              with your phone number. Opting out of marketing will not stop
              essential service messages about an active order. We will cease
              messaging that relies on consent within a reasonable time after
              withdrawal, except where retention/processing is required by law
              or to complete an order already placed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6) Fair Use & Safety
            </h2>
            <p>
              Do not use WhatsApp to send unlawful, harmful, infringing, or
              abusive content, or to impersonate others. We may suspend WhatsApp
              communications to protect customers, prevent fraud, or comply with
              law. Do not share sensitive payment data in chat; use our secure
              checkout only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7) Orders, Prices & Payments
            </h2>
            <p>
              WhatsApp is a support/notification channel. Orders are accepted
              only through our website/app (unless we explicitly provide a
              WhatsApp order flow for specific cases). Pricing, taxes, delivery,
              cancellations and refunds are governed by our Website Terms of
              Sale and Returns Policy at:{" "}
              <a href="/refund" className="text-blue-600 hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8) Availability & Delivery of Messages
            </h2>
            <p>
              WhatsApp and telecom networks are third-party services. We do not
              guarantee continuous availability or delivery times of messages
              (including delivery/read receipts). If WhatsApp is unavailable, we
              may use alternate channels (e.g., email/SMS).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9) India Consumer Grievances (E-commerce Rules, 2020)
            </h2>
            <p>
              We maintain a grievance redressal mechanism and appoint a
              Grievance Officer. We will acknowledge consumer complaints within
              48 hours and aim to resolve them within one month from receipt.
            </p>
            <p className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <strong>Grievance Officer:</strong> Manager
              <br />
              <strong>Email:</strong> mrvstoresvps@gmail.com
              <br />
              <strong>Phone:</strong> +91 94481 32930
              <br />
              <strong>Address:</strong> SHOP No. 11, APMC Yard, ARSIKERE,
              573103, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10) Liability
            </h2>
            <p>
              To the maximum extent permitted by law, we are not liable for (a)
              delays, delivery failures or inaccuracies caused by
              networks/WhatsApp, or (b) indirect or consequential losses.
              Nothing limits liability for fraud, gross negligence, or where not
              permitted by law. Your statutory rights remain unaffected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11) Data & Privacy (DPDP Act, 2023)
            </h2>
            <p>
              We process your phone number, name, order identifiers and
              conversation content to provide support and order updates. See our{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy (India)
              </a>{" "}
              for details, including legal bases, retention, sharing and your
              rights. WhatsApp may process your data under its own terms and
              privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12) Changes
            </h2>
            <p>
              We may update these Terms to reflect legal/technical/business
              changes. The “Effective date” shows the latest version. Material
              changes will be notified where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13) Governing Law & Disputes
            </h2>
            <p>
              These Terms are governed by the laws of India. Courts at Arsikere,
              Karnataka shall have jurisdiction, subject to applicable consumer
              laws.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
            <p>
              <strong>MRV Grocery Store</strong>
              <br />
              SHOP No. 11, APMC Yard, ARSIKERE, 573103, Karnataka, India
              <br />
              <strong>Email:</strong> mrvstoresvps@gmail.com
              <br />
              <strong>Phone/WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/919448132930"
                className="text-blue-600 hover:underline"
              >
                +91 94481 32930
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
