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
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(27, 59, 43, 0.08)",
        "gold-glow": "0 4px 25px -2px rgba(197, 160, 89, 0.35)",
        "emerald-glow": "0 4px 25px -2px rgba(27, 59, 43, 0.35)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-7px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(197, 160, 89, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(197, 160, 89, 0.7)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down": "fadeInDown 0.5s ease-out forwards",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "pulse-glow": "pulseGlow 3s infinite",
        "scale-up": "scaleUp 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
