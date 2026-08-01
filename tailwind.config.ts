import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Purple = authority (primary), per design direction §9
        primary: {
          50: "#f5f0fa",
          100: "#e9def4",
          200: "#d3bde9",
          300: "#b591d9",
          400: "#9666c7",
          500: "#7743ab",
          600: "#5B2D8E",
          700: "#4a2474",
          800: "#3a1d5b",
          900: "#2b1543",
        },
        // Orange = actions and important notices
        action: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#F97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        // Warm neutral "ink & paper" scale for the editorial look — replaces the
        // cool default grays with a slightly warm cast that pairs with purple.
        ink: {
          50: "#faf9fb",
          100: "#f4f2f7",
          200: "#e8e4ee",
          300: "#d5cede",
          400: "#a79db6",
          500: "#786d88",
          600: "#574d66",
          700: "#3f3750",
          800: "#2a2338",
          900: "#191324",
        },
      },
      fontFamily: {
        // Body — clean, highly legible Devanagari + Latin.
        sans: ["var(--font-mukta)", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        // Editorial headings — serif that supports Devanagari.
        serif: ["var(--font-tiro)", "Georgia", "Times New Roman", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        // Ultra-soft elevation — editorial, not glossy.
        card: "0 1px 2px rgba(25,19,36,0.04), 0 8px 24px -12px rgba(25,19,36,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
