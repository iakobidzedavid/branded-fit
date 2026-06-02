import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d1f33",
        surface: "#102542",
        border: "#1a3a5c",
        text: "#ecebf3",
        "text-muted": "#8fa3b8",
        accent: "#a855f7",
        danger: "#ef4444",
      },
      backgroundColor: {
        default: "#0d1f33",
      },
      textColor: {
        default: "#ecebf3",
      },
    },
  },
  plugins: [],
};

export default config;
