// src/components/product/FeaturedProducts.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-12 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600">
              Check back soon for amazing products!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Split products into categories for better display
  const topProducts = products.slice(0, 3);
  const remainingProducts = products.slice(3);

  return (
    <div className="space-y-12">
      {/* Top 3 Featured Products - Larger Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      ></motion.div>

      {/* Remaining Products Grid */}
      {remainingProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  More Products
                </h3>
                <p className="text-gray-600">Discover our complete range</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {remainingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.05 }}
              >
                <ProductCard product={product} index={index + 3} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* View All Products CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center pt-8"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Explore Our Complete Collection
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover hundreds of premium quality products across all
              categories. From daily essentials to specialty items, we have
              everything you need.
            </p>

            <Link
              href="/products"
              className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Product Categories Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            name: "Rice & Grains",
            icon: "🌾",
            color: "from-amber-500 to-orange-500",
          },
          {
            name: "Fresh Oils",
            icon: "🫒",
            color: "from-green-500 to-emerald-500",
          },
          { name: "Spices", icon: "🌶️", color: "from-red-500 to-pink-500" },
          { name: "Dairy", icon: "🥛", color: "from-blue-500 to-indigo-500" },
        ].map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-xl">{category.icon}</span>
              </div>
              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h4>
              <div className="flex items-center mt-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                <span className="text-sm font-medium">Shop Now</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
