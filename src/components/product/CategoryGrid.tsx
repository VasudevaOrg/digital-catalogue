// src/components/product/CategoryGrid.tsx
"use client";

import Link from "next/link";

interface CategoryGridProps {
  categories: string[];
}

const categoryIcons: Record<string, string> = {
  "rice & grains": "🌾",
  oils: "🛢️",
  "sugar & sweeteners": "🍯",
  "fruits & vegetables": "🥬",
  "spices & herbs": "🌶️",
  "pulses & lentils": "🫘",
  "dairy products": "🥛",
  seafood: "🐟",
  snacks: "🍿",
  beverages: "☕",
  default: "📦",
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string): string => {
    const key = category.toLowerCase();
    return categoryIcons[key] || categoryIcons.default;
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/products?category=${encodeURIComponent(category)}`}
          className="group"
        >
          <div className="bg-white border rounded p-3 text-center hover:border-gray-400 hover:shadow-sm transition-all duration-200">
            <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
            <h3 className="text-xs font-medium text-gray-700 group-hover:text-gray-900 line-clamp-2">
              {category}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
