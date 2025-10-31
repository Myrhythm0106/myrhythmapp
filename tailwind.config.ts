
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
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.015em',
        'snug': '-0.01em',
      },
      spacing: {
        'mobile-touch': '12px',
        'section': '24px',
        'page': '32px',
        'page-mobile': '16px',
        'card': '16px',
        'card-lg': '24px',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'nav-height': '64px',
      },
      fontSize: {
        'display-xl': ['6rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.015em' }],
        'display-md': ['3.75rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.01em' }],
        'display-sm': ['3rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.01em' }],
        'title': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
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
        // Neural Luxury: Purple-Indigo-Blue gradient (65-75% saturation)
        "neural-purple": {
          50: "hsl(var(--neural-purple-50))",
          100: "hsl(var(--neural-purple-100))",
          200: "hsl(var(--neural-purple-200))",
          300: "hsl(var(--neural-purple-300))",
          400: "hsl(var(--neural-purple-400))",
          500: "hsl(var(--neural-purple-500))",
          600: "hsl(var(--neural-purple-600))",
          700: "hsl(var(--neural-purple-700))",
          800: "hsl(var(--neural-purple-800))",
          900: "hsl(var(--neural-purple-900))",
        },
        "neural-indigo": {
          50: "hsl(var(--neural-indigo-50))",
          100: "hsl(var(--neural-indigo-100))",
          200: "hsl(var(--neural-indigo-200))",
          300: "hsl(var(--neural-indigo-300))",
          400: "hsl(var(--neural-indigo-400))",
          500: "hsl(var(--neural-indigo-500))",
          600: "hsl(var(--neural-indigo-600))",
          700: "hsl(var(--neural-indigo-700))",
          800: "hsl(var(--neural-indigo-800))",
          900: "hsl(var(--neural-indigo-900))",
        },
        "neural-blue": {
          50: "hsl(var(--neural-blue-50))",
          100: "hsl(var(--neural-blue-100))",
          200: "hsl(var(--neural-blue-200))",
          300: "hsl(var(--neural-blue-300))",
          400: "hsl(var(--neural-blue-400))",
          500: "hsl(var(--neural-blue-500))",
          600: "hsl(var(--neural-blue-600))",
          700: "hsl(var(--neural-blue-700))",
          800: "hsl(var(--neural-blue-800))",
          900: "hsl(var(--neural-blue-900))",
        },
        "neural-magenta": {
          50: "hsl(var(--neural-magenta-50))",
          100: "hsl(var(--neural-magenta-100))",
          200: "hsl(var(--neural-magenta-200))",
          300: "hsl(var(--neural-magenta-300))",
          400: "hsl(var(--neural-magenta-400))",
          500: "hsl(var(--neural-magenta-500))",
          600: "hsl(var(--neural-magenta-600))",
          700: "hsl(var(--neural-magenta-700))",
          800: "hsl(var(--neural-magenta-800))",
          900: "hsl(var(--neural-magenta-900))",
        },
        // Brain Health Spectrum: Unified emerald-teal-cyan (45-55% saturation)
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
        // Legacy compatibility - kept for existing components
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
        // Beacon: Legacy compatibility - maps to neural-purple
        "beacon": {
          50: "hsl(var(--beacon-50))",
          100: "hsl(var(--beacon-100))",
          200: "hsl(var(--beacon-200))",
          300: "hsl(var(--beacon-300))",
          400: "hsl(var(--beacon-400))",
          500: "hsl(var(--beacon-500))",
          600: "hsl(var(--beacon-600))",
          700: "hsl(var(--beacon-700))",
          800: "hsl(var(--beacon-800))",
          900: "hsl(var(--beacon-900))",
        },
        // Brand Colors: Empowering brain health palette
        "brand-teal": {
          50: "hsl(var(--brand-teal-50))",
          100: "hsl(var(--brand-teal-100))",
          200: "hsl(var(--brand-teal-200))",
          300: "hsl(var(--brand-teal-300))",
          400: "hsl(var(--brand-teal-400))",
          500: "hsl(var(--brand-teal-500))",
          600: "hsl(var(--brand-teal-600))",
          700: "hsl(var(--brand-teal-700))",
          800: "hsl(var(--brand-teal-800))",
          900: "hsl(var(--brand-teal-900))",
        },
        "brand-emerald": {
          50: "hsl(var(--brand-emerald-50))",
          100: "hsl(var(--brand-emerald-100))",
          200: "hsl(var(--brand-emerald-200))",
          300: "hsl(var(--brand-emerald-300))",
          400: "hsl(var(--brand-emerald-400))",
          500: "hsl(var(--brand-emerald-500))",
          600: "hsl(var(--brand-emerald-600))",
          700: "hsl(var(--brand-emerald-700))",
          800: "hsl(var(--brand-emerald-800))",
          900: "hsl(var(--brand-emerald-900))",
        },
        "brand-orange": {
          50: "hsl(var(--brand-orange-50))",
          100: "hsl(var(--brand-orange-100))",
          200: "hsl(var(--brand-orange-200))",
          300: "hsl(var(--brand-orange-300))",
          400: "hsl(var(--brand-orange-400))",
          500: "hsl(var(--brand-orange-500))",
          600: "hsl(var(--brand-orange-600))",
          700: "hsl(var(--brand-orange-700))",
          800: "hsl(var(--brand-orange-800))",
          900: "hsl(var(--brand-orange-900))",
        },
        "brand-blue": {
          50: "hsl(var(--brand-blue-50))",
          100: "hsl(var(--brand-blue-100))",
          200: "hsl(var(--brand-blue-200))",
          300: "hsl(var(--brand-blue-300))",
          400: "hsl(var(--brand-blue-400))",
          500: "hsl(var(--brand-blue-500))",
          600: "hsl(var(--brand-blue-600))",
          700: "hsl(var(--brand-blue-700))",
          800: "hsl(var(--brand-blue-800))",
          900: "hsl(var(--brand-blue-900))",
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
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
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
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
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
        "slide-in-from-top": {
          "0%": { 
            transform: "translateY(-100px) translateX(-50%)",
            opacity: "0"
          },
          "100%": { 
            transform: "translateY(0) translateX(-50%)",
            opacity: "1"
          }
        },
        "fade-in-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "parallax-float": {
          "0%, 100%": { 
            transform: "translateY(0px)"
          },
          "50%": { 
            transform: "translateY(-20px)"
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
        "slide-in-from-top": "slide-in-from-top 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "parallax-float": "parallax-float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;
