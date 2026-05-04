import type { Config } from "tailwindcss";
import { colors, typography, spacing, shadows, borderRadius, animations, breakpoints } from "./lib/design-tokens";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        // Legacy accent color mapping to primary
        accent: colors.primary,
      },
      fontFamily: {
        sans: typography.fontFamily.sans.split(", "),
        ko: typography.fontFamily.ko.split(", "),
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing,
      boxShadow: shadows,
      borderRadius,
      transitionDuration: {
        fast: animations.duration.fast,
        base: animations.duration.base,
        slow: animations.duration.slow,
      },
      transitionTimingFunction: {
        smooth: animations.easing.smooth,
        bounce: animations.easing.bounce,
        "in-out-quad": animations.easing.inOutQuad,
      },
      keyframes: animations.keyframes,
      animation: {
        "fade-in": "fadeIn 250ms ease-smooth",
        "slide-up": "slideUp 250ms ease-smooth",
        "scale-in": "scaleIn 250ms ease-smooth",
        "shimmer": "shimmer 2s linear infinite",
      },
      screens: breakpoints,
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1200px", // Custom max-width from design tokens
        },
      },
    },
  },
  plugins: [],
};

export default config;
