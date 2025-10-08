/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // <-- Tell Tailwind to scan these files for classes
  ],
  theme: {
    extend: {},   // You can add custom colors, fonts, spacing later
  },
  plugins: [],    // You can add Tailwind plugins here later if needed
}
