"use client";

import { MapPin } from "lucide-react";
import { FormEvent, useState } from "react";

import { useDeliveryStore } from "@/components/providers/delivery-store";
import { useMarket } from "@/hooks/use-market";

export function DeliveryChecker({ isPrime = true }: { isPrime?: boolean }) {
  const { pincode, setLocation } = useDeliveryStore();
  const { market, config } = useMarket();
  const [input, setInput] = useState(pincode);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/delivery/check?postalCode=${encodeURIComponent(input)}&prime=${isPrime}&market=${market}`
      );
      const data = (await res.json()) as { serviceable: boolean; estimatedDelivery?: string; message: string };
      setMessage(data.serviceable ? `Delivery by ${data.estimatedDelivery}` : data.message);
      if (data.serviceable) setLocation(input, "Your location", market);
    } catch {
      setMessage("Unable to check delivery");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={check} className="mt-4">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
        Deliver to {config.flag} {config.name}
      </p>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.postal.placeholder}
            maxLength={config.postal.maxLength}
            className="h-10 w-full rounded border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-amazon-orange dark:border-white/20 dark:bg-slate-950"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-slate-100 px-4 text-sm font-medium hover:bg-slate-200 dark:bg-white/10"
        >
          Check
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-amazon-green">{message}</p>}
    </form>
  );
}
