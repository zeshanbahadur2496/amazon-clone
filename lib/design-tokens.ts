export const storeTokens = {
  colors: {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    accent: "#06b6d4",
    deal: "#f43f5e",
    success: "#10b981",
    lightBg: "#f4f6fb",
    darkBg: "#0b0f19",
    surfaceLight: "#ffffff",
    surfaceDark: "#151b28"
  },
  spacing: {
    navHeight: "72px",
    subNavHeight: "44px",
    pagePadding: "1rem",
    cardPadding: "1rem",
    sectionGap: "1.5rem"
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    productTitle: "text-sm leading-snug font-medium",
    price: "text-xl font-bold",
    mrp: "text-xs text-slate-500 line-through"
  }
} as const;

/** @deprecated use storeTokens */
export const amazonTokens = storeTokens;

export const trendingSearches = [
  "iphone 16",
  "laptop deals",
  "air fryer",
  "running shoes",
  "kindle",
  "wireless earbuds",
  "smart watch",
  "gaming chair"
];

export const deliveryLocations = [
  { pincode: "110001", city: "New Delhi" },
  { pincode: "400001", city: "Mumbai" },
  { pincode: "560001", city: "Bengaluru" },
  { pincode: "600001", city: "Chennai" }
];
