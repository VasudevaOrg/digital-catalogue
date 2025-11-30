// src/components/ui/TermsAndPoliciesModal.tsx
"use client";

import { useState } from "react";
import { X, FileText, ShieldCheck, AlertCircle } from "lucide-react";

interface TermsAndPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  stage: "cart" | "checkout";
}

export function TermsAndPoliciesModal({
  isOpen,
  onClose,
  onAccept,
  stage,
}: TermsAndPoliciesModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [refundPolicyAccepted, setRefundPolicyAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAccept = () => {
    if (!termsAccepted || !refundPolicyAccepted) {
      setShowError(true);
      return;
    }
    onAccept();
  };

  const handleClose = () => {
    setTermsAccepted(false);
    setRefundPolicyAccepted(false);
    setShowError(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Terms & Policies</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Please read and accept to continue
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Error Message */}
              {showError && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1">
                        Action Required
                      </h4>
                      <p className="text-red-700 text-sm">
                        You must accept both the Terms and Conditions and the
                        Return & Refund Policy to proceed with your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Terms and Conditions
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      1. Order Acceptance
                    </h4>
                    <p>
                      All orders placed through our Digital Catalogue are
                      subject to acceptance and availability. We reserve the
                      right to refuse or cancel any order at our discretion.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2. Product Information
                    </h4>
                    <p>
                      We strive to provide accurate product descriptions,
                      images, and pricing. However, we do not warrant that
                      product descriptions or other content is error-free. If a
                      product is not as described, your sole remedy is to return
                      it in accordance with our Return & Refund Policy.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3. Pricing and Payment
                    </h4>
                    <p>
                      • All prices are in Indian Rupees (INR) and include
                      applicable taxes unless stated otherwise.
                    </p>
                    <p>
                      • We accept multiple payment methods including prepaid
                      (online) and cash on pickup/delivery.
                    </p>
                    <p>
                      • For prepaid orders, payment must be completed before
                      order processing.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      4. Delivery
                    </h4>
                    <p>
                      • Free delivery is available on eligible orders above
                      ₹1,000 (excluding DELTA products: sugar, oils, jaggery).
                    </p>
                    <p>
                      • Delivery times are estimates and may vary based on
                      location and product availability.
                    </p>
                    <p>
                      • Home delivery is available within our service area.
                      Store pickup is available at our location.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      5. Product Quality
                    </h4>
                    <p>
                      We guarantee the quality of our products. All items are
                      fresh, hand-picked, and quality assured. If you receive a
                      defective or damaged product, please contact us
                      immediately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      6. Customer Responsibilities
                    </h4>
                    <p>
                      • Provide accurate delivery information and contact
                      details.
                    </p>
                    <p>
                      • Be available to receive orders during estimated delivery
                      time.
                    </p>
                    <p>
                      • Inspect products upon delivery and report any issues
                      immediately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      7. Privacy and Data Protection
                    </h4>
                    <p>
                      Your personal information will be used solely for order
                      processing and will not be shared with third parties
                      without your consent, except as required by law.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      8. Limitation of Liability
                    </h4>
                    <p>
                      Digital Catalogue shall not be liable for any indirect,
                      incidental, or consequential damages arising from the use
                      of our products or services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Return and Refund Policy */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Return & Refund Policy
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      1. Return Eligibility
                    </h4>
                    <p>
                      • Products must be unused, in original packaging, and in
                      the same condition as received.
                    </p>
                    <p>
                      • Returns must be initiated within 24 hours of delivery
                      for perishable items.
                    </p>
                    <p>
                      • Non-perishable items can be returned within 7 days of
                      delivery.
                    </p>
                    <p>
                      • Fresh produce, dairy products, and other perishables may
                      have different return windows.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2. Non-Returnable Items
                    </h4>
                    <p>The following items cannot be returned:</p>
                    <p>• Fresh fruits and vegetables (unless defective)</p>
                    <p>• Opened or used products</p>
                    <p>• Products without original packaging</p>
                    <p>• Customized or special orders</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3. Return Process
                    </h4>
                    <p>To initiate a return:</p>
                    <p>
                      • Contact us via WhatsApp (+91 9164912323) or phone
                      within the return window.
                    </p>
                    <p>• Provide your Order ID and reason for return.</p>
                    <p>• Our team will guide you through the return process.</p>
                    <p>
                      • For home delivery orders, we will arrange pickup at no
                      additional cost.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      4. Refund Policy
                    </h4>
                    <p>
                      • Refunds will be processed within 5-7 business days after
                      return approval.
                    </p>
                    <p>
                      • For prepaid orders, refunds will be credited to the
                      original payment method.
                    </p>
                    <p>
                      • For cash on delivery/pickup orders, refunds will be
                      provided via bank transfer or store credit.
                    </p>
                    <p>
                      • Delivery charges are non-refundable unless the return is
                      due to a defective or wrong product.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      5. Defective or Wrong Products
                    </h4>
                    <p>If you receive a defective or incorrect product:</p>
                    <p>• Contact us immediately (preferably with photos).</p>
                    <p>
                      • We will arrange for replacement or full refund including
                      delivery charges.
                    </p>
                    <p>
                      • No questions asked - customer satisfaction is our
                      priority.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      6. Order Cancellation
                    </h4>
                    <p>
                      • Orders can be cancelled within 30 minutes of placement
                      without any charges.
                    </p>
                    <p>
                      • After 30 minutes, cancellation may be subject to
                      processing fees.
                    </p>
                    <p>
                      • Once an order is out for delivery, it cannot be
                      cancelled.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      7. Quality Guarantee
                    </h4>
                    <p>
                      We stand behind the quality of our products. If you're not
                      satisfied with your purchase for any reason related to
                      quality, please contact us and we'll make it right.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      8. Contact Information
                    </h4>
                    <p>For returns, refunds, or any questions:</p>
                    <p>• Phone: +91 91649 12323</p>
                    <p>• WhatsApp: +91 91649 12323</p>
                    <p>• Email: support@digitalcatalogue.com</p>
                    <p>• Store Address: SHOP No. 11, APMC Yard, Karnataka 573103</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="space-y-4">
                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        setShowError(false);
                      }}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      I have read and agree to the{" "}
                      <span className="font-semibold text-blue-600">
                        Terms and Conditions
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={refundPolicyAccepted}
                      onChange={(e) => {
                        setRefundPolicyAccepted(e.target.checked);
                        setShowError(false);
                      }}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                      I have read and agree to the{" "}
                      <span className="font-semibold text-green-600">
                        Return & Refund Policy
                      </span>
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!termsAccepted || !refundPolicyAccepted}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      termsAccepted && refundPolicyAccepted
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {stage === "cart"
                      ? "Accept & Proceed to Checkout"
                      : "Accept & Place Order"}
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center">
                  By accepting, you confirm that you have read, understood, and
                  agree to be bound by these terms and policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
