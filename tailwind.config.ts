
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        // Memory Emerald: Calming green tones for healing
        "memory-emerald": {
          50: "hsl(var(--memory-emerald-50))",
          100: "hsl(var(--memory-emerald-100))",
          200: "hsl(var(--memory-emerald-200))",
          300: "hsl(var(--memory-emerald-300))",
          400: "hsl(var(--memory-emerald-400))",
          500: "hsl(var(--memory-emerald-500))",
          600: "hsl(var(--memory-emerald-600))",
          700: "hsl(var(--memory-emerald-700))",
          800: "hsl(var(--memory-emerald-800))",
          900: "hsl(var(--memory-emerald-900))",
        },
        // Brain Health: Teal tones for cognitive focus
        "brain-health": {
          50: "hsl(var(--brain-health-50))",
          100: "hsl(var(--brain-health-100))",
          200: "hsl(var(--brain-health-200))",
          300: "hsl(var(--brain-health-300))",
          400: "hsl(var(--brain-health-400))",
          500: "hsl(var(--brain-health-500))",
          600: "hsl(var(--brain-health-600))",
          700: "hsl(var(--brain-health-700))",
          800: "hsl(var(--brain-health-800))",
          900: "hsl(var(--brain-health-900))",
        },
        // Clarity Teal: Clear mental focus colors
        "clarity-teal": {
          50: "hsl(var(--clarity-teal-50))",
          100: "hsl(var(--clarity-teal-100))",
          200: "hsl(var(--clarity-teal-200))",
          300: "hsl(var(--clarity-teal-300))",
          400: "hsl(var(--clarity-teal-400))",
          500: "hsl(var(--clarity-teal-500))",
          600: "hsl(var(--clarity-teal-600))",
          700: "hsl(var(--clarity-teal-700))",
          800: "hsl(var(--clarity-teal-800))",
          900: "hsl(var(--clarity-teal-900))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
