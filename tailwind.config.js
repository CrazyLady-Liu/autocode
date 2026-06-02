/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        surface: "#0a0a0f",
        accent: {
          cyan: "#38bdf8",
          violet: "#8b5cf6",
          rose: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};
