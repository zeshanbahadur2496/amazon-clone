"use client";

import { ChevronDown, Globe, MapPin } from "lucide-react";
import { useState } from "react";

import { useLocaleStore } from "@/components/providers/locale-store";
import { MARKET_CODES, MARKETS, type MarketCode } from "@/lib/markets";

export function MarketSelector({ compact = false }: { compact?: boolean }) {
  const market = useLocaleStore((s) => s.market);
  const setMarket = useLocaleStore((s) => s.setMarket);
  const config = MARKETS[market];
  const [open, setOpen] = useState<"country" | "currency" | null>(null);

  function selectMarket(code: MarketCode) {
    setMarket(code);
    setOpen(null);
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "country" ? null : "country")}
          className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white"
        >
          <MapPin className="h-4 w-4" />
          {config.flag} {config.name}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "country" && (
          <div className="absolute bottom-full left-0 z-50 mb-2 max-h-64 w-56 overflow-y-auto rounded border border-slate-600 bg-[#232f3e] py-1 shadow-lg">
            {MARKET_CODES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => selectMarket(code)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${code === market ? "font-bold text-amazon-gold" : ""}`}
              >
                {MARKETS[code].flag} {MARKETS[code].name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white"
      >
        <Globe className="h-4 w-4" />
        English
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "currency" ? null : "currency")}
          className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white"
        >
          <span className="font-bold">{config.currency === "INR" ? "₹" : config.currency === "USD" ? "$" : config.currency === "GBP" ? "£" : config.currency === "EUR" ? "€" : "¤"}</span>
          {config.currencyLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "currency" && (
          <div className="absolute bottom-full left-0 z-50 mb-2 max-h-64 w-64 overflow-y-auto rounded border border-slate-600 bg-[#232f3e] py-1 shadow-lg">
            {MARKET_CODES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => selectMarket(code)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${code === market ? "font-bold text-amazon-gold" : ""}`}
              >
                {MARKETS[code].currencyLabel}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "country" ? null : "country")}
          className="flex items-center gap-1.5 rounded border border-slate-500 px-3 py-1.5 text-sm hover:border-white"
        >
          <MapPin className="h-4 w-4" />
          {config.flag} {config.name}
          <ChevronDown className="h-3 w-3" />
        </button>
        {open === "country" && (
          <div className="absolute bottom-full right-0 z-50 mb-2 max-h-64 w-56 overflow-y-auto rounded border border-slate-600 bg-[#232f3e] py-1 shadow-lg">
            {MARKET_CODES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => selectMarket(code)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${code === market ? "font-bold text-amazon-gold" : ""}`}
              >
                {MARKETS[code].flag} {MARKETS[code].name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
