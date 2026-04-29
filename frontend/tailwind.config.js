export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fff8f4',
        peach: {
          50: '#fff1e9',
          100: '#ffe1d2',
          200: '#f7c9b5',
          400: '#ef9c76',
          500: '#ea8a62',
          600: '#e77f55',
          700: '#b95c39',
          800: '#8f432d',
        },
        'warm-beige': '#f5f1ed',
        'soft-peach': '#f4a380',
        'accent-orange': '#e8a57f',
        'dark-gray': '#2c2c2c',
      },
      borderRadius: {
        'xl': '1.25rem',
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
