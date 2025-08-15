// src/app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { staticProducts, staticCategories } from "@/data/staticProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Filter, X } from "lucide-react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState(staticProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    setSelectedCategory(category);

    // Filter products
    let filtered = [...staticProducts];

    if (category) {
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase() === category.toLowerCase() ||
          p.category === category // Handle exact match for encoded categories
      );
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort products
    const [sortField, sortOrder] = sortBy.split("-");
    filtered.sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    setProducts(filtered);
  }, [searchParams, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    // Update URL with new category
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Keep search param if it exists
    const search = searchParams.get("search");
    if (search) {
      params.set("search", search);
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSortBy("name-asc");

    // Clear URL params but keep search if exists
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) {
      params.set("search", search);
    }

    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {selectedCategory
              ? `Showing: ${selectedCategory}`
              : "Browse our complete collection"}
          </p>
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
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:text-gray-900">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={() => handleCategoryChange("")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      All Categories
                    </span>
                  </label>
                  {staticCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center cursor-pointer hover:text-gray-900"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
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
                  value={sortBy}
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
              {selectedCategory && (
                <span className="text-sm text-gray-600">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length} products
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 mb-4">No products found</p>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="text-gray-800 hover:text-gray-900 underline"
                  >
                    View all products
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filter content */}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mobile-category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={() => {
                        handleCategoryChange("");
                        setShowFilters(false);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {staticCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="mobile-category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => {
                          handleCategoryChange(category);
                          setShowFilters(false);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
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
