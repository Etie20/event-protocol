/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6b21a8',
          light: '#7c3aed',
          dark: '#581c87',
        },
        secondary: {
          DEFAULT: '#f97316',
          light: '#fb923c',
        },
        success: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#f87171',
        },
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
