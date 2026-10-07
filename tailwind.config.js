/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        'cream-card': '#FAF7F0',
        'deep-green': '#0F382C',
        'deep-green-dark': '#08251C',
        'accent-green': '#1B5E4B',
      }
    },
  },
  plugins: [],
}