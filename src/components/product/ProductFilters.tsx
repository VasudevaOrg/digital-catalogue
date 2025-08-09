// src/components/product/ProductFilters.tsx
"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setFilters, clearFilters } from "@/store/slices/productSlice";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.products);

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(
      setFilters({
        category: filters.category === category ? "" : category,
      })
    );
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(setFilters({ priceRange: [min, max] }));
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    dispatch(setFilters({ sortBy: sortBy as any, sortOrder }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters =
    filters.category ||
    filters.searchQuery ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10000;

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            Filters Applied
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="border border-gray-200">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200"
        >
          <h3 className="font-semibold text-gray-900">Categories</h3>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="p-4 space-y-2">
            <button
              onClick={() => handleCategoryChange("")}
              className={`block w-full text-left px-3 py-2 text-sm border ${
                !filters.category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50 border-gray-300"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 text-sm border ${
                  filters.category === category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50 border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border border-gray-200">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200"
        >
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange(
                    filters.priceRange[0],
                    parseInt(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  handlePriceRangeChange(
                    parseInt(e.target.value) || 0,
                    filters.priceRange[1]
                  )
                }
                className="px-3 py-2 border border-gray-300 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange(
                    filters.priceRange[0],
                    parseInt(e.target.value) || 10000
                  )
                }
                className="px-3 py-2 border border-gray-300 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="border border-gray-200">
        <button
          onClick={() => toggleSection("sort")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200"
        >
          <h3 className="font-semibold text-gray-900">Sort By</h3>
          {expandedSections.sort ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.sort && (
          <div className="p-4 space-y-2">
            {[
              {
                label: "Name (A-Z)",
                sortBy: "name",
                sortOrder: "asc" as const,
              },
              {
                label: "Name (Z-A)",
                sortBy: "name",
                sortOrder: "desc" as const,
              },
              {
                label: "Price (Low to High)",
                sortBy: "price",
                sortOrder: "asc" as const,
              },
              {
                label: "Price (High to Low)",
                sortBy: "price",
                sortOrder: "desc" as const,
              },
              {
                label: "Newest First",
                sortBy: "newest",
                sortOrder: "desc" as const,
              },
            ].map((option) => (
              <button
                key={`${option.sortBy}-${option.sortOrder}`}
                onClick={() =>
                  handleSortChange(option.sortBy, option.sortOrder)
                }
                className={`block w-full text-left px-3 py-2 text-sm border ${
                  filters.sortBy === option.sortBy &&
                  filters.sortOrder === option.sortOrder
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50 border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
