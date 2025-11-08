// src/lib/freeDeliveryUtils.ts - Fixed Free Delivery Logic

import { Product } from "@/types";

/**
 * DELTA PRODUCTS: Products that are EXCLUDED from free delivery calculation
 * These are: Sugar, Oils, Jaggery
 */
const DELTA_CATEGORIES = [
  "sugar",
  "sugars",
  "sweetener",
  "sweeteners",
  "sugar & sweeteners",
  "sugar and sweeteners",
  "oils",
  "cooking oils",
  "cooking oil",
  "oil",
  "edible oils",
  "edible oil",
  "jaggery",
  "jaggerys",
  "gur",
  "gud",
];

const DELTA_KEYWORDS = [
  "sugar",
  "oil",
  "jaggery",
  "gur",
  "gud",
  "sweetener",
  "cooking oil",
  "edible oil",
];

/**
 * Normalize string for comparison
 */
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
};

/**
 * Check if a category is a DELTA product
 */
const isDeltaCategory = (category: string): boolean => {
  const categoryNormalized = normalizeString(category);

  return DELTA_CATEGORIES.some((delta) => {
    const deltaNormalized = normalizeString(delta);
    return (
      categoryNormalized === deltaNormalized ||
      categoryNormalized.includes(deltaNormalized) ||
      (deltaNormalized.includes(categoryNormalized) &&
        categoryNormalized.length > 3)
    );
  });
};

/**
 * Check if product name contains DELTA keywords
 */
const hasDeltaKeyword = (productName: string): boolean => {
  const nameLower = normalizeString(productName);

  return DELTA_KEYWORDS.some((keyword) => {
    const keywordLower = normalizeString(keyword);
    const regex = new RegExp(`\\b${keywordLower}\\b`, "i");
    return regex.test(nameLower) || nameLower.includes(keywordLower);
  });
};

/**
 * CRITICAL: Check if a product is a DELTA product
 * DELTA products are EXCLUDED from free delivery calculation
 *
 * @param product - The product to check
 * @returns true if product is DELTA (excluded), false if ELIGIBLE for free delivery
 */
export const isDeltaProduct = (product: Product): boolean => {
  // First check: Product's explicit flag (if marked as not eligible)
  if (product.isEligibleForFreeDelivery === false) {
    console.log("❌ DELTA Product (explicit flag):", product.name);
    return true; // It's a DELTA product
  }

  // Second check: Category exclusion
  if (isDeltaCategory(product.category)) {
    console.log("❌ DELTA Product (category):", {
      productName: product.name,
      category: product.category,
    });
    return true; // It's a DELTA product
  }

  // Third check: Product name keywords
  if (hasDeltaKeyword(product.name)) {
    console.log("❌ DELTA Product (keyword):", product.name);
    return true; // It's a DELTA product
  }

  console.log("✅ ELIGIBLE Product (not DELTA):", product.name);
  return false; // Not a DELTA product, eligible for free delivery calculation
};

/**
 * Check if a product is eligible for free delivery calculation
 * This is the INVERSE of isDeltaProduct
 */
export const isProductEligibleForFreeDelivery = (product: Product): boolean => {
  return !isDeltaProduct(product);
};

/**
 * Get human-readable reason why a product is DELTA
 */
export const getDeltaReason = (product: Product): string | null => {
  if (product.isEligibleForFreeDelivery === false) {
    return "This product is marked as a DELTA product (not eligible for free delivery calculation)";
  }

  if (isDeltaCategory(product.category)) {
    return `${product.category} products are DELTA products (excluded from free delivery calculation)`;
  }

  if (hasDeltaKeyword(product.name)) {
    return "This product is a DELTA product (excluded from free delivery calculation)";
  }

  return null;
};

/**
 * Calculate cart totals with FREE DELIVERY eligibility
 *
 * FREE DELIVERY RULE:
 * - Cart must have ≥ ₹1000 worth of NON-DELTA products
 * - DELTA products (sugar, oils, jaggery) are EXCLUDED from the ₹1000 calculation
 * - User can still order DELTA products, but they don't count toward free delivery
 *
 * Examples:
 * 1. ₹999 rice + ₹1 jaggery = NOT eligible (only ₹999 non-DELTA)
 * 2. ₹1000 rice + ₹500 jaggery = ELIGIBLE (₹1000 non-DELTA)
 * 3. ₹1500 rice + ₹0 DELTA = ELIGIBLE (₹1500 non-DELTA)
 * 4. ₹500 rice + ₹600 oil = NOT eligible (only ₹500 non-DELTA)
 */
export interface CartTotals {
  totalAmount: number; // Total of ALL products
  eligibleAmount: number; // Total of NON-DELTA products (counts toward free delivery)
  deltaAmount: number; // Total of DELTA products (excluded from free delivery)
  isEligibleForFreeDelivery: boolean; // True if eligibleAmount >= 1000
  amountNeededForFreeDelivery: number; // How much more NON-DELTA products needed
}

