// src/components/ui/WhatsAppButton.tsx
"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Clock,
  MapPin,
  User,
  Package,
  Truck,
  HeadphonesIcon,
  Star,
  ChevronRight,
} from "lucide-react";
import { whatsappService } from "@/lib/whatsappService";
import { useAppSelector } from "@/store";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const { cart } = useAppSelector((state) => state.cart);

  // Show/hide button based on scroll
  useEffect(() => {
    const controlButton = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlButton);
      return () => window.removeEventListener("scroll", controlButton);
    }
  }, [lastScrollY]);

  // Simulate typing indicator
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDirectMessage = () => {
    const message =
      "Hi! I'm interested in your products. Could you please help me with my order?";
    whatsappService.openWhatsApp(message);
    setIsOpen(false);
  };

  const handleQuickActions = (action: string) => {
    let message = "";
    switch (action) {
      case "catalog":
        message =
          "Hi! Could you please share your product catalog with current prices and availability?";
        break;
      case "delivery":
        message =
          "Hi! What are your delivery options and charges for my location? Do you deliver to my area?";
        break;
      case "support":
        message =
          "Hi! I need help with my order or have a question. Could you please assist me?";
        break;
      case "bulk":
        message =
          "Hi! I'm interested in bulk orders and wholesale pricing. Could you share your bulk rates?";
        break;
      case "cart":
        if (cart.items.length > 0) {
          const orderData = {
            orderId: `QUICK${Date.now()}`,
            customerInfo: {
              name: "Customer",
              phoneNumber: "",
            },
            items: cart.items,
            totalAmount: cart.totalAmount,
            totalWeight: cart.totalWeight,
            deliveryType: "delivery" as const,
            paymentMethod: "prepaid" as const,
            deliveryFee: cart.isEligibleForFreeDelivery ? 0 : 50,
          };
          whatsappService.sendOrderEnquiry(orderData);
        } else {
          message =
            "Hi! I'd like to place an order. Could you help me with your available products?";
          whatsappService.openWhatsApp(message);
        }
        break;
      case "status":
        message =
          "Hi! Could you please help me check the status of my recent order?";
        break;
    }

    if (action !== "cart") {
      whatsappService.openWhatsApp(message);
    }
    setIsOpen(false);
  };

  const businessInfo = whatsappService.getBusinessInfo();
  const isBusinessHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 9 && currentHour < 20; // 9 AM to 8 PM
  };

  const quickActions = [
    {
      id: "catalog",
      icon: "📋",
      title: "View Product Catalog",
      description: "See all available products with prices",
      color: "bg-blue-100",
    },
    {
      id: "cart",
      icon: "🛒",
      title: cart.items.length > 0 ? "Order Cart Items" : "Place New Order",
      description:
        cart.items.length > 0
          ? `${cart.items.length} items in cart (₹${cart.totalAmount.toFixed(
              2
            )})`
          : "Start a new order with assistance",
      color: "bg-green-100",
      badge: cart.items.length > 0 ? cart.items.length : null,
    },
    {
      id: "delivery",
      icon: "🚚",
      title: "Delivery Information",
      description: "Check delivery options and charges",
      color: "bg-orange-100",
    },
    {
      id: "bulk",
      icon: "📦",
      title: "Bulk Orders",
      description: "Wholesale pricing and bulk discounts",
      color: "bg-purple-100",
    },
    {
      id: "status",
      icon: "📋",
      title: "Order Status",
      description: "Track your existing orders",
      color: "bg-indigo-100",
    },
    {
      id: "support",
      icon: "💬",
      title: "Customer Support",
      description: "Get help with your orders",
      color: "bg-red-100",
    },
  ];

  return (
    <>
      {/* WhatsApp Chat Widget */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Widget */}
          <div className="fixed bottom-24 right-4 md:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] animate-scaleIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      {/* Online status */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-300 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {businessInfo.businessName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-green-100">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                        <span>
                          {isBusinessHours()
                            ? "Online now"
                            : "Typically replies within an hour"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="max-h-80 overflow-y-auto">
                {/* Welcome Message */}
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
                        <p className="text-sm text-gray-800">
                          👋 Hi there! Welcome to {businessInfo.businessName}!
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
                        <p className="text-sm text-gray-800">
                          How can I help you today? You can choose from the
                          options below or send me a message directly!
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Just now</p>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 w-16">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="px-4 pb-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Quick Actions
                    </h4>
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickActions(action.id)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 hover:border-green-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center relative`}
                          >
                            <span className="text-lg">{action.icon}</span>
                            {action.badge && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                {action.badge}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 group-hover:text-green-600 transition-colors">
                              {action.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {action.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business Info */}
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Business Info
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">4.8/5</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{businessInfo.workingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{businessInfo.businessPhone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight">
                          {businessInfo.storeAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <button
                  onClick={handleDirectMessage}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Conversation
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Powered by WhatsApp Business
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Button */}
      <div
        className={`fixed bottom-6 right-4 md:right-6 z-50 transition-all duration-300 ${
          isVisible
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-16 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Cart Badge */}
          {cart.items.length > 0 && !isOpen && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold border-2 border-white shadow-lg animate-bounce">
              {cart.items.length}
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            <div className="flex items-center justify-center">
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MessageCircle className="w-6 h-6" />
              )}
            </div>

            {/* Pulse Animation */}
            {!isOpen && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
                <div
                  className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-50"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </>
            )}

            {/* Tooltip */}
            {!isOpen && (
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Need help? Chat with us!
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
              </div>
            )}
          </button>

          {/* Online Status Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Quick Action Hints */}
        {!isOpen && isBusinessHours() && (
          <div className="absolute bottom-full right-0 mb-2 bg-white text-gray-800 text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online now • Quick responses
            </div>
          </div>
        )}
      </div>
    </>
  );
}
