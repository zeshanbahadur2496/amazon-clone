import { getServerSession } from "next-auth";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PrimeSubscribeButton } from "@/components/prime/prime-subscribe-button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPrimePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPrime: true, primeExpiresAt: true }
      })
    : null;

  const isActive =
    user?.isPrime && (!user.primeExpiresAt || user.primeExpiresAt > new Date());

  return (
    <DashboardShell title="Prime Membership">
      <div className="amazon-card bg-gradient-to-br from-sky-900 to-slate-900 p-6 text-white">
        <p className="font-bold text-amazon-gold">amazon prime</p>
        <h2 className="mt-2 text-2xl font-bold">Fast, FREE delivery & exclusive deals</h2>
        {isActive ? (
          <p className="mt-3 text-sm text-emerald-300">
            Your Prime membership is active
            {user?.primeExpiresAt ? ` until ${user.primeExpiresAt.toLocaleDateString()}` : ""}.
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-200">Subscribe to unlock free shipping and exclusive deals.</p>
        )}
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ FREE fast delivery on millions of items</li>
          <li>✓ Prime Video & early access to sales</li>
          <li>✓ Exclusive coupons and lightning deals</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          {!isActive && <PrimeSubscribeButton label="Join Prime" />}
          <Link href="/prime" className="inline-flex h-11 items-center rounded-full border border-white/40 px-6 text-sm font-bold hover:bg-white/10">
            Explore Prime benefits
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
