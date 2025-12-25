// src/app/checkout/page.tsx - Complete Updated Version
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
  calculateProductDiscount,
  isDiscountActive,
} from "@/lib/discountUtils";
import {
  isDeltaProduct,
  calculateFreeDeliveryEligibility,
} from "@/lib/freeDeliveryUtils";
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
  ArrowLeft,
  Weight,
  Tag,
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
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [deliveryRadius] = useState(10);

  // Terms and Conditions state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  // Auto-update payment method when delivery type changes
  useEffect(() => {
    if (deliveryType === "pickup") {
      setPaymentMethod("cash_on_pickup");
    } else {
      setPaymentMethod("prepaid");
    }
  }, [deliveryType]);

  // Calculate eligible and delta amounts using the CORRECT utility
  const itemsWithPrices = cart.items.map((item) => {
    const hasDiscount =
      item.product.discount && isDiscountActive(item.product.discount);

    // Use variant price if available
    const productForPrice = item.selectedVariant
      ? { ...item.product, price: item.selectedVariant.price }
      : item.product;

    const discountCalc = hasDiscount
      ? calculateProductDiscount(productForPrice, item.quantity)
      : null;
    const finalPrice =
      discountCalc?.discountedPrice || productForPrice.price * item.quantity;

    return {
      product: productForPrice,
      quantity: item.quantity,
      finalPrice: finalPrice,
    };
  });

  // Use the CORRECT free delivery calculation
  const deliveryCalc = calculateFreeDeliveryEligibility(itemsWithPrices);
  const eligibleAmount = deliveryCalc.eligibleAmount;
  const deltaAmount = deliveryCalc.deltaAmount;
  const amountNeededForFreeDelivery = deliveryCalc.amountNeededForFreeDelivery;
  const isEligibleForFreeDelivery =
    deliveryCalc.isEligibleForFreeDelivery && isDeliveryAvailable;

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClient) {
      const customerPincode = customerInfo.address.pincode;
      const shopPincode = "573103";
      const isAvailable = customerPincode.startsWith("573");
      setIsDeliveryAvailable(isAvailable);
    }
  }, [customerInfo.address.pincode, isClient]);

  // Calculate delivery fee - CORRECTED
  const calculateDeliveryFee = () => {
    if (deliveryType === "pickup") return 0;
    if (isEligibleForFreeDelivery) return 0;
    return isDeliveryAvailable ? 50 : 0;
  };

  const deliveryFee = calculateDeliveryFee();
  const totalAmount = cart.totalAmount + deliveryFee;

  // Calculate grouped measurements
  const calculateMeasurements = () => {
    const totals: Record<string, number> = {
      mass: 0, // stored in grams
      volume: 0, // stored in ml
      box: 0,
      bags: 0,
      pieces: 0,
      other: 0,
    };

    cart.items.forEach((item) => {
      const variant = item.selectedVariant;
      const weight = variant ? variant.weight : item.product.weight;
      const unit = variant ? variant.weightUnit : item.product.weightUnit;
      const quantity = item.quantity;
      const totalValue = weight * quantity;

      switch (unit) {
        case "kg":
          totals.mass += totalValue * 1000;
          break;
        case "grams":
          totals.mass += totalValue;
          break;
        case "ltr":
          totals.volume += totalValue * 1000;
          break;
        case "ml":
          totals.volume += totalValue;
          break;
        case "box":
          totals.box += totalValue; // Assuming value implies count/weight abstractly, but usually matches quantity x weight if weight is '1 box'
          break;
        case "bags":
          totals.bags += totalValue;
          break;
        case "pieces":
          totals.pieces += totalValue;
          break;
        default:
          totals.other += totalValue;
      }
    });

    return totals;
  };

  const measurementTotals = calculateMeasurements();

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

    // Validate terms and conditions
    if (!acceptedTerms) {
      dispatch(showErrorNotification("Please accept the Terms and Conditions"));
      return false;
    }

    if (!acceptedPrivacy) {
      dispatch(showErrorNotification("Please accept the Privacy Policy"));
      return false;
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

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      const orderId = generateOrderId();

      // Calculate items with discounted prices
      const orderItems = cart.items.map((item) => {
        const hasDiscount =
          item.product.discount && isDiscountActive(item.product.discount);

        // Use variant data if available
        const productData = item.selectedVariant
          ? {
              ...item.product,
              price: item.selectedVariant.price,
              weight: item.selectedVariant.weight,
              weightUnit: item.selectedVariant.weightUnit,
            }
          : item.product;

        if (hasDiscount) {
          const discountCalc = calculateProductDiscount(
            productData,
            item.quantity
          );

          return {
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description || "",
              price: discountCalc.discountedPrice / item.quantity,
              originalPrice: productData.price,
              weight: productData.weight,
              category: item.product.category,
              images: item.product.images || [],
              discount: item.product.discount,
              selectedVariant: item.selectedVariant, // Pass variant info
            },
            quantity: item.quantity,
            appliedDiscount: discountCalc.discountAmount,
            savings: discountCalc.discountAmount,
          };
        } else {
          return {
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description || "",
              price: productData.price,
              weight: productData.weight,
              category: item.product.category,
              images: item.product.images || [],
              selectedVariant: item.selectedVariant, // Pass variant info
            },
            quantity: item.quantity,
          };
        }
      });

      const subtotal = orderItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      const totalSavings = orderItems.reduce((sum, item) => {
        return sum + (item.savings || 0);
      }, 0);

      const originalAmount = cart.items.reduce((sum, item) => {
        const price = item.selectedVariant?.price || item.product.price;
        return sum + price * item.quantity;
      }, 0);

      console.log("💰 ORDER CALCULATION:", {
        subtotal,
        deliveryFee,
        totalAmount: subtotal + deliveryFee,
        eligibleAmount,
        deltaAmount,
        isEligibleForFreeDelivery,
        deliveryType,
      });

      const orderData = {
        orderId,
        customerInfo: {
          ...customerInfo,
          phoneNumber: customerInfo.phoneNumber
            .replace(/\D/g, "")
            .replace(/^91/, ""),
        },
        items: orderItems,
        totalAmount: subtotal + deliveryFee,
        originalAmount: originalAmount + deliveryFee,
        totalSavings: totalSavings,
        totalWeight: cart.totalWeight,
        deliveryType,
        paymentMethod,
        deliveryAddress:
          deliveryType === "delivery" ? customerInfo.address : null,
        deliveryFee,
        subtotal: subtotal,
        isEligibleForFreeDelivery: isEligibleForFreeDelivery,
        orderDate: new Date().toISOString(),
        orderNotes: `Order placed via Digital Catalogue website. ${
          deliveryType === "delivery" ? "Home delivery" : "Store pickup"
        } requested.${
          totalSavings > 0
            ? ` Customer saved ₹${totalSavings.toFixed(2)} with discounts.`
            : ""
        } Eligible amount: ₹${eligibleAmount.toFixed(
          2
        )}, DELTA products: ₹${deltaAmount.toFixed(2)}${
          isEligibleForFreeDelivery
            ? `. FREE delivery applied (eligible ≥₹1000).`
            : `. Delivery fee: ₹${deliveryFee}.`
        }`,
      };

      console.log("📦 Creating order with correct free delivery:", orderData);

      const orderController = new AbortController();
      const orderTimeout = setTimeout(() => orderController.abort(), 30000);

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

        console.log("✅ Order saved:", orderResult.order.orderId);
      } catch (error) {
        clearTimeout(orderTimeout);
        if (error.name === "AbortError") {
          throw new Error("Order creation timed out. Please try again.");
        }
        throw error;
      }

      const savedOrder = orderResult.order;

      console.log("📱 Sending WhatsApp notification...");

      const whatsappController = new AbortController();
      const whatsappTimeout = setTimeout(
        () => whatsappController.abort(),
        20000
      );

      let whatsappResult;
      try {
        const whatsappResponse = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: orderData.customerInfo.phoneNumber,
            message: "",
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

        whatsappResult = {
          success: false,
          error:
            error.name === "AbortError"
              ? "WhatsApp notification timed out"
              : "WhatsApp notification failed",
        };
      }

      setWhatsappResult(whatsappResult);
      dispatch(clearCart());
      setOrderSuccess(true);

      const successMessage = whatsappResult.success
        ? `Order placed successfully! 

Order Details:
• Order ID: ${savedOrder.orderId}
• Invoice: ${savedOrder.invoiceNumber}
${totalSavings > 0 ? `• You saved: ₹${totalSavings.toFixed(2)}` : ""}
${
  isEligibleForFreeDelivery
    ? "• FREE Delivery Applied! ✅"
    : `• Delivery Fee: ₹${deliveryFee}`
}
• Payment: ${
            paymentMethod === "prepaid" ? "Prepaid (Online)" : "Cash on Pickup"
          }
• WhatsApp confirmation sent to +91${orderData.customerInfo.phoneNumber}

Please check your WhatsApp for complete order details and next steps.`
        : `Order placed successfully! 

Order Details:
• Order ID: ${savedOrder.orderId}
• Invoice: ${savedOrder.invoiceNumber}
${totalSavings > 0 ? `• You saved: ₹${totalSavings.toFixed(2)}` : ""}
${
  isEligibleForFreeDelivery
    ? "• FREE Delivery Applied! ✅"
    : `• Delivery Fee: ₹${deliveryFee}`
}
• Payment: ${
            paymentMethod === "prepaid" ? "Prepaid (Online)" : "Cash on Pickup"
          }

WhatsApp notification: ${whatsappResult.error || "Failed to send"}

Please call us at +91 82971 37702 for order confirmation.`;

      dispatch(showSuccessNotification(successMessage));

      setTimeout(() => {
        router.push("/");
      }, 6000);
    } catch (error: any) {
      console.error("❌ Order placement error:", error);

      let errorMessage = "Failed to place order. Please try again.";

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
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Add some products to your cart before checkout.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
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
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Your order has been processed and WhatsApp confirmation sent.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border mb-6 sm:mb-8">
            <div className="border-b p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Confirmed
              </h3>
              <p className="text-gray-600">Ready for processing</p>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
                <span className="text-gray-600 ml-2 text-sm sm:text-base">
                  {cart.items.length} items
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {whatsappResult?.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 text-sm sm:text-base">
                        WhatsApp Confirmation Sent
                      </h4>
                      <p className="text-green-800 text-xs sm:text-sm mt-1">
                        Sent to:{" "}
                        <span className="font-mono">
                          +91{customerInfo.phoneNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isEligibleForFreeDelivery && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 text-sm sm:text-base">
                        🎉 FREE Delivery Applied!
                      </h4>
                      <p className="text-green-800 text-xs sm:text-sm mt-1">
                        Eligible items: ₹{eligibleAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                      What Happens Next?
                    </h4>
                    <ul className="text-blue-800 text-xs sm:text-sm mt-2 space-y-1">
                      <li>• Check your WhatsApp for order confirmation</li>
                      <li>• Our team will contact you within 10-15 minutes</li>
                      {paymentMethod === "prepaid" && (
                        <li>• Payment details will be shared via WhatsApp</li>
                      )}
                      {paymentMethod === "cash_on_pickup" && (
                        <li>• Prepare cash payment for store pickup</li>
                      )}
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
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>

            <p className="text-xs sm:text-sm text-gray-500">
              Redirecting to home page in 6 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Back
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your order details
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-6">
            <div className="flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 sm:w-5 h-3 sm:h-5 text-white" />
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-blue-600">
                Cart
              </span>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-blue-200"></div>
            <div className="flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">
                  2
                </span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-blue-600">
                Checkout
              </span>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs sm:text-sm font-medium">
                  3
                </span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-400">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Customer Info, Delivery, Payment */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
              </div>
              <div className="p-4 sm:p-6">
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
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
              <div className="border-b p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Options
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                      <span className="font-medium text-sm sm:text-base">
                        Home Delivery
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                        <span>2-4 hours delivery</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                        <span>
                          {deliveryFee > 0
                            ? `₹${deliveryFee} delivery fee`
                            : "FREE delivery"}
                        </span>
                      </div>
                    </div>
                    {!isDeliveryAvailable && (
                      <p className="text-red-600 text-xs sm:text-sm mt-2">
                        Not available for your area
                      </p>
                    )}
                  </div>

                  <div
                    className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                      <span className="font-medium text-sm sm:text-base">
                        Store Pickup
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                        <span>Ready in 1-2 hours</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-green-500" />
                        <span className="text-green-600">Always FREE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!isDeliveryAvailable && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex">
                      <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 mr-2 flex-shrink-0" />
                      <div className="text-xs sm:text-sm text-amber-800">
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
                <div className="border-b p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Address
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
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
                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
                          className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
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
              <div className="border-b p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {deliveryType === "pickup" ? (
                  // Store Pickup - Cash Payment Only
                  <>
                    <div className="border-2 rounded-lg p-3 sm:p-4 border-green-500 bg-green-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={true}
                          readOnly
                          className="mr-3"
                        />
                        <Package className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-sm sm:text-base">
                          Cash on Pickup
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700 ml-10 mt-1">
                        Pay when you collect your order from our store
                      </p>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex">
                        <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 mr-2 flex-shrink-0" />
                        <div className="text-xs sm:text-sm text-green-800">
                          <p className="font-medium">
                            Cash Payment for Store Pickup
                          </p>
                          <p>
                            You can pay in cash when you pick up your order from
                            our store. No advance payment required.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Home Delivery - Original Multiple Payment Options
                  <>
                    <div className="space-y-3">
                      <div
                        className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                          <span className="font-medium text-sm sm:text-base">
                            Prepaid (Online Payment)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 ml-10">
                          Pay online before delivery/pickup
                        </p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                          <span className="font-medium text-sm sm:text-base">
                            Cash on Delivery
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 ml-10">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex">
                        <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2 flex-shrink-0" />
                        <div className="text-xs sm:text-sm text-blue-800">
                          <p className="font-medium">Payment Information</p>
                          <p>
                            Choose your preferred payment method. Our team will
                            share payment details via WhatsApp after order
                            confirmation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b p-4 sm:p-6">
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

              <div className="p-4 sm:p-6">
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => {
                    const hasDiscount =
                      item.product.discount &&
                      isDiscountActive(item.product.discount);

                    // Use variant data
                    const productForDisplay = item.selectedVariant
                      ? {
                          ...item.product,
                          price: item.selectedVariant.price,
                          weight: item.selectedVariant.weight,
                        }
                      : item.product;

                    const discountCalc = hasDiscount
                      ? calculateProductDiscount(
                          productForDisplay,
                          item.quantity
                        )
                      : null;

                    const originalPrice =
                      productForDisplay.price * item.quantity;
                    const finalPrice =
                      discountCalc?.discountedPrice || originalPrice;
                    const savings = discountCalc?.discountAmount || 0;

                    const isItemDelta = isDeltaProduct(item.product);

                    // Format weight
                    const weight = item.selectedVariant
                      ? item.selectedVariant.weight
                      : item.product.weight;
                    const weightUnit = item.selectedVariant
                      ? item.selectedVariant.weightUnit
                      : item.product.weightUnit;
                    const customUnit = item.selectedVariant?.customUnit;

                    let weightDisplay = "";
                    if (customUnit) {
                      weightDisplay = `${weight * item.quantity} ${customUnit}`;
                    } else {
                      weightDisplay = `${(weight * item.quantity).toFixed(
                        2
                      )} ${weightUnit}`;
                    }

                    return (
                      <div
                        key={`${item.product.id}-${
                          item.selectedVariant?.sku || "base"
                        }`}
                        className="flex justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                            {item.selectedVariant && (
                              <span className="text-gray-500 font-normal ml-1">
                                (
                                {item.selectedVariant.customUnit ||
                                  `${item.selectedVariant.weight} ${item.selectedVariant.weightUnit}`}
                                )
                              </span>
                            )}
                            {isItemDelta && (
                              <span className="ml-2 text-xs text-amber-600">
                                DELTA
                              </span>
                            )}
                          </h4>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {hasDiscount && savings > 0 ? (
                              <div className="flex flex-col gap-1">
                                <div>
                                  <span className="line-through">
                                    ₹{productForDisplay.price}
                                  </span>{" "}
                                  →{" "}
                                  <span className="text-green-600 font-medium">
                                    ₹{(finalPrice / item.quantity).toFixed(2)}
                                  </span>{" "}
                                  × {item.quantity}
                                </div>
                                <div className="text-green-600 font-medium text-xs">
                                  Save ₹{savings.toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <>
                                ₹{productForDisplay.price} × {item.quantity}
                              </>
                            )}
                            {" • "}
                            {weightDisplay}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {hasDiscount && savings > 0 ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-green-600">
                                ₹{finalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{originalPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-900">
                              ₹{finalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  {cart.items.some((item) => {
                    const hasDiscount =
                      item.product.discount &&
                      isDiscountActive(item.product.discount);
                    const discountCalc = hasDiscount
                      ? calculateProductDiscount(item.product, item.quantity)
                      : null;
                    return discountCalc && discountCalc.discountAmount > 0;
                  }) && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="text-gray-500 line-through">
                          ₹
                          {cart.items
                            .reduce((total, item) => {
                              const price =
                                item.selectedVariant?.price ||
                                item.product.price;
                              return total + price * item.quantity;
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          Discount Savings:
                        </span>
                        <span className="text-green-600 font-medium">
                          -₹
                          {cart.items
                            .reduce((total, item) => {
                              const hasDiscount =
                                item.product.discount &&
                                isDiscountActive(item.product.discount);

                              // Use variant data
                              const productForDiscount = item.selectedVariant
                                ? {
                                    ...item.product,
                                    price: item.selectedVariant.price,
                                  }
                                : item.product;

                              const discountCalc = hasDiscount
                                ? calculateProductDiscount(
                                    productForDiscount,
                                    item.quantity
                                  )
                                : null;
                              return (
                                total + (discountCalc?.discountAmount || 0)
                              );
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">
                      ₹{cart.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Total Measurements Display */}
                  <div className="flex flex-col space-y-1 text-sm border-t border-dashed pt-2 mt-2">
                    <span className="text-gray-600 font-medium pb-1">
                      Total Quantities:
                    </span>

                    {measurementTotals.mass > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">
                          Total Weight:
                        </span>
                        <span className="text-gray-900">
                          {measurementTotals.mass >= 1000
                            ? `${(measurementTotals.mass / 1000).toFixed(2)} kg`
                            : `${measurementTotals.mass} g`}
                        </span>
                      </div>
                    )}

                    {measurementTotals.volume > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">
                          Total Volume:
                        </span>
                        <span className="text-gray-900">
                          {measurementTotals.volume >= 1000
                            ? `${(measurementTotals.volume / 1000).toFixed(
                                2
                              )} L`
                            : `${measurementTotals.volume} ml`}
                        </span>
                      </div>
                    )}

                    {measurementTotals.box > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">Total Boxes:</span>
                        <span className="text-gray-900">
                          {measurementTotals.box}
                        </span>
                      </div>
                    )}

                    {measurementTotals.bags > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">Total Bags:</span>
                        <span className="text-gray-900">
                          {measurementTotals.bags}
                        </span>
                      </div>
                    )}

                    {measurementTotals.pieces > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">
                          Total Pieces:
                        </span>
                        <span className="text-gray-900">
                          {measurementTotals.pieces}
                        </span>
                      </div>
                    )}

                    {measurementTotals.other > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 pl-2">Other Items:</span>
                        <span className="text-gray-900">
                          {measurementTotals.other}
                        </span>
                      </div>
                    )}
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
                  <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Delivery Status - CORRECTED MESSAGING */}
                {deliveryType === "delivery" && (
                  <div className="mt-4">
                    {isEligibleForFreeDelivery ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center text-green-800 text-xs">
                          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">
                              🎉 FREE Delivery Applied!
                            </p>
                            <p className="text-green-700">
                              Eligible items: ₹{eligibleAmount.toFixed(2)}
                            </p>
                            {deltaAmount > 0 && (
                              <p className="text-green-600 text-xs mt-1">
                                (DELTA products: ₹{deltaAmount.toFixed(2)} -
                                bonus items!)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start">
                            <Tag className="w-3 h-3 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-amber-800">
                                Eligible items: ₹{eligibleAmount.toFixed(2)}
                              </p>
                              {amountNeededForFreeDelivery > 0 && (
                                <p className="text-amber-700 text-xs mt-1">
                                  Add ₹{amountNeededForFreeDelivery.toFixed(2)}{" "}
                                  more in eligible items for FREE delivery!
                                </p>
                              )}
                            </div>
                          </div>

                          {deltaAmount > 0 && (
                            <div className="flex items-start">
                              <AlertCircle className="w-3 h-3 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-blue-800">
                                  DELTA products: ₹{deltaAmount.toFixed(2)}
                                </p>
                                <p className="text-blue-700 text-xs mt-1">
                                  Sugar, oils, and jaggery don't count toward
                                  the ₹1000 threshold but can stay in your cart.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Time */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <Calendar className="w-4 h-4 mr-2" />
                    <div className="text-xs sm:text-sm">
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

            {/* Terms and Conditions Checkboxes */}
            <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={isPlacingOrder}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    I agree to the{" "}
                    <span className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </span>{" "}
                    *
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    disabled={isPlacingOrder}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    I agree to the{" "}
                    <span className="text-blue-600 hover:underline">
                      Privacy Policy
                    </span>{" "}
                    *
                  </label>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="mt-4 sm:mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !acceptedTerms || !acceptedPrivacy}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 transition-colors ${
                  isPlacingOrder || !acceptedTerms || !acceptedPrivacy
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
              <div className="mt-4 bg-white rounded-lg border p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
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
                  {deliveryType === "pickup" && (
                    <div className="flex items-start space-x-2">
                      <Package className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Cash Payment
                        </p>
                        <p className="text-gray-600">
                          Pay in cash when you collect your order
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
