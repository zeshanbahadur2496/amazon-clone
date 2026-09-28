import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const perks = ["Unlimited FREE fast delivery", "Prime Video included", "Early access to deals", "Cancel anytime"];

export function PrimePanel() {
  return (
    <section className="amazon-section">
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-700 p-5 text-white shadow-glow sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-2xl font-black italic tracking-tight text-cyan-200">prime</p>
          <h2 className="mt-1 text-xl font-bold sm:text-2xl">Fast, FREE delivery on eligible orders</h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-indigo-100">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/prime" className="store-btn-primary inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-indigo-700 hover:from-white hover:to-white">
          Try Prime free
        </Link>
      </div>
    </section>
  );
}
