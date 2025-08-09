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
import { whatsappService } from "@/lib/whatsappService";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Package,
  MessageCircle,
  Truck,
  ArrowRight,
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

  const handleWhatsAppOrder = () => {
    if (cart.items.length === 0) return;

    const orderData = {
      orderId: `QUICK${Date.now()}`,
      customerInfo: {
        name: "Customer",
        phoneNumber: "",
      },
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalWeight: cart.totalWeight,
      deliveryType: "delivery" as const,
      paymentMethod: "prepaid" as const,
      deliveryFee: cart.isEligibleForFreeDelivery ? 0 : 50,
    };

    whatsappService.sendOrderEnquiry(orderData);
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
        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slideInRight">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-sm text-gray-600">
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover our amazing products and add them to your cart
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          ₹{item.product.price} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-semibold bg-white py-2.5">
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
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
              {/* Order Summary */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Weight:</span>
                    <span>{cart.totalWeight.toFixed(2)}kg</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery:</span>
                    <span
                      className={
                        cart.isEligibleForFreeDelivery
                          ? "text-green-600 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {cart.isEligibleForFreeDelivery
                        ? "FREE"
                        : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg text-gray-900">
                      <span>Total:</span>
                      <span>₹{totalWithDelivery.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Delivery Message */}
              {!cart.isEligibleForFreeDelivery && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                      Add ₹{(1000 - cart.totalAmount).toFixed(2)} more for free
                      delivery
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Quick Order via WhatsApp</span>
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full border-2 border-gray-300 hover:border-primary-300 hover:bg-primary-50 text-gray-700 hover:text-primary-700 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 text-center text-xs text-gray-600 pt-2">
                <div className="flex items-center justify-center gap-1">
                  <Package className="w-3 h-3" />
                  <span>Quality Products</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp Support</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
