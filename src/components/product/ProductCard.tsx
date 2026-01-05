// src/components/product/ProductCard.tsx - Complete with Stock Validation
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/store/slices/uiSlice";
import { Product, WEIGHT_UNIT_LABELS } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
} from "@/lib/discountUtils";
import { ProductCardSkeleton } from "../ui/SkeletonLoader";
import { DiscountBadgeCompact } from "@/components/product/DiscountBadge";
import { DiscountPriceDisplay } from "@/components/product/DiscountPriceDisplay";
import { QuantityDiscountBadge } from "./QuantityDiscountTiers";
import {
  ShoppingCart,
  Star,
  Trophy,
  Tag,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  index?: number;
  isLoading?: boolean;
  layout?: "grid" | "list";
}

export function ProductCard({
  product,
  showAddToCart = true,
  index = 0,
  isLoading = false,
  layout = "grid",
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const [imageLoading, setImageLoading] = useState(true);

  // Show skeleton if loading
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  // Calculate available stock (considering items already in cart)
  const getAvailableStock = () => {
    const cartItem = cart.items.find((item) => item.product.id === product.id);
    const quantityInCart = cartItem?.quantity || 0;
    const availableStock = product.stock - quantityInCart;
    return Math.max(0, availableStock);
  };

  const availableStock = getAvailableStock();
  const isOutOfStock = product.stock === 0 || availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate stock before adding
    if (isOutOfStock) {
      dispatch(
        showErrorNotification(`${product.name} is currently out of stock`)
      );
      return;
    }

    // Always add only 1 unit from product card
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const hasDiscount = product.discount && isDiscountActive(product.discount);

  // Get tag icon based on tag name
  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "recommended":
        return <Trophy className="w-3 h-3" />;
      case "best-selling":
        return <Star className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  // Get tag color based on tag name
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "recommended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "best-selling":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "fresh":
        return "bg-green-100 text-green-800 border-green-200";
      case "organic":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "premium":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "new-arrival":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "discounted":
        return "bg-red-100 text-red-800 border-red-200";
      case "limited-offer":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format weight display
  const formatWeight = () => {
    const unit = WEIGHT_UNIT_LABELS[product.weightUnit] || product.weightUnit;
    if (product.weightUnit === "grams" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} kg`;
    }
    if (product.weightUnit === "ml" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} L`;
    }
    return `${product.weight} ${unit.split(" ")[1] || unit}`;
  };

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: "easeOut",
        }}
        className="group relative w-full"
      >
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 p-4">
          <div className="flex gap-4">
            {/* Image */}
            <Link
              href={`/products/${product.id}`}
              className="block flex-shrink-0"
            >
              <div className="relative w-24 h-24 overflow-hidden bg-gray-50 rounded-lg">
                {/* Discount Badge */}
                {hasDiscount && !isOutOfStock && (
                  <DiscountBadgeCompact product={product} quantity={1} />
                )}

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
                    sizes="96px"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(
                            tag
                          )}`}
                        >
                          {getTagIcon(tag)}
                          <span className="ml-1 capitalize">
                            {tag.replace("-", " ")}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 transition-colors duration-200 text-base cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center text-yellow-500 ml-4">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs text-gray-500 ml-1">4.8</span>
                </div>
              </div>

              <Link href={`/products/${product.id}`} className="block">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed cursor-pointer">
                  {product.description}
                </p>
              </Link>

              {/* Quantity Discount Badge */}
              {hasDiscount &&
                product.discount?.type !== "simple" &&
                !isOutOfStock && (
                  <div className="mb-2">
                    <QuantityDiscountBadge product={product} />
                  </div>
                )}

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  {/* Price Display with Discount */}
                  <DiscountPriceDisplay
                    product={product}
                    quantity={1}
                    className="mb-1"
                  />
                  <div className="text-sm text-gray-500">
                    per {formatWeight()}
                  </div>

                  {/* Stock Status */}
                  {/* <div className="mt-1">
                    {isOutOfStock ? (
                      <span className="text-xs text-red-600 font-medium flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-xs text-orange-600 font-medium flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Only {availableStock} left!
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-medium flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {availableStock} available
                      </span>
                    )}
                  </div> */}
                </div>

                {showAddToCart && (
                  <div>
                    {!isOutOfStock ? (
                      <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-400 py-2 px-4 rounded-lg font-medium cursor-not-allowed text-sm"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout
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
          <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
            {/* Discount Badge */}
            {hasDiscount && !isOutOfStock && (
              <DiscountBadgeCompact product={product} quantity={1} />
            )}

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

            {/* Recommended Badge */}
            {product.isRecommended && !hasDiscount && !isOutOfStock && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center shadow-lg">
                  <Trophy className="w-3 h-3 mr-1" />
                  Recommended
                </span>
              </div>
            )}

            {/* Out of Stock Badge */}
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

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getTagColor(
                    tag
                  )}`}
                >
                  {getTagIcon(tag)}
                  <span className="ml-1 capitalize text-xs">
                    {tag.replace("-", " ")}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Product Name */}
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

          {/* Quantity Discount Info */}
          {hasDiscount &&
            product.discount?.type !== "simple" &&
            !isOutOfStock && (
              <div className="mb-2">
                <QuantityDiscountBadge product={product} />
              </div>
            )}

          {/* Price and Stock Info */}
          <div className="mb-3">
            <DiscountPriceDisplay
              product={product}
              quantity={1}
              className="mb-1"
            />
            <div className="flex items-baseline text-xs text-gray-500">
              <span>per {formatWeight()}</span>
            </div>

            {/* Stock Status */}
            {/* <div className="mt-2">
              {isOutOfStock ? (
                <span className="text-xs text-red-600 font-medium flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Out of stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs text-orange-600 font-medium flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Only {availableStock} left!
                </span>
              ) : (
                <span className="text-xs text-green-600 font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {availableStock} available
                </span>
              )}
            </div> */}
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
