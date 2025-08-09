// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Customer, OTPVerification } from "@/types";
import { api } from "@/lib/api";

const initialState: AuthState = {
  isAuthenticated: false,
  customer: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/api/auth/send-otp",
        {
          phoneNumber,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (
    { phoneNumber, otp }: { phoneNumber: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<{ customer: Customer; token: string }>(
        "/api/auth/verify-otp",
        {
          phoneNumber,
          otp,
        }
      );

      // Store token in localStorage
      localStorage.setItem("authToken", response.data.token);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);

export const loadCustomer = createAsyncThunk(
  "auth/loadCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get<Customer>("/api/auth/me");
      return response.data;
    } catch (error: any) {
      localStorage.removeItem("authToken");
      return rejectWithValue(
        error.response?.data?.message || "Failed to load customer"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "auth/updateCustomer",
  async (customerData: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response = await api.put<Customer>(
        "/api/auth/update",
        customerData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.customer = null;
      state.error = null;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.customer = action.payload.customer;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load Customer
      .addCase(loadCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.customer = action.payload;
      })
      .addCase(loadCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.customer = null;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customer = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setCustomer } = authSlice.actions;
export default authSlice.reducer;
