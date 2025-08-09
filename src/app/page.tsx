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
import { Search, Filter, Grid, List, Package } from "lucide-react";

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
  const itemsPerPage = 12;

  // Load initial data and apply URL parameters
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    if (category) {
      dispatch(setFilters({ category }));
    }
    if (search) {
      dispatch(setFilters({ searchQuery: search }));
    }

    // Load categories first
    dispatch(fetchCategories());
  }, [dispatch, searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: itemsPerPage,
        filters,
      })
    );
  }, [dispatch, currentPage, filters]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Digital Catalogue
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Premium quality groceries and daily essentials delivered to your
              doorstep. Free delivery on orders above ₹1,000 within 573103 area.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Quality Products</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 text-center">🚚</span>
                <span>Free Delivery ₹1000+</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 text-center">📱</span>
                <span>WhatsApp Ordering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Browse Products
              </h2>
              <p className="text-gray-600 mt-1">
                {products.length} Products Available
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Toggle - Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-4">
              <ProductFilters categories={categories} />
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
              <div className="bg-white w-80 h-full overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100"
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
            {/* Products */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <>
                <ProductGrid products={currentProducts} viewMode={viewMode} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 bg-white border border-gray-200 p-4">
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
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Free Delivery
              </h3>
              <p className="text-sm text-gray-600">
                On orders above ₹1,000 (excluding sugar, oils, jaggery)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quality Assured
              </h3>
              <p className="text-sm text-gray-600">
                Premium products with quality guarantee
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                WhatsApp Support
              </h3>
              <p className="text-sm text-gray-600">
                Order via WhatsApp: +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
