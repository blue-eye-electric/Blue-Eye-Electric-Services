import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#00008B",
        secondary: "#ffd447",

        background: "#f4f8fc",

        text: "#102a43",
        muted: "#58718a",
        border: "#cbdceb",
        disabled: "#cbdceb",

        onPrimary: "#f4f8fc",
        onSecondary: "#102a43",

        success: "#168c78",
        onSuccess: "#ffffff",

        error: "#dc3545",
        onError: "#ffffff",

        ink: "#102a43",
        paper: "#f4f8fc",
        "muted-green": "#3f6382",
        "light-green": "#dcebf9",
      },

      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },

  plugins: [],
} satisfies Config;