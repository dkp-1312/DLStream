import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgb(15 23 42 / 0.08), 0 10px 20px -2px rgb(15 23 42 / 0.04)",
        nav: "0 1px 0 0 rgb(15 23 42 / 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dlstream: {
          primary: "#0284c7",
          "primary-content": "#ffffff",
          secondary: "#1e293b",
          "secondary-content": "#f8fafc",
          accent: "#0d9488",
          "accent-content": "#ffffff",
          neutral: "#475569",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          info: "#3b82f6",
          "info-content": "#ffffff",
          success: "#16a34a",
          "success-content": "#ffffff",
          warning: "#d97706",
          "warning-content": "#ffffff",
          error: "#dc2626",
          "error-content": "#ffffff",
        },
      },
    ],
  },
}
