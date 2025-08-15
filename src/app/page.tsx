// src/app/page.tsx
"use client";

import { staticProducts, staticCategories } from "@/data/staticProducts";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { CategoryGrid } from "@/components/product/CategoryGrid";

export default function HomePage() {
  // Use static data
  const products = staticProducts.slice(0, 12);
  const categories = staticCategories;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Categories Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              Shop by Category
            </h1>
            <p className="text-gray-600">Browse our premium collection</p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-gray-800 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">Handpicked quality items for you</p>
        </div>
        <FeaturedProducts products={products} />
      </section>

      {/* Info Section */}
      <section className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Quality Products
              </h3>
              <p className="text-gray-600 text-sm">
                Premium quality groceries and essentials
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Easy Ordering
              </h3>
              <p className="text-gray-600 text-sm">
                Simple WhatsApp ordering process
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Quick Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Fast delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
