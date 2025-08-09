// src/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartState, Cart, Product, CartItem } from "@/types";
import { api } from "@/lib/api";

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

  // Check if eligible for free delivery
  const eligibleAmount = items
    .filter((item) => item.product.isEligibleForFreeDelivery)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isEligibleForFreeDelivery =
    eligibleAmount >=
    parseInt(process.env.NEXT_PUBLIC_MIN_ORDER_VALUE || "1000");

  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalWeight: parseFloat(totalWeight.toFixed(2)),
    isEligibleForFreeDelivery,
  };
};

// Async thunks
export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Cart>("/api/cart");
      return response.data;
    } catch (error: any) {
      // If no cart exists, return empty cart
      if (error.response?.status === 404) {
        return initialState.cart;
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (cart: Cart, { rejectWithValue }) => {
    try {
      const response = await api.post<Cart>("/api/cart/sync", cart);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to sync cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
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
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.product.id !== productId
      );

      const totals = calculateCartTotals(state.cart.items);
      state.cart = { ...state.cart, ...totals };
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
      }
    },

    clearCart: (state) => {
      state.cart = initialState.cart;
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
} = cartSlice.actions;

export default cartSlice.reducer;
