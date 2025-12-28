import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MRV Grocery Store",
  description:
    "Privacy policy regarding data collection and usage at MRV Grocery Store.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Personal Details:</strong> Name, contact number, and
                delivery address (shared by you during order placement).
              </li>
              <li>
                <strong>Order Data:</strong> Order history and preferences.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To confirm and deliver your orders.</li>
              <li>
                To communicate offers, updates, and service improvements (only
                if you have opted in).
              </li>
              <li>For internal record-keeping.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Sharing
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not sell, rent, or trade your personal data.</li>
              <li>
                Your data may be shared with delivery staff strictly for
                fulfilling your order.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We take reasonable measures to protect your information from
                unauthorized access or disclosure.
              </li>
              <li>
                WhatsApp communications are subject to WhatsApp’s privacy
                policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Your Rights
            </h2>
            <p>
              You can request correction or deletion of your personal data by
              contacting us at +91 94481 32930.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Policy Changes
            </h2>
            <p>
              We may update this Privacy Policy. The latest version will always
              be available upon request.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>Last Updated: December 28, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}
