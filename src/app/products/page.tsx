// src/app/products/page.tsx - Responsive Layout
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProducts,
  fetchCategories,
  setFilters,
  clearFilters,
} from "@/store/slices/productSlice";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductsPageSkeleton } from "@/components/ui/SkeletonLoader";
import { Pagination } from "@/components/ui/Pagination";
import {
  Filter,
  X,
  ShoppingBag,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { products, categories, isLoading, error, filters } = useAppSelector(
    (state) => state.products
  );

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [isInitialized, setIsInitialized] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(20);

  // Load initial data and apply URL parameters
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchCategories());

        const category = searchParams.get("category") || "";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");

        const urlFilters = {
          category,
          searchQuery: search,
          sortBy: "name" as const,
          sortOrder: "asc" as const,
          priceRange: [0, 10000] as [number, number],
        };

        dispatch(setFilters(urlFilters));
        setLocalFilters(urlFilters);
        setCurrentPage(page);

        const result = await dispatch(
          fetchProducts({
            page: page,
            limit: productsPerPage,
            filters: urlFilters,
          })
        );

        if (result.payload && result.payload.pagination) {
          setTotalProducts(result.payload.pagination.total);
          setTotalPages(result.payload.pagination.totalPages);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading products page:", error);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      loadData();
    }
  }, [dispatch, searchParams, isInitialized, productsPerPage]);

  // Handle filter changes
  const handleFilterChange = async (newFilters: any) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (updatedFilters.category) {
      params.set("category", updatedFilters.category);
    }
    if (updatedFilters.searchQuery) {
      params.set("search", updatedFilters.searchQuery);
    }
    params.set("page", "1");

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);

    const result = await dispatch(
      fetchProducts({
        page: 1,
        limit: productsPerPage,
        filters: updatedFilters,
      })
    );

    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);

    const result = await dispatch(
      fetchProducts({
        page: page,
        limit: productsPerPage,
        filters: localFilters,
      })
    );

    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      category: "",
      searchQuery: "",
      sortBy: "name" as const,
      sortOrder: "asc" as const,
      priceRange: [0, 10000] as [number, number],
    };

    setLocalFilters(clearedFilters);
    dispatch(clearFilters());
    setCurrentPage(1);
    router.push("/products");

    const result = await dispatch(
      fetchProducts({
        page: 1,
        limit: productsPerPage,
      })
    );

    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }
  };

  const handleSortChange = async (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      "name" | "price" | "newest",
      "asc" | "desc"
    ];
    await handleFilterChange({ sortBy, sortOrder });
  };

  // Show skeleton loading while initializing
  if (!isInitialized || (isLoading && products.length === 0)) {
    return <ProductsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
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
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2 sm:mb-4">
            All Products
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              {localFilters.category
                ? `Category: ${localFilters.category}`
                : localFilters.searchQuery
                ? `Search results for: "${localFilters.searchQuery}"`
                : "Browse our complete collection"}
            </p>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-800">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <label className="flex items-center cursor-pointer hover:text-gray-900">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={localFilters.category === ""}
                      onChange={() => handleFilterChange({ category: "" })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      All Categories
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center cursor-pointer hover:text-gray-900"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={localFilters.category === category}
                        onChange={() => handleFilterChange({ category })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter and Sort Bar */}
            <div className="lg:hidden mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {(localFilters.category || localFilters.searchQuery) && (
                    <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>

                {/* Sort Dropdown - Mobile */}
                <div className="flex-1">
                  <select
                    value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                  </select>
                </div>

                {/* View Mode Toggle - Mobile */}
                <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(localFilters.category || localFilters.searchQuery) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {localFilters.category && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      Category: {localFilters.category}
                      <button
                        onClick={() => handleFilterChange({ category: "" })}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {localFilters.searchQuery && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      Search: {localFilters.searchQuery}
                      <button
                        onClick={() => handleFilterChange({ searchQuery: "" })}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results count and loading indicator */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading products...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span>
                      Showing {(currentPage - 1) * productsPerPage + 1} -{" "}
                      {Math.min(currentPage * productsPerPage, totalProducts)}{" "}
                      of {totalProducts} products
                    </span>
                    <span className="text-xs text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <>
              {products.length > 0 ? (
                <>
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
                        : "space-y-4 sm:space-y-6"
                    }`}
                  >
                    {products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        isLoading={isLoading}
                        layout={viewMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 sm:mt-12">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalProducts}
                        itemsPerPage={productsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
                    <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Try adjusting your filters or search terms
                    </p>
                    {(localFilters.category || localFilters.searchQuery) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        View all products
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Clear All Filters */}
              {(localFilters.category || localFilters.searchQuery) && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowFilters(false);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-6"
                >
                  Clear All Filters
                </button>
              )}

              {/* Mobile Categories */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-category"
                        value=""
                        checked={localFilters.category === ""}
                        onChange={() => {
                          handleFilterChange({ category: "" });
                          setShowFilters(false);
                        }}
                        className="mr-3"
                      />
                      <span className="text-gray-700">All Categories</span>
                    </label>
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="mobile-category"
                          value={category}
                          checked={localFilters.category === category}
                          onChange={() => {
                            handleFilterChange({ category });
                            setShowFilters(false);
                          }}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
