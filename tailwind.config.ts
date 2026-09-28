import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        store: {
          bg: "var(--store-bg)",
          surface: "var(--store-surface)",
          muted: "var(--store-text-muted)",
          border: "var(--store-border)",
          primary: "var(--store-primary)",
          accent: "var(--store-accent)",
          deal: "var(--store-deal)",
          success: "var(--store-success)"
        },
        amazon: {
          navy: "#111827",
          blue: "#1f2937",
          light: "#374151",
          gold: "#22d3ee",
          orange: "#6366f1",
          teal: "#8b5cf6",
          green: "#10b981",
          red: "#f43f5e",
          page: "var(--amazon-page)"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        amazon: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "var(--store-glow)",
        soft: "var(--store-shadow)",
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
        cardHover: "0 12px 32px rgba(99, 102, 241, 0.14)",
        dropdown: "0 16px 40px rgba(15, 23, 42, 0.12)",
        sticky: "0 8px 24px rgba(15, 23, 42, 0.08)"
      },
      maxWidth: {
        amazon: "1500px"
      },
      animation: {
        "fade-in": "fadeIn 0.55s ease-out both",
        shimmer: "shimmer 1.35s linear infinite",
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
