// src/components/layout/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Truck,
  Phone,
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Premium Quality Products",
    subtitle: "Fresh groceries delivered to your doorstep",
    description:
      "Discover our wide range of premium quality products including rice, oils, spices, and more.",
    image: "/images/hero/hero-1.jpg",
    cta: "Shop Now",
    ctaLink: "/products",
  },
  {
    id: 2,
    title: "Free Delivery Available",
    subtitle: "On orders above ₹1,000",
    description:
      "Get free home delivery on eligible products when you order above ₹1,000.",
    image: "/images/hero/hero-2.jpg",
    cta: "Learn More",
    ctaLink: "/products",
  },
  {
    id: 3,
    title: "WhatsApp Ordering",
    subtitle: "Order via WhatsApp for convenience",
    description:
      "Browse our digital catalogue and place orders directly through WhatsApp.",
    image: "/images/hero/hero-3.jpg",
    cta: "Contact Us",
    ctaLink: "https://wa.me/919448132930",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Slide Content */}
            <div className="text-white space-y-6 animate-fadeInUp">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-primary-200 uppercase tracking-wide">
                  {currentSlideData.subtitle}
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
              </div>

              <p className="text-lg md:text-xl text-primary-100 leading-relaxed max-w-lg">
                {currentSlideData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {currentSlideData.ctaLink.startsWith("http") ? (
                  <a
                    href={currentSlideData.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {currentSlideData.cta}
                  </a>
                ) : (
                  <Link
                    href={currentSlideData.ctaLink}
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {currentSlideData.cta}
                  </Link>
                )}

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Features Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center text-gray-700">
              <Truck className="w-5 h-5 mr-2 text-primary-600" />
              <span className="font-medium">Free Delivery on ₹1000+</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-2 text-primary-600" />
              <span className="font-medium">WhatsApp Ordering</span>
            </div>
            <div className="flex items-center text-gray-700">
              <ShoppingBag className="w-5 h-5 mr-2 text-primary-600" />
              <span className="font-medium">Quality Products</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
