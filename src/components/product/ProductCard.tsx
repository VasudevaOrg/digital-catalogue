// src/components/product/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { Product } from "@/types";
import { ShoppingCart, Plus, Minus, Weight, Package } from "lucide-react";

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

  if (layout === "list") {
    return (
      <div className="bg-white border border-gray-200 p-4 mb-3">
        <div className="flex">
          {/* Product Image */}
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <div className="relative w-24 h-24 bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package className="w-8 h-8" />
              </div>
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 ml-4 flex justify-between">
            <div className="flex-1">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Weight className="w-4 h-4" />
                  <span>{product.weight}kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{product.stock} in stock</span>
                </div>
                <span className="bg-gray-100 px-2 py-1 text-xs border">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.isEligibleForFreeDelivery && (
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      Free Delivery
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            {showAddToCart && !isOutOfStock && (
              <div className="flex flex-col items-end justify-between">
                {/* Quantity Selector */}
                <div className="flex items-center gap-2 mb-3 border border-gray-300">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 border-r border-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 border-l border-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 font-medium flex items-center gap-2 border"
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
              <div className="flex items-center">
                <span className="bg-gray-300 text-gray-500 px-4 py-2 font-medium border">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="bg-white border border-gray-200 p-4">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-50 border border-gray-200 mb-4">
          <div className="flex items-center justify-center h-full text-gray-400">
            <Package className="w-16 h-16" />
          </div>

          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {product.isEligibleForFreeDelivery && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold">
              Free Delivery
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {product.weight}kg • {product.stock} in stock
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 border">
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
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 border-r border-gray-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 border-l border-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 font-medium flex items-center justify-center space-x-2 border"
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
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 font-medium cursor-not-allowed border"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
