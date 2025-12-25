// src/app/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCategories, fetchProducts } from "@/store/slices/productSlice";
import { CategoriesGridSkeleton } from "@/components/ui/SkeletonLoader";
import Link from "next/link";
import { ArrowLeft, Package, Search } from "lucide-react";

const categoryConfig: Record<
  string,
  { icon: string; gradient: string; description: string }
> = {
  "Rice & Grains": {
    icon: "🌾",
    gradient: "from-amber-400 to-orange-500",
    description: "Premium quality rice & grains",
  },
  Oils: {
    icon: "🫒",
    gradient: "from-yellow-400 to-amber-500",
    description: "Pure & healthy cooking oils",
  },
  "Sugar & Sweeteners": {
    icon: "🍯",
    gradient: "from-pink-400 to-rose-500",
    description: "Natural sweeteners & sugar",
  },
  "Fruits & Vegetables": {
    icon: "🥬",
    gradient: "from-green-400 to-emerald-500",
    description: "Fresh fruits & vegetables",
  },
  "Spices & Herbs": {
    icon: "🌶️",
    gradient: "from-red-400 to-pink-500",
    description: "Aromatic spices & herbs",
  },
  "Pulses & Lentils": {
    icon: "🫘",
    gradient: "from-orange-400 to-red-500",
    description: "Protein-rich pulses & lentils",
  },
  "Dairy Products": {
    icon: "🥛",
    gradient: "from-blue-400 to-indigo-500",
    description: "Fresh dairy products",
  },
  Seafood: {
    icon: "🐟",
    gradient: "from-cyan-400 to-blue-500",
    description: "Fresh seafood selection",
  },
  Snacks: {
    icon: "🍿",
    gradient: "from-purple-400 to-pink-500",
    description: "Delicious snacks & treats",
  },
  Beverages: {
    icon: "☕",
    gradient: "from-indigo-400 to-purple-500",
    description: "Refreshing beverages",
  },
  Bakery: {
    icon: "🥖",
    gradient: "from-yellow-300 to-orange-400",
    description: "Fresh baked goods",
  },
  "Frozen Foods": {
    icon: "🧊",
    gradient: "from-blue-300 to-cyan-400",
    description: "Frozen & chilled items",
  },
  "Personal Care": {
    icon: "🧴",
    gradient: "from-pink-300 to-purple-400",
    description: "Health & beauty products",
  },
  "Household Items": {
    icon: "🧽",
    gradient: "from-green-300 to-teal-400",
    description: "Cleaning & home essentials",
  },
};

const getCategoryConfig = (category: string) => {
  return (
    categoryConfig[category] || {
      icon: "📦",
      gradient: "from-gray-400 to-slate-500",
      description: "Quality products",
    }
  );
};

interface CategoryWithCount {
  name: string;
  count: number;
  isLoading: boolean;
}

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories, isLoading, error, products } = useAppSelector(
    (state) => state.products
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<
    CategoryWithCount[]
  >([]);
  const [filteredCategories, setFilteredCategories] = useState<
    CategoryWithCount[]
  >([]);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  // Load categories
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Load product counts for each category
  useEffect(() => {
    const loadCategoryCounts = async () => {
      if (categories.length === 0) return;

      setIsLoadingCounts(true);
      const categoriesWithCountsTemp: CategoryWithCount[] = categories.map(
        (category) => ({
          name: category,
          count: 0,
          isLoading: true,
        })
      );

      setCategoriesWithCounts(categoriesWithCountsTemp);

      // Load product counts for each category
      const countPromises = categories.map(async (category) => {
        try {
          const result = await dispatch(
            fetchProducts({
              page: 1,
              limit: 1, // We only need the count, not the actual products
              filters: {
                category,
                searchQuery: "",
                sortBy: "name",
                sortOrder: "asc",
                priceRange: [0, 10000],
              },
            })
          );

          return {
            category,
            count: result.payload?.pagination?.total || 0,
          };
        } catch (error) {
          console.error(
            `Error fetching count for category ${category}:`,
            error
          );
          return {
            category,
            count: 0,
          };
        }
      });

      // Wait for all counts to be loaded
      const counts = await Promise.all(countPromises);

      // Update categories with actual counts
      const updatedCategories = categories.map((category) => {
        const countData = counts.find((c) => c.category === category);
        return {
          name: category,
          count: countData?.count || 0,
          isLoading: false,
        };
      });

      setCategoriesWithCounts(updatedCategories);
      setIsLoadingCounts(false);
    };

    if (categories.length > 0) {
      loadCategoryCounts();
    }
  }, [categories, dispatch]);

  // Filter categories based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = categoriesWithCounts.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categoriesWithCounts);
    }
  }, [searchQuery, categoriesWithCounts]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Unable to load categories
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                All Categories
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Discover our complete range of products across all categories
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading || isLoadingCounts ? (
          <CategoriesGridSkeleton />
        ) : (
          <>
            {filteredCategories.length > 0 ? (
              <>
                <div className="text-gray-600 mb-6 flex items-center justify-between">
                  <span>Showing {filteredCategories.length} categories</span>
                  <div className="text-sm">
                    {isLoadingCounts ? (
                      <span className="flex items-center">
                        <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading product counts...
                      </span>
                    ) : (
                      <span>
                        Total products:{" "}
                        {filteredCategories.reduce(
                          (sum, cat) => sum + cat.count,
                          0
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredCategories.map((categoryData, index) => {
                    const config = getCategoryConfig(categoryData.name);

                    return (
                      <motion.div
                        key={categoryData.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={`/products?category=${encodeURIComponent(
                            categoryData.name
                          )}`}
                          className="group block"
                        >
                          <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                            {/* Background Gradient */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                            ></div>

                            {/* Icon Background */}
                            <div
                              className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg`}
                            >
                              <span className="text-3xl filter drop-shadow-sm">
                                {config.icon}
                              </span>
                            </div>

                            {/* Category Info */}
                            <div className="text-center">
                              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                                {categoryData.name}
                              </h3>

                              <p className="text-sm text-gray-500 mb-4 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                                {config.description}
                              </p>

                              {/* Product Count */}
                              <div className="inline-flex items-center px-3 py-1 bg-gray-100 group-hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors duration-300">
                                {categoryData.isLoading ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  `${categoryData.count} ${
                                    categoryData.count === 1 ? "item" : "items"
                                  }`
                                )}
                              </div>

                              {/* Stock Status */}
                              {!categoryData.isLoading && (
                                <div className="mt-2">
                                  {categoryData.count === 0 ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Out of Stock
                                    </span>
                                  ) : categoryData.count < 5 ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Limited Stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      In Stock
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              <div className="w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No categories found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              Contact us for special requests or if you need help finding a
              specific product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Contact Support
              </Link>
              <button
                onClick={() =>
                  window.open("https://wa.me/919448132930", "_blank")
                }
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
