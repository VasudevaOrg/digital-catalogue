// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProducts, fetchCategories } from "@/store/slices/productSlice";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { DeliveryInfo } from "@/components/layout/DeliveryInfo";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, categories, isLoading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Load initial data
    dispatch(fetchProducts({ limit: 8 })); // Featured products
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection />

      {/* Delivery Information */}
      <DeliveryInfo />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Category
          </h2>
          <CategoryGrid categories={categories} />
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Products
          </h2>
          <FeaturedProducts products={products} />
        </section>
      )}

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore our wide range of quality products across different
                categories.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Send Enquiry</h3>
              <p className="text-gray-600">
                Add items to cart and send us your order enquiry via WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Delivered</h3>
              <p className="text-gray-600">
                Choose delivery or pickup option and enjoy your products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4">
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us via WhatsApp for instant support and order assistance.
          </p>
          <button
            onClick={() => window.open("https://wa.me/919876543210", "_blank")}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}
