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
        handwriting: ["Nanum Pen Script", "cursive"],
        serif: ["Gowun Batang", "serif"],
        "serif-kr": ["Gowun Batang", "serif"],
        "serif-en": ["Cormorant Garamond", "serif"],
        sans: ["IBM Plex Sans KR", "sans-serif"],
      },
      letterSpacing: {
        "tight-serif": "-0.02em",
      },
    },
  },
  plugins: [],
}
