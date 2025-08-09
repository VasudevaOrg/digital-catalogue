// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { loadCustomer } from "@/store/slices/authSlice";
import { loadCart } from "@/store/slices/cartSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Try to load customer from token
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(loadCustomer());
      dispatch(loadCart());
    }
  }, [dispatch]);

  return <>{children}</>;
}
