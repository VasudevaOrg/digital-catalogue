// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { staticProducts, staticCategories } from "@/data/staticProducts";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { HeroBanner } from "@/components/layout/HeroBanner";
import {
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Award,
  Users,
} from "lucide-react";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const products = staticProducts.slice(0, 12);
  const categories = staticCategories;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Banner with Corrosion Effects */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="relative py-16 bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-100 to-transparent rounded-full blur-2xl opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of quality groceries and daily
              essentials
            </p>
          </div>

          <div
            className={`transition-opacity duration-500 ${
              isClient ? "opacity-100" : "opacity-0"
            }`}
          >
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Background Pattern - Using CSS instead of inline SVG */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(156,146,172,0.03) 2px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Premium Quality Products
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked quality items for your daily needs
            </p>
          </div>

          <div
            className={`transition-opacity duration-500 ${
              isClient ? "opacity-100" : "opacity-0"
            }`}
          >
            <FeaturedProducts products={products} />
          </div>
        </div>
      </section>
    </div>
  );
}
