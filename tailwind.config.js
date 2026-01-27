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
          DEFAULT: '#13ec5b', // Updated to neon green
          light: '#4ade80',
        },
        danger: {
          DEFAULT: '#ec1313', // Updated to red error
          light: '#f87171',
        },
        warning: '#f59e0b',
        "background-light": "#f6f8f6",
        "background-dark": "#102216",
        "brand-purple": "#4A148C",
        "brand-purple-dark": "#2E1065",
        "brand-orange": "#FF6D00",
        "brand-orange-red": "#FF5722",
        "brand-error": "#EF4444",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
