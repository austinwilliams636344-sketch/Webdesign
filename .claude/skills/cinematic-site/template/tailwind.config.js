import colors from './src/theme.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Wide landscape screens: chapter text in a left column, film on the right.
        // Must match SIDE_QUERY in ScrollFilm.jsx.
        side: { raw: '(min-width: 1100px) and (min-aspect-ratio: 6/5)' },
        // short phones (e.g. iPhone SE): tighter hero so the house band fits above it
        short: { raw: '(max-width: 639px) and (max-height: 739px)' },
      },
      colors,
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { '2.5xl': '1.25rem', '4xl': '2rem', '5xl': '2.5rem', '6xl': '3rem' },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
