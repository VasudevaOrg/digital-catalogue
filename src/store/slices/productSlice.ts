// src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ProductState,
  Product,
  ProductFilters,
  PaginatedResponse,
} from "@/types";
import { mockProductAPI } from "@/lib/demoData";

const initialState: ProductState = {
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  filters: {
    category: "",
    priceRange: [0, 10000],
    searchQuery: "",
    sortBy: "name",
    sortOrder: "asc",
  },
};

// Async thunks using demo data
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params?: {
      page?: number;
      limit?: number;
      filters?: Partial<ProductFilters>;
    },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await mockProductAPI.getProducts(params?.filters);
      return response;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const product = await mockProductAPI.getProductById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch product");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      const categories = await mockProductAPI.getCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const response = await mockProductAPI.getProducts({ searchQuery: query });
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to search products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: "name" | "price" | "newest";
        sortOrder: "asc" | "desc";
      }>
    ) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update product in the list if it exists
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSearchQuery,
  setCategory,
  setPriceRange,
  setSortBy,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
