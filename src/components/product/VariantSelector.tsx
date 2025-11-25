// src/components/product/VariantSelector.tsx
"use client";

import { ProductVariant, WEIGHT_UNIT_LABELS } from "@/types";
import { Package, CheckCircle, AlertCircle, Layers } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantSelect,
}: VariantSelectorProps) {
  // Filter only active variants
  const activeVariants = variants.filter((v) => v.isActive);

  if (activeVariants.length === 0) {
    return null;
  }

  // Format weight display
  const formatWeight = (variant: ProductVariant) => {
    if (variant.customUnit) {
      return `${variant.weight} ${variant.customUnit}`;
    }

    const unit = WEIGHT_UNIT_LABELS[variant.weightUnit] || variant.weightUnit;
    if (variant.weightUnit === "grams" && variant.weight >= 1000) {
      return `${(variant.weight / 1000).toFixed(1)} kg`;
    }
    if (variant.weightUnit === "ml" && variant.weight >= 1000) {
      return `${(variant.weight / 1000).toFixed(1)} L`;
    }
    return `${variant.weight} ${unit.split(" ")[1] || unit}`;
  };

  // Check if variant is low stock
  const isLowStock = (variant: ProductVariant) => {
    const threshold = variant.lowStockThreshold || 10;
    return variant.stock > 0 && variant.stock <= threshold;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Size / Weight:
      </label>
      <div className="flex flex-wrap gap-3">
        {activeVariants.map((variant) => {
          const isSelected =
            selectedVariant?._id === variant._id ||
            selectedVariant?.sku === variant.sku;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant._id || variant.sku}
              onClick={() => !isOutOfStock && onVariantSelect(variant)}
              disabled={isOutOfStock}
              className={`
                px-4 py-2 rounded-md text-sm font-medium border transition-all
                ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                    : isOutOfStock
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed decoration-slice line-through"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }
              `}
            >
              {formatWeight(variant)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
