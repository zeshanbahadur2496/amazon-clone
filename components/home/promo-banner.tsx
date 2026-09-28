import Image from "next/image";
import Link from "next/link";

type PromoBannerProps = {
  title: string;
  subtitle?: string;
  cta: string;
  href: string;
  image: string;
  dark?: boolean;
};

export function PromoBanner({ title, subtitle, cta, href, image, dark = false }: PromoBannerProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl ${
        dark
          ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900"
          : "bg-[color:var(--store-surface)]"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="min-w-0 flex-1">
          <p className={`text-lg font-bold sm:text-xl ${dark ? "text-white" : "text-[color:var(--store-text)]"}`}>{title}</p>
          {subtitle && (
            <p className={`mt-1 text-sm ${dark ? "text-slate-300" : "text-[color:var(--store-text-muted)]"}`}>{subtitle}</p>
          )}
          <span className="store-link mt-2 inline-block text-sm font-semibold">{cta}</span>
        </div>
        <div className="relative hidden h-24 w-48 shrink-0 overflow-hidden rounded-xl sm:block md:h-28 md:w-56">
          <Image src={image} alt="" fill sizes="224px" className="object-cover transition duration-300 group-hover:scale-105" />
        </div>
      </div>
    </Link>
  );
}