export const calculateFreeDeliveryEligibility = (
  items: Array<{ product: Product; quantity: number; finalPrice: number }>
): CartTotals => {
  let totalAmount = 0;
  let eligibleAmount = 0; // NON-DELTA products
  let deltaAmount = 0; // DELTA products

  items.forEach((item) => {
    totalAmount += item.finalPrice;

    if (isDeltaProduct(item.product)) {
      // This is a DELTA product - EXCLUDE from free delivery calculation
      deltaAmount += item.finalPrice;
      console.log(
        `📦 DELTA Product (excluded): ${
          item.product.name
        } = ₹${item.finalPrice.toFixed(2)}`
      );
    } else {
      // This is a NON-DELTA product - INCLUDE in free delivery calculation
      eligibleAmount += item.finalPrice;
      console.log(
        `✅ Eligible Product (included): ${
          item.product.name
        } = ₹${item.finalPrice.toFixed(2)}`
      );
    }
  });

  // FREE DELIVERY: eligibleAmount (NON-DELTA) must be >= 1000
  const isEligibleForFreeDelivery = eligibleAmount >= 1000;
  const amountNeededForFreeDelivery = Math.max(0, 1000 - eligibleAmount);

  console.log("\n🧮 FREE DELIVERY CALCULATION:");
  console.log(`Total Cart Value: ₹${totalAmount.toFixed(2)}`);
  console.log(`NON-DELTA Products (eligible): ₹${eligibleAmount.toFixed(2)}`);
  console.log(`DELTA Products (excluded): ₹${deltaAmount.toFixed(2)}`);
  console.log(`Free Delivery Threshold: ₹1000 (NON-DELTA only)`);
  console.log(`Is Eligible: ${isEligibleForFreeDelivery ? "✅ YES" : "❌ NO"}`);
  if (!isEligibleForFreeDelivery) {
    console.log(
      `Amount Needed: ₹${amountNeededForFreeDelivery.toFixed(
        2
      )} more in NON-DELTA products\n`
    );
  }

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    eligibleAmount: parseFloat(eligibleAmount.toFixed(2)),
    deltaAmount: parseFloat(deltaAmount.toFixed(2)),
    isEligibleForFreeDelivery,
    amountNeededForFreeDelivery: parseFloat(
      amountNeededForFreeDelivery.toFixed(2)
    ),
  };
};

/**
 * Format free delivery status message
 */
export const getFreeDeliveryMessage = (totals: CartTotals): string => {
  if (totals.isEligibleForFreeDelivery) {
    return `🎉 You qualify for FREE delivery! (Eligible products: ₹${totals.eligibleAmount.toFixed(
      2
    )})`;
  }

  if (totals.deltaAmount > 0) {
    return `Add ₹${totals.amountNeededForFreeDelivery.toFixed(
      2
    )} more in eligible products for FREE delivery (DELTA products excluded: ₹${totals.deltaAmount.toFixed(
      2
    )})`;
  }

  return `Add ₹${totals.amountNeededForFreeDelivery.toFixed(
    2
  )} more for FREE delivery`;
};

/**
 * Get list of all DELTA categories (for display purposes)
 */
export const getDeltaCategories = (): string[] => {
  return [...DELTA_CATEGORIES];
};

/**
 * Get list of all DELTA keywords (for display purposes)
 */
export const getDeltaKeywords = (): string[] => {
  return [...DELTA_KEYWORDS];
};

/**
 * Check if a category should be excluded from free delivery
 */
export const isCategoryExcludedFromFreeDelivery = (
  category: string
): boolean => {
  return isDeltaCategory(category);
};

/**
 * Test function to validate the logic with a product
 */
export const testFreeDeliveryEligibility = (product: Product): void => {
  console.group(`Testing: ${product.name}`);
  console.log("Category:", product.category);
  console.log("Normalized Category:", normalizeString(product.category));
  console.log("Flag:", product.isEligibleForFreeDelivery);
  console.log("Is DELTA Product?", isDeltaProduct(product));
  console.log(
    "Is Eligible for Free Delivery?",
    isProductEligibleForFreeDelivery(product)
  );
  console.log(
    "Reason:",
    getDeltaReason(product) || "Eligible - Not a DELTA product"
  );
  console.groupEnd();
};

// Legacy exports for backward compatibility
export const getIneligibilityReason = getDeltaReason;
export const getExcludedCategories = getDeltaCategories;
export const getExcludedKeywords = getDeltaKeywords;

/**
 * IMPORTANT USAGE NOTES:
 *
 * 1. isDeltaProduct() - Returns TRUE if product is DELTA (sugar/oil/jaggery)
 * 2. isProductEligibleForFreeDelivery() - Returns TRUE if product is NOT DELTA
 *
 * FREE DELIVERY LOGIC:
 * - Only NON-DELTA products count toward the ₹1000 threshold
 * - DELTA products can be in cart but don't affect free delivery eligibility
 * - User needs ≥₹1000 of NON-DELTA products to qualify for free delivery
 *
 * CORRECT EXAMPLES:
 * ✅ ₹1000 rice + ₹500 oil = FREE delivery (₹1000 eligible)
 * ✅ ₹1500 rice + ₹0 oil = FREE delivery (₹1500 eligible)
 * ❌ ₹999 rice + ₹1 oil = NO free delivery (₹999 eligible)
 * ❌ ₹500 rice + ₹600 oil = NO free delivery (₹500 eligible)
 */
