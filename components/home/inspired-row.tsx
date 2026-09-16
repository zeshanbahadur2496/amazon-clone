"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { MarketPrice } from "@/components/ui/market-price";
import { Rating } from "@/components/ui/rating";
import type { Product } from "@/types";

export function InspiredRow({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  return (
    <section className="bg-white dark:bg-slate-900">
      <div className="px-5 pt-5">
        <h2 className="text-[21px] font-bold text-[#0f1111] dark:text-white">Inspired by your browsing history</h2>
      </div>

      <div className="relative px-3 pb-5 pt-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden h-16 w-11 -translate-y-1/2 items-center justify-center rounded bg-white/95 shadow-md hover:bg-white lg:flex dark:bg-slate-800/95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div ref={scrollerRef} className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="w-[180px] shrink-0 px-2 sm:w-[200px]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7fafa]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-amazon-teal hover:text-amazon-orange hover:underline">
                {product.title}
              </p>
              <Rating value={product.rating} count={product.reviewCount} className="mt-1 scale-90 origin-left" />
              <MarketPrice value={product.price} className="mt-1 block text-[15px] font-bold text-[#0f1111] dark:text-white" />
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden h-16 w-11 -translate-y-1/2 items-center justify-center rounded bg-white/95 shadow-md hover:bg-white lg:flex dark:bg-slate-800/95"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}
