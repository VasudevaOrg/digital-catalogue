// src/components/product/QuantityDiscountTiers.tsx
"use client";

import { Product } from "@/types";
import {
  getAvailableQuantityDiscounts,
  formatDiscountText,
  calculateProductDiscount,
  getNextDiscountTier,
} from "@/lib/discountUtils";
import { TrendingUp, Gift, ArrowRight } from "lucide-react";

interface QuantityDiscountTiersProps {
  product: Product;
  currentQuantity?: number;
  onQuantityClick?: (quantity: number) => void;
}

export function QuantityDiscountTiers({
  product,
  currentQuantity = 1,
  onQuantityClick,
}: QuantityDiscountTiersProps) {
  const quantityDiscounts = getAvailableQuantityDiscounts(product);

  if (quantityDiscounts.length === 0) {
    return null;
  }

  const nextTier = getNextDiscountTier(product, currentQuantity);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">
          Quantity Discounts Available!
        </h3>
      </div>

      {/* Next tier alert */}
      {nextTier && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-yellow-700" />
              <span className="text-sm font-medium text-yellow-800">
                Buy {nextTier.nextTierQuantity - currentQuantity} more to get{" "}
                {formatDiscountText(
                  nextTier.nextTierDiscount.discountType,
                  nextTier.nextTierDiscount.discountValue
                )}
              </span>
            </div>
            {onQuantityClick && (
              <button
                onClick={() => onQuantityClick(nextTier.nextTierQuantity)}
                className="text-yellow-700 hover:text-yellow-900 font-medium text-sm flex items-center gap-1"
              >
                Apply
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Discount tiers */}
      <div className="space-y-2">
        {quantityDiscounts.map((discount, index) => {
          const isActive =
            currentQuantity >= discount.minQuantity &&
            (!discount.maxQuantity || currentQuantity <= discount.maxQuantity);

          const tierCalc = calculateProductDiscount(
            product,
            discount.minQuantity
          );

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                isActive
                  ? "border-purple-500 bg-purple-100"
                  : "border-purple-200 bg-white hover:border-purple-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isActive
                      ? "bg-purple-500 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {discount.minQuantity}+
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {discount.minQuantity} - {discount.maxQuantity || "∞"} units
                  </div>
                  {discount.label && (
                    <div className="text-xs text-gray-600">
                      {discount.label}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-purple-700">
                  {formatDiscountText(
                    discount.discountType,
                    discount.discountValue
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  ₹{tierCalc.discountedPrice.toFixed(2)} per unit
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings example */}
      <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
        <div className="text-xs text-gray-600 mb-1">💡 Maximum Savings:</div>
        {quantityDiscounts.length > 0 && (
          <div className="text-sm">
            Buy{" "}
            <span className="font-bold text-purple-700">
              {quantityDiscounts[quantityDiscounts.length - 1].minQuantity}+
              units
            </span>{" "}
            and save up to{" "}
            <span className="font-bold text-green-600">
              {formatDiscountText(
                quantityDiscounts[quantityDiscounts.length - 1].discountType,
                quantityDiscounts[quantityDiscounts.length - 1].discountValue
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for product card
export function QuantityDiscountBadge({ product }: { product: Product }) {
  const quantityDiscounts = getAvailableQuantityDiscounts(product);

  if (quantityDiscounts.length === 0) {
    return null;
  }

  const maxDiscount = quantityDiscounts[quantityDiscounts.length - 1];

  return (
    <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
      <TrendingUp className="w-3 h-3" />
      <span>
        Up to{" "}
        {formatDiscountText(
          maxDiscount.discountType,
          maxDiscount.discountValue
        )}
      </span>
    </div>
  );
}
