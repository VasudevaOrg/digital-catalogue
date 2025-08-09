// src/components/layout/MobileMenu.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import { User, ShoppingBag, Package, LogOut, X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);
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

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    router.push("/");
  };

  const handleLinkClick = (href: string) => {
    onClose();
    router.push(href);
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
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">DC</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Digital Catalogue
                </h2>
                {isAuthenticated && customer && (
                  <p className="text-sm text-gray-600">
                    {customer.name || customer.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 py-4">
            <nav className="space-y-2 px-4">
              {/* Products */}
              <button
                onClick={() => handleLinkClick("/products")}
                className="flex items-center w-full px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Package className="w-5 h-5 mr-3" />
                <span className="font-medium">Products</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  onClose();
                  dispatch(openCart());
                }}
                className="flex items-center justify-between w-full px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  <span className="font-medium">Cart</span>
                </div>
                {cartItemsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Orders (only if authenticated) */}
              {isAuthenticated && (
                <button
                  onClick={() => handleLinkClick("/orders")}
                  className="flex items-center w-full px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5 mr-3" />
                  <span className="font-medium">My Orders</span>
                </button>
              )}

              {/* Profile (only if authenticated) */}
              {isAuthenticated && (
                <button
                  onClick={() => handleLinkClick("/profile")}
                  className="flex items-center w-full px-3 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </button>
              )}
            </nav>

            {/* Divider */}
            <div className="border-t my-4 mx-4" />

            {/* Contact Info */}
            <div className="px-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">📞 +91 98765 43210</p>
                <p className="text-sm text-gray-600">
                  📧 info@digitalcatalogue.com
                </p>
              </div>

              <button
                onClick={() =>
                  window.open("https://wa.me/919876543210", "_blank")
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                WhatsApp Support
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick("/auth/login")}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
