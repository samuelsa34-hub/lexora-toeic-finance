import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Geist', 'system-ui', 'sans-serif'],
        mono:  ['Geist Mono', 'ui-monospace', 'monospace'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
      },

      // ── Semantic colors (shadcn CSS-variable tokens) ───────────────────────
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
      },

      // ── Radius (4px base unit) ─────────────────────────────────────────────
      borderRadius: {
        none: '0px',
        sm:   '4px',
        DEFAULT: '8px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl': '24px',
        '3xl': '20px',
        full: '9999px',
      },

      // ── Shadows (from design system spec) ─────────────────────────────────
      boxShadow: {
        sm:  '0 1px 2px rgba(0,0,0,0.05)',
        md:  '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
        lg:  '0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
        xl:  '0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)',
        // legacy dark-mode card shadows (still used by existing components)
        'card':    '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 2px 8px rgba(0,0,0,0.35)',
        'card-lg': '0 1px 0 0 rgba(255,255,255,0.07) inset, 0 8px 32px rgba(0,0,0,0.5)',
        'glow-sm': '0 0 20px rgba(99,102,241,0.2)',
        'glow-md': '0 0 30px rgba(99,102,241,0.25), 0 0 60px rgba(99,102,241,0.08)',
        'inner-top': '0 1px 0 0 rgba(255,255,255,0.08) inset',
      },

      // ── Motion ─────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        'default':    'cubic-bezier(0.4, 0, 0.2, 1)',
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
        'snappy':     'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      transitionDuration: {
        instant:    '50ms',
        fast:       '150ms',
        normal:     '250ms',
        slow:       '400ms',
        deliberate: '600ms',
      },

      // ── Animations ─────────────────────────────────────────────────────────
      animation: {
        'pulse-slow':       'pulse-slow 3s ease-in-out infinite',
        'glow':             'glow 2s ease-in-out infinite alternate',
        'progress-shimmer': 'progress-shimmer 2.5s ease-in-out infinite',
        'status-pulse':     'status-pulse 2s ease-in-out infinite',
        'float-up':         'float-up 0.25s ease-out forwards',
        'accordion-down':   'accordion-down 0.2s ease-out',
        'accordion-up':     'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        glow: {
          from: { boxShadow: '0 0 12px rgba(99,102,241,0.3)' },
          to:   { boxShadow: '0 0 28px rgba(99,102,241,0.6), 0 0 50px rgba(99,102,241,0.15)' },
        },
        'progress-shimmer': {
          '0%':        { transform: 'translateX(-120%)' },
          '60%, 100%': { transform: 'translateX(120%)' },
        },
        'status-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.5)' },
          '50%':      { boxShadow: '0 0 0 4px rgba(16,185,129,0)' },
        },
        'float-up': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
