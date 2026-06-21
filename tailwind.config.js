/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1117",
        surface: "#1C1F26",
        "surface-2": "#252932",
        // gold references a CSS variable so the accent picker recolors the whole app.
        // rgb(... / <alpha-value>) keeps Tailwind opacity utilities (gold/15 etc.) working.
        gold: "rgb(var(--accent-rgb, 201 168 76) / <alpha-value>)",
        "gold-dim": "rgb(var(--accent-dim-rgb, 140 107 47) / <alpha-value>)",
        "gold-soft": "rgb(var(--accent-soft-rgb, 224 197 110) / <alpha-value>)",
        ink: "#F0EDE8",
        "ink-dim": "#8A8A9A",
        "ink-faint": "#55585F",
        line: "#2A2D35",
        success: "#4CAF7D",
        danger: "#E05C5C",
        warn: "#E0A84C",
      },
      fontFamily: {
        display: ["ClashDisplay", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      fontVariantNumeric: {
        tabular: "tabular-nums",
      },
    },
  },
  plugins: [],
};
