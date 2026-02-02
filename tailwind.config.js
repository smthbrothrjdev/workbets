/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cloud: "#f7f7fb",
        mint: "#d5f5e3",
        lavender: "#e8e6ff",
        peach: "#ffe3d4",
        sky: "#d8f1ff",
      },
      boxShadow: {
        soft: "0 18px 30px -24px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
};
