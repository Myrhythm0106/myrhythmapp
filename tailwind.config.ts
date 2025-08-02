
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
        // GORGEOUS THERAPEUTIC PURPLE - Memory & Trust
        "memory-emerald": {
          50: "hsl(280, 65%, 97%)",
          100: "hsl(280, 60%, 94%)",
          200: "hsl(280, 65%, 88%)",
          300: "hsl(280, 70%, 78%)",
          400: "hsl(280, 75%, 68%)",
          500: "hsl(280, 80%, 58%)",
          600: "hsl(280, 85%, 48%)",
          700: "hsl(280, 90%, 38%)",
          800: "hsl(280, 95%, 28%)",
          900: "hsl(280, 100%, 20%)",
        },
        // STUNNING THERAPEUTIC TEAL - Calm & Healing
        "brain-health": {
          50: "hsl(180, 70%, 97%)",
          100: "hsl(180, 65%, 94%)",
          200: "hsl(180, 70%, 88%)",
          300: "hsl(180, 75%, 78%)",
          400: "hsl(180, 80%, 68%)",
          500: "hsl(180, 85%, 58%)",
          600: "hsl(180, 90%, 48%)",
          700: "hsl(180, 95%, 38%)",
          800: "hsl(180, 100%, 28%)",
          900: "hsl(180, 100%, 20%)",
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
        // Sunrise Amber: Peaceful warmth for renewal moments
        "sunrise-amber": {
          50: "hsl(var(--sunrise-amber-50))",
          100: "hsl(var(--sunrise-amber-100))",
          200: "hsl(var(--sunrise-amber-200))",
          300: "hsl(var(--sunrise-amber-300))",
          400: "hsl(var(--sunrise-amber-400))",
          500: "hsl(var(--sunrise-amber-500))",
          600: "hsl(var(--sunrise-amber-600))",
          700: "hsl(var(--sunrise-amber-700))",
          800: "hsl(var(--sunrise-amber-800))",
          900: "hsl(var(--sunrise-amber-900))",
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
        "memory-emerald": "hsl(var(--memory-emerald))",
        "memory-emerald-dark": "hsl(var(--memory-emerald-dark))",
        "memory-emerald-light": "hsl(var(--memory-emerald-light))",
        "brain-health": "hsl(var(--brain-health))",
        "brain-health-dark": "hsl(var(--brain-health-dark))",
        "brain-health-light": "hsl(var(--brain-health-light))",
      },
      backgroundImage: {
        "gradient-memory": "var(--gradient-memory)",
        "gradient-subtle": "var(--gradient-subtle)",
        "gradient-trust": "var(--gradient-trust)",
      },
      boxShadow: {
        "glow": "var(--shadow-glow)",
        "elegant": "var(--shadow-elegant)",
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
        "neural-pulse": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--brain-health-400) / 0.7)"
          },
          "70%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px hsl(var(--brain-health-400) / 0)"
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--brain-health-400) / 0)"
          }
        },
        "achievement-celebration": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.1) rotate(5deg)" },
          "50%": { transform: "scale(1.2) rotate(-5deg)" },
          "75%": { transform: "scale(1.1) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" }
        },
        "cognitive-flow": {
          "0%": { 
            background: "linear-gradient(45deg, hsl(var(--brain-health-100)), hsl(var(--clarity-teal-100)))"
          },
          "50%": { 
            background: "linear-gradient(45deg, hsl(var(--clarity-teal-100)), hsl(var(--memory-emerald-100)))"
          },
          "100%": { 
            background: "linear-gradient(45deg, hsl(var(--memory-emerald-100)), hsl(var(--brain-health-100)))"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "neural-pulse": "neural-pulse 2s infinite",
        "achievement-celebration": "achievement-celebration 0.6s ease-out",
        "cognitive-flow": "cognitive-flow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;
