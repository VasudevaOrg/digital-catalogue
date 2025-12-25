// src/app/track-order/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  User,
  Weight,
  ArrowLeft,
  MessageCircle,
  Star,
  Copy,
  Check,
} from "lucide-react";

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    weight: number;
    category: string;
    images?: string[];
  };
  quantity: number;
  price: number;
  totalPrice: number;
  weight: number;
  totalWeight: number;
}

interface OrderData {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerInfo: {
    name: string;
    phoneNumber: string;
    email?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  totalWeight: number;
  deliveryFee: number;
  subtotal: number;
  deliveryType: "delivery" | "pickup";
  paymentMethod: "prepaid" | "cash_on_pickup";
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isEligibleForFreeDelivery: boolean;
  orderNotes?: string;
  estimatedDeliveryDate?: string;
  whatsappMessageId?: string;
  whatsappStatus?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Check URL parameters for order ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrderId = urlParams.get("id");
    if (urlOrderId) {
      setOrderId(urlOrderId.toUpperCase());
      // Auto-search if order ID is provided in URL
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) {
          form.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
          );
        }
      }, 100);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Order not found. Please check your Order ID and try again."
          );
        }
        throw new Error("Failed to fetch order details. Please try again.");
      }

      const data = await response.json();

      if (data.success && data.order) {
        setOrderData(data.order);
      } else {
        throw new Error(data.message || "Order not found");
      }
    } catch (error: any) {
      console.error("Error fetching order:", error);
      setError(error.message || "Failed to fetch order details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusMessage = (status: string, deliveryType: string) => {
    const messages = {
      confirmed:
        "Your order has been confirmed and is being processed by our team.",
      delivered:
        deliveryType === "pickup"
          ? "Your order has been completed. Thank you for shopping with us!"
          : "Your order has been delivered successfully. Thank you for shopping with us!",
      cancelled:
        "This order has been cancelled. Please contact us if you have any questions.",
    };
    return (
      messages[status as keyof typeof messages] || "Processing your order..."
    );
  };

  const copyOrderId = async () => {
    if (orderData) {
      try {
        await navigator.clipboard.writeText(orderData.orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Updated steps - only 2 steps now: Confirmed -> Delivered
  const steps = [
    { status: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    {
      status: "delivered",
      label:
        orderData?.deliveryType === "pickup" ? "Order Completed" : "Delivered",
      icon: orderData?.deliveryType === "pickup" ? Star : CheckCircle,
    },
  ];

  const getCurrentStepIndex = () => {
    if (!orderData) return 0;

    switch (orderData.orderStatus) {
      case "confirmed":
        return 0;
      case "delivered":
        return 1;
      case "cancelled":
        return 0; // Show as first step for cancelled orders
      default:
        return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                Track Your Order
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Enter your Order ID to get real-time updates
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="Enter your Order ID (e.g., ORD8857716373)"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-mono"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800">Order Not Found</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <div className="mt-3 text-sm text-red-700">
                    <p className="font-medium">Please check:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Your Order ID is correct (e.g., ORD8857716373)</li>
                      <li>The order was placed recently</li>
                      <li>You received a confirmation message</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Order Details */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order Details
                    </h2>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {copied ? "Copied!" : "Copy ID"}
                      </span>
                    </button>
                  </div>
                  <p className="text-gray-600 font-mono text-lg">
                    {orderData.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(orderData.createdAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full border font-medium ${getStatusColor(
                      orderData.orderStatus
                    )}`}
                  >
                    {getStatusIcon(orderData.orderStatus)}
                    <span className="ml-2 capitalize">
                      {orderData.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  {getStatusMessage(
                    orderData.orderStatus,
                    orderData.deliveryType
                  )}
                </p>
              </div>

              {/* Progress Steps - Updated to show only 2 steps */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Progress
                </h3>
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentStepIndex >= 1 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      style={{
                        width:
                          orderData.orderStatus === "cancelled"
                            ? "0%"
                            : `${
                                (currentStepIndex / (steps.length - 1)) * 100
                              }%`,
                      }}
                    />
                  </div>

                  {steps.map((step, index) => {
                    const isActive =
                      index <= currentStepIndex &&
                      orderData.orderStatus !== "cancelled";
                    const isCurrent =
                      index === currentStepIndex &&
                      orderData.orderStatus !== "cancelled";
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-blue-100" : ""} ${
                            orderData.orderStatus === "cancelled" && index === 0
                              ? "bg-red-600 border-red-600 text-white"
                              : ""
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium text-center max-w-24 ${
                            isActive ||
                            (orderData.orderStatus === "cancelled" &&
                              index === 0)
                              ? "text-blue-600"
                              : "text-gray-500"
                          } ${
                            orderData.orderStatus === "cancelled" && index === 0
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {orderData.orderStatus === "cancelled" && index === 0
                            ? "Cancelled"
                            : step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Customer</h4>
                  </div>
                  <p className="text-gray-700">{orderData.customerInfo.name}</p>
                  <p className="text-gray-600 text-sm">
                    +91{orderData.customerInfo.phoneNumber}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Payment</h4>
                  </div>
                  <p className="text-gray-700 capitalize">
                    {orderData.paymentMethod === "prepaid"
                      ? "Prepaid (Online)"
                      : "Cash on Pickup"}
                  </p>
                  <p
                    className={`text-sm capitalize ${
                      orderData.paymentStatus === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orderData.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  {getStatusMessage(
                    orderData.orderStatus,
                    orderData.deliveryType
                  )}
                </p>
              </div>

              {/* Progress Steps */}

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Customer</h4>
                  </div>
                  <p className="text-gray-700">{orderData.customerInfo.name}</p>
                  <p className="text-gray-600 text-sm">
                    +91{orderData.customerInfo.phoneNumber}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Payment</h4>
                  </div>
                  <p className="text-gray-700 capitalize">
                    {orderData.paymentMethod === "prepaid"
                      ? "Prepaid (Online)"
                      : "Cash on Pickup"}
                  </p>
                  <p
                    className={`text-sm capitalize ${
                      orderData.paymentStatus === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orderData.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-6 h-6 mr-2" />
                Delivery Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Delivery Type
                  </h4>
                  <div className="flex items-center space-x-3">
                    {orderData.deliveryType === "delivery" ? (
                      <>
                        <Truck className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Home Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Delivered to your address
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Package className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Store Pickup
                          </p>
                          <p className="text-sm text-gray-600">
                            Collect from our store
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {orderData.deliveryAddress && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-700">
                            {orderData.deliveryAddress.street},<br />
                            {orderData.deliveryAddress.city},{" "}
                            {orderData.deliveryAddress.state}
                            <br />
                            Pincode: {orderData.deliveryAddress.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Delivery Fee
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Delivery Charge:</span>
                      <span
                        className={`font-bold ${
                          orderData.deliveryFee === 0
                            ? "text-green-600"
                            : "text-gray-900"
                        }`}
                      >
                        {orderData.deliveryFee === 0
                          ? "FREE"
                          : `₹${orderData.deliveryFee}`}
                      </span>
                    </div>
                    {orderData.isEligibleForFreeDelivery && (
                      <p className="text-green-600 text-xs mt-2">
                        ✓ Eligible for free delivery
                      </p>
                    )}
                  </div>

                  {orderData.estimatedDeliveryDate && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Estimated Delivery
                      </h5>
                      <p className="text-blue-600 font-semibold">
                        {formatDate(orderData.estimatedDeliveryDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-6 h-6 mr-2" />
                Order Items ({orderData.items.length})
              </h3>

              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {item.product.category}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Weight className="w-3 h-3 mr-1" />
                            {item.product.weight}kg each
                          </span>
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items Total:</span>
                      <span className="text-gray-900">
                        ₹{orderData.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="text-gray-900">
                        {orderData.totalWeight.toFixed(2)}kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span
                        className={
                          orderData.deliveryFee === 0
                            ? "text-green-600"
                            : "text-gray-900"
                        }
                      >
                        {orderData.deliveryFee === 0
                          ? "FREE"
                          : `₹${orderData.deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span>₹{orderData.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status History */}
            {orderData.statusHistory && orderData.statusHistory.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Order Updates
                </h3>

                <div className="space-y-4">
                  {orderData.statusHistory
                    .filter((history) =>
                      [
                        "pending",
                        "confirmed",
                        "ready",
                        "delivered",
                        "cancelled",
                      ].includes(history.status)
                    )
                    .map((history, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-2 ${
                            getStatusColor(history.status).split(" ")[0]
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 capitalize">
                              {history.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(history.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {history.status === "pending" &&
                              "Order placed and waiting for confirmation"}
                            {history.status === "confirmed" &&
                              "Order confirmed and being processed"}
                            {history.status === "ready" &&
                              (orderData.deliveryType === "pickup"
                                ? "Ready for pickup at store"
                                : "Ready for delivery")}
                            {history.status === "delivered" &&
                              "Order completed successfully"}
                            {history.status === "cancelled" &&
                              "Order was cancelled"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">
                  Need Help with Your Order?
                </h3>
                <p className="text-blue-100 mb-4">
                  Our customer support team is here to help you with any
                  questions about your order.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() =>
                      window.open("https://wa.me/919448132930", "_blank")
                    }
                    className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Support
                  </button>
                  <button
                    onClick={() => window.open("tel:+919448132930", "_blank")}
                    className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Support
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        {!orderData && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Don't have your Order ID?
              </h3>
              <p className="text-gray-600 mb-6">
                Your Order ID was sent to your WhatsApp when you placed the
                order. It looks like "ORD" followed by numbers (e.g.,
                ORD8857716373).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    window.open("https://wa.me/919448132930", "_blank")
                  }
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact on WhatsApp
                </button>
                <button
                  onClick={() => window.open("tel:+919448132930", "_blank")}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
