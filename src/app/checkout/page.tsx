// src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/store/slices/uiSlice";
import {
  Package,
  Truck,
  Store,
  MessageCircle,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "prepaid" | "cash_on_pickup"
  >("prepaid");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "Karnataka",
      pincode: "573103",
    },
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [whatsappResult, setWhatsappResult] = useState<any>(null);

  // Check if delivery is available based on pincode
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [deliveryRadius] = useState(10); // Default radius in km (editable by shop owner in backend)

  useEffect(() => {
    // Check delivery availability based on pincode
    const customerPincode = customerInfo.address.pincode;
    const shopPincode = "573103";

    // Simple check - in real implementation, this would be more sophisticated
    const isAvailable = customerPincode.startsWith("573");
    setIsDeliveryAvailable(isAvailable);
  }, [customerInfo.address.pincode]);

  // Calculate delivery fee based on requirements
  const calculateDeliveryFee = () => {
    if (deliveryType === "pickup") return 0;

    // Check if eligible for free delivery
    if (cart.isEligibleForFreeDelivery && isDeliveryAvailable) return 0;

    // Regular delivery fee if not eligible
    return isDeliveryAvailable ? 50 : 0;
  };

  const deliveryFee = calculateDeliveryFee();
  const totalAmount = cart.totalAmount + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setCustomerInfo((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setCustomerInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      dispatch(showErrorNotification("Please enter your name"));
      return false;
    }

    if (!customerInfo.phoneNumber.trim()) {
      dispatch(showErrorNotification("Please enter your phone number"));
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = customerInfo.phoneNumber.replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      dispatch(
        showErrorNotification("Please enter a valid 10-digit phone number")
      );
      return false;
    }

    if (deliveryType === "delivery") {
      if (!isDeliveryAvailable) {
        dispatch(
          showErrorNotification(
            "Delivery is not available for your pincode. Please choose store pickup."
          )
        );
        return false;
      }

      if (!customerInfo.address.street.trim()) {
        dispatch(showErrorNotification("Please enter your street address"));
        return false;
      }

      if (!customerInfo.address.city.trim()) {
        dispatch(showErrorNotification("Please enter your city"));
        return false;
      }
    }

    return true;
  };

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `ORD${timestamp}${random}`;
  };

  const generateWhatsAppMessage = (orderData: any) => {
    const {
      orderId,
      customerInfo,
      items,
      totalAmount,
      totalWeight,
      deliveryType,
      deliveryAddress,
      deliveryFee,
    } = orderData;

    let message = `🛒 *ORDER CONFIRMATION REQUIRED*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Customer Details
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `Name: ${customerInfo.name}\n`;
    message += `Phone: +91${customerInfo.phoneNumber}\n\n`;

    // Order Details
    message += `📋 *ORDER DETAILS*\n`;
    message += `Order ID: ${orderId}\n`;
    message += `Date: ${new Date().toLocaleDateString("en-IN")}\n`;
    message += `Time: ${new Date().toLocaleTimeString("en-IN")}\n\n`;

    // Items List
    message += `🛍️ *ITEMS ORDERED*\n`;
    items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Price: ₹${item.product.price} x ${item.quantity}\n`;
      message += `   Weight: ${(item.product.weight * item.quantity).toFixed(
        2
      )}kg\n`;
      message += `   Subtotal: ₹${(item.product.price * item.quantity).toFixed(
        2
      )}\n\n`;
    });

    // Order Summary
    message += `💰 *ORDER SUMMARY*\n`;
    message += `Items Total: ₹${(totalAmount - deliveryFee).toFixed(2)}\n`;
    message += `Total Weight: ${totalWeight.toFixed(2)}kg\n`;
    message += `Delivery Fee: ${
      deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`
    }\n`;
    message += `*TOTAL AMOUNT: ₹${totalAmount.toFixed(2)}*\n\n`;

    // Delivery Information
    message += `🚚 *DELIVERY INFORMATION*\n`;
    message += `Type: ${
      deliveryType === "delivery" ? "Home Delivery" : "Store Pickup"
    }\n`;

    if (deliveryAddress) {
      message += `Address: ${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}\n`;
    }

    message += `Payment: ${
      orderData.paymentMethod === "prepaid"
        ? "Prepaid (Online)"
        : "Cash on Pickup"
    }\n\n`;

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔔 *NEXT STEPS*\n`;
    message += `We will contact you within 10-15 minutes to:\n`;
    message += `• Confirm your order details\n`;
    message += `• Process payment (if prepaid)\n`;
    message += `• Provide delivery/pickup timeline\n\n`;

    message += `📞 For immediate assistance, call: +91 98765 43210\n\n`;
    message += `Thank you for choosing Digital Catalogue! 🙏`;

    return message;
  };

  const sendWhatsAppMessage = async (phoneNumber: string, orderData: any) => {
    try {
      console.log("📱 Sending WhatsApp message to:", phoneNumber);

      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: "", // Will be generated by the API
          messageType: "order_enquiry",
          orderData: orderData, // Pass the full order data
        }),
      });

      const data = await response.json();

      console.log("📨 WhatsApp API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send WhatsApp message");
      }

      return data;
    } catch (error) {
      console.error("❌ WhatsApp API error:", error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      // Prepare order data
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customerInfo: {
          ...customerInfo,
          phoneNumber: customerInfo.phoneNumber
            .replace(/\D/g, "")
            .replace(/^91/, ""), // Clean phone number
        },
        items: cart.items,
        totalAmount,
        totalWeight: cart.totalWeight,
        deliveryType,
        paymentMethod,
        deliveryAddress:
          deliveryType === "delivery" ? customerInfo.address : null,
        deliveryFee,
        isEligibleForFreeDelivery: cart.isEligibleForFreeDelivery,
        orderDate: new Date().toISOString(),
        status: "pending",
      };

      console.log("📦 Order Data:", orderData);

      // Send WhatsApp message using template approach
      const messageResult = await sendWhatsAppMessage(
        orderData.customerInfo.phoneNumber,
        orderData
      );

      console.log("✅ WhatsApp message result:", messageResult);
      setWhatsappResult(messageResult);

      if (messageResult.success) {
        // Clear cart and show success
        dispatch(clearCart());
        setOrderSuccess(true);

        dispatch(
          showSuccessNotification(
            `Order placed successfully! WhatsApp confirmation sent to +91${orderData.customerInfo.phoneNumber}. Check your WhatsApp for details.`
          )
        );

        // Save order to backend (optional - you can implement this API endpoint)
        try {
          await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });
        } catch (error) {
          console.log("Order save failed (backend not implemented):", error);
        }

        // Redirect to home after 5 seconds
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        throw new Error(
          messageResult.error || "Failed to send WhatsApp message"
        );
      }
    } catch (error: any) {
      console.error("❌ Order placement error:", error);

      let errorMessage = "Failed to place order. Please try again.";

      // Handle specific WhatsApp API errors
      if (
        error.message.includes("131047") ||
        error.message.includes("re-engagement")
      ) {
        errorMessage =
          "WhatsApp message requires user initiation. Please message us first on WhatsApp at +1 (555) 623-3859, then try placing your order again.";
      } else if (
        error.message.includes("131000") ||
        error.message.includes("test list")
      ) {
        errorMessage =
          "Phone number not in test list. Please contact support or try a different number.";
      } else if (
        error.message.includes("190") ||
        error.message.includes("token")
      ) {
        errorMessage =
          "WhatsApp service temporarily unavailable. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(showErrorNotification(errorMessage));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center bg-white border-2 border-gray-300 p-8 max-w-md mx-auto">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-700 mb-6">
              Add some products to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium border-2 border-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border-2 border-green-300 p-8 max-w-lg mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-700 mb-4">
            Your order has been processed and WhatsApp confirmation has been
            sent.
          </p>

          <div className="bg-green-50 border border-green-200 p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-900 mb-2">
              📱 WhatsApp Message Sent
            </h3>
            <p className="text-sm text-green-800 mb-2">
              Order confirmation sent to:{" "}
              <strong>+91{customerInfo.phoneNumber}</strong>
            </p>
            {whatsappResult?.messageId && (
              <p className="text-xs text-green-700">
                Message ID: {whatsappResult.messageId}
              </p>
            )}
            <p className="text-xs text-green-700 mt-2">
              Please check your WhatsApp for complete order details and next
              steps.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">
              📞 What's Next?
            </h3>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Check your WhatsApp for order confirmation</li>
              <li>We'll contact you within 10-15 minutes</li>
              <li>Confirm your order details with us</li>
              <li>Process payment (if prepaid)</li>
              <li>Get delivery/pickup timeline</li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 font-medium border-2 border-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
            <p className="text-xs text-gray-500">
              Redirecting to home page in 5 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-300 pb-4">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="border-2 border-gray-300 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-400 pb-2">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500 outline-none"
                    required
                    disabled={isPlacingOrder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500 outline-none"
                    required
                    disabled={isPlacingOrder}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Order confirmation will be sent to this WhatsApp number
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="border-2 border-gray-300 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-400 pb-2">
                Delivery Options
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="delivery"
                    checked={deliveryType === "delivery"}
                    onChange={() => setDeliveryType("delivery")}
                    className="w-4 h-4"
                    disabled={!isDeliveryAvailable || isPlacingOrder}
                  />
                  <label
                    htmlFor="delivery"
                    className={`flex items-center space-x-2 ${
                      isDeliveryAvailable ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Home Delivery</span>
                    {deliveryFee > 0 && (
                      <span className="text-sm text-gray-600">
                        (₹{deliveryFee} delivery fee)
                      </span>
                    )}
                    {!isDeliveryAvailable && (
                      <span className="text-sm text-red-600">
                        (Not available for your area)
                      </span>
                    )}
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="pickup"
                    checked={deliveryType === "pickup"}
                    onChange={() => setDeliveryType("pickup")}
                    className="w-4 h-4"
                    disabled={isPlacingOrder}
                  />
                  <label
                    htmlFor="pickup"
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <Store className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Store Pickup (Free)</span>
                  </label>
                </div>
              </div>

              {!isDeliveryAvailable && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Delivery is currently available only within {deliveryRadius}km
                  radius of pincode 573103.
                </div>
              )}
            </div>

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <div className="border-2 border-gray-300 p-6 bg-white">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-400 pb-2">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address.street}
                      onChange={(e) =>
                        handleInputChange("address.street", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500 outline-none"
                      required
                      disabled={isPlacingOrder}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.city}
                        onChange={(e) =>
                          handleInputChange("address.city", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500 outline-none"
                        required
                        disabled={isPlacingOrder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.pincode}
                        onChange={(e) =>
                          handleInputChange("address.pincode", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900 focus:border-blue-500 outline-none"
                        required
                        disabled={isPlacingOrder}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="border-2 border-gray-300 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-400 pb-2">
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="prepaid"
                    checked={paymentMethod === "prepaid"}
                    onChange={() => setPaymentMethod("prepaid")}
                    className="w-4 h-4"
                    disabled={isPlacingOrder}
                  />
                  <label
                    htmlFor="prepaid"
                    className="text-gray-800 font-medium"
                  >
                    Prepaid (Online Payment)
                  </label>
                </div>
                {deliveryType === "pickup" && (
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cash_on_pickup"
                      checked={paymentMethod === "cash_on_pickup"}
                      onChange={() => setPaymentMethod("cash_on_pickup")}
                      className="w-4 h-4"
                      disabled={isPlacingOrder}
                    />
                    <label
                      htmlFor="cash_on_pickup"
                      className="text-gray-800 font-medium"
                    >
                      Cash on Pickup
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                <strong>Note:</strong> Both delivery and pickup orders require
                prepaid payment, except for store pickup which allows cash
                payment.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border-2 border-gray-300 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-400 pb-2">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center py-2 border-b border-gray-300"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-700">
                        ₹{item.product.price} x {item.quantity} •{" "}
                        {item.product.weight * item.quantity}kg
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 border-t-2 border-gray-300 pt-4 bg-gray-50 p-3 border-2">
                <div className="flex justify-between text-gray-800">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Total Weight:</span>
                  <span>{cart.totalWeight.toFixed(2)}kg</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Delivery Fee:</span>
                  <span
                    className={
                      deliveryFee === 0
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                    }
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-400 pt-2 text-gray-900">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Delivery Notice */}
              {deliveryType === "delivery" &&
                !cart.isEligibleForFreeDelivery && (
                  <div className="mt-4 p-3 bg-amber-100 border-2 border-amber-400 text-sm text-amber-800">
                    Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for free
                    delivery!
                    <br />
                    <span className="text-xs">
                      *Excludes sugar, oils, and jaggery items
                    </span>
                  </div>
                )}
            </div>

            {/* Place Order Button */}
            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className={`w-full py-4 px-6 font-semibold flex items-center justify-center space-x-2 border-2 transition-colors ${
                  isPlacingOrder
                    ? "bg-gray-400 border-gray-500 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white border-green-700"
                }`}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Place Order via WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-700 text-center bg-gray-100 p-3 border border-gray-300">
                Your order confirmation will be sent directly to your WhatsApp
                number. Our team will contact you within 10-15 minutes to
                finalize the order and process payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
