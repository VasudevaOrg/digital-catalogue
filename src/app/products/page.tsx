// src/app/products/page.tsx - Fixed with proper filter handling
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
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductsPageSkeleton } from "@/components/ui/SkeletonLoader";
import { Pagination } from "@/components/ui/Pagination";
import {
  Filter,
  X,
  ShoppingBag,
  Grid,
  List,
  SlidersHorizontal,
  Trophy,
  Tag,
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
        const isRecommended = searchParams.get("recommended") === "true";
        const tagsParam = searchParams.get("tags");
        const tags = tagsParam ? tagsParam.split(",") : [];
        const minPrice = parseInt(searchParams.get("minPrice") || "0");
        const maxPrice = parseInt(searchParams.get("maxPrice") || "10000");

        const urlFilters = {
          category,
          searchQuery: search,
          sortBy: "name" as const,
          sortOrder: "asc" as const,
          priceRange: [minPrice, maxPrice] as [number, number],
          isRecommended,
          tags,
        };

        console.log("Initial URL filters:", urlFilters);

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
    console.log("Filter change requested:", newFilters);

    const updatedFilters = { ...localFilters, ...newFilters };
    console.log("Updated filters:", updatedFilters);

    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));
    setCurrentPage(1);

    // Update URL parameters
    const params = new URLSearchParams();
    if (updatedFilters.category) {
      params.set("category", updatedFilters.category);
    }
    if (updatedFilters.searchQuery) {
      params.set("search", updatedFilters.searchQuery);
    }
    if (updatedFilters.isRecommended) {
      params.set("recommended", "true");
    }
    if (updatedFilters.tags && updatedFilters.tags.length > 0) {
      params.set("tags", updatedFilters.tags.join(","));
    }
    if (updatedFilters.priceRange[0] > 0) {
      params.set("minPrice", updatedFilters.priceRange[0].toString());
    }
    if (updatedFilters.priceRange[1] < 10000) {
      params.set("maxPrice", updatedFilters.priceRange[1].toString());
    }
    params.set("page", "1");

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);

    try {
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
    } catch (error) {
      console.error("Error applying filters:", error);
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
      isRecommended: false,
      tags: [],
    };

    console.log("Clearing filters");
    setLocalFilters(clearedFilters);
    dispatch(clearFilters());
    setCurrentPage(1);
    router.push("/products");

    const result = await dispatch(
      fetchProducts({
        page: 1,
        limit: productsPerPage,
        filters: clearedFilters,
      })
    );

    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }
  };

  const handleSortChange = async (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      "name" | "price" | "newest" | "recommended",
      "asc" | "desc"
    ];
    console.log("Sort change:", sortBy, sortOrder);
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            {localFilters.isRecommended
              ? "Recommended Products"
              : "All Products"}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-gray-900 font-medium text-sm sm:text-base">
                {localFilters.category
                  ? `Category: ${localFilters.category}`
                  : localFilters.searchQuery
                  ? `Search results for: "${localFilters.searchQuery}"`
                  : localFilters.isRecommended
                  ? "Specially recommended products for you"
                  : "Browse our complete collection"}
              </p>

              {/* Active filters display */}
              {(localFilters.isRecommended ||
                (localFilters.tags && localFilters.tags.length > 0) ||
                localFilters.priceRange[0] > 0 ||
                localFilters.priceRange[1] < 10000) && (
                <div className="flex flex-wrap gap-2">
                  {localFilters.isRecommended && (
                    <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Trophy className="w-3 h-3 mr-1" />
                      Recommended
                    </span>
                  )}
                  {localFilters.tags &&
                    localFilters.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.replace("-", " ")}
                      </span>
                    ))}
                  {(localFilters.priceRange[0] > 0 ||
                    localFilters.priceRange[1] < 10000) && (
                    <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      ₹{localFilters.priceRange[0]} - ₹
                      {localFilters.priceRange[1]}
                    </span>
                  )}
                </div>
              )}
            </div>

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
              <ProductFilters
                categories={categories}
                onFilterChange={handleFilterChange}
                currentFilters={localFilters}
                onClearFilters={handleClearFilters}
              />
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
                  className="flex items-center justify-center bg-white border border-gray-300 text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {(localFilters.category ||
                    localFilters.searchQuery ||
                    localFilters.isRecommended ||
                    (localFilters.tags && localFilters.tags.length > 0) ||
                    localFilters.priceRange[0] > 0 ||
                    localFilters.priceRange[1] < 10000) && (
                    <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>

                {/* Sort Dropdown - Mobile */}
                <div className="flex-1">
                  <select
                    value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:border-blue-500 shadow-sm"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="recommended-desc">Recommended First</option>
                    <option value="newest-desc">Newest First</option>
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
            </div>

            {/* Results count and loading indicator */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <div className="flex items-center text-gray-900 font-medium">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading products...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-900 font-medium">
                    <span>
                      Showing {(currentPage - 1) * productsPerPage + 1} -{" "}
                      {Math.min(currentPage * productsPerPage, totalProducts)}{" "}
                      of {totalProducts} products
                    </span>
                    <span className="text-xs text-gray-600 font-inter">
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
                    {(localFilters.category ||
                      localFilters.searchQuery ||
                      localFilters.isRecommended ||
                      (localFilters.tags && localFilters.tags.length > 0) ||
                      localFilters.priceRange[0] > 0 ||
                      localFilters.priceRange[1] < 10000) && (
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

              <ProductFilters
                categories={categories}
                onFilterChange={(filters) => {
                  handleFilterChange(filters);
                  setShowFilters(false);
                }}
                currentFilters={localFilters}
                onClearFilters={() => {
                  handleClearFilters();
                  setShowFilters(false);
                }}
              />

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
