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
  Truck,
  Star,
  Shield,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Products", href: "/" },
    { name: "Categories", href: "/?tab=categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const categories = [
    { name: "Rice & Grains", href: "/?category=Rice%20%26%20Grains" },
    { name: "Oils", href: "/?category=Oils" },
    { name: "Pulses & Lentils", href: "/?category=Pulses%20%26%20Lentils" },
    { name: "Spices & Herbs", href: "/?category=Spices%20%26%20Herbs" },
    { name: "Sugar & Sweeteners", href: "/?category=Sugar%20%26%20Sweeteners" },
    { name: "Dairy Products", href: "/?category=Dairy%20Products" },
  ];

  const features = [
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Free Delivery",
      description: "On orders above ₹1,000",
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Quality Products",
      description: "100% quality guarantee",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "WhatsApp Support",
      description: "24/7 customer support",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Payments",
      description: "Safe & secure transactions",
    },
  ];

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/919876543210?text=Hi! I need help with my order.",
      "_blank"
    );
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Features Section */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">
                  Digital Catalogue
                </h3>
                <p className="text-sm text-gray-500">Quality Products</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted partner for premium quality groceries and daily
              essentials. We bring fresh products directly to your doorstep with
              convenient delivery options.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                4.8/5 (2,500+ reviews)
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-600 hover:text-primary-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-600 hover:text-primary-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-600 hover:text-primary-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
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
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
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
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>123 Main Street</p>
                  <p>Your City, 573103</p>
                  <p>Karnataka, India</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a
                  href="mailto:info@digitalcatalogue.com"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  info@digitalcatalogue.com
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Information Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">₹</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Free Delivery
                </p>
                <p className="text-xs text-gray-600">On orders above ₹1,000</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Local Delivery
                </p>
                <p className="text-xs text-gray-600">Within 573103 area</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  WhatsApp Orders
                </p>
                <p className="text-xs text-gray-600">Quick & convenient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm">
                © {currentYear} Digital Catalogue. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Made with ❤️ for quality products and excellent service
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-xs text-gray-400 hover:text-white transition-colors"
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
