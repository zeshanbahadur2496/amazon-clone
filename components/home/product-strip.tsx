"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { Product } from "@/types";

type ProductStripProps = {
  title: string;
  products: Product[];
  href?: string;
};

export function ProductStrip({ title, products, href = "/search" }: ProductStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: number) {
    scrollerRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  }

  return (
    <section className="relative bg-white dark:bg-slate-900">
      <div className="flex items-baseline justify-between px-5 pt-5">
        <Link href={href} className="text-[21px] font-bold text-[#0f1111] hover:text-amazon-orange dark:text-white">
          {title}
        </Link>
      </div>

      <div className="relative px-3 pb-5 pt-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden h-16 w-11 -translate-y-1/2 items-center justify-center rounded bg-white/95 shadow-md hover:bg-white lg:flex dark:bg-slate-800/95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-7 w-7 text-[#0f1111] dark:text-white" />
        </button>

        <div ref={scrollerRef} className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group w-[200px] shrink-0 px-2 sm:w-[220px]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7fafa]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="220px"
                  className="object-contain p-3 transition group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden h-16 w-11 -translate-y-1/2 items-center justify-center rounded bg-white/95 shadow-md hover:bg-white lg:flex dark:bg-slate-800/95"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-7 w-7 text-[#0f1111] dark:text-white" />
        </button>
      </div>
    </section>
  );
}
