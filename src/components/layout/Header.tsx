// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleMobileMenu, openCart } from "@/store/slices/uiSlice";
import { setSearchQuery } from "@/store/slices/productSlice";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { HeaderSkeleton } from "@/components/ui/SkeletonLoader";
import {
  Menu,
  ShoppingCart,
  Search,
  Phone,
  MapPin,
  Clock,
  Truck,
  Star,
  User,
  Heart,
  Grid3X3,
  X,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);
  const { cart } = useAppSelector((state) => state.cart);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cartItemsCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      dispatch(setSearchQuery(searchValue));
      router.push(`/products?search=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
      setShowSearch(false);
    }
  };

  // Show skeleton loader while loading
  if (isLoading || !isClient) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-3 group-hover:shadow-lg transition-shadow duration-300">
                  <ShoppingCart className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    DIGITAL
                  </span>
                  <div className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    CATALOGUE
                  </div>
                </div>
                {/* Mobile Logo Text */}
                <div className="sm:hidden">
                  <span className="text-base font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    DC
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {[
                { name: "Products", href: "/products" },
                { name: "Categories", href: "/categories" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item, index) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group py-2 flex items-center text-sm xl:text-base"
                  >
                    {item.name === "Categories" && (
                      <Grid3X3 className="w-4 h-4 mr-2" />
                    )}
                    {item.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Track Order Button - Desktop */}
              <Link
                href="/track-order"
                className="hidden md:inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 lg:px-4 py-2 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Search className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Track</span>
                <span className="lg:hidden">Track</span>
              </Link>

              {/* Mobile Track Order Button */}
              <Link
                href="/track-order"
                className="md:hidden w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* Search */}
              <div className="hidden sm:block">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300"
                >
                  <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="sm:hidden w-8 h-8 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist - Hidden on mobile */}
              <button className="hidden sm:flex relative w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg md:rounded-xl items-center justify-center transition-all duration-300">
                <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 h-4 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="relative w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300"
              >
                <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                {isClient && cartItemsCount > 0 && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Account - Hidden on mobile */}
              <button className="hidden md:flex w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-lg md:rounded-xl items-center justify-center transition-all duration-300">
                <User className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="lg:hidden w-8 sm:w-9 h-8 sm:h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Mobile/Desktop Search Bar */}
          {showSearch && (
            <div className="pb-4 border-t border-gray-100 animate-slide-down">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center">
                    <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for products, categories, or brands..."
                    className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowSearch(false)}
                      className="mr-2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => dispatch(toggleMobileMenu())}
      />
    </>
  );
}
