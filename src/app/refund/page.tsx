import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | MRV Grocery Store",
  description:
    "Details on returns, exchanges, and refunds at MRV Grocery Store.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 border-b pb-4">
          Return & Refund Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          {/* -- RETURN & EXCHANGE POLICY -- */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-6">
              Return & Exchange Policy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Return Eligibility (Dry Goods Only)
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Returns are accepted only at our physical store under the
                    following conditions:
                  </li>
                  <li>
                    The item is unopened, unused, and in original packaging.
                  </li>
                  <li>Return is initiated within 2 hours of delivery.</li>
                  <li>
                    Customer must present a valid invoice or order confirmation.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Required Proof
                </h3>
                <p className="mb-2">
                  Video proof during unboxing or opening is required for any
                  claim of:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Damage</li>
                  <li>Wrong item</li>
                  <li>Expired or defective product</li>
                </ul>
                <p className="mt-2 font-medium">
                  Without such evidence, returns may not be accepted.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Return Process
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Contact us via Phone, Email, or WhatsApp within 24 hours of
                    delivery.
                  </li>
                  <li>
                    Returns shall be dropped at the store only within 7 days of
                    return approval.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Items Not Eligible for Return
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Opened or tampered products</li>
                  <li>Items returned without proof</li>
                  <li>
                    Items purchased during clearance or promotional sales are
                    final, and no returns are accepted.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* -- REFUND POLICY -- */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-6">
              Refund Policy
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Eligibility for Refund
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Delivered item is damaged, expired, or incorrect.</li>
                  <li>Product is out of stock after order placement.</li>
                  <li>Order is canceled before dispatch.</li>
                  <li>Payment was processed but order failed.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Refund Method & Timeline
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Refunds are issued within 5–7 business days to the original
                    payment method.
                  </li>
                  <li>
                    For COD orders, refunds will be processed via bank transfer
                    or store wallet credit.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Non-Refundable Situations
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>No refund for opened items unless verified defective.</li>
                  <li>
                    No refund for cancellations at time of delivery (10% penalty
                    applies).
                  </li>
                  <li>
                    No refund will be issued without required proof or after the
                    return window closes.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Partial Refunds
                </h3>
                <p>
                  For orders with multiple items, only the returned item(s) will
                  be refunded if approved.
                </p>
              </div>
            </div>
          </section>

          {/* -- ADDITIONAL INFO -- */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Customer Support
            </h3>
            <p className="mb-4">
              For any issues related to orders, returns, or refunds:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>Phone/WhatsApp:</strong> +91 94481 32930
              </li>
              <li>
                <strong>Email:</strong> mrvstoresvps@gmail.com
              </li>
              <li>
                <strong>Store Hours:</strong> Mon-Sat 9AM-8PM, Sun 10AM-6PM
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Legal Compliance & Safety Notes
            </h3>
            <p className="mb-2">In accordance with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consumer Protection (E-Commerce) Rules, 2020</li>
              <li>
                Food Safety and Standards Authority of India (FSSAI) regulations
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 p-6 rounded-xl border border-amber-200">
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              Legal Clause for Non-Returnable Grocery Items
            </h3>
            <p className="text-amber-800">
              Certain dry goods such as pulses, flours, rice, and packaged
              staples are non-returnable once delivered, unless found expired,
              damaged, or incorrect. To process such a claim, customers must
              provide clear unboxing video proof recorded before the product is
              opened or consumed.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
