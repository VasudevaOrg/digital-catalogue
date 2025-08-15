// src/components/product/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { Product } from "@/types";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(showSuccessNotification(`${product.name} added to cart!`));
    setQuantity(1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="bg-white border rounded hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 ${
                isHovered ? "scale-105" : ""
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
          )}

          {/* Badges */}
          {(isOutOfStock || product.isEligibleForFreeDelivery) && (
            <div className="absolute top-1 left-1 space-y-1">
              {isOutOfStock && (
                <span className="block bg-red-500 text-white px-1.5 py-0.5 text-xs rounded">
                  Out of Stock
                </span>
              )}
              {product.isEligibleForFreeDelivery && !isOutOfStock && (
                <span className="block bg-green-600 text-white px-1.5 py-0.5 text-xs rounded">
                  Free Delivery
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm text-gray-800 mb-1 hover:text-gray-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              /{product.weight}kg
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        {/* Quantity and Add to Cart */}
        {showAddToCart && !isOutOfStock && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 text-sm">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-1 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
          </div>
        )}

        {isOutOfStock && (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 py-1.5 rounded text-sm cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
