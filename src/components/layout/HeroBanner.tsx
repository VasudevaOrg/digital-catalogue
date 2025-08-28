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
        // Fallback is handled in the service
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Loading Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-8 animate-pulse">
                <div className="inline-block h-12 w-64 bg-white/20 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-16 w-full max-w-2xl mx-auto bg-white/20 rounded"></div>
                  <div className="h-16 w-3/4 mx-auto bg-white/20 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-full max-w-3xl mx-auto bg-white/20 rounded"></div>
                  <div className="h-6 w-2/3 mx-auto bg-white/20 rounded"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="h-14 w-48 bg-white/20 rounded-2xl"></div>
                  <div className="h-14 w-48 bg-white/20 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image or Gradient */}
      {currentSlideData.image ? (
        <div className="absolute inset-0">
          {/* Use regular img tag for blob storage to avoid Next.js hostname issues */}
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover absolute inset-0"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
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
              // Hide the image container if it fails to load
              const target = e.target as HTMLImageElement;
              if (target.parentElement) {
                target.parentElement.style.display = "none";
              }
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient} transition-all duration-1000`}
        >
          {/* Corrosion/Erosion Effect Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                background: `
                radial-gradient(ellipse 100% 60% at 50% 120%, transparent 40%, rgba(255,255,255,0.1) 70%),
                radial-gradient(ellipse 100% 80% at 80% 100%, rgba(255,255,255,0.05) 40%, transparent 70%),
                radial-gradient(ellipse 120% 60% at 20% 120%, rgba(255,255,255,0.05) 40%, transparent 70%)
              `,
              }}
            ></div>
          </div>

          {/* Animated Particles - Only render on client */}
          {isClient && (
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
                  style={{
                    left: `${(i * 7) % 100}%`,
                    top: `${(i * 11) % 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + (i % 3)}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm font-semibold border border-white/30">
                <Sparkles className="w-4 h-4 mr-2" />
                {currentSlideData.subtitle}
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                <span className="block">
                  {currentSlideData.title.split(" ").slice(0, -1).join(" ")}
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  {currentSlideData.title.split(" ").slice(-1)}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                {currentSlideData.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {currentSlideData.primaryLink.startsWith("http") ? (
                  <a
                    href={currentSlideData.primaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center min-w-[200px] justify-center"
                  >
                    <Phone className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    {currentSlideData.primaryCTA}
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                ) : (
                  <Link
                    href={currentSlideData.primaryLink}
                    className="group bg-white text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center min-w-[200px] justify-center"
                  >
                    <ShoppingBag className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    {currentSlideData.primaryCTA}
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )}

                <Link
                  href={currentSlideData.secondaryLink}
                  className="group bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center min-w-[200px] justify-center"
                >
                  <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {currentSlideData.secondaryCTA}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Only show on client */}
      {isClient && slides.length > 1 && (
        <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none z-20">
          <button
            onClick={goToPrevious}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-lg border border-white/20 pointer-events-auto group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>

          <button
            onClick={goToNext}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-lg border border-white/20 pointer-events-auto group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 h-3 bg-white rounded-full"
                  : "w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Floating Elements - Only show on client */}
      {isClient && (
        <>
          <div className="absolute top-1/4 left-8 w-20 h-20 bg-white/10 rounded-full backdrop-blur-lg border border-white/20 hidden lg:flex items-center justify-center">
            <Truck className="w-8 h-8 text-white" />
          </div>

          <div className="absolute top-1/3 right-8 w-16 h-16 bg-white/10 rounded-full backdrop-blur-lg border border-white/20 hidden lg:flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
        </>
      )}

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-24 fill-current text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}
