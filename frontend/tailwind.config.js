/** @type {import('tailwindcss').Config} */
import scrollbar from "tailwind-scrollbar"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#228B22",
        secondary: "#A8E100",
        light: "#27AE60",
        hover: "#1ABC9C",
        background: '#001F3F',
        navbar: '#002855',
        target: "#0A3D62",
        text_hover: "#00FF88",
        home: "#fe5f55",
        // away: "#27ae60",
        draw: "#00C49F",
        'custom-scroll': '#4B5563',
      },
      fontFamily: {
        title: ["Monomaniac One", "sans-serif"],
        subtitle: ["Comic Neue", "sans-serif"],
      },
      container: {
        center:true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [
    [scrollbar],
  ],
}

