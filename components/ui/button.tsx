import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md hover:from-indigo-600 hover:to-cyan-600 active:scale-[0.98]",
        variant === "secondary" && "bg-rose-500 text-white shadow-sm hover:bg-rose-600",
        variant === "ghost" && "text-[color:var(--store-text-muted)] hover:bg-indigo-500/10 hover:text-indigo-600",
        variant === "dark" && "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
        variant === "outline" &&
          "border border-[color:var(--store-border)] bg-[color:var(--store-surface)] text-[color:var(--store-text)] hover:border-indigo-300 hover:bg-indigo-500/5",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        size === "icon" && "h-10 w-10 p-0",
        className
      )}
      {...props}
    />
  );
}
