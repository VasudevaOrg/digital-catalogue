// src/store/slices/cartSlice.ts - Fixed with Correct Free Delivery Logic and Variants Support
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartState, Cart, Product, CartItem, ProductVariant } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
} from "@/lib/discountUtils";
import {
  isDeltaProduct,
  calculateFreeDeliveryEligibility,
} from "@/lib/freeDeliveryUtils";
import { api } from "@/lib/api";

const CART_STORAGE_KEY = "digital_catalogue_cart";

const initialState: CartState = {
  cart: {
    items: [],
    totalAmount: 0,
    totalWeight: 0,
    isEligibleForFreeDelivery: false,
  },
  isLoading: false,
  error: null,
};

// Helper function - checks if product is DELTA (excluded from free delivery calculation)
// This is just for backward compatibility - use isDeltaProduct from freeDeliveryUtils
export const isProductEligibleForFreeDelivery = (product: Product): boolean => {
  return !isDeltaProduct(product);
};

// Helper function to calculate cart totals with CORRECT free delivery logic
const calculateCartTotals = (
  items: CartItem[]
): {
  totalAmount: number;
  totalWeight: number;
  isEligibleForFreeDelivery: boolean;
  eligibleAmount: number;
  deltaAmount: number;
} => {
  // Calculate total with discounts applied
  const totalAmount = items.reduce((sum, item) => {
    // Use variant price if available, otherwise use product price
    const basePrice = item.selectedVariant?.price || item.product.price;
    const productForDiscount = item.selectedVariant
      ? {
          ...item.product,
          price: item.selectedVariant.price,
          discount:
            item.selectedVariant.discount &&
            isDiscountActive(item.selectedVariant.discount)
              ? item.selectedVariant.discount
              : item.product.discount,
        }
      : item.product;

    const discountCalc = calculateProductDiscount(
      productForDiscount,
      item.quantity
    );
    return sum + discountCalc.discountedPrice;
  }, 0);

  const totalWeight = items.reduce((sum, item) => {
    const weight = item.selectedVariant?.weight || item.product.weight;
    return sum + weight * item.quantity;
  }, 0);

  // Prepare items for free delivery calculation
  const itemsWithPrices = items.map((item) => {
    const basePrice = item.selectedVariant?.price || item.product.price;
    const productForDiscount = item.selectedVariant
      ? {
          ...item.product,
          price: item.selectedVariant.price,
          discount:
            item.selectedVariant.discount &&
            isDiscountActive(item.selectedVariant.discount)
              ? item.selectedVariant.discount
              : item.product.discount,
        }
      : item.product;

    const discountCalc = calculateProductDiscount(
      productForDiscount,
      item.quantity
    );
    return {
      product: item.product,
      quantity: item.quantity,
      finalPrice: discountCalc.discountedPrice,
    };
  });

  // Use the CORRECTED free delivery calculation from freeDeliveryUtils
  const deliveryCalc = calculateFreeDeliveryEligibility(itemsWithPrices);

  console.log("📊 Cart Totals (CORRECTED LOGIC):", {
    totalAmount: deliveryCalc.totalAmount.toFixed(2),
    eligibleAmount: deliveryCalc.eligibleAmount.toFixed(2),
    deltaAmount: deliveryCalc.deltaAmount.toFixed(2),
    isEligibleForFreeDelivery: deliveryCalc.isEligibleForFreeDelivery,
    amountNeeded: deliveryCalc.amountNeededForFreeDelivery.toFixed(2),
  });

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalWeight: parseFloat(totalWeight.toFixed(2)),
    isEligibleForFreeDelivery: deliveryCalc.isEligibleForFreeDelivery,
    eligibleAmount: deliveryCalc.eligibleAmount,
    deltaAmount: deliveryCalc.deltaAmount,
  };
};

