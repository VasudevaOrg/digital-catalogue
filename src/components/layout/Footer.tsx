// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Digital Catalogue
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted partner for quality groceries and daily essentials.
            </p>
            <button
              onClick={() =>
                window.open("https://wa.me/919876543210", "_blank")
              }
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Delivery Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=rice-grains"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Rice & Grains
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=oils"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Oils
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=spices-herbs"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Spices & Herbs
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dairy"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Dairy Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  123 Main Street
                  <br />
                  Your City, 573103
                  <br />
                  Karnataka, India
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-gray-800">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@digitalcatalogue.com"
                  className="hover:text-gray-800"
                >
                  info@digitalcatalogue.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© {currentYear} Digital Catalogue. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link href="/terms" className="hover:text-gray-800">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-gray-800">
                Privacy
              </Link>
              <Link href="/refund" className="hover:text-gray-800">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
