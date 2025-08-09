// src/components/product/CategoryGrid.tsx
"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils";
import {
  Wheat,
  Droplets,
  Cookie,
  Apple,
  Coffee,
  Beef,
  Fish,
  Milk,
  ShoppingBasket,
} from "lucide-react";

interface CategoryGridProps {
  categories: string[];
}

// Category icons mapping
const categoryIcons: Record<string, JSX.Element> = {
  "rice & grains": <Wheat className="w-8 h-8" />,
  oils: <Droplets className="w-8 h-8" />,
  "sugar & sweeteners": <Cookie className="w-8 h-8" />,
  "fruits & vegetables": <Apple className="w-8 h-8" />,
  "spices & herbs": <Coffee className="w-8 h-8" />,
  "pulses & lentils": <Beef className="w-8 h-8" />,
  "dairy products": <Milk className="w-8 h-8" />,
  seafood: <Fish className="w-8 h-8" />,
  snacks: <Cookie className="w-8 h-8" />,
  beverages: <Coffee className="w-8 h-8" />,
  default: <ShoppingBasket className="w-8 h-8" />,
};

// Category colors mapping
const categoryColors: Record<string, string> = {
  "rice & grains": "from-yellow-400 to-orange-500",
  oils: "from-amber-400 to-yellow-600",
  "sugar & sweeteners": "from-pink-400 to-rose-500",
  "fruits & vegetables": "from-green-400 to-emerald-600",
  "spices & herbs": "from-red-400 to-orange-600",
  "pulses & lentils": "from-brown-400 to-yellow-600",
  "dairy products": "from-blue-400 to-cyan-500",
  seafood: "from-teal-400 to-blue-500",
  snacks: "from-purple-400 to-pink-500",
  beverages: "from-indigo-400 to-purple-500",
  default: "from-gray-400 to-gray-600",
};

function getCategoryIcon(category: string): JSX.Element {
  const key = category.toLowerCase();
  return categoryIcons[key] || categoryIcons.default;
}

function getCategoryColor(category: string): string {
  const key = category.toLowerCase();
  return categoryColors[key] || categoryColors.default;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories.length) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {categories.map((category, index) => {
        const categorySlug = slugify(category);
        const gradientColors = getCategoryColor(category);
        const categoryIcon = getCategoryIcon(category);

        return (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="group"
          >
            <div
              className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-transparent animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative p-6 text-center">
                {/* Icon */}
                <div
                  className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 
                  bg-gradient-to-br ${gradientColors} text-white shadow-lg
                  group-hover:scale-110 transition-transform duration-300
                `}
                >
                  {categoryIcon}
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-primary-600 transition-colors duration-200 leading-tight">
                  {category}
                </h3>

                {/* Hover Arrow */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="inline-flex items-center text-xs text-primary-600 font-medium">
                    <span>Browse</span>
                    <svg
                      className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
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
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${gradientColors} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />
              </div>

              <div className="absolute bottom-0 left-0 w-16 h-16 transform -translate-x-8 translate-y-8">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${gradientColors} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />
              </div>
            </div>
          </Link>
        );
      })}

      {/* View All Categories Card */}
      <Link href="/products" className="group">
        <div
          className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary-200 animate-fadeInUp"
          style={{ animationDelay: `${categories.length * 100}ms` }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative p-6 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-primary-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingBasket className="w-8 h-8" />
            </div>

            {/* Text */}
            <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-primary-600 transition-colors duration-200 leading-tight">
              View All Products
            </h3>

            {/* Arrow */}
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="inline-flex items-center text-xs text-primary-600 font-medium">
                <span>Browse All</span>
                <svg
                  className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
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
          </div>
        </div>
      </Link>
    </div>
  );
}
