import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amazon Clone",
    short_name: "Amazon Clone",
    description: "An educational full-stack Amazon.pk-inspired e-commerce clone.",
    start_url: "/",
    display: "standalone",
    background_color: "#eaeded",
    theme_color: "#131921",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
