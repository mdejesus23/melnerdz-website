/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: 'var(--color-white)',
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card': 'var(--color-bg-card)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-muted': 'var(--color-accent-muted)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        glass: 'var(--color-glass)',
        // Legacy mappings
        pblue: 'var(--color-pblue)',
        lblue: 'var(--color-lblue)',
        lorange: 'var(--color-lorange)',
        project: 'var(--color-project)',
        projectDesc: 'var(--color-projectDesc)',
      },
      fontFamily: {
        logofont: ['var(--font-logofont)'],
        headfont: ['var(--font-headfont)'],
        bodyfont: ['var(--font-bodyfont)'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(245, 158, 11, 0.2)',
        'glow-lg': '0 0 60px rgba(245, 158, 11, 0.3)',
        card: '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
        projectCard:
          '0 4px 8px rgba(245, 158, 11, 0.15), 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            color: 'var(--color-white)',
            '--tw-prose-headings': 'var(--color-white)',
            '--tw-prose-links': 'var(--color-accent)',
            '--tw-prose-bold': 'var(--color-accent)',
            '--tw-prose-quotes': 'var(--color-text-muted)',
          },
        },
      }),
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
