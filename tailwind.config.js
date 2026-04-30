/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 35px -18px rgba(15, 23, 42, 0.35)",
      },
      colors: {
        brand: {
          50: "#ecf5ff",
          100: "#d5e9ff",
          500: "#2b72c9",
          600: "#1f5ea9",
          700: "#184b87",
        },
      },
    },
  },
  plugins: [],
};

