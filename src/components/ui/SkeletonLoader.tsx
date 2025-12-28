// src/components/ui/SkeletonLoader.tsx
"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded-lg" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Product Name */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
          <div className="text-right">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      {/* Icon */}
      <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />

      {/* Category Name */}
      <Skeleton className="h-5 w-full mb-2" />

      {/* Description */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3 mx-auto" />
      </div>
    </div>
  );
}

// Featured Products Skeleton
export function FeaturedProductsSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-32 mx-auto rounded-full" />
        <Skeleton className="h-10 w-96 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* CTA Section Skeleton */}
      <div className="text-center pt-8">
        <div className="bg-gray-50 rounded-3xl p-8 border">
          <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-6" />
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 mx-auto mb-6" />
          <Skeleton className="h-12 w-40 mx-auto rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Categories Grid Skeleton
export function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Hero Banner Skeleton
export function HeroBannerSkeleton() {
  return (
    <div className="bg-blue-600/5 py-4 sm:py-6 lg:py-8 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Card Skeleton */}
        <div className="relative bg-[#f2ebe1] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] max-h-[400px] sm:max-h-[600px] lg:max-h-[800px] flex flex-col items-center justify-end pb-8 sm:pb-12 animate-pulse shadow-sm border-4 border-white/50">
          <div className="h-10 w-32 bg-white/60 backdrop-blur-sm rounded-lg mx-auto shadow-sm"></div>
        </div>

        {/* Navigation Bar Skeleton */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between px-2 sm:px-6 max-w-4xl mx-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 shadow-sm"></div>
          <div className="hidden sm:flex space-x-3">
            <div className="w-2 h-2 sm:w-10 sm:h-3 rounded-full bg-blue-200"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-200"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-200"></div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}

// Header Skeleton
export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Skeleton */}
          <div className="flex items-center">
            <Skeleton className="w-12 h-12 rounded-xl mr-3" />
            <div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
          </div>

          {/* Navigation Skeleton (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-16" />
            ))}
          </div>

          {/* Right Actions Skeleton */}
          <div className="flex items-center space-x-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-10 h-10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// Products Page Skeleton
export function ProductsPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="flex gap-8">
          {/* Sidebar Skeleton (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <Skeleton className="h-5 w-20 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                  ))}
                </div>
              </div>

              {/* Sort Section */}
              <div>
                <Skeleton className="h-5 w-16 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Results Count */}
            <Skeleton className="h-4 w-32 mb-4" />

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 20 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout Page Skeleton
export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 border-2 border-gray-300"
              >
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 border-2 border-gray-300">
              <Skeleton className="h-6 w-24 mb-4" />

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-3 border-2 space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
