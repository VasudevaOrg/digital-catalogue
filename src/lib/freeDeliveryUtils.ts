// src/lib/freeDeliveryUtils.ts - Centralized Free Delivery Logic

import { Product } from "@/types";

/**
 * List of product categories that are NOT eligible for free delivery calculation
 * Add more categories here as needed
 */
const EXCLUDED_CATEGORIES = [
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

/**
 * List of keywords in product names that exclude them from free delivery
 */
const EXCLUDED_KEYWORDS = [
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
 * Normalize string for comparison - lowercase, trim, and normalize spaces
 */
const normalizeString = (str: string): string => {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
};

/**
 * Check if a category matches any excluded category
 */
const isCategoryExcluded = (category: string): boolean => {
  const categoryNormalized = normalizeString(category);

  return EXCLUDED_CATEGORIES.some((excluded) => {
    const excludedNormalized = normalizeString(excluded);

    // Check for exact match
    if (categoryNormalized === excludedNormalized) {
      return true;
    }

    // Check if category contains the excluded term
    if (categoryNormalized.includes(excludedNormalized)) {
      return true;
    }

    // Check if excluded term contains the category (for broader matches)
    if (
      excludedNormalized.includes(categoryNormalized) &&
      categoryNormalized.length > 3
    ) {
      return true;
    }

    return false;
  });
};

/**
 * Check if product name contains any excluded keywords
 */
const hasExcludedKeyword = (productName: string): boolean => {
  const nameLower = normalizeString(productName);

  return EXCLUDED_KEYWORDS.some((keyword) => {
    const keywordLower = normalizeString(keyword);

    // Use word boundary check to avoid false positives
    // For example, "Olive Oil" should match, but "Foil" should not
    const regex = new RegExp(`\\b${keywordLower}\\b`, "i");
    return regex.test(nameLower) || nameLower.includes(keywordLower);
  });
};

/**
 * Main function to check if a product is eligible for free delivery calculation
 *
 * @param product - The product to check
 * @returns true if product counts toward free delivery, false otherwise
 */
export const isProductEligibleForFreeDelivery = (product: Product): boolean => {
  // First check: Product's explicit flag
  if (product.isEligibleForFreeDelivery === false) {
    console.log("❌ Product explicitly marked as not eligible:", product.name);
    return false;
  }

  // Second check: Category exclusion
  if (isCategoryExcluded(product.category)) {
    console.log("❌ Category excluded from free delivery:", {
      productName: product.name,
      category: product.category,
      normalized: normalizeString(product.category),
    });
    return false;
  }

  // Third check: Product name keywords
  if (hasExcludedKeyword(product.name)) {
    console.log("❌ Product name contains excluded keyword:", {
      productName: product.name,
      normalized: normalizeString(product.name),
    });
    return false;
  }

  console.log("✅ Product eligible for free delivery:", product.name);
  return true;
};

/**
 * Get human-readable reason why a product is not eligible
 */
export const getIneligibilityReason = (product: Product): string | null => {
  if (product.isEligibleForFreeDelivery === false) {
    return "This product is marked as not eligible for free delivery";
  }

  if (isCategoryExcluded(product.category)) {
    return `${product.category} products are not eligible for free delivery`;
  }

  if (hasExcludedKeyword(product.name)) {
    return "This product type is not eligible for free delivery";
  }

  return null;
};

/**
 * Check if a category should be excluded from free delivery
 * Useful for displaying warnings in admin/product management
 */
export const isCategoryExcludedFromFreeDelivery = (
  category: string
): boolean => {
  return isCategoryExcluded(category);
};

/**
 * Get list of all excluded categories (for display purposes)
 */
export const getExcludedCategories = (): string[] => {
  return [...EXCLUDED_CATEGORIES];
};

/**
 * Get list of all excluded keywords (for display purposes)
 */
export const getExcludedKeywords = (): string[] => {
  return [...EXCLUDED_KEYWORDS];
};

/**
 * Calculate cart totals with free delivery eligibility
 */
export interface CartTotals {
  totalAmount: number;
  eligibleAmount: number;
  excludedAmount: number;
  isEligibleForFreeDelivery: boolean;
  amountNeededForFreeDelivery: number;
}

export const calculateFreeDeliveryEligibility = (
  items: Array<{ product: Product; quantity: number; finalPrice: number }>
): CartTotals => {
  let totalAmount = 0;
  let eligibleAmount = 0;
  let excludedAmount = 0;

  items.forEach((item) => {
    totalAmount += item.finalPrice;

    if (isProductEligibleForFreeDelivery(item.product)) {
      eligibleAmount += item.finalPrice;
    } else {
      excludedAmount += item.finalPrice;
    }
  });

  const isEligibleForFreeDelivery =
    eligibleAmount >= 1000 && excludedAmount === 0;
  const amountNeededForFreeDelivery = Math.max(0, 1000 - eligibleAmount);

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    eligibleAmount: parseFloat(eligibleAmount.toFixed(2)),
    excludedAmount: parseFloat(excludedAmount.toFixed(2)),
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
  if (totals.excludedAmount > 0) {
    return `⚠️ Cart contains ineligible items (₹${totals.excludedAmount.toFixed(
      2
    )}). Remove them for FREE delivery eligibility.`;
  }

  if (totals.isEligibleForFreeDelivery) {
    return `🎉 You qualify for FREE delivery! (Eligible items: ₹${totals.eligibleAmount.toFixed(
      2
    )})`;
  }

  return `Add ₹${totals.amountNeededForFreeDelivery.toFixed(
    2
  )} more for FREE delivery`;
};

/**
 * Test function to validate the logic with a product
 * Useful for debugging
 */
export const testFreeDeliveryEligibility = (product: Product): void => {
  console.group(`Testing: ${product.name}`);
  console.log("Category:", product.category);
  console.log("Normalized Category:", normalizeString(product.category));
  console.log("Flag:", product.isEligibleForFreeDelivery);
  console.log("Is Category Excluded?", isCategoryExcluded(product.category));
  console.log("Has Excluded Keyword?", hasExcludedKeyword(product.name));
  console.log("Final Result:", isProductEligibleForFreeDelivery(product));
  console.log("Reason:", getIneligibilityReason(product) || "Eligible");
  console.groupEnd();
};
