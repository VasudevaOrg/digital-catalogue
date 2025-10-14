// src/lib/discountUtils.ts - Complete Discount Calculation Utilities

import { Product } from "@/types";

// Discount interfaces
export interface QuantityDiscount {
  minQuantity: number;
  maxQuantity: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  label?: string;
}

export interface SimpleDiscount {
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export interface ProductDiscount {
  isActive: boolean;
  type: "simple" | "quantity-based" | "both";
  simpleDiscount?: SimpleDiscount;
  quantityDiscounts?: QuantityDiscount[];
  startDate?: Date | string;
  endDate?: Date | string;
  maxDiscountAmount?: number;
}

export interface DiscountCalculation {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  appliedDiscount: {
    type: "simple" | "quantity-based";
    label?: string;
    discountValue: number;
    discountType: "percentage" | "fixed";
  } | null;
}

/**
 * Check if a discount is currently active based on date range
 */
export const isDiscountActive = (discount: ProductDiscount): boolean => {
  if (!discount.isActive) return false;

  const now = new Date();

  if (discount.startDate && new Date(discount.startDate) > now) {
    return false;
  }

  if (discount.endDate && new Date(discount.endDate) < now) {
    return false;
  }

  return true;
};

/**
 * Find the applicable quantity discount for a given quantity
 */
export const findQuantityDiscount = (
  quantity: number,
  quantityDiscounts: QuantityDiscount[]
): QuantityDiscount | null => {
  if (!quantityDiscounts || quantityDiscounts.length === 0) return null;

  // Sort by minQuantity to ensure we get the highest applicable discount
  const sortedDiscounts = [...quantityDiscounts].sort(
    (a, b) => b.minQuantity - a.minQuantity
  );

  return (
    sortedDiscounts.find(
      (discount) =>
        quantity >= discount.minQuantity &&
        (!discount.maxQuantity || quantity <= discount.maxQuantity)
    ) || null
  );
};

/**
 * Calculate discount amount based on discount type
 */
const calculateDiscountAmount = (
  price: number,
  discountType: "percentage" | "fixed",
  discountValue: number,
  maxDiscountAmount?: number
): number => {
  let discount = 0;

  if (discountType === "percentage") {
    discount = (price * discountValue) / 100;
  } else {
    discount = discountValue;
  }

  // Apply max discount cap if set
  if (maxDiscountAmount && discount > maxDiscountAmount) {
    discount = maxDiscountAmount;
  }

  // Ensure discount doesn't exceed the price
  return Math.min(discount, price);
};

/**
 * Calculate the best applicable discount for a product
 */
export const calculateProductDiscount = (
  product: Product,
  quantity: number = 1
): DiscountCalculation => {
  const originalPrice = product.price * quantity;

  // Default result - no discount
  const noDiscount: DiscountCalculation = {
    originalPrice,
    discountedPrice: originalPrice,
    discountAmount: 0,
    discountPercentage: 0,
    appliedDiscount: null,
  };

  // Check if product has discount and it's active
  if (!product.discount || !isDiscountActive(product.discount)) {
    return noDiscount;
  }

  let bestDiscount = 0;
  let appliedDiscountInfo: DiscountCalculation["appliedDiscount"] = null;

  // Calculate simple discount
  if (product.discount.type === "simple" || product.discount.type === "both") {
    if (product.discount.simpleDiscount) {
      const simpleDiscountAmount = calculateDiscountAmount(
        originalPrice,
        product.discount.simpleDiscount.discountType,
        product.discount.simpleDiscount.discountValue,
        product.discount.maxDiscountAmount
      );

      if (simpleDiscountAmount > bestDiscount) {
        bestDiscount = simpleDiscountAmount;
        appliedDiscountInfo = {
          type: "simple",
          discountValue: product.discount.simpleDiscount.discountValue,
          discountType: product.discount.simpleDiscount.discountType,
        };
      }
    }
  }

  // Calculate quantity-based discount
  if (
    product.discount.type === "quantity-based" ||
    product.discount.type === "both"
  ) {
    if (product.discount.quantityDiscounts) {
      const quantityDiscount = findQuantityDiscount(
        quantity,
        product.discount.quantityDiscounts
      );

      if (quantityDiscount) {
        const quantityDiscountAmount = calculateDiscountAmount(
          originalPrice,
          quantityDiscount.discountType,
          quantityDiscount.discountValue,
          product.discount.maxDiscountAmount
        );

        if (quantityDiscountAmount > bestDiscount) {
          bestDiscount = quantityDiscountAmount;
          appliedDiscountInfo = {
            type: "quantity-based",
            label: quantityDiscount.label,
            discountValue: quantityDiscount.discountValue,
            discountType: quantityDiscount.discountType,
          };
        }
      }
    }
  }

  const discountedPrice = originalPrice - bestDiscount;
  const discountPercentage = (bestDiscount / originalPrice) * 100;

  return {
    originalPrice,
    discountedPrice,
    discountAmount: bestDiscount,
    discountPercentage,
    appliedDiscount: appliedDiscountInfo,
  };
};

/**
 * Get all available quantity discounts for display
 */
export const getAvailableQuantityDiscounts = (
  product: Product
): QuantityDiscount[] => {
  if (
    !product.discount ||
    !isDiscountActive(product.discount) ||
    !product.discount.quantityDiscounts
  ) {
    return [];
  }

  if (
    product.discount.type === "quantity-based" ||
    product.discount.type === "both"
  ) {
    return product.discount.quantityDiscounts.sort(
      (a, b) => a.minQuantity - b.minQuantity
    );
  }

  return [];
};

/**
 * Format discount display text
 */
export const formatDiscountText = (
  discountType: "percentage" | "fixed",
  discountValue: number
): string => {
  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  }
  return `₹${discountValue} OFF`;
};

/**
 * Get discount badge color based on discount percentage
 */
export const getDiscountBadgeColor = (discountPercentage: number): string => {
  if (discountPercentage >= 50) return "bg-red-500 text-white";
  if (discountPercentage >= 30) return "bg-orange-500 text-white";
  if (discountPercentage >= 15) return "bg-yellow-500 text-white";
  return "bg-green-500 text-white";
};

/**
 * Check if quantity qualifies for a better discount
 */
export const getNextDiscountTier = (
  product: Product,
  currentQuantity: number
): {
  nextTierQuantity: number;
  nextTierDiscount: QuantityDiscount;
} | null => {
  if (!product.discount || !product.discount.quantityDiscounts) {
    return null;
  }

  const sortedDiscounts = [...product.discount.quantityDiscounts].sort(
    (a, b) => a.minQuantity - b.minQuantity
  );

  for (const discount of sortedDiscounts) {
    if (discount.minQuantity > currentQuantity) {
      return {
        nextTierQuantity: discount.minQuantity,
        nextTierDiscount: discount,
      };
    }
  }

  return null;
};

/**
 * Calculate savings message
 */
export const getSavingsMessage = (
  originalPrice: number,
  discountedPrice: number
): string => {
  const savings = originalPrice - discountedPrice;
  if (savings <= 0) return "";

  const percentage = ((savings / originalPrice) * 100).toFixed(0);
  return `Save ₹${savings.toFixed(2)} (${percentage}%)`;
};
