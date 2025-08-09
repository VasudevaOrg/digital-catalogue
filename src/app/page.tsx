// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProducts,
  fetchCategories,
  setFilters,
} from "@/store/slices/productSlice";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryGrid } from "@/components/product/CategoryGrid";
import {
  Search,
  Filter,
  Grid,
  List,
  Package,
  MessageCircle,
  Truck,
  Star,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { products, categories, isLoading, filters } = useAppSelector(
    (state) => state.products
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );
  const itemsPerPage = 12;

  // Load initial data and apply URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      dispatch(setFilters({ category }));
      setActiveTab("products");
    }
    if (search) {
      dispatch(setFilters({ searchQuery: search }));
      setActiveTab("products");
    }

    // Load categories first
    dispatch(fetchCategories());
  }, [dispatch, searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    if (activeTab === "products") {
      dispatch(
        fetchProducts({
          page: currentPage,
          limit: itemsPerPage,
          filters,
        })
      );
    }
  }, [dispatch, currentPage, filters, activeTab]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppContact = () => {
    window.open(
      "https://wa.me/919876543210?text=Hi! I'm interested in your products.",
      "_blank"
    );
  };

  if (isLoading && products.length === 0 && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading Digital Catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quick Stats Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{products.length}+ Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Free Delivery ₹1000+</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Digital Catalogue
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium quality groceries and daily essentials delivered to your
              doorstep
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "products"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-primary-500"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "categories"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-primary-500"
                }`}
              >
                Categories
              </button>
            </div>
          </div>

          {/* Controls for Products Tab */}
          {activeTab === "products" && (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">
                  {products.length} Products Found
                </span>
                {(filters.category || filters.searchQuery) && (
                  <button
                    onClick={() => {
                      dispatch(setFilters({ category: "", searchQuery: "" }));
                      router.push("/");
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Toggle - Mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-colors ${
                      viewMode === "list"
                        ? "bg-primary-500 text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        {activeTab === "categories" ? (
          <div className="animate-fadeInUp">
            <CategoryGrid categories={categories} />
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <ProductFilters categories={categories} />
              </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="bg-white w-80 h-full overflow-y-auto shadow-xl">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <ProductFilters categories={categories} />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {products.length === 0 && !isLoading ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      dispatch(setFilters({ category: "", searchQuery: "" }));
                      setActiveTab("categories");
                    }}
                    className="btn-primary"
                  >
                    Browse Categories
                  </button>
                </div>
              ) : (
                <>
                  <div className="animate-fadeInUp">
                    <ProductGrid
                      products={currentProducts}
                      viewMode={viewMode}
                    />
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={products.length}
                        itemsPerPage={itemsPerPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Need Help with Your Order?
            </h3>
            <p className="text-green-100 mb-6">
              Contact us on WhatsApp for instant support and personalized
              assistance
            </p>
            <button
              onClick={handleWhatsAppContact}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors transform hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </div>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-sm text-gray-600">
              On orders above ₹1,000 within 573103 area
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Quality Products
            </h3>
            <p className="text-sm text-gray-600">
              Premium quality groceries with quality guarantee
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              WhatsApp Support
            </h3>
            <p className="text-sm text-gray-600">
              24/7 customer support via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
