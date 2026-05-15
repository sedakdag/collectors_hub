/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'cream-bg': '#fdfaf3',
        'sidebar-blue': '#c5e3f4',
        'purple-box': '#b7a2d6',
        'purple-text': '#8e7eb5',
      }
    },
  },
  plugins: [],
}