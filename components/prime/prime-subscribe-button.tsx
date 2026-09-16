"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function PrimeSubscribeButton({ label = "Start 30-day free trial" }: { label?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/prime");
      return;
    }

    if (session.user.isPrime) {
      toast.info("You already have an active Prime membership");
      router.push("/dashboard/prime");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/prime/subscribe", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Subscription failed");
      if (data.url) window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={subscribe} disabled={loading} className="amazon-btn-primary">
      {loading ? "Redirecting..." : label}
    </button>
  );
}
