import type { Config } from "tailwindcss";

/**
 * SSF Guide Nepal — design tokens (v3 "clear & modern").
 *
 * - primary  = Digital Solution purple (brand), used for identity + primary actions
 * - action   = warm orange, reserved for the single most important CTA on a screen
 * - health   = teal, used only for the hospital / medical directory surfaces
 * - ink      = cool slate neutrals (text, borders, subtle surfaces)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F1FB",
          100: "#EAE1F7",
          200: "#D5C4EF",
          300: "#B89CE3",
          400: "#9A72D4",
          500: "#7B4FC3",
          600: "#5B2D8E",
          700: "#4B2476",
          800: "#3B1C5D",
          900: "#2A1342",
          950: "#1A0B2B",
        },
        action: {
          50: "#FFF5EC",
          100: "#FFE6D0",
          200: "#FFCCA3",
          500: "#F26B1D",
          600: "#D9560F",
          700: "#B2430A",
        },
        health: {
          50: "#ECFDFB",
          100: "#CDF7F2",
          200: "#9EEDE4",
          500: "#0E9F97",
          600: "#0B7F79",
          700: "#0A6661",
          900: "#073E3B",
        },
        ink: {
          50: "#F7F8FA",
          100: "#EEF0F4",
          200: "#E2E5EB",
          300: "#CCD1DB",
          400: "#9AA2B2",
          500: "#6B7386",
          600: "#4F5667",
          700: "#393F4D",
          800: "#252A36",
          900: "#141821",
        },
      },
      fontFamily: {
        // Body: Noto Sans Devanagari — the most legible Devanagari UI face,
        // with a matching Latin so mixed Nepali/English lines sit evenly.
        sans: ["var(--font-body)", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        // Display: Anek Devanagari — modern, confident headlines (Devanagari + Latin).
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
        // Legacy alias — older pages used `font-serif` for headings.
        serif: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.14em",
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,24,33,0.04), 0 10px 30px -14px rgba(20,24,33,0.14)",
        pop: "0 12px 40px -12px rgba(20,24,33,0.22)",
        ring: "0 0 0 4px rgba(91,45,142,0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
