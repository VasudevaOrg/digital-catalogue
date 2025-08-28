// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProducts,
  fetchCategories,
  fetchFeaturedProducts,
} from "@/store/slices/productSlice";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import { HeroBanner } from "@/components/layout/HeroBanner";
import {
  HeroBannerSkeleton,
  CategoriesGridSkeleton,
  FeaturedProductsSkeleton,
} from "@/components/ui/SkeletonLoader";
import Link from "next/link";
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
  Grid3X3,
} from "lucide-react";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, categories, isLoading, error } = useAppSelector(
    (state) => state.products
  );
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories first
        await dispatch(fetchCategories());

        // Fetch featured products (limited to 12)
        await dispatch(fetchFeaturedProducts(12));

        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading homepage data:", error);
      }
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [dispatch, dataLoaded]);

  // Show only 6 random categories for homepage
  const getDisplayCategories = () => {
    if (categories.length <= 6) {
      return categories;
    }

    // Shuffle categories and take first 6
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  const displayCategories = getDisplayCategories();

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4 mx-auto"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoading && !dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <HeroBannerSkeleton />
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
            </div>
            <CategoriesGridSkeleton />
          </div>
        </div>
        <div className="py-20">
          <div className="container mx-auto px-4">
            <FeaturedProductsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <HeroBanner />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-red-500 mb-4">
              <ShoppingBag className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Unable to load products
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Banner */}
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Discover our premium collection of quality groceries and daily
              essentials
            </p>
          </div>

          <div className="transition-opacity duration-500 opacity-100">
            {displayCategories.length > 0 ? (
              <>
                <CategoryGrid categories={displayCategories} />

                {/* Show More Button */}
                {categories.length > 6 && (
                  <div className="text-center mt-12">
                    <Link
                      href="/categories"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group"
                    >
                      <Grid3X3 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <span>View All Categories</span>
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>

                    <p className="text-sm text-gray-500 mt-3">
                      Showing {displayCategories.length} of {categories.length}{" "}
                      categories
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No categories available
                  </h3>
                  <p className="text-gray-600">
                    Check back soon for amazing categories!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Background Pattern */}
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

          <div className="transition-opacity duration-500 opacity-100">
            {products.length > 0 ? (
              <FeaturedProducts products={products} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No products available
                  </h3>
                  <p className="text-gray-600">
                    Check back soon for amazing products!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Free Delivery",
                subtitle: "On orders ₹1000+",
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality Assured",
                subtitle: "Premium products",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Same Day Delivery",
                subtitle: "Order before 2 PM",
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "24/7 Support",
                subtitle: "Always here to help",
                color: "text-orange-600",
                bg: "bg-orange-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${feature.bg} ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
