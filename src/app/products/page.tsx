// src/app/products/page.tsx
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
import { Filter, X, ShoppingBag, Grid, List } from "lucide-react";

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
  const [productsPerPage] = useState(20); // Show 20 products per page

  // Load initial data and apply URL parameters
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories first
        await dispatch(fetchCategories());

        // Get URL parameters
        const category = searchParams.get("category") || "";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");

        // Update filters from URL
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

        // Fetch products with filters and pagination
        const result = await dispatch(
          fetchProducts({
            page: page,
            limit: productsPerPage,
            filters: urlFilters,
          })
        );

        // Handle pagination data
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
    setCurrentPage(1); // Reset to first page when filters change

    // Update URL
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

    // Fetch products with new filters
    const result = await dispatch(
      fetchProducts({
        page: 1,
        limit: productsPerPage,
        filters: updatedFilters,
      })
    );

    // Update pagination data
    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    // Update URL with new page
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);

    // Fetch products for new page
    const result = await dispatch(
      fetchProducts({
        page: page,
        limit: productsPerPage,
        filters: localFilters,
      })
    );

    // Update pagination data
    if (result.payload && result.payload.pagination) {
      setTotalProducts(result.payload.pagination.total);
      setTotalPages(result.payload.pagination.totalPages);
    }

    // Scroll to top
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

    // Fetch all products
    const result = await dispatch(
      fetchProducts({
        page: 1,
        limit: productsPerPage,
      })
    );

    // Update pagination data
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            All Products
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {localFilters.category
                ? `Category: ${localFilters.category}`
                : localFilters.searchQuery
                ? `Search results for: "${localFilters.searchQuery}"`
                : "Browse our complete collection"}
            </p>

            {/* View Mode Toggle */}
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

        <div className="flex gap-8">
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
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              {(localFilters.category || localFilters.searchQuery) && (
                <span className="text-sm text-gray-600">
                  {localFilters.category &&
                    `Category: ${localFilters.category}`}
                  {localFilters.searchQuery &&
                    `Search: ${localFilters.searchQuery}`}
                </span>
              )}
            </div>

            {/* Results count and loading indicator */}
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading products...
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
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

              {/* Mobile Sort */}
              <div className="lg:hidden">
                <select
                  value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <>
              {products.length > 0 ? (
                <>
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                        : "space-y-4"
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
                    <div className="mt-12 flex justify-center">
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
                <div className="text-center py-12 bg-white rounded-lg">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  {(localFilters.category || localFilters.searchQuery) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-gray-800 hover:text-gray-900 underline"
                    >
                      View all products
                    </button>
                  )}
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto animate-slide-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mobile-category"
                      value=""
                      checked={localFilters.category === ""}
                      onChange={() => {
                        handleFilterChange({ category: "" });
                        setShowFilters(false);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="mobile-category"
                        value={category}
                        checked={localFilters.category === category}
                        onChange={() => {
                          handleFilterChange({ category });
                          setShowFilters(false);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                  onChange={(e) => {
                    handleSortChange(e.target.value);
                    setShowFilters(false);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gray-800 text-white py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
