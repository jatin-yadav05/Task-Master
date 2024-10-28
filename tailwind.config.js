/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/*.{js,jsx}"
  ],
  theme: {
     extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.7s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}