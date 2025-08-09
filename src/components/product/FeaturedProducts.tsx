// src/components/product/FeaturedProducts.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + itemsPerPage));
  };

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No featured products available at the moment.
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Browse All Products →
        </Link>
      </div>
    );
  }

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="text-gray-600 mt-2">
            Discover our handpicked selection of premium products
          </p>
        </div>

        {/* Navigation Controls - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className={`p-2 rounded-full border transition-colors ${
                canGoPrevious
                  ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={`p-2 rounded-full border transition-colors ${
                canGoNext
                  ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <Link
            href="/products"
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between mt-6">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              canGoPrevious
                ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({
              length: Math.ceil(products.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? "bg-primary-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              canGoNext
                ? "border-gray-300 hover:bg-gray-50 text-gray-700"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View All Link - Mobile */}
      <div className="flex md:hidden justify-center pt-4">
        <Link
          href="/products"
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Product Count Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {currentIndex + 1}-
        {Math.min(currentIndex + itemsPerPage, products.length)} of{" "}
        {products.length} products
      </div>
    </div>
  );
}
