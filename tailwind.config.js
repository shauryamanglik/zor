/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1117",
        surface: "#1C1F26",
        "surface-2": "#252932",
        gold: "#C9A84C",
        "gold-dim": "#8C6B2F",
        "gold-soft": "#E0C56E",
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
