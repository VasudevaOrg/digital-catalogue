// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { loadCustomer } from "@/store/slices/authSlice";
import { initializeCart, loadCart } from "@/store/slices/cartSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize cart from localStorage first
    dispatch(initializeCart());

    // Try to load customer from token
    const token = localStorage.getItem("authToken");
    if (token) {
      // If authenticated, load customer and sync cart
      dispatch(loadCustomer()).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          // Customer loaded successfully, sync cart with server
          dispatch(loadCart());
        }
      });
    }
  }, [dispatch]);

  return <>{children}</>;
}
