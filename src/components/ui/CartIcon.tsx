"use client";

import { useAppSelector, useAppDispatch } from "@/store";
import { openCart } from "@/store/slices/uiSlice";
import { ShoppingCart } from "lucide-react";

export function CartIcon() {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => dispatch(openCart())}
      className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
