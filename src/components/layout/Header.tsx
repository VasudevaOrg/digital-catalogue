// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleMobileMenu, openCart } from "@/store/slices/uiSlice";
import { setSearchQuery } from "@/store/slices/productSlice";
import { SearchBar } from "@/components/ui/SearchBar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Menu, X, ShoppingCart, Package, MessageCircle } from "lucide-react";

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);
  const { cart } = useAppSelector((state) => state.cart);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (query: string) => {
    setSearchValue(query);
    dispatch(setSearchQuery(query));
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const cartItemsCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <div className="w-10 h-10 bg-blue-600 border-2 border-blue-700 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Digital Catalogue
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-3 text-gray-800 hover:text-blue-600 border-2 border-gray-400 hover:border-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center font-semibold border-2 border-white rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* WhatsApp Contact */}
              <button
                onClick={() =>
                  window.open("https://wa.me/918297137702", "_blank")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium border-2 border-green-700 flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 text-gray-800 hover:text-blue-600 border-2 border-gray-400 hover:border-blue-600 bg-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => dispatch(toggleMobileMenu())}
      />
    </>
  );
}
