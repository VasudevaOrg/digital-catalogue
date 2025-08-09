// src/components/product/ProductGrid.tsx
"use client";

import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} layout="list" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fadeInUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} layout="grid" />
        </div>
      ))}
    </div>
  );
}
