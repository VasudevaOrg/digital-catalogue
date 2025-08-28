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
import { useCarouselPreloader } from "@/hooks/useCarouselPreloader";

const inter = Inter({ subsets: ["latin"] });

// Carousel preloader component
function CarouselPreloader() {
  useCarouselPreloader();
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthProvider>
            <LoadingProvider>
              {/* Preload carousel data */}
              <CarouselPreloader />

              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

              {/* Global Components */}
              <CartSidebar />
              <NotificationContainer />
            </LoadingProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
