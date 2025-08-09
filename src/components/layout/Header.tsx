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
import {
  Menu,
  X,
  ShoppingCart,
  Package,
  MessageCircle,
  Phone,
} from "lucide-react";

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

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/919876543210?text=Hi! I'm interested in your products.",
      "_blank"
    );
  };

  const cartItemsCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <header className="sticky-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold gradient-text">
                  Digital Catalogue
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  Quality Products
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSearch={handleSearch}
                placeholder="Search products..."
                className="w-full"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 group"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-semibold animate-bounce-subtle">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </button>

              {/* WhatsApp Contact */}
              <button
                onClick={handleWhatsAppClick}
                className="btn-whatsapp flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </button>

              {/* Phone Contact */}
              <a
                href="tel:+919876543210"
                className="p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                title="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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

        {/* Cart Summary - Mobile */}
        {cartItemsCount > 0 && (
          <div className="md:hidden bg-primary-50 border-t border-primary-100">
            <div className="container mx-auto px-4 py-2">
              <button
                onClick={handleCartClick}
                className="w-full flex items-center justify-between text-primary-700 font-medium"
              >
                <span>{cartItemsCount} items in cart</span>
                <span>₹{cart.totalAmount.toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => dispatch(toggleMobileMenu())}
      />
    </>
  );
}
