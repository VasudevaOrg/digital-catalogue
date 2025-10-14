// src/components/product/DiscountPriceDisplay.tsx
"use client";

import { Product } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
} from "@/lib/discountUtils";

interface DiscountPriceDisplayProps {
  product: Product;
  quantity?: number;
  showOriginalPrice?: boolean;
  className?: string;
  originalPriceClassName?: string;
  discountedPriceClassName?: string;
}

export function DiscountPriceDisplay({
  product,
  quantity = 1,
  showOriginalPrice = true,
  className = "",
  originalPriceClassName = "text-sm text-gray-500 line-through",
  discountedPriceClassName = "text-lg font-bold text-green-600",
}: DiscountPriceDisplayProps) {
  const hasActiveDiscount =
    product.discount && isDiscountActive(product.discount);
  const discountCalc = hasActiveDiscount
    ? calculateProductDiscount(product, quantity)
    : null;

  const hasDiscount = discountCalc && discountCalc.discountAmount > 0;

  // No discount - show regular price
  if (!hasDiscount) {
    return (
      <div className={className}>
        <span className="text-lg font-bold text-gray-900">
          ₹{(product.price * quantity).toFixed(2)}
        </span>
      </div>
    );
  }

  // With discount - show both prices
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Discounted Price */}
      <span className={discountedPriceClassName}>
        ₹{discountCalc.discountedPrice.toFixed(2)}
      </span>

      {/* Original Price */}
      {showOriginalPrice && (
        <span className={originalPriceClassName}>
          ₹{discountCalc.originalPrice.toFixed(2)}
        </span>
      )}

      {/* Savings Badge */}
      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
        {discountCalc.discountPercentage.toFixed(0)}% OFF
      </span>
    </div>
  );
}

// Compact version for list view
export function DiscountPriceCompact({
  product,
  quantity = 1,
}: Pick<DiscountPriceDisplayProps, "product" | "quantity">) {
  const hasActiveDiscount =
    product.discount && isDiscountActive(product.discount);
  const discountCalc = hasActiveDiscount
    ? calculateProductDiscount(product, quantity)
    : null;

  const hasDiscount = discountCalc && discountCalc.discountAmount > 0;

  if (!hasDiscount) {
    return (
      <span className="text-xl font-bold text-gray-900">
        ₹{(product.price * quantity).toFixed(2)}
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-green-600">
          ₹{discountCalc.discountedPrice.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 line-through">
          ₹{discountCalc.originalPrice.toFixed(2)}
        </span>
      </div>
      <span className="text-xs text-green-600 font-medium">
        Save ₹{discountCalc.discountAmount.toFixed(2)}
      </span>
    </div>
  );
}
