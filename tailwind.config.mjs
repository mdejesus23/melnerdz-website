/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#f4edea',
      pblue: '#12263a',
      lblue: '#06bcc1',
      lorange: '#f4d1ae',
    },
    fontFamily: {
      logofont: ['Pacifico', 'cursive;'],
    },
    screens: {
      xs: '480px', // Extra small screens
      sm: '640px', // Small screens (default Tailwind breakpoint)
      md: '768px', // Medium screens (default Tailwind breakpoint)
      lg: '1024px', // Large screens (default Tailwind breakpoint)
      xl: '1280px', // Extra large screens (default Tailwind breakpoint)
      '2xl': '1536px', // 2x large screens (default Tailwind breakpoint)
      '3xl': '1920px', // Custom 3x large screens
    },
  },
  plugins: [],
};
