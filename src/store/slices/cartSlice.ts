// src/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartState, Cart, Product, CartItem } from "@/types";
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

// Helper functions
const calculateCartTotals = (
  items: CartItem[]
): {
  totalAmount: number;
  totalWeight: number;
  isEligibleForFreeDelivery: boolean;
} => {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalWeight = items.reduce(
    (sum, item) => sum + item.product.weight * item.quantity,
    0
  );

  // Check if eligible for free delivery (excluding sugar, oils, jaggery)
  const eligibleAmount = items
    .filter((item) => item.product.isEligibleForFreeDelivery)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isEligibleForFreeDelivery = eligibleAmount >= 1000; // Minimum order value for free delivery

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalWeight: parseFloat(totalWeight.toFixed(2)),
    isEligibleForFreeDelivery,
  };
};

// Load cart from localStorage
const loadCartFromStorage = (): Cart => {
  if (typeof window === "undefined") return initialState.cart;

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Recalculate totals in case of any changes
      const totals = calculateCartTotals(parsedCart.items);
      return { ...parsedCart, ...totals };
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
      // First try to load from localStorage
      const localCart = loadCartFromStorage();

      // If authenticated, try to sync with server
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await api.get<Cart>("/api/cart");
          return response.data;
        } catch (error: any) {
          // If server cart doesn't exist, return local cart
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
      return localCart; // Always fallback to local cart
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
      return cart; // If not authenticated, just return the current cart
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
    cart: loadCartFromStorage(), // Load from storage on initialization
  },
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.items.push({ product, quantity });
      }

      const totals = calculateCartTotals(state.cart.items);
      state.cart = { ...state.cart, ...totals };

      // Save to localStorage
      saveCartToStorage(state.cart);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.product.id !== productId
      );

      const totals = calculateCartTotals(state.cart.items);
      state.cart = { ...state.cart, ...totals };

      // Save to localStorage
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
        state.cart = { ...state.cart, ...totals };

        // Save to localStorage
        saveCartToStorage(state.cart);
      }
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
      // Clear from localStorage
      saveCartToStorage(state.cart);
    },

    clearError: (state) => {
      state.error = null;
    },

    // For walk-in customers - no minimum order value
    setWalkInMode: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        // For walk-in customers, always eligible for any order value
        state.cart.isEligibleForFreeDelivery = true;
      } else {
        // Recalculate for online customers
        const totals = calculateCartTotals(state.cart.items);
        state.cart = { ...state.cart, ...totals };
      }

      // Save to localStorage
      saveCartToStorage(state.cart);
    },

    // Initialize cart from storage (called on app start)
    initializeCart: (state) => {
      const storedCart = loadCartFromStorage();
      state.cart = storedCart;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Cart
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        // Save to localStorage
        saveCartToStorage(state.cart);
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Sync Cart
      .addCase(syncCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        // Save to localStorage
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
} = cartSlice.actions;

export default cartSlice.reducer;
