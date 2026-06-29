/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-2px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },

        // 🔥 ADD THIS
        swing: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(180deg)" },
          "50%": { transform: "rotate(180deg)" }, // pause at top
          "75%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" }, // pause at bottom
        },
      },

      animation: {
        shake: "shake 0.4s ease-in-out",

        // 🔥 ADD THIS
        swing: "swing 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "#fff8f2",
        surface: "#ffffff",
        primary: "#ff7a00",
        secondary: "#ff9d42",

        dark: "#2b0d00",
        dark2: "#4a1800",

        border: "#ffe2c2",
        muted: "#8a6b55",

        success: "#22c55e",
        danger: "#ef4444",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },

      boxShadow: {
        orange: "0 10px 40px rgba(255,122,0,0.15)",
      },
    },
  },

  plugins: [],
};