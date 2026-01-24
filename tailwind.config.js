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
      animation: {
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
      keyframes: {
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
    },
  },
  plugins: [],
}
