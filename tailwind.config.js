/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '30': '30%',
        '55': '55%',
        '40': '40%',
        '50': '50%',
        '75': '75%',
        '100': '100%',
      },
    },
  },
  plugins: [],
}

