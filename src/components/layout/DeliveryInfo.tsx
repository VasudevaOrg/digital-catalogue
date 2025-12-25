// src/components/layout/DeliveryInfo.tsx
"use client";

import { Truck, MapPin, Clock, Shield, Phone, Star } from "lucide-react";

export function DeliveryInfo() {
  const deliveryFeatures = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Delivery",
      description: "On orders above ₹1,000",
      details: "Excludes sugar, oils, and jaggery items",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Delivery Zone",
      description: "Within 573103 radius",
      details: "Check if we deliver to your area",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Delivery",
      description: "Same day or next day",
      details: "Order before 2 PM for same day",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Assured",
      description: "Premium products only",
      details: "100% quality guarantee",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const orderOptions = [
    {
      title: "Home Delivery",
      description: "Get products delivered to your doorstep",
      features: [
        "Free delivery on ₹1000+",
        "Track your order",
        "Flexible timing",
      ],
      popular: true,
    },
    {
      title: "Store Pickup",
      description: "Pick up your order from our store",
      features: [
        "No delivery charges",
        "Instant pickup",
        "Cash payment available",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Delivery Information
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enjoy convenient delivery options and quality service with every
            order
          </p>
        </div>

        {/* Delivery Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {deliveryFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 font-medium mb-1">
                {feature.description}
              </p>
              <p className="text-sm text-gray-500">{feature.details}</p>
            </div>
          ))}
        </div>

        {/* Order Options */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Choose Your Preferred Option
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {orderOptions.map((option, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border-2 ${
                  option.popular
                    ? "border-primary-200 ring-2 ring-primary-100"
                    : "border-gray-100 hover:border-primary-200"
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h4>
                  <p className="text-gray-600">{option.description}</p>
                </div>

                <ul className="space-y-3">
                  {option.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-700"
                    >
                      <Star className="w-4 h-4 text-primary-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Important Delivery Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
            <div>
              <h4 className="font-medium mb-2">Free Delivery Conditions:</h4>
              <ul className="space-y-1 text-amber-600">
                <li>• Minimum order value: ₹1,000</li>
                <li>• Excludes: sugar, oils, jaggery items</li>
                <li>• Within delivery radius only</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Walk-in Customers:</h4>
              <ul className="space-y-1 text-amber-600">
                <li>• No minimum order value</li>
                <li>• Direct store purchases</li>
                <li>• Cash payments accepted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Need Help with Your Order?
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Our customer support team is ready to assist you with any questions
            about delivery, products, or orders. Contact us via WhatsApp for
            instant support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                window.open("https://wa.me/919448132930", "_blank")
              }
              className="inline-flex items-center justify-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp Support
            </button>

            <div className="text-primary-100">
              <p className="text-sm">Call us: +91 94481 32930</p>
              <p className="text-sm">Email: mrvstoresvps@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
