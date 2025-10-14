// src/components/product/DiscountBadge.tsx
"use client";

import { Product } from "@/types";
import {
  calculateProductDiscount,
  formatDiscountText,
  getDiscountBadgeColor,
  isDiscountActive,
} from "@/lib/discountUtils";
import { Tag, Percent, Gift } from "lucide-react";

interface DiscountBadgeProps {
  product: Product;
  quantity?: number;
  className?: string;
  showSavings?: boolean;
}

export function DiscountBadge({
  product,
  quantity = 1,
  className = "",
  showSavings = false,
}: DiscountBadgeProps) {
  // Check if discount is active
  if (!product.discount || !isDiscountActive(product.discount)) {
    return null;
  }

  const discountCalc = calculateProductDiscount(product, quantity);

  // No discount applied
  if (!discountCalc.appliedDiscount || discountCalc.discountAmount === 0) {
    return null;
  }

  const badgeColor = getDiscountBadgeColor(discountCalc.discountPercentage);
  const discountText = formatDiscountText(
    discountCalc.appliedDiscount.discountType,
    discountCalc.appliedDiscount.discountValue
  );

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      {/* Discount Badge */}
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${badgeColor} animate-pulse`}
      >
        <Percent className="w-3 h-3 mr-1" />
        <span>{discountText}</span>
      </div>

      {/* Quantity-based discount label */}
      {discountCalc.appliedDiscount.type === "quantity-based" &&
        discountCalc.appliedDiscount.label && (
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            <Gift className="w-3 h-3 mr-1" />
            <span>{discountCalc.appliedDiscount.label}</span>
          </div>
        )}

      {/* Savings amount */}
      {showSavings && discountCalc.discountAmount > 0 && (
        <div className="text-xs text-green-600 font-medium">
          Save ₹{discountCalc.discountAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
}

// Compact version for grid view
export function DiscountBadgeCompact({
  product,
  quantity = 1,
}: Omit<DiscountBadgeProps, "className" | "showSavings">) {
  if (!product.discount || !isDiscountActive(product.discount)) {
    return null;
  }

  const discountCalc = calculateProductDiscount(product, quantity);

  if (!discountCalc.appliedDiscount || discountCalc.discountAmount === 0) {
    return null;
  }

  const discountText = formatDiscountText(
    discountCalc.appliedDiscount.discountType,
    discountCalc.appliedDiscount.discountValue
  );

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
        {discountText}
      </div>
    </div>
  );
}
