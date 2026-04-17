/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#4F46E5",
          pink: "#7C3AED",
          violet: "#A855F7",
          gold: "#F59E0B"
        },
        brand: {
          blue: "rgb(var(--color-brand-blue) / <alpha-value>)",
          background: "rgb(var(--color-brand-background) / <alpha-value>)",
          card: "rgb(var(--color-brand-card) / <alpha-value>)",
          green: "#10B981",
          red: "#EF4444",
          dark: "#0F172A"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "sans-serif"]
      }
    }
  },
  plugins: []
};


