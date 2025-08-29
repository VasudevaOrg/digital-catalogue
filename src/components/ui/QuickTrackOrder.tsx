// src/components/ui/QuickTrackOrder.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, ArrowRight, Clock } from "lucide-react";

export function QuickTrackOrder() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/track-order?id=${orderId.trim().toUpperCase()}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0 lg:max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Track Your Order</h3>
                <p className="text-blue-100">Get real-time updates instantly</p>
              </div>
            </div>

            <div className="space-y-3 text-blue-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Live order status updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="text-sm">Delivery tracking information</span>
              </div>
            </div>
          </div>

          <div className="lg:max-w-md lg:ml-8">
            <form onSubmit={handleQuickTrack} className="space-y-4">
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Enter your Order ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="e.g., ORD8857716373"
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl focus:border-white/50 focus:bg-white/30 outline-none transition-all duration-300 text-white placeholder-blue-200 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!orderId.trim()}
                className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  orderId.trim()
                    ? "bg-white text-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 hover:shadow-xl"
                    : "bg-white/20 text-blue-200 cursor-not-allowed"
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => router.push("/track-order")}
                className="text-blue-100 hover:text-white underline text-sm transition-colors"
              >
                Or go to full tracking page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
    </motion.div>
  );
}
