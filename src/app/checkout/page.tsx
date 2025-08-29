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
import { CheckoutPageSkeleton } from "@/components/ui/SkeletonLoader";
import {
  Package,
  Truck,
  Store,
  MessageCircle,
  Phone,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  Clock,
  CreditCard,
  MapPin,
  User,
  Shield,
  Star,
  Calendar,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const [isClient, setIsClient] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
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

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Check delivery availability based on pincode
      const customerPincode = customerInfo.address.pincode;
      const shopPincode = "573103";

      // Simple check - in real implementation, this would be more sophisticated
      const isAvailable = customerPincode.startsWith("573");
      setIsDeliveryAvailable(isAvailable);
    }
  }, [customerInfo.address.pincode, isClient]);

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
      // 1. Prepare order data with validation
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        customerInfo: {
          ...customerInfo,
          phoneNumber: customerInfo.phoneNumber
            .replace(/\D/g, "")
            .replace(/^91/, ""), // Clean phone number
        },
        items: cart.items.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description || "",
            price: item.product.price,
            weight: item.product.weight,
            category: item.product.category,
            images: item.product.images || [],
          },
          quantity: item.quantity,
        })),
        totalAmount,
        totalWeight: cart.totalWeight,
        deliveryType,
        paymentMethod,
        deliveryAddress:
          deliveryType === "delivery" ? customerInfo.address : null,
        deliveryFee,
        isEligibleForFreeDelivery: cart.isEligibleForFreeDelivery,
        orderDate: new Date().toISOString(),
        orderNotes: `Order placed via Digital Catalogue website. ${
          deliveryType === "delivery" ? "Home delivery" : "Store pickup"
        } requested.`,
      };

      console.log("📦 Creating order with data:", orderData);

      // 2. Save order to database with timeout
      const orderController = new AbortController();
      const orderTimeout = setTimeout(() => orderController.abort(), 30000); // 30 seconds

      let orderResult;
      try {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
          signal: orderController.signal,
        });

        clearTimeout(orderTimeout);
        orderResult = await orderResponse.json();

        if (!orderResponse.ok || !orderResult.success) {
          throw new Error(
            orderResult.message || "Failed to create order in database"
          );
        }

        console.log("✅ Order saved to database:", orderResult.order.orderId);
      } catch (error) {
        clearTimeout(orderTimeout);
        if (error.name === "AbortError") {
          throw new Error("Order creation timed out. Please try again.");
        }
        throw error;
      }

      const savedOrder = orderResult.order;

      // 3. Send WhatsApp message with timeout and retry
      console.log("📱 Sending WhatsApp notification...");

      const whatsappController = new AbortController();
      const whatsappTimeout = setTimeout(
        () => whatsappController.abort(),
        20000
      ); // 20 seconds

      let whatsappResult;
      try {
        const whatsappResponse = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: orderData.customerInfo.phoneNumber,
            message: "", // Will be generated by the API
            messageType: "order_enquiry",
            orderData: {
              ...orderData,
              orderId: savedOrder.orderId,
              invoiceNumber: savedOrder.invoiceNumber,
            },
          }),
          signal: whatsappController.signal,
        });

        clearTimeout(whatsappTimeout);
        whatsappResult = await whatsappResponse.json();

        console.log("📨 WhatsApp result:", whatsappResult);
      } catch (error) {
        clearTimeout(whatsappTimeout);
        console.warn("⚠️ WhatsApp notification failed:", error);

        // Don't fail the entire order if WhatsApp fails
        whatsappResult = {
          success: false,
          error:
            error.name === "AbortError"
              ? "WhatsApp notification timed out"
              : "WhatsApp notification failed",
        };
      }

      // 4. Handle success regardless of WhatsApp status
      setWhatsappResult(whatsappResult);

      // Clear cart and show success
      dispatch(clearCart());
      setOrderSuccess(true);

      const successMessage = whatsappResult.success
        ? `Order placed successfully! 

Order Details:
• Order ID: ${savedOrder.orderId}
• Invoice: ${savedOrder.invoiceNumber}
• WhatsApp confirmation sent to +91${orderData.customerInfo.phoneNumber}

Please check your WhatsApp for complete order details and next steps.`
        : `Order placed successfully! 

Order Details:
• Order ID: ${savedOrder.orderId}
• Invoice: ${savedOrder.invoiceNumber}

WhatsApp notification: ${whatsappResult.error || "Failed to send"}

Please call us at +91 82971 37702 for order confirmation.`;

      dispatch(showSuccessNotification(successMessage));

      // Redirect to home after 6 seconds
      setTimeout(() => {
        router.push("/");
      }, 6000);
    } catch (error: any) {
      console.error("❌ Order placement error:", error);

      let errorMessage = "Failed to place order. Please try again.";

      // Handle specific errors
      if (
        error.message.includes("timeout") ||
        error.message.includes("timed out")
      ) {
        errorMessage =
          "Request timed out. Your order may have been placed. Please check with customer support.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (
        error.message.includes("database") ||
        error.message.includes("create order")
      ) {
        errorMessage =
          "Unable to save order. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(showErrorNotification(errorMessage));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Show skeleton loading while initializing
  if (!isClient || isPageLoading) {
    return <CheckoutPageSkeleton />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some products to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Your order has been processed and WhatsApp confirmation sent.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="border-b p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Confirmed
              </h3>
              <p className="text-gray-600">Ready for processing</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{totalAmount}
                </span>
                <span className="text-gray-600 ml-2">
                  {cart.items.length} items
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* WhatsApp Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">
                      WhatsApp Confirmation Sent
                    </h4>
                    <p className="text-green-800 text-sm mt-1">
                      Sent to:{" "}
                      <span className="font-mono">
                        +91{customerInfo.phoneNumber}
                      </span>
                    </p>
                    {whatsappResult?.messageId && (
                      <p className="text-green-700 text-xs mt-1">
                        Message ID:{" "}
                        <span className="font-mono">
                          {whatsappResult.messageId}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">
                      What Happens Next?
                    </h4>
                    <ul className="text-blue-800 text-sm mt-2 space-y-1">
                      <li>• Check your WhatsApp for order confirmation</li>
                      <li>• Our team will contact you within 10-15 minutes</li>
                      <li>• We'll process payment if prepaid</li>
                      <li>• Order preparation begins immediately</li>
                      <li>
                        •{" "}
                        {deliveryType === "delivery"
                          ? "Delivery in 2-4 hours"
                          : "Ready for pickup in 1-2 hours"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Order Summary
                </h4>

                <div className="space-y-2 mb-4">
                  {cart.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-800">
                          {item.product.name}
                        </span>
                        <span className="text-gray-500 ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="text-gray-800">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div className="text-sm text-gray-500 text-center py-1">
                      ... and {cart.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{(totalAmount - deliveryFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>

            <p className="text-sm text-gray-500">
              Redirecting to home page in 6 seconds...
            </p>

            {/* Contact Support */}
            <div className="pt-4 border-t">
              <p className="text-gray-600 mb-3">Need assistance?</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    window.open("https://wa.me/919876543210", "_blank")
                  }
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={() => window.open("tel:+919876543210", "_blank")}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order details</p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-sm text-blue-600">Cart</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <span className="ml-2 text-sm text-blue-600">Checkout</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm font-medium">3</span>
              </div>
              <span className="ml-2 text-sm text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                      disabled={isPlacingOrder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                      disabled={isPlacingOrder}
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      Order confirmation will be sent via WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Options
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      deliveryType === "delivery"
                        ? "border-blue-500 bg-blue-50"
                        : isDeliveryAvailable
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-200 opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      isDeliveryAvailable && setDeliveryType("delivery")
                    }
                  >
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        checked={deliveryType === "delivery"}
                        onChange={() => setDeliveryType("delivery")}
                        className="mr-3"
                        disabled={!isDeliveryAvailable || isPlacingOrder}
                      />
                      <Truck className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">Home Delivery</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>2-4 hours delivery</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        <span>
                          {deliveryFee > 0
                            ? `₹${deliveryFee} delivery fee`
                            : "FREE delivery"}
                        </span>
                      </div>
                    </div>
                    {!isDeliveryAvailable && (
                      <p className="text-red-600 text-sm mt-2">
                        Not available for your area
                      </p>
                    )}
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      deliveryType === "pickup"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setDeliveryType("pickup")}
                  >
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        checked={deliveryType === "pickup"}
                        onChange={() => setDeliveryType("pickup")}
                        className="mr-3"
                        disabled={isPlacingOrder}
                      />
                      <Store className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">Store Pickup</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Ready in 1-2 hours</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-green-600">Always FREE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!isDeliveryAvailable && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Delivery Information</p>
                        <p>
                          Home delivery is available only within{" "}
                          {deliveryRadius}km of pincode 573103.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.street}
                        onChange={(e) =>
                          handleInputChange("address.street", e.target.value)
                        }
                        placeholder="Enter your complete street address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                        disabled={isPlacingOrder}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.address.city}
                          onChange={(e) =>
                            handleInputChange("address.city", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          required
                          disabled={isPlacingOrder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.address.pincode}
                          onChange={(e) =>
                            handleInputChange("address.pincode", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                          required
                          disabled={isPlacingOrder}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === "prepaid"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("prepaid")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === "prepaid"}
                        onChange={() => setPaymentMethod("prepaid")}
                        className="mr-3"
                        disabled={isPlacingOrder}
                      />
                      <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">
                        Prepaid (Online Payment)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-10">
                      Pay online before delivery/pickup
                    </p>
                  </div>

                  {deliveryType === "pickup" && (
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === "cash_on_pickup"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod("cash_on_pickup")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={paymentMethod === "cash_on_pickup"}
                          onChange={() => setPaymentMethod("cash_on_pickup")}
                          className="mr-3"
                          disabled={isPlacingOrder}
                        />
                        <Package className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium">Cash on Pickup</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-10">
                        Pay when you collect your order
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex">
                    <Shield className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Payment Information</p>
                      <p>
                        {deliveryType === "delivery"
                          ? "Home delivery orders require prepaid payment for security."
                          : "Store pickup allows both prepaid and cash payment options."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Order Summary
                  </span>
                  <span className="text-sm text-gray-500">
                    {cart.items.length} items
                  </span>
                </h2>
              </div>

              <div className="p-6">
                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <div className="text-sm text-gray-500">
                          ₹{item.product.price} × {item.quantity} •{" "}
                          {(item.product.weight * item.quantity).toFixed(2)}kg
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">
                      ₹{cart.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Weight:</span>
                    <span className="text-gray-900">
                      {cart.totalWeight.toFixed(2)}kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery:</span>
                    <span
                      className={
                        deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                      }
                    >
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Delivery Notice */}
                {deliveryType === "delivery" &&
                  !cart.isEligibleForFreeDelivery && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 font-medium text-sm text-center">
                        Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for
                        FREE delivery!
                      </p>
                      <p className="text-amber-700 text-xs text-center mt-1">
                        *Excludes sugar, oils, and jaggery items
                      </p>
                    </div>
                  )}

                {/* Delivery Time */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {deliveryType === "delivery"
                          ? "Estimated Delivery"
                          : "Ready for Pickup"}
                      </p>
                      <p className="text-blue-700">
                        {deliveryType === "delivery"
                          ? "2-4 hours after confirmation"
                          : "1-2 hours after confirmation"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors ${
                  isPlacingOrder
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isPlacingOrder ? (
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

              {/* Order Info */}
              <div className="mt-4 bg-white rounded-lg border p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Instant WhatsApp Confirmation
                      </p>
                      <p className="text-gray-600">
                        Order sent directly to your WhatsApp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Personal Support
                      </p>
                      <p className="text-gray-600">
                        Our team will contact you within 10-15 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Secure & Safe</p>
                      <p className="text-gray-600">
                        Order securely processed and saved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
