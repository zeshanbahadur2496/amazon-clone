"use client";

import { Filter, Star, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { SearchParams } from "@/types";

const ratingOptions = [4.5, 4, 3, 2, 1];

function FilterPanel({ params, onNavigate }: { params: SearchParams; onNavigate?: () => void }) {
  const activeCategory = params.category && params.category !== "All" ? params.category : null;
  const activeRating = params.rating ? Number(params.rating) : null;
  const activePrime = params.prime === "true";

  function withParams(overrides: Partial<Record<keyof SearchParams, string | undefined>>) {
    const next = new URLSearchParams();
    const merged = { ...params, ...overrides };
    Object.entries(merged).forEach(([key, value]) => {
      if (value && key !== "page") next.set(key, String(value));
    });
    const query = next.toString();
    return `/search${query ? `?${query}` : ""}`;
  }

  const hasFilters = Boolean(
    activeCategory || activeRating || activePrime || params.deal || params.minPrice || params.maxPrice || params.brand
  );

  return (
    <div className="rounded border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">Filters</h2>
        {hasFilters && (
          <Link
            href="/search"
            onClick={onNavigate}
            className="flex items-center gap-1 text-xs font-bold text-amazon-teal hover:underline"
          >
            <X className="h-3 w-3" />
            Clear
          </Link>
        )}
      </div>

      <div className="border-t border-slate-100 py-3 dark:border-white/10">
        <h3 className="mb-2 text-sm font-bold">Prime</h3>
        <Link
          href={withParams({ prime: activePrime ? undefined : "true" })}
          onClick={onNavigate}
          className={cn(
            "block text-sm hover:text-amazon-orange hover:underline",
            activePrime && "font-bold text-amazon-orange"
          )}
        >
          Prime eligible
        </Link>
      </div>

      <div className="border-t border-slate-100 py-3 dark:border-white/10">
        <h3 className="mb-2 text-sm font-bold">Price (INR)</h3>
        <form action="/search" className="flex gap-2">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          {params.rating && <input type="hidden" name="rating" value={params.rating} />}
          {params.prime && <input type="hidden" name="prime" value={params.prime} />}
          {params.deal && <input type="hidden" name="deal" value={params.deal} />}
          <input
            name="minPrice"
            type="number"
            placeholder="Min"
            defaultValue={params.minPrice ?? ""}
            className="h-9 w-full rounded border px-2 text-sm dark:border-white/10 dark:bg-slate-950"
          />
          <input
            name="maxPrice"
            type="number"
            placeholder="Max"
            defaultValue={params.maxPrice ?? ""}
            className="h-9 w-full rounded border px-2 text-sm dark:border-white/10 dark:bg-slate-950"
          />
          <button type="submit" className="rounded bg-slate-100 px-3 text-xs font-bold dark:bg-white/10">
            Go
          </button>
        </form>
      </div>

      <div className="border-t border-slate-100 py-3 dark:border-white/10">
        <h3 className="mb-2 text-sm font-bold">Brand</h3>
        <form action="/search" className="flex gap-2">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          <input
            name="brand"
            placeholder="Brand name"
            defaultValue={params.brand ?? ""}
            className="h-9 w-full rounded border px-2 text-sm dark:border-white/10 dark:bg-slate-950"
          />
          <button type="submit" className="rounded bg-slate-100 px-3 text-xs font-bold dark:bg-white/10">
            Go
          </button>
        </form>
      </div>

      <div className="border-t border-slate-100 py-3 dark:border-white/10">
        <h3 className="mb-2 text-sm font-bold">Category</h3>
        <ul className="max-h-48 space-y-1.5 overflow-y-auto text-sm">
          <li>
            <Link
              href={withParams({ category: undefined })}
              onClick={onNavigate}
              className={cn("block hover:text-amazon-orange hover:underline", !activeCategory && "font-bold")}
            >
              All categories
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={withParams({ category })}
                onClick={onNavigate}
                className={cn(
                  "block hover:text-amazon-orange hover:underline",
                  activeCategory === category && "font-bold text-amazon-orange"
                )}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-100 py-3 dark:border-white/10">
        <h3 className="mb-2 text-sm font-bold">Customer Review</h3>
        <ul className="space-y-1.5">
          {ratingOptions.map((rating) => (
            <li key={rating}>
              <Link
                href={withParams({ rating: activeRating === rating ? undefined : String(rating) })}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-1.5 rounded px-1 py-0.5 text-sm hover:bg-amber-50 dark:hover:bg-white/5",
                  activeRating === rating && "bg-amber-50 dark:bg-white/10"
                )}
              >
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "h-3.5 w-3.5",
                        index + 1 <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                      )}
                    />
                  ))}
                </span>
                <span>& Up</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SearchSidebar({ params }: { params: SearchParams }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-3 flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-bold lg:hidden dark:border-white/10 dark:bg-slate-900"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      <aside className="hidden w-full shrink-0 lg:block lg:w-56">
        <FilterPanel params={params} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-label="Close filters" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-white p-4 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel params={params} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
