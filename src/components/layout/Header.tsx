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
import { Menu, X, ShoppingCart, Package } from "lucide-react";

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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 border-2 border-blue-700 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Digital Catalogue
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600 font-medium border-b-2 border-transparent hover:border-blue-600 pb-1"
              >
                Products
              </Link>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-800 hover:text-blue-600 border-2 border-gray-400 hover:border-blue-600 bg-white hover:bg-blue-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center font-semibold border border-red-600">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* WhatsApp Contact */}
              <button
                onClick={() =>
                  window.open("https://wa.me/919876543210", "_blank")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium border-2 border-green-700"
              >
                WhatsApp Order
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 text-gray-800 hover:text-blue-600 border-2 border-gray-400 hover:border-blue-600 bg-white"
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
