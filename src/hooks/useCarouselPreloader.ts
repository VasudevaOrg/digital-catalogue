// src/hooks/useCarouselPreloader.ts
"use client";

import { useEffect } from "react";
import { carouselService } from "@/lib/carouselService";

/**
 * Hook to preload carousel data in the background
 * This helps improve performance by loading carousel content early
 */
export function useCarouselPreloader() {
  useEffect(() => {
    // Preload carousel data when the app starts
    const preload = async () => {
      try {
        await carouselService.preloadCarousel();
        console.log("🎠 Carousel preloaded successfully");
      } catch (error) {
        console.warn("⚠️ Carousel preload failed:", error);
      }
    };

    // Delay preload slightly to not block initial render
    const timer = setTimeout(preload, 100);

    return () => clearTimeout(timer);
  }, []);
}

// Optional: Hook for components that need to know carousel loading state
export function useCarouselData() {
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCarousel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const carouselSlides = await carouselService.getCarouselSlides();
        setSlides(carouselSlides);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadCarousel();
  }, []);

  const refreshCarousel = async () => {
    carouselService.clearCache();
    const loadCarousel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const carouselSlides = await carouselService.getCarouselSlides();
        setSlides(carouselSlides);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    await loadCarousel();
  };

  return {
    slides,
    isLoading,
    error,
    refreshCarousel,
  };
}

import { useState } from "react";
import { CarouselSlide } from "@/lib/carouselService";
