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
    // Simulate loading time for demonstration
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
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          {/* You can add promotional banner here if needed */}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:shadow-lg transition-shadow duration-300">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    DIGITAL
                  </span>
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    CATALOGUE
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Products", href: "/products" },
                { name: "Categories", href: "/categories" }, // Updated to point to categories page
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item, index) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group py-2 flex items-center"
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
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-10 h-10 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Wishlist */}
              <button className="relative w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl flex items-center justify-center transition-all duration-300">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="relative w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                {isClient && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <button className="hidden md:flex w-10 h-10 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-xl items-center justify-center transition-all duration-300">
                <User className="w-5 h-5" />
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="pb-4 border-t border-gray-100 animate-slide-down">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for products, categories, or brands..."
                    className="w-full pl-12 pr-16 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-300 text-gray-800 placeholder-gray-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                      Search
                    </div>
                  </button>
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
