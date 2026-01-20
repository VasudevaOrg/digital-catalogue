// src/app/products/[id]/page.tsx - Enhanced with Stock Validation
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProductById } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/store/slices/uiSlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WEIGHT_UNIT_LABELS, ProductVariant } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
  getSavingsMessage,
} from "@/lib/discountUtils";
import { DiscountBadge } from "@/components/product/DiscountBadge";
import { DiscountPriceDisplay } from "@/components/product/DiscountPriceDisplay";
import { QuantityDiscountTiers } from "@/components/product/QuantityDiscountTiers";
import { VariantSelector } from "@/components/product/VariantSelector";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Star,
  Trophy,
  Tag,
  Award,
  Leaf,
  Zap,
  Weight,
  Info,
  Clock,
  Percent,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = params.id as string;

  const { products, isLoading } = useAppSelector((state) => state.products);
  const { cart } = useAppSelector((state) => state.cart);
  const product = products.find((p) => p.id === productId);

  // Main source of truth for calculations
  const [quantity, setQuantity] = useState(1);
  // Local input state to allow transient empty/invalid values while typing
  const [inputValue, setInputValue] = useState("1");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );

  useEffect(() => {
    if (productId && !product) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, product]);

  // Sync inputValue when quantity changes externally (e.g. +/- buttons)
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  // Don't auto-select variant - show base product by default
  // Helper functions to get current values based on selected variant or base product
  const getCurrentPrice = () => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.stock;
    }
    return product?.stock || 0;
  };

  const getCurrentWeight = () => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.weight;
    }
    return product?.weight || 0;
  };

  const getCurrentWeightUnit = () => {
    if (product?.hasVariants && selectedVariant) {
      return selectedVariant.weightUnit;
    }
    return product?.weightUnit || "kg";
  };

  // Calculate remaining stock (considering items already in cart)
  const getAvailableStock = () => {
    if (!product) return 0;

    const currentStock = getCurrentStock();

    // For variants, check cart items with same variant
    if (product.hasVariants && selectedVariant) {
      const cartItem = cart.items.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant?.sku === selectedVariant.sku,
      );
      const quantityInCart = cartItem?.quantity || 0;
      return Math.max(0, currentStock - quantityInCart);
    }

    // For non-variant products
    const cartItem = cart.items.find(
      (item) => item.product.id === product.id && !item.selectedVariant,
    );
    const quantityInCart = cartItem?.quantity || 0;
    return Math.max(0, currentStock - quantityInCart);
  };

  const availableStock = getAvailableStock();
  const isOutOfStock = getCurrentStock() === 0 || availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  // Handle quantity change with stock validation
  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    const validQuantity = Math.max(1, Math.min(availableStock, newQuantity));
    setQuantity(validQuantity);

    // Show warning if trying to exceed stock
    if (newQuantity > availableStock) {
      dispatch(
        showErrorNotification(
          `Only ${availableStock} unit${
            availableStock !== 1 ? "s" : ""
          } available for this product`,
        ),
      );
    }
  };

  // Handle input change: allows empty string, but valid numbers update quantity immediately
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === "") return;

    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 0) {
      // Only update actual quantity if valid number > 0.
      // We don't want to trigger "0" updates as they are invalid for quantity
      // and might be transitional state (e.g. deleting and typing 0 then 5)
      // But user requirement says "when he enter 0 then he converts to 1".
      // We'll handle "0" validation on blur or specifically if needed.
      // For now, only update valid quantities > 0.
      // Note: we don't clamp here immediately to let user type large numbers if they want,
      // but handleQuantityChange does clamp. If we want to allow typing "10" when max is "5"
      // only to be clamped, handleQuantityChange will do it, but that forces inputValue->clamped
      // via useEffect, which interrupts typing.
      // BETTER: Check against max before updating quantity to avoid jarring jumps?
      // Or just use handleQuantityChange which clamps.
      // If user types "10" and max is "5", handleQuantityChange sets "5".
      // Effect sets inputValue "5". User sees "10" turn into "5" instantly. That is acceptable validation.
      handleQuantityChange(parsed);
    }
  };

  // Handle blur: ensure valid state
  const handleInputBlur = () => {
    if (
      inputValue === "" ||
      parseInt(inputValue) === 0 ||
      isNaN(parseInt(inputValue))
    ) {
      setQuantity(1);
      setInputValue("1");
    } else {
      // Ensure specific cleanup if needed, but the useEffect([quantity]) mechanism
      // generally keeps them in sync. If user typed "05", parseInt is 5, qty=5,
      // effect sets input="5". So "05" cleans up to "5". Good.
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Variant selection is now optional
    // if (product.hasVariants && !selectedVariant) {
    //   dispatch(showErrorNotification("Please select a variant first"));
    //   return;
    // }

    if (quantity > availableStock) {
      dispatch(
        showErrorNotification(
          `Cannot add ${quantity} units. Only ${availableStock} available.`,
        ),
      );
      return;
    }

    // Add to basket with selected variant if applicable
    dispatch(
      addToCart({
        product,
        quantity,
        selectedVariant:
          product.hasVariants && selectedVariant ? selectedVariant : undefined,
      }),
    );

    setQuantity(1);
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Reset quantity when variant changes
    setQuantity(1);
  };

  const handleQuantityClick = (newQuantity: number) => {
    handleQuantityChange(Math.min(availableStock, newQuantity));
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const hasDiscount = product.discount && isDiscountActive(product.discount);

  // Calculate effective discount based on variant selection
  const currentDiscount =
    selectedVariant?.discount && isDiscountActive(selectedVariant.discount)
      ? selectedVariant.discount
      : product.discount;

  const hasActiveDiscount =
    currentDiscount && isDiscountActive(currentDiscount);

  // Create an effective product object for discount calculations
  // This ensures all components use the correct price and discount data
  const effectiveProduct = {
    ...product,
    price: getCurrentPrice(),
    weight: getCurrentWeight(),
    weightUnit: getCurrentWeightUnit() as any,
    discount: currentDiscount,
  };

  const discountCalc = hasActiveDiscount
    ? calculateProductDiscount(effectiveProduct, quantity)
    : null;

  // Format weight display
  const formatWeight = () => {
    const weight = getCurrentWeight();
    const weightUnit = getCurrentWeightUnit();

    if (product?.hasVariants && selectedVariant?.customUnit) {
      return `${weight} ${selectedVariant.customUnit}`;
    }

    if (product?.customUnit && weightUnit === "other") {
      return `${weight} ${product.customUnit}`;
    }

    const unit = WEIGHT_UNIT_LABELS[weightUnit] || weightUnit;
    if (weightUnit === "grams" && weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} kg`;
    }
    if (weightUnit === "ml" && weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} L`;
    }
    return `${weight} ${unit.split(" ")[1] || unit}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />

                    {/* Discount Badge on Image */}
                    {hasActiveDiscount && (
                      <div className="absolute top-4 right-4">
                        <DiscountBadge
                          product={effectiveProduct}
                          quantity={quantity}
                          showSavings={true}
                        />
                      </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <div className="text-center">
                          <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg mb-2">
                            OUT OF STOCK
                          </div>
                          <p className="text-white text-sm">
                            Currently Unavailable
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Recommended Badge on Image */}
                    {product.isRecommended &&
                      !hasActiveDiscount &&
                      !isOutOfStock && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-3 py-2 text-sm font-bold rounded-full flex items-center shadow-lg">
                            <Trophy className="w-4 h-4 mr-2" />
                            Recommended
                          </span>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package className="w-16 sm:w-24 h-16 sm:h-24" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded border-2 overflow-hidden ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4 sm:mb-6">
                {/* Category Badge */}
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {product.category}
                </span>

                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-gray-50 text-gray-800 border-gray-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        <span className="capitalize">
                          {tag.replace("-", " ")}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-2 sm:mb-3">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {product.description}
                </p>
              </div>

              {/* Variant Selector */}
              {/* Variant Selector moved below price */}

              {/* Stock Status - Prominent Display */}
              {/* <div className="mb-4 sm:mb-6">
                {isOutOfStock ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-red-600 font-bold text-lg">
                          Out of Stock
                        </p>
                        <p className="text-red-500 text-sm">
                          This product is currently unavailable
                        </p>
                      </div>
                    </div>
                  </div>
                ) : isLowStock ? (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
                      <div>
                        <p className="text-orange-600 font-semibold">
                          Only {availableStock} unit
                          {availableStock !== 1 ? "s" : ""} left in stock!
                        </p>
                        <p className="text-orange-500 text-sm">
                          Order soon before it's gone
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-green-600 font-semibold">In Stock</p>
                        <p className="text-green-500 text-sm">
                          {availableStock} units available
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Price and Discount */}
              <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <DiscountPriceDisplay
                  product={effectiveProduct}
                  quantity={quantity}
                  showOriginalPrice={true}
                  className="mb-2"
                  discountedPriceClassName="text-3xl font-bold text-green-600"
                  originalPriceClassName="text-xl text-gray-500 line-through"
                />

                {hasActiveDiscount &&
                  discountCalc &&
                  discountCalc.discountAmount > 0 && (
                    <div className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      <span>
                        {getSavingsMessage(
                          discountCalc.originalPrice,
                          discountCalc.discountedPrice,
                        )}
                      </span>
                    </div>
                  )}

                <div className="text-sm text-gray-600 mt-2">
                  Price per {formatWeight()} • Total:{" "}
                  {(quantity * getCurrentWeight()).toFixed(2)}{" "}
                  {getCurrentWeightUnit() === "other" && product.customUnit
                    ? product.customUnit
                    : WEIGHT_UNIT_LABELS[getCurrentWeightUnit()]?.split(
                        " ",
                      )[1] || getCurrentWeightUnit()}
                </div>
              </div>

              {/* Variant Selector */}
              {product.hasVariants &&
                product.variants &&
                product.variants.length > 0 && (
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={handleVariantSelect}
                  />
                )}

              {/* Quantity Discount Tiers */}
              {hasActiveDiscount &&
                currentDiscount?.type !== "simple" &&
                !isOutOfStock && (
                  <div className="mb-6">
                    <QuantityDiscountTiers
                      product={effectiveProduct}
                      currentQuantity={quantity}
                      onQuantityClick={handleQuantityClick}
                    />
                  </div>
                )}

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2 text-sm">
                  4.8 (124 reviews)
                </span>
              </div>

              {/* Quantity Selector and Add to Basket */}
              {!isOutOfStock && (
                <div className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Quantity
                    {isLowStock && (
                      <span className="text-orange-600 text-sm ml-2">
                        (Max: {availableStock})
                      </span>
                    )}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={availableStock}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="w-16 h-full text-center font-medium text-gray-900 border-x border-transparent focus:outline-none focus:bg-gray-50 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= availableStock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={quantity > availableStock}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Basket
                    </button>
                  </div>

                  {/* Stock warning when approaching limit */}
                  {quantity >= availableStock && availableStock > 0 && (
                    <p className="text-orange-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      You've selected the maximum available quantity
                    </p>
                  )}
                </div>
              )}

              {/* Out of Stock Message */}
              {/* {isOutOfStock && (
                <div className="mb-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <p className="text-gray-700 font-medium mb-2">
                    This product is currently out of stock
                  </p>
                  <p className="text-gray-600 text-sm">
                    Check back soon or contact us for restocking information
                  </p>
                </div>
              )} */}

              {/* Product Features */}
              <div className="border-t pt-4 sm:pt-6 space-y-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Delivery Information
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.isEligibleForFreeDelivery
                        ? "Eligible for free delivery on orders above ₹1,000"
                        : "Standard delivery charges apply"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">
                      Quality Guarantee
                    </p>
                    <p className="text-sm text-gray-600">
                      100% genuine products with quality assurance
                    </p>
                  </div>
                </div>

                {hasActiveDiscount && currentDiscount?.endDate && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Limited Time Offer
                      </p>
                      <p className="text-sm text-gray-600">
                        Offer ends on{" "}
                        {new Date(currentDiscount.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Info className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Product Details</p>
                    <p className="text-sm text-gray-600">
                      Weight: {formatWeight()} per unit
                    </p>
                    <p className="text-sm text-gray-600">
                      Category: {product.category}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      Available Stock: {availableStock} units
                    </p> */}
                    {product.tags && product.tags.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Tags:{" "}
                        {product.tags
                          .map((tag) => tag.replace("-", " "))
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Badges */}
                {product.isRecommended && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Recommended Product
                        </p>
                        <p className="text-sm text-yellow-700">
                          This product is specially recommended by our team for
                          its quality and popularity.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
