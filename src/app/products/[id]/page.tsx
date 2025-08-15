// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchProductById } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { showSuccessNotification } from "@/store/slices/uiSlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
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

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package className="w-24 h-24" />
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
                      className={`relative w-20 h-20 rounded border-2 overflow-hidden ${
                        selectedImage === index
                          ? "border-gray-800"
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
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-800 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Price and Category */}
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-medium text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    per {product.weight}kg
                  </span>
                </div>
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  {product.category}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <p className="text-red-600 font-medium">Out of Stock</p>
                ) : (
                  <p className="text-green-600">
                    {product.stock} units available
                  </p>
                )}
              </div>

              {/* Quantity Selector and Add to Cart */}
              {!isOutOfStock && (
                <div className="mb-8">
                  <label className="block text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-6 py-3 min-w-[80px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="p-3 hover:bg-gray-50"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
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
                  <Shield className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
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
                  <Package className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Product Weight</p>
                    <p className="text-sm text-gray-600">
                      {product.weight}kg per unit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
