/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',   // ✅ এই লাইনটি আবশ্যক
  theme: {
    extend: {},
  },
  plugins: [],
}