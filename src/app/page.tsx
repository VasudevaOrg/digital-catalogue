// src/app/page.tsx - Updated Homepage with Recommended Products Filter
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
  Package,
  Phone,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, categories, isLoading, error } = useAppSelector(
    (state) => state.products
  );
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

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

        // Fetch all products to filter recommended ones
        const result = await dispatch(
          fetchProducts({
            page: 1,
            limit: 50, // Get more products to filter recommended ones
            filters: {
              sortBy: "newest",
              sortOrder: "desc",
            },
          })
        );

        // Filter recommended products from the fetched products
        if (result.payload && result.payload.data) {
          const recommended = result.payload.data.filter(
            (product: any) => product.isRecommended === true
          );
          setRecommendedProducts(recommended.slice(0, 12)); // Show top 12 recommended
        }

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
          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-200 rounded-full mb-4 mx-auto"></div>
          <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoading && !dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <HeroBannerSkeleton />
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="animate-pulse space-y-4">
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-48 sm:w-64 mx-auto"></div>
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-64 sm:w-96 mx-auto"></div>
              </div>
            </div>
            <CategoriesGridSkeleton />
          </div>
        </div>
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="text-center bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-4">
            <div className="text-red-500 mb-4">
              <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Unable to load products
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-semibold"
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
      <section className="relative py-8 sm:py-12 lg:py-16 bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-tl from-orange-100 to-transparent rounded-full blur-2xl opacity-60"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-3 sm:mb-4 md:mb-6 px-4 sm:px-0">
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
                  <div className="text-center mt-8 sm:mt-12">
                    <Link
                      href="/categories"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group"
                    >
                      <Grid3X3 className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <span>View All Categories</span>
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
                  <Package className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    No categories available
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Check back soon for amazing categories!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 md:mb-4">
              <Trophy className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2" />
              Specially Recommended for You
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                Recommended Products
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto px-4 sm:px-0">
              Handpicked quality items specially recommended by our team
            </p>
          </div>

          <div className="transition-opacity duration-500 opacity-100">
            {recommendedProducts.length > 0 ? (
              <>
                <FeaturedProducts products={recommendedProducts} />

                {/* View More Recommended Button */}
                <div className="text-center mt-12">
                  <Link
                    href="/products?recommended=true"
                    className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group"
                  >
                    <Trophy className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>View All Recommended</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
                  <Trophy className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    No recommended products yet
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Our team is working on curating the best products for you!
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse All Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Products Section (Fallback if no recommended) */}
      {recommendedProducts.length === 0 && products.length > 0 && (
        <section className="relative py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                Premium Quality Products
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent mb-3 sm:mb-4">
                Featured Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                Discover our quality selection of products for your daily needs
              </p>
            </div>

            <div className="transition-opacity duration-500 opacity-100">
              <FeaturedProducts products={products.slice(0, 12)} />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                icon: <Truck className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Free Delivery",
                subtitle: "On orders ₹1000+",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: <Trophy className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Recommended",
                subtitle: "Curated selection",
                color: "text-yellow-600",
                bgColor: "bg-yellow-100",
              },
              {
                icon: <Clock className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Same Day Delivery",
                subtitle: "Order before 2 PM",
                color: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                icon: <Users className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "24/7 Support",
                subtitle: "Always here to help",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl hover:shadow-lg transition-shadow duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 ${feature.bgColor} ${feature.color} rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {feature.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Sparkles className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Start Shopping?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Browse our complete collection of premium quality products and
                get them delivered to your doorstep or pickup from our store.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link
                  href="/products"
                  className="group bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center w-full sm:w-auto justify-center"
                >
                  <ShoppingBag className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Browse Products
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <button
                  onClick={() =>
                    window.open("https://wa.me/919448132930", "_blank")
                  }
                  className="group bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  WhatsApp Us
                </button>
              </div>

              <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Phone className="w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">
                      Call Us
                    </h4>
                    <p className="text-blue-100 text-sm">+91 94481 32930</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Clock className="w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">
                      Store Hours
                    </h4>
                    <p className="text-blue-100 text-sm">Mon-Sat: 9AM-8PM</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Truck className="w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">
                      Free Delivery
                    </h4>
                    <p className="text-blue-100 text-sm">Orders above ₹1000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
