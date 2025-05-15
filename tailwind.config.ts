import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Earthy tone palette
        sage: {
          50: "#f2f5f2",
          100: "#e6ebe5",
          200: "#cdd8cc",
          300: "#b3c5b2",
          400: "#9ab298",
          500: "#81a07e",
          600: "#678d65",
          700: "#527a50",
          800: "#3e5c3c",
          900: "#2a3e28",
          950: "#152014",
        },
        clay: {
          50: "#f9f6f3",
          100: "#f3ede7",
          200: "#e7dbd0",
          300: "#dbc9b9",
          400: "#cfb7a2",
          500: "#c3a58b",
          600: "#b79374",
          700: "#a67e5d",
          800: "#8c6a4e",
          900: "#73563f",
          950: "#3a2b20",
        },
        terracotta: {
          50: "#fbf5f2",
          100: "#f7ebe5",
          200: "#efd7cc",
          300: "#e7c3b2",
          400: "#dfaf99",
          500: "#d79b7f",
          600: "#cf8766",
          700: "#c7734d",
          800: "#b35f34",
          900: "#994b1c",
          950: "#4f260e",
        },
        olive: {
          50: "#f8f9f2",
          100: "#f1f3e5",
          200: "#e3e7cc",
          300: "#d5dbb2",
          400: "#c7cf99",
          500: "#b9c37f",
          600: "#abb766",
          700: "#9dab4c",
          800: "#7f8c33",
          900: "#616c19",
          950: "#31360c",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
