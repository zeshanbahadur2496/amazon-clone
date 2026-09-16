"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { heroSlides } from "@/lib/data";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  function move(direction: number) {
    setActive((value) => (value + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="relative">
      <div className="relative h-[250px] overflow-hidden sm:h-[320px] lg:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#eaeded] to-transparent dark:from-slate-950" />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => move(-1)}
          className="absolute left-0 top-1/2 z-10 hidden h-[250px] w-[80px] -translate-y-1/2 items-center justify-start pl-2 hover:bg-black/5 lg:flex"
          aria-label="Previous slide"
        >
          <span className="flex h-16 w-11 items-center justify-center rounded bg-white/90 shadow-md hover:bg-white">
            <ChevronLeft className="h-7 w-7 text-[#0f1111]" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => move(1)}
          className="absolute right-0 top-1/2 z-10 hidden h-[250px] w-[80px] -translate-y-1/2 items-center justify-end pr-2 hover:bg-black/5 lg:flex"
          aria-label="Next slide"
        >
          <span className="flex h-16 w-11 items-center justify-center rounded bg-white/90 shadow-md hover:bg-white">
            <ChevronRight className="h-7 w-7 text-[#0f1111]" />
          </span>
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
          {heroSlides.map((s, index) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${index === active ? "w-5 bg-amazon-orange" : "w-2 bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