// Load cart from localStorage
const loadCartFromStorage = (): Cart => {
  if (typeof window === "undefined") return initialState.cart;

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Recalculate totals with correct free delivery logic
      const totals = calculateCartTotals(parsedCart.items);
      return {
        items: parsedCart.items,
        totalAmount: totals.totalAmount,
        totalWeight: totals.totalWeight,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return initialState.cart;
};

// Save cart to localStorage
const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Async thunks
export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (_, { rejectWithValue }) => {
    try {
      const localCart = loadCartFromStorage();
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await api.get<Cart>("/api/cart");
          return response.data;
        } catch (error: any) {
          if (
            error.response?.status === 404 ||
            error.response?.status === 401
          ) {
            return localCart;
          }
          throw error;
        }
      }

      return localCart;
    } catch (error: any) {
      return loadCartFromStorage();
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (cart: Cart, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await api.post<Cart>("/api/cart/sync", cart);
        return response.data;
      }
      return cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to sync cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    ...initialState,
    cart: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedVariant?: ProductVariant;
      }>
    ) => {
      const { product, quantity, selectedVariant } = action.payload;

      // Find existing item - must match both product ID and variant (if applicable)
      const existingItem = state.cart.items.find((item) => {
        if (selectedVariant) {
          // For variant products, match both product ID and variant SKU
          return (
            item.product.id === product.id &&
            item.selectedVariant?.sku === selectedVariant.sku
          );
        } else {
          // For non-variant products, match product ID and ensure no variant is selected
          return item.product.id === product.id && !item.selectedVariant;
        }
      });

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.items.push({ product, quantity, selectedVariant });
      }

      // Recalculate totals with CORRECT free delivery logic
      const totals = calculateCartTotals(state.cart.items);
      state.cart = {
        items: state.cart.items,
        totalAmount: totals.totalAmount,
        totalWeight: totals.totalWeight,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
      };

      saveCartToStorage(state.cart);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.product.id !== productId
      );

      const totals = calculateCartTotals(state.cart.items);
      state.cart = {
        items: state.cart.items,
        totalAmount: totals.totalAmount,
        totalWeight: totals.totalWeight,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
      };

      saveCartToStorage(state.cart);
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.items.find(
        (item) => item.product.id === productId
      );

      if (item) {
        if (quantity <= 0) {
          state.cart.items = state.cart.items.filter(
            (item) => item.product.id !== productId
          );
        } else {
          item.quantity = quantity;
        }

        const totals = calculateCartTotals(state.cart.items);
        state.cart = {
          items: state.cart.items,
          totalAmount: totals.totalAmount,
          totalWeight: totals.totalWeight,
          isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
        };

        saveCartToStorage(state.cart);
      }
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
      saveCartToStorage(state.cart);
    },

    clearError: (state) => {
      state.error = null;
    },

    setWalkInMode: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.cart.isEligibleForFreeDelivery = true;
      } else {
        const totals = calculateCartTotals(state.cart.items);
        state.cart = {
          items: state.cart.items,
          totalAmount: totals.totalAmount,
          totalWeight: totals.totalWeight,
          isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
        };
      }

      saveCartToStorage(state.cart);
    },

    initializeCart: (state) => {
      const storedCart = loadCartFromStorage();
      state.cart = storedCart;
      saveCartToStorage(state.cart);
    },

    // Update multiple products in cart (e.g., when prices change)
    updateProductsInCart: (
      state,
      action: PayloadAction<{ id: string; product: Product }[]>
    ) => {
      action.payload.forEach(({ id, product }) => {
        state.cart.items.forEach((item) => {
          if (item.product.id === id) {
            // Update the main product data
            item.product = product;

            // If this item has a variant selected, update the variant data too
            if (item.selectedVariant && product.variants) {
              const updatedVariant = product.variants.find(
                (v) => v.sku === item.selectedVariant?.sku
              );
              if (updatedVariant) {
                item.selectedVariant = updatedVariant;
              }
            }
          }
        });
      });

      const totals = calculateCartTotals(state.cart.items);
      state.cart = {
        items: state.cart.items,
        totalAmount: totals.totalAmount,
        totalWeight: totals.totalWeight,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
      };
      saveCartToStorage(state.cart);
    },

    // Recalculate cart (useful when discounts change)
    recalculateCart: (state) => {
      const totals = calculateCartTotals(state.cart.items);
      state.cart = {
        items: state.cart.items,
        totalAmount: totals.totalAmount,
        totalWeight: totals.totalWeight,
        isEligibleForFreeDelivery: totals.isEligibleForFreeDelivery,
      };
      saveCartToStorage(state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(syncCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  clearError,
  setWalkInMode,
  initializeCart,
  updateProductsInCart,
  recalculateCart,
} = cartSlice.actions;

// Selectors with CORRECT logic
export const selectEligibleAmount = (state: { cart: CartState }) => {
  const totals = calculateCartTotals(state.cart.cart.items);
  return totals.eligibleAmount;
};

export const selectDeltaAmount = (state: { cart: CartState }) => {
  const totals = calculateCartTotals(state.cart.cart.items);
  return totals.deltaAmount;
};

export const selectAmountNeededForFreeDelivery = (state: {
  cart: CartState;
}) => {
  const totals = calculateCartTotals(state.cart.cart.items);
  return Math.max(0, 1000 - totals.eligibleAmount);
};

// Legacy selector for backward compatibility
export const selectExcludedAmount = selectDeltaAmount;

export default cartSlice.reducer;
