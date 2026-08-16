import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f0f7f3",
          100: "#dcece2",
          200: "#bbd9c8",
          300: "#90beaa",
          400: "#609e86",
          500: "#3d826a",
          600: "#2e6854",
          700: "#265444",
          800: "#1b3b2b", // Deep Mehendi Emerald
          900: "#143023",
          950: "#0b1a13",
        },
        gold: {
          50: "#fdfbf4",
          100: "#f9f4e2",
          200: "#f3e6c0",
          300: "#e9d393",
          400: "#dcbb66",
          500: "#c5a059", // Warm Royal Gold
          600: "#b0853c",
          700: "#8c6431",
          800: "#74502d",
          900: "#62422a",
        },
        cream: {
          50: "#ffffff",
          100: "#fdfbf7", // Warm Ivory Cream
          200: "#f8f3ea",
          300: "#efe8d8",
          400: "#dfd2b9",
        },
        earth: {
          100: "#f5f0eb",
          500: "#7a5c43",
          800: "#4a3525", // Deep Earthy Brown
          900: "#322216",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Inter", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 59, 43, 0.08)',
        'gold-glow': '0 4px 20px -2px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
