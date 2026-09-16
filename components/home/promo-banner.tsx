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
      className={`group relative block overflow-hidden ${dark ? "bg-[#0f1419]" : "bg-white"} dark:bg-slate-900`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0 flex-1">
          <p className={`text-lg font-bold sm:text-xl ${dark ? "text-white" : "text-[#0f1111] dark:text-white"}`}>{title}</p>
          {subtitle && (
            <p className={`mt-1 text-sm ${dark ? "text-slate-300" : "text-[#565959] dark:text-slate-400"}`}>{subtitle}</p>
          )}
          <span className="mt-2 inline-block text-sm font-bold text-amazon-teal group-hover:text-amazon-orange group-hover:underline">
            {cta}
          </span>
        </div>
        <div className="relative hidden h-24 w-48 shrink-0 overflow-hidden rounded sm:block md:h-28 md:w-56">
          <Image src={image} alt="" fill sizes="224px" className="object-cover" />
        </div>
      </div>
    </Link>
  );
}
