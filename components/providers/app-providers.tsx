"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { CartWishlistSync } from "@/components/providers/cart-wishlist-sync";
import { MarketInit } from "@/components/providers/market-init";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <MarketInit />
        <CartWishlistSync />
        {children}
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
