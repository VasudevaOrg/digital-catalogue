// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { openWhatsAppOrder, whatsappTestService } from "@/lib/whatsappTest";
import { Package, Truck, Store, MessageCircle, Phone } from "lucide-react";

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

  const handlePlaceOrder = () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.phoneNumber) {
      alert("Please fill in your name and phone number");
      return;
    }

    if (
      deliveryType === "delivery" &&
      (!customerInfo.address.street || !customerInfo.address.city)
    ) {
      alert("Please fill in your delivery address");
      return;
    }

    // Prepare order data
    const orderData = {
      orderId: `ORD${Date.now()}`,
      customerInfo,
      items: cart.items,
      totalAmount,
      totalWeight: cart.totalWeight,
      deliveryType,
      paymentMethod,
      deliveryAddress:
        deliveryType === "delivery" ? customerInfo.address : null,
      deliveryFee: finalDeliveryFee,
    };

    // Open WhatsApp with order details
    openWhatsAppOrder(orderData);

    // Clear cart after placing order
    dispatch(clearCart());

    // Show success message
    alert(
      "Order sent via WhatsApp! Please wait for confirmation from our team."
    );

    // Redirect to home
    router.push("/");
  };

  const handleTestWhatsApp = () => {
    const orderData = {
      orderId: `TEST${Date.now()}`,
      customerInfo,
      items: cart.items,
      totalAmount,
      totalWeight: cart.totalWeight,
      deliveryType,
      paymentMethod,
      deliveryAddress:
        deliveryType === "delivery" ? customerInfo.address : null,
      deliveryFee: finalDeliveryFee,
    };

    // Test WhatsApp integration
    whatsappTestService.testWhatsAppIntegration(orderData);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center bg-gray-50 border-2 border-gray-300 p-8">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-700 mb-6">
              Add some products to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium border-2 border-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-300 pb-4">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="border-2 border-gray-300 p-6 bg-gray-50">
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
                    className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900"
                    required
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
                    className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="border-2 border-gray-300 p-6 bg-gray-50">
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
                  />
                  <label
                    htmlFor="delivery"
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Home Delivery</span>
                    {!cart.isEligibleForFreeDelivery && (
                      <span className="text-sm text-gray-600">
                        (₹{deliveryFee} delivery fee)
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
            </div>

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <div className="border-2 border-gray-300 p-6 bg-gray-50">
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
                      className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900"
                      required
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
                        className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900"
                        required
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
                        className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="border-2 border-gray-300 p-6 bg-gray-50">
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border-2 border-gray-300 p-6 bg-gray-50">
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
                        ₹{item.product.price} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 border-t-2 border-gray-300 pt-4 bg-white p-3 border-2">
                <div className="flex justify-between text-gray-800">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Weight:</span>
                  <span>{cart.totalWeight.toFixed(2)}kg</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Delivery Fee:</span>
                  <span
                    className={
                      finalDeliveryFee === 0
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                    }
                  >
                    {finalDeliveryFee === 0 ? "FREE" : `₹${finalDeliveryFee}`}
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
                  </div>
                )}
            </div>

            {/* Place Order Button */}
            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 font-semibold flex items-center justify-center space-x-2 border-2 border-green-700"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Place Order via WhatsApp</span>
              </button>

              <button
                onClick={handleTestWhatsApp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 font-medium flex items-center justify-center space-x-2 border-2 border-blue-700"
              >
                <Phone className="w-4 h-4" />
                <span>Test WhatsApp Integration</span>
              </button>

              <p className="text-xs text-gray-700 text-center bg-gray-100 p-2 border border-gray-300">
                Your order will be sent via WhatsApp for confirmation. Our team
                will contact you shortly to finalize the order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
