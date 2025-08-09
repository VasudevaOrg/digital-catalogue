// src/components/product/ProductCard.tsx
"use client";

import { useState } from "react";
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
  Star,
  Eye,
  MessageCircle,
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
  const [isHovered, setIsHovered] = useState(false);

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

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in ordering:\n\n${product.name}\nPrice: ₹${product.price}\nQuantity: ${quantity}\n\nPlease let me know the availability.`;
    window.open(
      `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
      "_blank"
    );
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 mb-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 overflow-hidden group">
            <div className="flex items-center justify-center h-full text-gray-400">
              <Package className="w-12 h-12" />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isOutOfStock && (
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-lg">
                  Out of Stock
                </span>
              )}
              {isLowStock && !isOutOfStock && (
                <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded-lg">
                  Low Stock
                </span>
              )}
              {product.isEligibleForFreeDelivery && !isOutOfStock && (
                <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-lg">
                  Free Delivery
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/products/${product.id}`}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Weight className="w-4 h-4" />
                    <span>{product.weight}kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.stock} in stock</span>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.isEligibleForFreeDelivery && (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                      Free Delivery
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 md:items-end">
                {showAddToCart && !isOutOfStock && (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 mr-2">
                        Qty:
                      </span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold bg-gray-50 py-2">
                          {quantity}
                        </span>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={handleWhatsAppOrder}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </>
                )}

                {isOutOfStock && (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      className="card-product"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 overflow-hidden">
        <div className="flex items-center justify-center h-full text-gray-400">
          <Package className="w-16 h-16" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-lg shadow-sm">
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded-lg shadow-sm">
              Only {product.stock} left
            </span>
          )}
          {product.isEligibleForFreeDelivery && !isOutOfStock && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-lg shadow-sm">
              Free Delivery
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-2"
          }`}
        >
          <Link
            href={`/products/${product.id}`}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-white transition-all duration-200 shadow-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={handleWhatsAppOrder}
            className="w-10 h-10 bg-green-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-all duration-200 shadow-sm"
            title="WhatsApp Order"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span>{product.weight}kg</span>
            <span>•</span>
            <span>{product.stock} in stock</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">4.5</span>
          </div>
        </div>

        <div className="mb-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            {product.isEligibleForFreeDelivery && (
              <div className="text-xs text-green-600 font-medium">
                Free Delivery
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Section */}
        {showAddToCart && !isOutOfStock && (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center font-semibold text-sm bg-gray-50 py-2">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
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
            className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
