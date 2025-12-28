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

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>MRV Grocery Store</strong>, your trusted grocer
              and one stop destination for quality products. By accessing or
              using our digital catalogue and placing an order via WhatsApp, you
              agree to comply with the following Terms & Conditions governed
              under Indian law.
            </p>
            <p className="mt-2">
              This digital catalogue is provided for informational and enquiry
              purposes only. We display our available grocery products,
              approximate prices, and delivery options. We are not an e-commerce
              platform and do not process automated online transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. User Account
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                An account with a valid mobile number and delivery address is
                required for precise estimation/quotation.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                login credentials.
              </li>
              <li>
                Please ensure that all personal details entered are accurate and
                updated regularly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Product Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We strive to ensure each and every product’s description;
                images, pricing, and availability are subjected to reference
                only.
              </li>
              <li>
                Product images are for reference only and may differ slightly
                from the actual product.
              </li>
              <li>
                Availability of items may change depending on stock levels.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Orders & Payments
            </h2>
            <p className="mb-4">
              Product prices, availability, and offers are subject to change
              without prior notice. All images in the catalogue are for
              reference; actual products may vary slightly in packaging or
              appearance.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Orders are only confirmed off-line (via WhatsApp or walk-in),
                after successful payment or valid COD confirmation.
              </li>
              <li>
                We do not use online payment gateways or automated checkout
                systems.
              </li>
              <li>No partial payments are accepted.</li>
              <li>
                Orders above ₹10,000 require a valid KYC (government-issued ID).
              </li>
              <li>
                Accepted payment modes: UPI, Cards, Net Banking, Wallets, and
                Cash on Delivery.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Delivery Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Free home delivery is available on orders of ₹1,000 or more.
              </li>
              <li>Delivery charges may apply to orders below ₹1,000.</li>
              <li>
                Please ensure someone is present to receive the order at the
                delivery address.
              </li>
              <li>
                Refusal to accept an order upon delivery will result in a 10%
                cancellation charge.
              </li>
              <li>
                Delivery timelines are indicative (estimation) and subject to
                location and stock availability.
              </li>
              <li>
                Delivery is only available within our specified serviceable
                area.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Cancellation Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders cannot be canceled once they are out for delivery.</li>
              <li>
                Cancellations before dispatch may be permitted on a case-by-case
                basis.
              </li>
              <li>
                Refunds for cancelled orders (if applicable) are processed as
                per our refund policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All content on our platforms—including text, product images, and
              store branding—belongs to <strong>MRV Grocery Store</strong> and
              cannot be reused without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Governing Law
            </h2>
            <p>
              These Terms are governed by the Consumer Protection Act, 2019, and
              other applicable laws of India. All legal matters shall fall under
              the jurisdiction of the courts in Arsikere, Hassan District,
              Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p>
              We may update these Terms at any time. Continued use of our
              service means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Limitations of Liability
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We are not responsible for delays caused by unforeseen
                circumstances (e.g., weather, strikes, supply shortages).
              </li>
              <li>
                Our liability is limited to the replacement of the product or
                refund of the amount paid.
              </li>
            </ul>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>Last Updated: December 28, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
