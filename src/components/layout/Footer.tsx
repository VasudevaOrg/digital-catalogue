// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              MRV Stores
            </h3>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              Your trusted partner for quality groceries and daily essentials.
            </p>
            <button
              onClick={() =>
                window.open("https://wa.me/919448132930", "_blank")
              }
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg touch-target"
            >
              <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              WhatsApp Us
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919448132930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919448132930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Delivery Info
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Categories
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link
                  href="/products?category=rice-grains"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Rice & Grains
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=oils"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=spices-herbs"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Spices & Herbs
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dairy"
                  className="text-gray-700 hover:text-blue-600 text-sm sm:text-base transition-colors duration-200 inline-block py-1 touch-target-sm"
                >
                  Dairy Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm sm:text-base text-gray-700">
              <div className="flex items-start">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                <div>
                  SHOP No. 11, APMC Yard
                  <br />
                  ARSIKERE, 573103
                  <br />
                  Karnataka, India
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0 text-blue-600" />
                <a
                  href="https://wa.me/919448132930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors duration-200 touch-target-sm"
                >
                  +91 94481 32930
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0 text-blue-600" />
                <a
                  href="mailto:mrvstoresvps@gmail.com"
                  className="hover:text-blue-600 transition-colors duration-200 touch-target-sm break-all"
                >
                  mrvstoresvps@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-200 py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm sm:text-base text-gray-700 gap-3 sm:gap-4">
            <p className="text-center md:text-left">
              © {currentYear} MRV Stores. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                href="/terms"
                className="hover:text-blue-600 transition-colors duration-200 touch-target-sm"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-blue-600 transition-colors duration-200 touch-target-sm"
              >
                Privacy
              </Link>
              <Link
                href="/refund"
                className="hover:text-blue-600 transition-colors duration-200 touch-target-sm"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
