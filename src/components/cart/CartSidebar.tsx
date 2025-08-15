// src/components/cart/CartSidebar.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeCart } from "@/store/slices/uiSlice";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/store/slices/cartSlice";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

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

  const deliveryFee = cart.isEligibleForFreeDelivery ? 0 : 50;
  const totalWithDelivery = cart.totalAmount + deliveryFee;

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-light text-gray-800">
              Shopping Cart ({cart.items.length})
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add items to your cart to continue
                </p>
                <button
                  onClick={() => {
                    router.push("/products");
                    handleClose();
                  }}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex space-x-4 pb-4 border-b"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{item.product.price} × {item.quantity} = ₹
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">
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
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span
                    className={
                      cart.isEligibleForFreeDelivery ? "text-green-600" : ""
                    }
                  >
                    {cart.isEligibleForFreeDelivery
                      ? "FREE"
                      : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Delivery Message */}
              {!cart.isEligibleForFreeDelivery && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for free
                  delivery
                </p>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
