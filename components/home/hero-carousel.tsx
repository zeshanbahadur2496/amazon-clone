"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { heroSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slide = heroSlides[active];
  const total = heroSlides.length;

  const goTo = useCallback((index: number) => {
    setActive((index + total) % total);
    setProgress(0);
  }, [total]);

  const move = useCallback(
    (direction: number) => {
      goTo(active + direction);
    },
    [active, goTo]
  );

  useEffect(() => {
    if (paused) return;

    setProgress(0);
    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setProgress(Math.min(100, (elapsed / SLIDE_MS) * 100));
      if (elapsed >= SLIDE_MS) {
        setActive((value) => (value + 1) % total);
      }
    }, 50);

    return () => window.clearInterval(tick);
  }, [active, paused, total]);

  return (
    <section
      className="mx-auto max-w-[1500px] px-3 pt-4 sm:px-4 sm:pt-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setProgress(0);
      }}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--store-border)] bg-[color:var(--store-surface)] shadow-glow">
        <div className="relative min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 grid lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className={cn("relative flex flex-col justify-center overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:px-12", `bg-gradient-to-br ${slide.accent}`)}>
                <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  {slide.eyebrow}
                </span>

                <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
                  {slide.title}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">{slide.description}</p>

                <Link
                  href={slide.href}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-lg"
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative hidden min-h-[280px] bg-[color:var(--store-surface-muted)] lg:block">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={active === 0}
                  sizes="(max-width: 1024px) 0vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              {heroSlides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}: ${item.title}`}
                  aria-current={index === active ? "true" : undefined}
                  className="group relative h-2 overflow-hidden rounded-full bg-white/25 transition-all"
                  style={{ width: index === active ? 56 : 8 }}
                >
                  {index === active && (
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white to-cyan-200 transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-black/35"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/20 text-white backdrop-blur transition hover:bg-black/35"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-44 overflow-hidden border-t border-[color:var(--store-border)] lg:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${slide.title}-mobile`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image src={slide.image} alt="" fill sizes="100vw" className="object-cover object-center" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--store-surface)] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
