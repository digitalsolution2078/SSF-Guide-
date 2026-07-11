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
      },
      fontFamily: {
        sans: [
          "Noto Sans Devanagari",
          "Noto Sans",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
