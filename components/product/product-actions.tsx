"use client";

import { Heart, Lock, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { useMarket } from "@/hooks/use-market";
import type { Product } from "@/types";

export function ProductActions({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const { formatPrice } = useMarket();

  function addToCart() {
    addItem(product, quantity);
    toast.success("Added to cart", { description: `${quantity} × ${product.title}` });
  }

  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  return (
    <div className={compact ? "" : "rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-5 shadow-soft"}>
      {!compact && (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{formatPrice(product.price)}</span>
          </div>
          {product.discount > 0 && <p className="mt-0.5 text-sm text-rose-500">({product.discount}% off)</p>}

          <p className={`mt-3 text-sm font-semibold ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>
        </>
      )}

      {product.stock > 0 && (
        <label className="mt-3 block">
          <span className="text-sm text-[color:var(--store-text-muted)]">Quantity:</span>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="ml-2 h-8 rounded-lg border border-[color:var(--store-border)] bg-[color:var(--store-surface-muted)] px-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          >
            {Array.from({ length: maxQuantity }).map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={addToCart}
          disabled={product.stock <= 0}
          className="store-btn-primary flex h-11 items-center justify-center gap-2 rounded-xl disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
          }}
          className="store-btn-secondary flex h-11 items-center justify-center gap-2 rounded-xl"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
          {isWishlisted ? "In wishlist" : "Add to Wish List"}
        </button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-[color:var(--store-text-muted)]">
        <Lock className="h-3.5 w-3.5" />
        Secure transaction
      </p>
    </div>
  );
}
