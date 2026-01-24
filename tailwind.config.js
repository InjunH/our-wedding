/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./index.tsx", "./App.tsx", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#c5a059",
        ivory: "#faf9f6",
        "gold-light": "#e5d5b7",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
}
