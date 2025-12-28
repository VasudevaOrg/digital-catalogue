// src/components/layout/HeroBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analyzeImageSource } from "@/lib/imageUtils";
import {
  ShoppingBag,
  Truck,
  Phone,
  Star,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { carouselService, CarouselSlide } from "@/lib/carouselService";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load carousel slides
  useEffect(() => {
    const loadSlides = async () => {
      if (!isClient) return;

      try {
        setIsLoading(true);
        const carouselSlides = await carouselService.getCarouselSlides();
        setSlides(carouselSlides);
        console.log("🎠 Carousel loaded:", carouselSlides.length, "slides");
      } catch (error) {
        console.error("Failed to load carousel slides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, [isClient]);

  useEffect(() => {
    if (!isAutoPlaying || !isClient || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isClient, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  // Show loading state
  if (!isClient || isLoading || slides.length === 0) {
    return (
      <section className="bg-blue-50 py-4 sm:py-6 lg:py-8 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carousel Card Skeleton */}
          <div className="relative bg-[#f2ebe1] rounded-[2.5rem] overflow-hidden shadow-sm aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] flex items-center justify-center animate-pulse">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="h-8 sm:h-10 w-48 sm:w-64 bg-black/5 rounded-full mx-auto"></div>
              <div className="h-10 sm:h-16 w-full max-w-xl bg-black/5 rounded-xl mx-auto"></div>
              <div className="h-12 w-40 bg-blue-100 rounded-xl mx-auto"></div>
            </div>
          </div>

          {/* Navigation Bar Skeleton */}
          <div className="mt-6 sm:mt-8 flex items-center justify-between px-2 sm:px-6 max-w-4xl mx-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100"></div>
            <div className="flex space-x-1.5 sm:space-x-3">
              <div className="w-2 h-2 sm:w-10 sm:h-3 rounded-full bg-blue-200"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-200"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-200"></div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="bg-blue-600/5 py-4 sm:py-6 lg:py-8 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Card Container */}
        <Link
          href={currentSlideData.primaryLink}
          className="relative block rounded-[1rem] sm:rounded-[1rem] overflow-hidden shadow-2xl aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] max-h-[400px] sm:max-h-[600px] lg:max-h-[800px] cursor-pointer group"
        >
          {/* Background Image or Gradient */}
          {currentSlideData.image ? (
            <div className="absolute inset-0">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log(
                    "✅ Carousel image loaded successfully:",
                    currentSlideData.image
                  );
                }}
                onError={(e) => {
                  console.warn(
                    "❌ Failed to load carousel image:",
                    currentSlideData.image
                  );
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    target.parentElement.style.display = "none";
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient} transition-all duration-1000`}
            ></div>
          )}
        </Link>

        {/* Navigation Bar Below Card */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between px-2 sm:px-6 max-w-4xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicators - Mobile: Dots, Desktop: Bars */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all duration-300 relative group"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Mobile version - active is pill, inactive is dot */}
                <div
                  className={`sm:hidden rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 h-2 bg-blue-600 shadow-sm"
                      : "w-1.5 h-1.5 bg-blue-200 hover:bg-blue-300"
                  }`}
                />

                {/* Desktop version - existing bar style */}
                <div
                  className={`hidden sm:block transition-all duration-300 ${
                    index === currentSlide
                      ? "w-12 h-3 bg-blue-600 rounded-full shadow-md"
                      : "w-3 h-3 bg-blue-200 hover:bg-blue-300 rounded-full"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
