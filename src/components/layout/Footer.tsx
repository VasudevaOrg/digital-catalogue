// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Package,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Products", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Delivery Info", href: "/delivery" },
  ];

  const categories = [
    { name: "Rice & Grains", href: "/?category=Rice%20%26%20Grains" },
    { name: "Oils", href: "/?category=Oils" },
    { name: "Pulses & Lentils", href: "/?category=Pulses%20%26%20Lentils" },
    { name: "Spices & Herbs", href: "/?category=Spices%20%26%20Herbs" },
    { name: "Sugar & Sweeteners", href: "/?category=Sugar%20%26%20Sweeteners" },
    { name: "Dairy Products", href: "/?category=Dairy%20Products" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Digital Catalogue</h3>
                <p className="text-gray-500 text-sm">Quality Products</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted partner for premium quality groceries and daily
              essentials. We bring fresh products directly to your doorstep with
              convenient delivery options.
            </p>

            {/* WhatsApp Button */}
            <button
              onClick={() =>
                window.open("https://wa.me/919876543210", "_blank")
              }
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium border border-green-600"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Categories
            </h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-600 hover:text-blue-600 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>123 Main Street</p>
                  <p>Your City, 573103</p>
                  <p>Karnataka, India</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a
                  href="mailto:info@digitalcatalogue.com"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  info@digitalcatalogue.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information Banner */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">₹</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Free Delivery
                </p>
                <p className="text-xs text-gray-600">On orders above ₹1,000</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Local Delivery
                </p>
                <p className="text-xs text-gray-600">Within 573103 area</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-8 h-8 bg-green-600 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  WhatsApp Orders
                </p>
                <p className="text-xs text-gray-600">Quick & convenient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © {currentYear} Digital Catalogue. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/terms"
                className="text-xs text-gray-600 hover:text-blue-600"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-600 hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-xs text-gray-600 hover:text-blue-600"
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
