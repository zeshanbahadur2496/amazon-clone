"use client";

import { BarChart2, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/components/providers/cart-store";
import { useCompareStore } from "@/components/providers/compare-store";
import { useWishlistStore } from "@/components/providers/wishlist-store";
import { Button } from "@/components/ui/button";
import { PrimeBadge } from "@/components/ui/prime-badge";
import { Rating } from "@/components/ui/rating";
import { estimateDeliveryDate } from "@/lib/delivery";
import { useDeliveryStore } from "@/components/providers/delivery-store";
import { useMarket } from "@/hooks/use-market";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
  sponsored?: boolean;
};

export function ProductCard({ product, compact = false, sponsored = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const addCompare = useCompareStore((s) => s.add);
  const [adding, setAdding] = useState(false);
  const { market, formatPrice } = useMarket();
  const pincode = useDeliveryStore((s) => s.pincode);

  const savings = product.mrp - product.price;
  const inStock = product.stock > 0;
  const deliveryDate = estimateDeliveryDate(pincode, product.isPrime, market);

  function addToCart() {
    setAdding(true);
    addItem(product, 1);
    toast.success("Added to cart", { description: product.title });
    setTimeout(() => setAdding(false), 400);
  }

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] p-3 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-cardHover dark:hover:border-indigo-500/30 sm:p-4">
      {(sponsored || product.isSponsored) && (
        <p className="mb-1 text-[10px] text-slate-400">Sponsored</p>
      )}

      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded bg-white">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
          className="object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
        />
        {product.discount > 0 && (
          <span className="absolute left-0 top-0 rounded-br-xl bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-0.5 text-[11px] font-bold text-white">
            -{product.discount}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className={cn(
            "absolute right-0 top-0 rounded-bl bg-white/90 p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100 dark:bg-slate-900/90",
            isWishlisted && "text-red-500 opacity-100"
          )}
          aria-label="Wishlist"
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>
      </Link>

      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">{product.brand}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-0.5 line-clamp-2 min-h-[2.5em] text-sm leading-snug text-[color:var(--store-text)] hover:text-indigo-600 hover:underline dark:hover:text-indigo-300"
        >
          {product.title}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} className="mt-1 text-xs" />

        <div className="mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{formatPrice(product.price)}</span>
            {savings > 0 && <span className="text-xs text-slate-500 line-through">{formatPrice(product.mrp)}</span>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {product.isPrime && <PrimeBadge />}
            {product.isFlashDeal && <span className="text-[11px] font-bold text-rose-500">⚡ Deal</span>}
          </div>
          <p className={cn("mt-1 text-xs", inStock ? "text-[color:var(--store-text-muted)]" : "text-rose-500")}>
            {inStock ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400">FREE delivery</span> {deliveryDate}
              </>
            ) : (
              "Currently unavailable"
            )}
          </p>
        </div>

        {!compact && (
          <div className="mt-2 flex items-center gap-1.5 pt-1">
            <Button
              onClick={addToCart}
              className="h-9 flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-2 text-xs font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-cyan-600"
              disabled={!inStock || adding}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </Button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const ok = addCompare(product);
                toast[ok ? "success" : "error"](ok ? "Added to compare" : "Compare list full (max 4)");
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--store-border)] text-[color:var(--store-text-muted)] hover:border-indigo-300 hover:text-indigo-600"
              aria-label="Compare"
              title="Compare"
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
