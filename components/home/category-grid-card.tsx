import Image from "next/image";
import Link from "next/link";

import type { HomeGridCard } from "@/lib/home-layout";

export function CategoryGridCard({ title, seeMoreHref, tiles }: HomeGridCard) {
  return (
    <article className="flex h-full flex-col bg-white p-5 dark:bg-slate-900">
      <h2 className="text-[21px] font-bold leading-tight text-[#0f1111] dark:text-white">{title}</h2>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-x-3 gap-y-4">
        {tiles.map((tile) => (
          <Link key={`${tile.label}-${tile.href}`} href={tile.href} className="group">
            <div className="relative aspect-square overflow-hidden bg-[#f7fafa]">
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                sizes="(max-width: 768px) 50vw, 180px"
                className="object-cover transition group-hover:opacity-90"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-[#0f1111] dark:text-slate-200">{tile.label}</p>
          </Link>
        ))}
      </div>
      <Link href={seeMoreHref} className="mt-4 inline-block text-[13px] text-amazon-teal hover:text-amazon-orange hover:underline">
        See more
      </Link>
    </article>
  );
}
