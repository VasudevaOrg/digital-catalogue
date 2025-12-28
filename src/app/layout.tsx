// src/app/layout.tsx
import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotificationContainer } from "@/components/ui/NotificationContainer";
import { CartSidebar } from "@/components/cart/CartSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MRV Store",
  description: "Quality Products at MRV Stores",
  icons: {
    icon: "/mainLogo.png",
    apple: "/mainLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/mainLogo.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          {/* Global Components */}
          <CartSidebar />
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  );
}
