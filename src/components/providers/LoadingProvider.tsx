"use client";

import { useAppSelector } from "@/store";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading: productLoading } = useAppSelector(
    (state) => state.products
  );
  const { isLoading: cartLoading } = useAppSelector((state) => state.cart);
  const { isLoading: orderLoading } = useAppSelector((state) => state.orders);

  const isGlobalLoading = false; // You can implement global loading logic here

  return (
    <>
      {children}
      {isGlobalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="medium" />
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
