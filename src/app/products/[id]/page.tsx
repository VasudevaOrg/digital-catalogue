// src/app/products/[id]/page.tsx - Product Detail with Discount Support
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProductById } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WEIGHT_UNIT_LABELS } from "@/types";
import {
  calculateProductDiscount,
  isDiscountActive,
  getSavingsMessage,
} from "@/lib/discountUtils";
import { DiscountBadge } from "@/components/product/DiscountBadge";
import { DiscountPriceDisplay } from "@/components/product/DiscountPriceDisplay";
import { QuantityDiscountTiers } from "@/components/product/QuantityDiscountTiers";
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
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = params.id as string;

  const { products, isLoading } = useAppSelector((state) => state.products);
  const product = products.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId && !product) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, product]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      dispatch(showSuccessNotification(`${product.name} added to cart!`));
      setQuantity(1);
    }
  };

  const handleQuantityClick = (newQuantity: number) => {
    setQuantity(Math.min(product?.stock || 1, newQuantity));
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.discount && isDiscountActive(product.discount);
  const discountCalc = hasDiscount
    ? calculateProductDiscount(product, quantity)
    : null;

  // Format weight display
  const formatWeight = () => {
    const unit = WEIGHT_UNIT_LABELS[product.weightUnit] || product.weightUnit;
    if (product.weightUnit === "grams" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} kg`;
    }
    if (product.weightUnit === "ml" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} L`;
    }
    return `${product.weight} ${unit.split(" ")[1] || unit}`;
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
                    {hasDiscount && (
                      <div className="absolute top-4 right-4">
                        <DiscountBadge
                          product={product}
                          quantity={quantity}
                          showSavings={true}
                        />
                      </div>
                    )}

                    {/* Recommended Badge on Image */}
                    {product.isRecommended && !hasDiscount && (
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

              {/* Price and Discount */}
              <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <DiscountPriceDisplay
                  product={product}
                  quantity={quantity}
                  showOriginalPrice={true}
                  className="mb-2"
                  discountedPriceClassName="text-3xl font-bold text-green-600"
                  originalPriceClassName="text-xl text-gray-500 line-through"
                />

                {hasDiscount &&
                  discountCalc &&
                  discountCalc.discountAmount > 0 && (
                    <div className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      <span>
                        {getSavingsMessage(
                          discountCalc.originalPrice,
                          discountCalc.discountedPrice
                        )}
                      </span>
                    </div>
                  )}

                <div className="text-sm text-gray-600 mt-2">
                  Price per {formatWeight()} • Total:{" "}
                  {(quantity * product.weight).toFixed(2)}{" "}
                  {WEIGHT_UNIT_LABELS[product.weightUnit]?.split(" ")[1] ||
                    product.weightUnit}
                </div>
              </div>

              {/* Quantity Discount Tiers */}
              {hasDiscount && product.discount?.type !== "simple" && (
                <div className="mb-6">
                  <QuantityDiscountTiers
                    product={product}
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

              {/* Stock Status */}
              <div className="mb-4 sm:mb-6">
                {isOutOfStock ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <p className="text-red-600 font-medium">Out of Stock</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-green-600">
                      {product.stock} units available
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Selector and Add to Cart */}
              {!isOutOfStock && (
                <div className="mb-6 sm:mb-8">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 sm:p-3 hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 sm:px-6 py-2 sm:py-3 min-w-[80px] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="p-2 sm:p-3 hover:bg-gray-50 transition-colors"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center font-medium"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

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

                {hasDiscount && product.discount?.endDate && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Limited Time Offer
                      </p>
                      <p className="text-sm text-gray-600">
                        Offer ends on{" "}
                        {new Date(
                          product.discount.endDate
                        ).toLocaleDateString()}
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
