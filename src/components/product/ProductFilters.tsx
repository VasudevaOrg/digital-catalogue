// src/components/product/ProductFilters.tsx - Fixed with proper filter handling
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Trophy, Tag, Star } from "lucide-react";
import { COMMON_TAGS, ProductFilters as ProductFiltersType } from "@/types";

interface ProductFiltersProps {
  categories: string[];
  availableTags?: string[];
  onFilterChange: (filters: Partial<ProductFiltersType>) => void;
  currentFilters: ProductFiltersType;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories,
  availableTags = [],
  onFilterChange,
  currentFilters,
  onClearFilters,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    recommendations: true,
    price: true,
    sort: true,
  });

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    currentFilters.priceRange
  );

  // Update local price range when currentFilters changes
  useEffect(() => {
    setLocalPriceRange(currentFilters.priceRange);
  }, [currentFilters.priceRange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = currentFilters.category === category ? "" : category;
    onFilterChange({ category: newCategory });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = currentFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    console.log("Tag toggled:", tag, "New tags:", newTags);
    onFilterChange({ tags: newTags });
  };

  const handleRecommendedToggle = () => {
    console.log("Recommended toggled:", !currentFilters.isRecommended);
    onFilterChange({ isRecommended: !currentFilters.isRecommended });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max];
    setLocalPriceRange(newRange);
    console.log("Price range changed:", newRange);
    onFilterChange({ priceRange: newRange });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    console.log("Sort changed:", sortBy, sortOrder);
    onFilterChange({ sortBy: sortBy as any, sortOrder });
  };

  const hasActiveFilters =
    currentFilters.category ||
    currentFilters.searchQuery ||
    currentFilters.isRecommended ||
    (currentFilters.tags && currentFilters.tags.length > 0) ||
    currentFilters.priceRange[0] > 0 ||
    currentFilters.priceRange[1] < 10000;

  // Combine available tags with common tags
  const allTags = Array.from(new Set([...COMMON_TAGS, ...availableTags]));

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            Filters Applied
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          {currentFilters.category && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              Category: {currentFilters.category}
              <button
                onClick={() => handleCategoryChange("")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentFilters.isRecommended && (
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
              <Trophy className="w-3 h-3 mr-1" />
              Recommended
              <button
                onClick={handleRecommendedToggle}
                className="ml-2 text-yellow-600 hover:text-yellow-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentFilters.tags &&
            currentFilters.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.replace("-", " ")}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

          {(currentFilters.priceRange[0] > 0 ||
            currentFilters.priceRange[1] < 10000) && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
              Price: ₹{currentFilters.priceRange[0]} - ₹
              {currentFilters.priceRange[1]}
              <button
                onClick={() => handlePriceRangeChange(0, 10000)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Recommendations Filter */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("recommendations")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Recommendations</h3>
          </div>
          {expandedSections.recommendations ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.recommendations && (
          <div className="p-4">
            <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={currentFilters.isRecommended || false}
                onChange={handleRecommendedToggle}
                className="mr-3 w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                <span className="text-gray-700 font-medium">
                  Show only recommended products
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-semibold text-gray-900">Categories</h3>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            <button
              onClick={() => handleCategoryChange("")}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                !currentFilters.category
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentFilters.category === category
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags Filter */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("tags")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-2 text-green-600" />
            <h3 className="font-semibold text-gray-900">Product Tags</h3>
          </div>
          {expandedSections.tags ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.tags && (
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            {allTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={currentFilters.tags?.includes(tag) || false}
                  onChange={() => handleTagToggle(tag)}
                  className="mr-3 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 capitalize">
                  {tag.replace("-", " ")}
                </span>
                {tag === "recommended" && (
                  <Trophy className="w-3 h-3 ml-2 text-yellow-500" />
                )}
                {tag === "best-selling" && (
                  <Star className="w-3 h-3 ml-2 text-purple-500" />
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
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
                <span>₹{localPriceRange[0]}</span>
                <span>₹{localPriceRange[1]}</span>
              </div>

              {/* Min Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={localPriceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value <= localPriceRange[1]) {
                      handlePriceRangeChange(value, localPriceRange[1]);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <label className="text-xs text-gray-500">Min Price</label>
              </div>

              {/* Max Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={localPriceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= localPriceRange[0]) {
                      handlePriceRangeChange(localPriceRange[0], value);
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <label className="text-xs text-gray-500">Max Price</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={localPriceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value <= localPriceRange[1]) {
                      handlePriceRangeChange(value, localPriceRange[1]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={localPriceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10000;
                    if (value >= localPriceRange[0]) {
                      handlePriceRangeChange(localPriceRange[0], value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick Price Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                [0, 100],
                [100, 500],
                [500, 1000],
                [1000, 2000],
                [2000, 10000],
              ].map(([min, max]) => (
                <button
                  key={`${min}-${max}`}
                  onClick={() => handlePriceRangeChange(min, max)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    localPriceRange[0] === min && localPriceRange[1] === max
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  ₹{min} - ₹{max === 10000 ? "10k+" : max}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection("sort")}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
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
              {
                label: "Recommended First",
                sortBy: "recommended",
                sortOrder: "desc" as const,
              },
            ].map((option) => (
              <button
                key={`${option.sortBy}-${option.sortOrder}`}
                onClick={() =>
                  handleSortChange(option.sortBy, option.sortOrder)
                }
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentFilters.sortBy === option.sortBy &&
                  currentFilters.sortOrder === option.sortOrder
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
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
