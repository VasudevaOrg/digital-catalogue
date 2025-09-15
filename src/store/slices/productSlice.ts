// src/store/slices/productSlice.ts - Updated with new filters
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ProductState,
  Product,
  ProductFilters,
  PaginatedResponse,
} from "@/types";
import { productAPI } from "@/lib/api";

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
    tags: [],
    isRecommended: false,
  },
};

// Async thunks
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
      const apiParams = {
        page: params?.page || 1,
        limit: params?.limit || 50,
        category: params?.filters?.category || "",
        search: params?.filters?.searchQuery || "",
        sortBy: params?.filters?.sortBy || "name",
        sortOrder: params?.filters?.sortOrder || "asc",
        isRecommended: params?.filters?.isRecommended || false,
        tags: params?.filters?.tags || [],
      };

      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([key, value]) => {
          if (key === "page" || key === "limit") return true; // Always include page and limit
          if (key === "isRecommended") return value === true; // Only include if true
          if (Array.isArray(value)) return value.length > 0; // Only include non-empty arrays
          return value !== "";
        })
      );

      console.log("Fetching products with params:", cleanParams);

      const response = await productAPI.getAll(cleanParams);

      // Ensure we return the correct structure
      return {
        data: response.data || [],
        pagination: response.pagination || {
          page: apiParams.page,
          limit: apiParams.limit,
          total: response.data?.length || 0,
          totalPages: Math.ceil((response.data?.length || 0) / apiParams.limit),
        },
      };
    } catch (error: any) {
      console.error("Error in fetchProducts:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const product = await productAPI.getById(productId);
      return product;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await productAPI.getCategories();
      return categories;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (
    {
      query,
      filters,
      page = 1,
      limit = 50,
    }: {
      query: string;
      filters?: Partial<ProductFilters>;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productAPI.search(query, {
        category: filters?.category || "",
        isRecommended: filters?.isRecommended,
        tags: filters?.tags,
        sortBy: filters?.sortBy || "name",
        sortOrder: filters?.sortOrder || "asc",
        page,
        limit,
      });

      return {
        data: response.data || [],
        pagination: response.pagination || {
          page,
          limit,
          total: response.data?.length || 0,
          totalPages: Math.ceil((response.data?.length || 0) / limit),
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search products"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (limit: number = 12, { rejectWithValue }) => {
    try {
      const products = await productAPI.getFeatured(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  "products/fetchRecommendedProducts",
  async (limit: number = 12, { rejectWithValue }) => {
    try {
      const products = await productAPI.getRecommended(limit);
      return products;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recommended products"
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (
    {
      category,
      page = 1,
      limit = 50,
      params,
    }: {
      category: string;
      page?: number;
      limit?: number;
      params?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productAPI.getByCategory(category, {
        page,
        limit,
        ...params,
      });

      return {
        data: response.data || [],
        pagination: response.pagination || {
          page,
          limit,
          total: response.data?.length || 0,
          totalPages: Math.ceil((response.data?.length || 0) / limit),
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products by category"
      );
    }
  }
);

export const fetchProductsByTags = createAsyncThunk(
  "products/fetchProductsByTags",
  async (
    {
      tags,
      page = 1,
      limit = 50,
      params,
    }: {
      tags: string[];
      page?: number;
      limit?: number;
      params?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productAPI.getByTags(tags, {
        page,
        limit,
        ...params,
      });

      return {
        data: response.data || [],
        pagination: response.pagination || {
          page,
          limit,
          total: response.data?.length || 0,
          totalPages: Math.ceil((response.data?.length || 0) / limit),
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products by tags"
      );
    }
  }
);

// New thunk to get product count for a category
export const fetchCategoryProductCount = createAsyncThunk(
  "products/fetchCategoryProductCount",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await productAPI.getByCategory(category, {
        page: 1,
        limit: 1, // We only need the count
      });

      return {
        category,
        count: response.pagination?.total || response.data?.length || 0,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category count"
      );
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
      state.filters = {
        category: "",
        priceRange: [0, 10000],
        searchQuery: "",
        sortBy: "name",
        sortOrder: "asc",
        tags: [],
        isRecommended: false,
      };
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
        sortBy: "name" | "price" | "newest" | "recommended";
        sortOrder: "asc" | "desc";
      }>
    ) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.filters.tags = action.payload;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.filters.tags) {
        state.filters.tags = [];
      }
      if (!state.filters.tags.includes(action.payload)) {
        state.filters.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      if (state.filters.tags) {
        state.filters.tags = state.filters.tags.filter(
          (tag) => tag !== action.payload
        );
      }
    },
    setRecommendedFilter: (state, action: PayloadAction<boolean>) => {
      state.filters.isRecommended = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add action to clear products (useful when changing filters)
    clearProducts: (state) => {
      state.products = [];
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
        state.products = action.payload.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.products = [];
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
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
        state.categories = action.payload || [];
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
        state.products = action.payload.data || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.products = [];
      })

      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Recommended Products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.products = [];
      })

      // Fetch Products by Tags
      .addCase(fetchProductsByTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
      })
      .addCase(fetchProductsByTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.products = [];
      })

      // Fetch Category Product Count
      .addCase(fetchCategoryProductCount.fulfilled, (state, action) => {
        // This doesn't modify the main products state, just used for category counts
        // The result is handled in the component that dispatches this action
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
  setTags,
  addTag,
  removeTag,
  setRecommendedFilter,
  clearError,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
