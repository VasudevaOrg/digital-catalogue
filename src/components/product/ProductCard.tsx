// src/components/product/ProductCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { Product } from "@/types";
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  index?: number;
  isLoading?: boolean;
}

export function ProductCard({
  product,
  showAddToCart = true,
  index = 0,
  isLoading = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageLoading, setImageLoading] = useState(true);

  // Show skeleton if loading
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(showSuccessNotification(`${product.name} added to cart!`));
  };

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="group relative w-full"
    >
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 h-full flex flex-col">
        {/* Image Container */}
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {/* Image Loading Skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}

            {/* Out of Stock Badge - Only Essential Badge */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
              {product.category}
            </span>
            <div className="flex items-center text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs text-gray-500 ml-1">4.8</span>
            </div>
          </div>

          {/* Product Name - Link to product page */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200 leading-tight text-sm sm:text-base line-clamp-2 cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <Link href={`/products/${product.id}`} className="block flex-1">
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed cursor-pointer">
              {product.description}
            </p>
          </Link>

          {/* Price and Stock Info */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-lg sm:text-xl font-bold text-gray-800">
                  ₹{product.price}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  /{product.weight}kg
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Available</div>
              <div
                className={`text-xs font-medium ${
                  product.stock < 10 ? "text-orange-600" : "text-green-600"
                }`}
              >
                {product.stock} units
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && (
            <div className="mt-auto">
              {!isOutOfStock ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg font-medium cursor-not-allowed text-sm"
                >
                  Out of Stock
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
