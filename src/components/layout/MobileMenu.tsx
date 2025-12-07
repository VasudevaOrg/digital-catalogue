// src/components/layout/MobileMenu.tsx (Updated)
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeMobileMenu, openCart } from "@/store/slices/uiSlice";
import {
  ShoppingBag,
  Package,
  X,
  MessageCircle,
  Phone,
  Search,
  Grid3X3,
  Info,
  User,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  const cartItemsCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleCartClick = () => {
    onClose();
    dispatch(openCart());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base sm:text-lg">
                  Digital Catalogue
                </h2>
                <p className="text-xs text-blue-100">Quality Products</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="touch-target p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4 sm:py-6">
            <nav className="space-y-1 px-3 sm:px-4">
              {/* Home */}
              <button
                onClick={() => handleLinkClick("/")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
              >
                <Package className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">Home</span>
              </button>

              {/* Products */}
              <button
                onClick={() => handleLinkClick("/products")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
              >
                <ShoppingBag className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">
                  Products
                </span>
              </button>

              {/* Categories */}
              <button
                onClick={() => handleLinkClick("/categories")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
              >
                <Grid3X3 className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">
                  Categories
                </span>
              </button>

              {/* About */}
              <button
                onClick={() => handleLinkClick("/about")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
              >
                <Info className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">
                  About
                </span>
              </button>

              {/* Contact */}
              <button
                onClick={() => handleLinkClick("/contact")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
              >
                <Phone className="w-5 h-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">
                  Contact
                </span>
              </button>

              {/* Track Order */}
              <button
                onClick={() => handleLinkClick("/track-order")}
                className="touch-target flex items-center w-full px-4 py-3.5 text-left text-gray-900 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 group"
              >
                <Search className="w-5 h-5 mr-3 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm sm:text-base">
                  Track Order
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="touch-target flex items-center justify-between w-full px-4 py-3.5 text-left text-gray-900 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-3 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm sm:text-base">
                    Cart
                  </span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center font-bold rounded-full shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4 sm:my-6 mx-3 sm:mx-4" />

            {/* Contact Info */}
            <div className="px-3 sm:px-4 space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">
                  Contact Us
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 mr-2.5 text-blue-600 flex-shrink-0" />
                    <a
                      href="tel:+918297137702"
                      className="hover:text-blue-600 transition-colors"
                    >
                      +91 82971 37702
                    </a>
                  </div>
                  <p className="text-sm text-gray-700 flex items-center">
                    <span className="mr-2.5">📧</span>
                    <a
                      href="mailto:info@digitalcatalogue.com"
                      className="hover:text-blue-600 transition-colors break-all"
                    >
                      info@digitalcatalogue.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2.5 mt-0.5">📍</span>
                    <span>SHOP No. 11, APMC Yard, 573103</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  window.open("https://wa.me/918297137702", "_blank")
                }
                className="touch-target w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-3.5 px-4 font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Support</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Free delivery on orders ₹1000+
              </p>
              <p className="text-xs text-gray-600">Within 573103 area only</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
