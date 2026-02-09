import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#000000",
          light: "#f9fafb",
        },
        foreground: {
          DEFAULT: "#111827",
          muted: "#6b7280",
        },
        gray: {
          950: "#0A0A0A",
          900: "#1A1A1A",
          850: "#2A2A2A",
          800: "#3A3A3A",
          700: "#4A4A4A",
          600: "#5A5A5A",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#B89621",
          muted: "#8A7128",
        },
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
