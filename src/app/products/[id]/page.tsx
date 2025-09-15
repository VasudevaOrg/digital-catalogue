// src/app/products/[id]/page.tsx - Updated Product Detail Page
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

  // Get tag icon based on tag name
  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "recommended":
        return <Trophy className="w-4 h-4" />;
      case "best-selling":
        return <Star className="w-4 h-4" />;
      case "fresh":
        return <Leaf className="w-4 h-4" />;
      case "organic":
        return <Leaf className="w-4 h-4" />;
      case "premium":
        return <Award className="w-4 h-4" />;
      case "new-arrival":
        return <Zap className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  // Get tag color based on tag name
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "recommended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "best-selling":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "fresh":
        return "bg-green-100 text-green-800 border-green-200";
      case "organic":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "premium":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "new-arrival":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "discounted":
        return "bg-red-100 text-red-800 border-red-200";
      case "limited-offer":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format weight display
  const formatWeight = () => {
    if (!product) return "";
    const unit = WEIGHT_UNIT_LABELS[product.weightUnit] || product.weightUnit;
    if (product.weightUnit === "grams" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} kg`;
    }
    if (product.weightUnit === "ml" && product.weight >= 1000) {
      return `${(product.weight / 1000).toFixed(1)} L`;
    }
    return `${product.weight} ${unit.split(" ")[1] || unit}`;
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

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

                    {/* Recommended Badge on Image */}
                    {product.isRecommended && (
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
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagColor(
                          tag
                        )}`}
                      >
                        {getTagIcon(tag)}
                        <span className="ml-2 capitalize">
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

              {/* Price and Weight */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl sm:text-3xl font-medium text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm sm:text-base">
                    per {formatWeight()}
                  </span>
                </div>

                {/* Weight Information */}
                <div className="flex items-center text-gray-600 text-sm">
                  <Weight className="w-4 h-4 mr-2" />
                  <span>Weight: {formatWeight()} per unit</span>
                </div>
              </div>

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
