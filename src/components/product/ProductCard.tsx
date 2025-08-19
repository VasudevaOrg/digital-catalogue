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
import {
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Award,
  Eye,
  Heart,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  index?: number;
}

export function ProductCard({
  product,
  showAddToCart = true,
  index = 0,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ product, quantity }));
    dispatch(showSuccessNotification(`${product.name} added to cart!`));
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(Math.max(1, Math.min(product.stock, newQuantity)));
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
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
      whileHover={{ y: -8 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-700 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                isHovered ? "opacity-20" : "opacity-0"
              }`}
            ></div>

            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-2">
              {isOutOfStock && (
                <span className="inline-block bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                  Out of Stock
                </span>
              )}
              {product.isEligibleForFreeDelivery && !isOutOfStock && (
                <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Free Delivery
                </span>
              )}
              {product.stock < 10 && !isOutOfStock && (
                <span className="inline-block bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                  Low Stock
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={`absolute top-3 right-3 space-y-2 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4"
              }`}
            >
              <button
                onClick={toggleLike}
                className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/products/${product.id}`;
                }}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-gray-600 hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add to Cart (Hover) */}
            {showAddToCart && !isOutOfStock && (
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-md"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quick Add
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs text-gray-600 ml-1">4.8</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price and Weight */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-gray-800">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  /{product.weight}kg
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Stock</div>
                <div
                  className={`text-sm font-semibold ${
                    product.stock < 10 ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {product.stock} units
                </div>
              </div>
            </div>

            {/* Quantity Selector and Add to Cart */}
            {showAddToCart && !isOutOfStock && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={(e) => handleQuantityChange(quantity - 1, e)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={(e) => handleQuantityChange(quantity + 1, e)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            )}

            {isOutOfStock && (
              <button
                disabled
                className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>

          {/* Premium Quality Badge */}
          {product.price > 200 && (
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Shine Effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-700 ${
              isHovered
                ? "translate-x-full opacity-20"
                : "-translate-x-full opacity-0"
            }`}
          ></div>
        </div>
      </Link>
    </motion.div>
  );
}
