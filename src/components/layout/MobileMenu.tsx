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
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden border-r-2 border-gray-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-300 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 border-2 border-blue-700 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Digital Catalogue
                </h2>
                <p className="text-sm text-gray-600">Quality Products</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 border-2 border-gray-400"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4">
            <nav className="space-y-2 px-4">
              {/* Home */}
              <button
                onClick={() => handleLinkClick("/")}
                className="flex items-center w-full px-3 py-3 text-left text-gray-800 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-lg"
              >
                <Package className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium">Home</span>
              </button>

              {/* Products */}
              <button
                onClick={() => handleLinkClick("/products")}
                className="flex items-center w-full px-3 py-3 text-left text-gray-800 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium">Products</span>
              </button>

              {/* Categories */}
              <button
                onClick={() => handleLinkClick("/categories")}
                className="flex items-center w-full px-3 py-3 text-left text-gray-800 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-lg"
              >
                <Grid3X3 className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium">Categories</span>
              </button>

              {/* Track Order */}
              <button
                onClick={() => handleLinkClick("/track-order")}
                className="flex items-center w-full px-3 py-3 text-left text-gray-800 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-lg"
              >
                <Search className="w-5 h-5 mr-3 text-orange-600" />
                <span className="font-medium">Track Order</span>
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="flex items-center justify-between w-full px-3 py-3 text-left text-gray-800 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-lg"
              >
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-medium">Cart</span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center font-semibold border border-red-600 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Divider */}
            <div className="border-t-2 border-gray-300 my-4 mx-4" />

            {/* Contact Info */}
            <div className="px-4 space-y-3">
              <div className="bg-gray-50 p-3 border-2 border-gray-300 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    <span>+91 82971 37702</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    📧 info@digitalcatalogue.com
                  </p>
                  <p className="text-sm text-gray-700">
                    📍 123 Main Street, 573103
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  window.open("https://wa.me/918297137702", "_blank")
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 font-medium border-2 border-green-600 rounded-lg flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 p-4 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Free delivery on orders ₹1000+
              </p>
              <p className="text-xs text-gray-500">Within 573103 area only</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
