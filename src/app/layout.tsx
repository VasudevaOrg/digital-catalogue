// src/app/layout.tsx
"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotificationContainer } from "@/components/ui/NotificationContainer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Digital Catalogue - Premium Quality Products</title>
        <meta
          name="description"
          content="Premium quality groceries and daily essentials delivered to your doorstep. Free delivery on orders above ₹1,000."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <LoadingProvider>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

              {/* Global Components */}
              <CartSidebar />
              <NotificationContainer />
              <WhatsAppButton />
            </LoadingProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
