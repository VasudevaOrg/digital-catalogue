// src/components/cart/CartSidebar.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeCart } from "@/store/slices/uiSlice";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/store/slices/cartSlice";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Package,
  Truck,
  AlertCircle,
} from "lucide-react";

export function CartSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartOpen } = useAppSelector((state) => state.ui);
  const { cart } = useAppSelector((state) => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    router.push("/checkout");
    handleClose();
  };

  const handleContinueShopping = () => {
    router.push("/");
    handleClose();
  };

  // Calculate delivery fee
  const deliveryFee = cart.isEligibleForFreeDelivery ? 0 : 50;
  const totalWithDelivery = cart.totalAmount + deliveryFee;

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l-2 border-gray-300 z-50 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-300 bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600">
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 border-2 border-gray-400 transition-colors"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Start shopping to add items to your cart
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium border-2 border-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3 bg-gray-50 border-2 border-gray-200 p-3 hover:bg-gray-100 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-white border-2 border-gray-300 flex-shrink-0">
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-700">
                          ₹{item.product.price} × {item.quantity}
                        </p>
                        {item.product.isEligibleForFreeDelivery && (
                          <span className="text-xs text-green-600 bg-green-50 px-1 py-0.5 border border-green-200">
                            <Truck className="w-3 h-3 inline" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Weight:{" "}
                        {(item.product.weight * item.quantity).toFixed(2)}kg
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center border-2 border-gray-300 bg-white">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r-2 border-gray-300 text-gray-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l-2 border-gray-300 text-gray-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-red-600 hover:text-red-800 p-1 border-2 border-red-400 hover:border-red-600 bg-white hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t-2 border-gray-300 p-4 space-y-4 bg-gray-50">
              {/* Order Summary */}
              <div className="space-y-2 text-sm bg-white p-3 border-2 border-gray-300">
                <div className="flex justify-between text-gray-800">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Total Weight:</span>
                  <span>{cart.totalWeight.toFixed(2)}kg</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Delivery Fee:</span>
                  <span
                    className={
                      cart.isEligibleForFreeDelivery
                        ? "text-green-600 font-semibold"
                        : "text-gray-800"
                    }
                  >
                    {cart.isEligibleForFreeDelivery
                      ? "FREE"
                      : `₹${deliveryFee}`}
                  </span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total:</span>
                  <span>₹{totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Delivery Message */}
              {!cart.isEligibleForFreeDelivery && (
                <div className="text-xs text-amber-800 bg-amber-100 p-3 border-2 border-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for free
                      delivery!
                    </p>
                    <p className="text-xs mt-1">
                      *Excludes sugar, oils, and jaggery items
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Info */}
              <div className="text-xs text-blue-800 bg-blue-50 p-2 border border-blue-200">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span className="font-medium">
                    Delivery available within 573103 area
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium border-2 border-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full border-2 border-gray-400 hover:bg-gray-100 text-gray-800 py-3 font-medium bg-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
