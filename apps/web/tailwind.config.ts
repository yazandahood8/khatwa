import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        // Baloo Bhaijaan 2 (rounded, bold) for headings, Tajawal for body, JetBrains Mono for math
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body-ar)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body-ar)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Brief type scale
        display: ['3rem', { lineHeight: '1.15', fontWeight: '700' }], // 48px
        tiny: ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }], // 12px
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          dark: 'hsl(var(--primary-dark) / <alpha-value>)',
          light: 'hsl(var(--primary-light) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: 'hsl(var(--warning) / <alpha-value>)',
        highlight: 'hsl(var(--highlight) / <alpha-value>)',
        margin: 'hsl(var(--margin) / <alpha-value>)',
        lime: {
          DEFAULT: 'hsl(var(--lime) / <alpha-value>)',
          light: 'hsl(var(--lime-light) / <alpha-value>)',
          dark: 'hsl(var(--lime-dark) / <alpha-value>)',
        },
        tint: {
          lavender: 'hsl(var(--tint-lavender) / <alpha-value>)',
          sky: 'hsl(var(--tint-sky) / <alpha-value>)',
          pink: 'hsl(var(--tint-pink) / <alpha-value>)',
          sun: 'hsl(var(--tint-sun) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold) / <alpha-value>)',
          light: 'hsl(var(--gold-light) / <alpha-value>)',
          text: 'hsl(var(--gold-text) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar) / <alpha-value>)',
          foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        // Big, friendly corners
        sm: '10px',
        DEFAULT: '14px',
        md: '16px',
        lg: 'var(--radius)',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        // Soft, layered, blue-tinted shadows
        subtle: '0 1px 2px hsl(var(--foreground) / 0.06)',
        card: '0 1px 2px hsl(var(--foreground) / 0.05), 0 8px 24px -12px hsl(var(--primary) / 0.18)',
        elevated:
          '0 2px 4px hsl(var(--foreground) / 0.06), 0 18px 36px -16px hsl(var(--primary) / 0.35)',
        float: '0 28px 56px -24px hsl(var(--primary) / 0.5)',
        // Chunky "ledge" under primary actions
        'glow-primary': '0 4px 0 0 hsl(var(--primary-dark))',
        'glow-streak': '0 3px 0 0 hsl(27 85% 34%)',
        'glow-lime': '0 4px 0 0 hsl(var(--lime-dark))',
        // Stacked ledge under colorful tiles
        sheet: '0 6px 0 -1px hsl(var(--foreground) / 0.12), 0 18px 32px -18px hsl(var(--primary) / 0.35)',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        successPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        errorShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        firePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.85' },
        },
        typingDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        pointsFloat: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-40px)' },
        },
        fillBar: {
          from: { width: '0%' },
          to: { width: 'var(--bar-fill, 100%)' },
        },
        stepReveal: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 350ms cubic-bezier(0.16,1,0.3,1) both',
        'success-pop': 'successPop 400ms cubic-bezier(0.16,1,0.3,1)',
        'error-shake': 'errorShake 400ms ease',
        'fire-pulse': 'firePulse 1.6s ease-in-out infinite',
        'typing-dot': 'typingDot 1.2s ease-in-out infinite',
        'points-float': 'pointsFloat 900ms ease-out forwards',
        'fill-bar': 'fillBar 800ms cubic-bezier(0.16,1,0.3,1) forwards',
        'step-reveal': 'stepReveal 350ms cubic-bezier(0.16,1,0.3,1) both',
        'toast-in': 'toastIn 300ms cubic-bezier(0.16,1,0.3,1) both',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
