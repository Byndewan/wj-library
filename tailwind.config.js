/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        secondary: "#475569",
        success: "#059669",
        warning: "#d97706",
        danger: "#dc2626",
        light: "#f8fafc",
        dark: "#1e293b",
        surface: "#ffffff",
        background: "#f1f5f9",
        "card-border": "#e2e8f0",
      },
    },
  },
  plugins: [],
};

