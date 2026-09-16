import Image from "next/image";
import Link from "next/link";

import type { HomeSingleCard } from "@/lib/home-layout";

export function CategorySingleCard({ title, href, cta, image }: HomeSingleCard) {
  return (
    <article className="flex h-full flex-col bg-white p-5 dark:bg-slate-900">
      <h2 className="text-[21px] font-bold leading-tight text-[#0f1111] dark:text-white">{title}</h2>
      <Link href={href} className="group mt-4 flex flex-1 flex-col">
        <div className="relative min-h-[220px] flex-1 overflow-hidden bg-[#f7fafa] lg:min-h-[260px]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition group-hover:opacity-90"
          />
        </div>
      </Link>
      <Link href={href} className="mt-4 inline-block text-[13px] text-amazon-teal hover:text-amazon-orange hover:underline">
        {cta}
      </Link>
    </article>
  );
}
