/**
 * Design Tokens
 * Central source of truth for colors, spacing, typography, and other design constants.
 */

// ═══════════════════════════════════════════════════════════
// Colors
// ═══════════════════════════════════════════════════════════

export const colors = {
  // Brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#4A7CFF", // Main brand color
    600: "#3b68db",
    700: "#2f5fd0",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  secondary: {
    50: "#fff5f2",
    100: "#ffe8e0",
    200: "#ffd4c6",
    300: "#ffb89d",
    400: "#ff9574",
    500: "#FF7A59", // Warm coral for CTAs
    600: "#f05a36",
    700: "#d94520",
    800: "#b8381a",
    900: "#9a3019",
  },
  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#f43f5e",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
} as const;

// ═══════════════════════════════════════════════════════════
// Typography
// ═══════════════════════════════════════════════════════════

export const typography = {
  fontFamily: {
    sans: '"Inter", "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    ko: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  },
} as const;

// ═══════════════════════════════════════════════════════════
// Spacing (8pt grid)
// ═══════════════════════════════════════════════════════════

export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
} as const;

// ═══════════════════════════════════════════════════════════
// Shadows & Elevation
// ═══════════════════════════════════════════════════════════

export const shadows = {
  xs: "0 1px 2px rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)",
  md: "0 4px 6px rgb(0 0 0 / 0.07), 0 2px 4px rgb(0 0 0 / 0.06)",
  lg: "0 10px 15px rgb(0 0 0 / 0.1), 0 4px 6px rgb(0 0 0 / 0.05)",
  xl: "0 20px 25px rgb(0 0 0 / 0.1), 0 8px 10px rgb(0 0 0 / 0.04)",
} as const;

// ═══════════════════════════════════════════════════════════
// Border Radius
// ═══════════════════════════════════════════════════════════

export const borderRadius = {
  sm: "0.25rem", // 4px — buttons, tags
  md: "0.375rem", // 6px — inputs
  lg: "0.5rem", // 8px — cards
  xl: "0.75rem", // 12px — large cards, modals
  "2xl": "1rem", // 16px — hero sections
  full: "9999px", // badges, avatars
} as const;

// ═══════════════════════════════════════════════════════════
// Animations & Transitions
// ═══════════════════════════════════════════════════════════

export const animations = {
  // Timing functions
  easing: {
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    inOutQuad: "cubic-bezier(0.45, 0, 0.55, 1)",
  },
  // Durations
  duration: {
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
  },
  // Keyframes (for use in CSS)
  keyframes: {
    fadeIn: {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },
    slideUp: {
      from: { transform: "translateY(10px)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },
    scaleIn: {
      from: { transform: "scale(0.95)", opacity: "0" },
      to: { transform: "scale(1)", opacity: "1" },
    },
    shimmer: {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════
// Breakpoints
// ═══════════════════════════════════════════════════════════

export const breakpoints = {
  sm: "640px", // large phones
  md: "768px", // tablets
  lg: "1024px", // laptops
  xl: "1280px", // desktops
  "2xl": "1536px", // large desktops
} as const;

// ═══════════════════════════════════════════════════════════
// Container
// ═══════════════════════════════════════════════════════════

export const container = {
  maxWidth: "1200px",
  padding: {
    default: "1rem",
    sm: "1.5rem",
    lg: "2rem",
  },
} as const;
