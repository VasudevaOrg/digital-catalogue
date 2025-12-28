"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { LoadingProvider } from "./LoadingProvider";
import { AuthProvider } from "./AuthProvider";
import { useCarouselPreloader } from "@/hooks/useCarouselPreloader";

function CarouselPreloader() {
  useCarouselPreloader();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LoadingProvider>
          <CarouselPreloader />
          {children}
        </LoadingProvider>
      </AuthProvider>
    </Provider>
  );
}
