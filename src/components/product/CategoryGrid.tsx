// src/components/product/CategoryGrid.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CategoryCardSkeleton } from "@/components/ui/SkeletonLoader";

interface CategoryGridProps {
  categories: string[];
  isLoading?: boolean;
  showAll?: boolean;
}

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

export function CategoryGrid({
  categories,
  isLoading = false,
  showAll = false,
}: CategoryGridProps) {
  // Show skeleton loading
  if (isLoading) {
    const skeletonCount = showAll ? 12 : 6;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 rounded-2xl p-8 max-w-md mx-auto"
        >
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-600 font-medium">No categories available</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back soon for amazing categories!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {categories.map((category, index) => {
        const config = getCategoryConfig(category);

        return (
          <motion.div
            key={category}
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
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group block h-full"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Icon Background */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <span className="text-2xl filter drop-shadow-sm">
                    {config.icon}
                  </span>
                </div>

                {/* Category Name */}
                <h3 className="text-sm md:text-base font-bold text-gray-800 text-center mb-2 group-hover:text-gray-900 transition-colors duration-300 leading-tight flex-grow">
                  {category}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 text-center leading-relaxed group-hover:text-gray-600 transition-colors duration-300 mb-4">
                  {config.description}
                </p>

                {/* Shop Now Button */}
                <div className="text-center">
                  <div className="inline-flex items-center text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    <span>Shop Now</span>
                    <svg
                      className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-300"
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

                {/* Hover Arrow */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-600"
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
  );
}
