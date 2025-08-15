// src/components/product/FeaturedProducts.tsx
"use client";

import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          View All Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
