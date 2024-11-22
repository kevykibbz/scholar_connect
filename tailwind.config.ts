import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background, #2b3440)",
        foreground: "var(--foreground, #e2e8f0)",
        neutral: "rgb(var(--fallback-n) #2b3440)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        '[data-theme="dark"]': {
          "--background": "#1e293b", // Dark background
          "--foreground": "#e2e8f0", // Light text
          "--fallback-n": "43 52 64", // Dark Neutral background (RGB)
        },
        '[data-theme="light"]': {
          "--background": "#f8fafc", // Light background
          "--foreground": "#1e293b", // Dark text
          "--fallback-n": "43 52 64", // Same Neutral background for light theme
        },
      });
    }),
  ],
} satisfies Config;