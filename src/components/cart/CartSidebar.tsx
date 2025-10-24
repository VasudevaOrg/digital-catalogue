// src/components/cart/CartSidebar.tsx - Complete Updated with Free Delivery Info
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
import { isProductEligibleForFreeDelivery } from "@/lib/freeDeliveryUtils";
import { WEIGHT_UNIT_LABELS } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
} from "@/lib/discountUtils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Weight,
  Tag,
  Percent,
  AlertCircle,
  CheckCircle,
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

  // Calculate eligible and excluded amounts
  const eligibleAmount = cart.items
    .filter((item) => isProductEligibleForFreeDelivery(item.product))
    .reduce((sum, item) => {
      const hasDiscount =
        item.product.discount && isDiscountActive(item.product.discount);
      const discountCalc = hasDiscount
        ? calculateProductDiscount(item.product, item.quantity)
        : null;
      const finalPrice =
        discountCalc?.discountedPrice || item.product.price * item.quantity;
      return sum + finalPrice;
    }, 0);

  const excludedAmount = cart.items
    .filter((item) => !isProductEligibleForFreeDelivery(item.product))
    .reduce((sum, item) => {
      const hasDiscount =
        item.product.discount && isDiscountActive(item.product.discount);
      const discountCalc = hasDiscount
        ? calculateProductDiscount(item.product, item.quantity)
        : null;
      const finalPrice =
        discountCalc?.discountedPrice || item.product.price * item.quantity;
      return sum + finalPrice;
    }, 0);

  const amountNeededForFreeDelivery = Math.max(0, 1000 - eligibleAmount);

  // Format weight display
  const formatWeight = (product: any, quantity: number = 1) => {
    const totalWeight = product.weight * quantity;
    const unit = WEIGHT_UNIT_LABELS[product.weightUnit] || product.weightUnit;

    if (product.weightUnit === "grams" && totalWeight >= 1000) {
      return `${(totalWeight / 1000).toFixed(1)} kg`;
    }
    if (product.weightUnit === "ml" && totalWeight >= 1000) {
      return `${(totalWeight / 1000).toFixed(1)} L`;
    }
    return `${totalWeight} ${unit.split(" ")[1] || unit}`;
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
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-light text-gray-800">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">
                {cart.items.map((item) => {
                  const hasDiscount =
                    item.product.discount &&
                    isDiscountActive(item.product.discount);
                  const discountCalc = hasDiscount
                    ? calculateProductDiscount(item.product, item.quantity)
                    : null;

                  const originalPrice = item.product.price * item.quantity;
                  const finalPrice =
                    discountCalc?.discountedPrice || originalPrice;
                  const savings = discountCalc?.discountAmount || 0;

                  const isEligible = isProductEligibleForFreeDelivery(
                    item.product
                  );

                  return (
                    <div
                      key={item.product.id}
                      className="flex space-x-4 pb-4 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount &&
                          discountCalc &&
                          discountCalc.discountPercentage > 0 && (
                            <div className="absolute top-1 right-1">
                              <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                {discountCalc.discountPercentage.toFixed(0)}%
                                OFF
                              </div>
                            </div>
                          )}

                        {/* Not Eligible Badge */}
                        {!isEligible && (
                          <div className="absolute bottom-1 left-1">
                            <div className="bg-amber-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                              ⚠️
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 mb-1 text-sm sm:text-base leading-tight">
                          {item.product.name}
                        </h4>

                        {/* Category */}
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mb-2">
                          {item.product.category}
                        </p>

                        {/* Not Eligible Warning */}
                        {!isEligible && (
                          <div className="flex items-center text-xs text-amber-600 mb-2">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            <span>Not eligible for free delivery</span>
                          </div>
                        )}

                        {/* Price with Discount */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2">
                            {hasDiscount && savings > 0 ? (
                              <>
                                <span className="text-sm font-bold text-green-600">
                                  ₹{finalPrice.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{originalPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-medium text-gray-800">
                                ₹{finalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {hasDiscount && savings > 0 && (
                            <div className="flex items-center text-xs text-green-600 font-medium">
                              <Tag className="w-3 h-3 mr-1" />
                              <span>Save ₹{savings.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex items-center text-xs text-gray-500">
                            <Weight className="w-3 h-3 mr-1" />
                            <span>
                              {formatWeight(item.product, item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
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
                              className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-4 sm:p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Items ({cart.items.length})
                  </span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Weight className="w-4 h-4 mr-1" />
                    Total Weight
                  </span>
                  <span className="text-sm">
                    {cart.totalWeight > 1000
                      ? `${(cart.totalWeight / 1000).toFixed(2)} kg`
                      : `${cart.totalWeight.toFixed(0)} g`}
                  </span>
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

              {/* Total Savings Banner */}
              {cart.items.some((item) => {
                const hasDiscount =
                  item.product.discount &&
                  isDiscountActive(item.product.discount);
                const discountCalc = hasDiscount
                  ? calculateProductDiscount(item.product, item.quantity)
                  : null;
                return discountCalc && discountCalc.discountAmount > 0;
              }) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-800">
                    <Percent className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium">Total Savings: </span>
                      <span className="font-bold">
                        ₹
                        {cart.items
                          .reduce((total, item) => {
                            const hasDiscount =
                              item.product.discount &&
                              isDiscountActive(item.product.discount);
                            const discountCalc = hasDiscount
                              ? calculateProductDiscount(
                                  item.product,
                                  item.quantity
                                )
                              : null;
                            return total + (discountCalc?.discountAmount || 0);
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Delivery Status */}
              {!cart.isEligibleForFreeDelivery && cart.items.length > 0 && (
                <div className="text-xs bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="space-y-2">
                    {excludedAmount > 0 && (
                      <>
                        <div className="flex items-start">
                          <AlertCircle className="w-3 h-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-800">
                              ⚠️ Ineligible items in cart: ₹
                              {excludedAmount.toFixed(2)}
                            </p>
                            <p className="text-red-700 text-xs mt-1">
                              Sugar, oils, and jaggery are NOT eligible for free
                              delivery. Remove these items to qualify for FREE
                              delivery.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Tag className="w-3 h-3 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-amber-800">
                              Eligible items: ₹{eligibleAmount.toFixed(2)}
                            </p>
                            <p className="text-amber-700 text-xs mt-1">
                              You have enough eligible items, but must remove
                              ineligible items for FREE delivery
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {excludedAmount === 0 &&
                      amountNeededForFreeDelivery > 0 && (
                        <div className="flex items-start">
                          <Tag className="w-3 h-3 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-amber-800">
                              Eligible items: ₹{eligibleAmount.toFixed(2)}
                            </p>
                            <p className="text-amber-700 text-xs mt-1">
                              Add ₹{amountNeededForFreeDelivery.toFixed(2)} more
                              in eligible items for FREE delivery!
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {cart.isEligibleForFreeDelivery && (
                <div className="text-xs bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">
                        🎉 You qualify for FREE delivery!
                      </p>
                      <p className="text-green-700 text-xs mt-1">
                        Eligible items: ₹{eligibleAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
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
