// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { whatsappService } from "@/lib/whatsappService";
import {
  Package,
  Truck,
  Store,
  MessageCircle,
  Phone,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Weight,
  Clock,
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
    email: "",
    address: {
      street: "",
      city: "",
      state: "Karnataka",
      pincode: "573103",
    },
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryFee = cart.isEligibleForFreeDelivery ? 0 : 50;
  const finalDeliveryFee = deliveryType === "pickup" ? 0 : deliveryFee;
  const totalAmount = cart.totalAmount + finalDeliveryFee;

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
    if (!customerInfo.name.trim()) return "Please enter your name";
    if (!customerInfo.phoneNumber.trim())
      return "Please enter your phone number";
    if (customerInfo.phoneNumber.length < 10)
      return "Please enter a valid phone number";

    if (deliveryType === "delivery") {
      if (!customerInfo.address.street.trim())
        return "Please enter your street address";
      if (!customerInfo.address.city.trim()) return "Please enter your city";
      if (!customerInfo.address.pincode.trim())
        return "Please enter your pincode";
    }

    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        orderId: `ORD${Date.now()}`,
        customerInfo: {
          name: customerInfo.name,
          phoneNumber: customerInfo.phoneNumber,
        },
        items: cart.items,
        totalAmount,
        totalWeight: cart.totalWeight,
        deliveryType,
        paymentMethod,
        deliveryAddress:
          deliveryType === "delivery" ? customerInfo.address : undefined,
        deliveryFee: finalDeliveryFee,
      };

      // Send order via WhatsApp
      whatsappService.sendOrderEnquiry(orderData);

      // Show success message
      dispatch(
        showSuccessNotification(
          "Order sent via WhatsApp! Please wait for confirmation."
        )
      );

      // Clear cart
      dispatch(clearCart());

      // Set order placed state
      setOrderPlaced(true);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some products to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-primary w-full"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Sent Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order has been sent via WhatsApp. Our team will contact you
            shortly for confirmation.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Check your WhatsApp for order details
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your order details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 text-sm">
                    We'll use this to contact you about your order
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Options
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose how you'd like to receive your order
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    deliveryType === "delivery"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setDeliveryType("delivery")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      checked={deliveryType === "delivery"}
                      onChange={() => setDeliveryType("delivery")}
                      className="text-primary-600"
                    />
                    <Truck className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">Home Delivery</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Get your order delivered to your doorstep
                    {!cart.isEligibleForFreeDelivery && (
                      <span className="block text-orange-600 font-medium">
                        Delivery fee: ₹{deliveryFee}
                      </span>
                    )}
                    {cart.isEligibleForFreeDelivery && (
                      <span className="block text-green-600 font-medium">
                        Free delivery available!
                      </span>
                    )}
                  </p>
                </div>

                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    deliveryType === "pickup"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setDeliveryType("pickup")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      checked={deliveryType === "pickup"}
                      onChange={() => setDeliveryType("pickup")}
                      className="text-primary-600"
                    />
                    <Store className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">Store Pickup</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8">
                    Pick up your order from our store
                    <span className="block text-green-600 font-medium">
                      No delivery charges
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      value={customerInfo.address.street}
                      onChange={(e) =>
                        handleInputChange("address.street", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your complete address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.city}
                        onChange={(e) =>
                          handleInputChange("address.city", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.state}
                        onChange={(e) =>
                          handleInputChange("address.state", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.pincode}
                        onChange={(e) =>
                          handleInputChange("address.pincode", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Pincode"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === "prepaid"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("prepaid")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "prepaid"}
                      onChange={() => setPaymentMethod("prepaid")}
                      className="text-primary-600"
                    />
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <span className="font-medium">
                      Online Payment (Prepaid)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 mt-1">
                    Pay securely using UPI, Cards, or Net Banking
                  </p>
                </div>

                {deliveryType === "pickup" && (
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "cash_on_pickup"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("cash_on_pickup")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === "cash_on_pickup"}
                        onChange={() => setPaymentMethod("cash_on_pickup")}
                        className="text-primary-600"
                      />
                      <Package className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Cash on Pickup</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8 mt-1">
                      Pay in cash when you pick up your order
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    Weight:
                  </span>
                  <span>{cart.totalWeight.toFixed(2)}kg</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span
                    className={
                      finalDeliveryFee === 0
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {finalDeliveryFee === 0 ? "FREE" : `₹${finalDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-3 text-gray-900">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              {deliveryType === "delivery" &&
                !cart.isEligibleForFreeDelivery && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for
                        free delivery!
                      </p>
                    </div>
                  </div>
                )}

              {/* Place Order Button */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Place Order via WhatsApp</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Your order will be sent via WhatsApp for confirmation. Our
                    team will contact you shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
