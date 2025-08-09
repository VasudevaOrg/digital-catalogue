// src/components/product/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { Product } from "@/types";
import {
  ShoppingCart,
  Plus,
  Minus,
  Weight,
  Package,
  Tag,
  Truck,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  layout = "grid",
  showAddToCart = true,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      dispatch(addToCart({ product, quantity }));
      dispatch(showSuccessNotification(`${product.name} added to cart!`));
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  if (layout === "list") {
    return (
      <div className="bg-white border-2 border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <div className="relative w-24 h-24 bg-gray-50 border-2 border-gray-200 overflow-hidden group">
              <div className="flex items-center justify-center h-full text-gray-400 group-hover:text-gray-600 transition-colors">
                <Package className="w-8 h-8" />
              </div>

              {/* Status Badges */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold bg-red-500 px-2 py-1">
                    Out of Stock
                  </span>
                </div>
              )}

              {isLowStock && !isOutOfStock && (
                <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs font-semibold px-2 py-1">
                  Low Stock
                </div>
              )}

              {product.isEligibleForFreeDelivery && !isOutOfStock && (
                <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-semibold px-1 py-1">
                  <Truck className="w-3 h-3" />
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Weight className="w-4 h-4" />
                    <span>{product.weight}kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.stock} in stock</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 text-xs border border-gray-300 text-gray-700">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.isEligibleForFreeDelivery && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 border border-green-200">
                      Free Delivery Eligible
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Section */}
              {showAddToCart && !isOutOfStock && (
                <div className="flex flex-col items-end gap-3 ml-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border-2 border-gray-300 bg-white">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r-2 border-gray-300 text-gray-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-gray-300 text-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 font-medium flex items-center gap-2 border-2 border-blue-700 transition-colors"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}

              {isOutOfStock && (
                <div className="flex items-center ml-4">
                  <span className="bg-gray-300 text-gray-500 px-4 py-2 font-medium border-2 border-gray-400">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="bg-white border-2 border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-50 border-2 border-gray-200 mb-4 overflow-hidden group-hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-center h-full text-gray-400 group-hover:text-gray-600 transition-colors">
            <Package className="w-16 h-16" />
          </div>

          {/* Status Badges */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-red-500 px-3 py-2">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1">
              Only {product.stock} left!
            </div>
          )}

          {product.isEligibleForFreeDelivery && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Free Delivery</span>
            </div>
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Details */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            <div className="text-xs text-gray-500 text-right">
              <div className="flex items-center gap-1">
                <Weight className="w-3 h-3" />
                <span>{product.weight}kg</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Package className="w-3 h-3" />
                <span>{product.stock} stock</span>
              </div>
            </div>
          </div>

          {product.isEligibleForFreeDelivery && (
            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 border border-green-200 text-center">
              ✓ Eligible for Free Delivery
            </div>
          )}
        </div>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 border border-gray-300 inline-flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        </div>

        {/* Add to Cart Section */}
        {showAddToCart && !isOutOfStock && (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center border-2 border-gray-300 bg-white">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r-2 border-gray-300 text-gray-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-gray-300 text-gray-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 font-medium flex items-center justify-center space-x-2 border-2 border-blue-700 hover:border-blue-800 transition-all duration-200 group-hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        )}

        {isOutOfStock && (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 font-medium cursor-not-allowed border-2 border-gray-400 flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Out of Stock</span>
          </button>
        )}
      </div>
    </div>
  );
}
