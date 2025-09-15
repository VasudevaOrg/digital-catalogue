// src/lib/api.ts - Updated with proper parameter handling
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

// Create axios instance
export const api = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(
        `API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const tokenKey = "authToken";
      localStorage.removeItem(tokenKey);

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    }

    if (error.response?.status === 404) {
      console.error("Resource not found:", error.config?.url);
    }

    if (error.response?.status >= 500) {
      console.error(
        "Server error:",
        error.response.status,
        error.response.data
      );
    }

    if (error.code === "NETWORK_ERROR" || !error.response) {
      console.error("Network error - please check your connection");
    }

    return Promise.reject(error);
  }
);

// API utility functions
export const apiUtils = {
  get: async <T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.get<T>(url, { params, ...config });
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
};

// Product API functions
export const productAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    isRecommended?: boolean;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      // Clean params to remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params || {}).filter(([key, value]) => {
          if (key === "page" || key === "limit") return true;
          if (key === "minPrice" || key === "maxPrice") {
            return value !== undefined && value !== null;
          }
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "boolean") return value === true; // Only include if true
          return value !== undefined && value !== "" && value !== null;
        })
      );

      // Convert tags array to comma-separated string if needed
      if (cleanParams.tags && Array.isArray(cleanParams.tags)) {
        cleanParams.tags = cleanParams.tags.join(",");
      }

      // Handle price range
      if (params?.priceRange) {
        const [minPrice, maxPrice] = params.priceRange;
        if (minPrice > 0) cleanParams.minPrice = minPrice;
        if (maxPrice < 10000) cleanParams.maxPrice = maxPrice;
        delete cleanParams.priceRange; // Remove priceRange as it's not a backend param
      }

      console.log("API request params:", cleanParams);

      const response = await apiUtils.get("/api/products", cleanParams);
      return response;
    } catch (error: any) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiUtils.get(`/api/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await apiUtils.get("/api/categories");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  search: async (query: string, params?: any) => {
    try {
      const searchParams = { search: query, ...params };

      // Handle price range in search
      if (params?.priceRange) {
        const [minPrice, maxPrice] = params.priceRange;
        if (minPrice > 0) searchParams.minPrice = minPrice;
        if (maxPrice < 10000) searchParams.maxPrice = maxPrice;
        delete searchParams.priceRange;
      }

      // Convert tags to string
      if (searchParams.tags && Array.isArray(searchParams.tags)) {
        searchParams.tags = searchParams.tags.join(",");
      }

      const response = await apiUtils.get("/api/products", searchParams);
      return response;
    } catch (error: any) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  getFeatured: async (limit: number = 12) => {
    try {
      const response = await apiUtils.get("/api/products", {
        limit,
        sortBy: "stock",
        sortOrder: "desc",
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  getRecommended: async (limit: number = 12) => {
    try {
      const response = await apiUtils.get("/api/products", {
        limit,
        isRecommended: true,
        sortBy: "newest",
        sortOrder: "desc",
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recommended products:", error);
      throw error;
    }
  },

  getByCategory: async (category: string, params?: any) => {
    try {
      const categoryParams = { category, ...params };

      // Handle price range
      if (categoryParams.priceRange) {
        const [minPrice, maxPrice] = categoryParams.priceRange;
        if (minPrice > 0) categoryParams.minPrice = minPrice;
        if (maxPrice < 10000) categoryParams.maxPrice = maxPrice;
        delete categoryParams.priceRange;
      }

      // Convert tags to string
      if (categoryParams.tags && Array.isArray(categoryParams.tags)) {
        categoryParams.tags = categoryParams.tags.join(",");
      }

      const response = await apiUtils.get("/api/products", categoryParams);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  getByTags: async (tags: string[], params?: any) => {
    try {
      const tagParams = {
        tags: tags.join(","),
        ...params,
      };

      // Handle price range
      if (tagParams.priceRange) {
        const [minPrice, maxPrice] = tagParams.priceRange;
        if (minPrice > 0) tagParams.minPrice = minPrice;
        if (maxPrice < 10000) tagParams.maxPrice = maxPrice;
        delete tagParams.priceRange;
      }

      const response = await apiUtils.get("/api/products", tagParams);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching products by tags:", error);
      throw error;
    }
  },

  // Get all available product tags
  getTags: async () => {
    try {
      const response = await apiUtils.get("/api/products/tags");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching product tags:", error);
      throw error;
    }
  },
};

export default api;
