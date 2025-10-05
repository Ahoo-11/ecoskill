/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          primary: "#10B981",
          secondary: "#2C5530",
          sky: "#38BDF8",
          sunshine: "#FACC15"
        }
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "DM Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(16, 185, 129, 0.15)",
        "card-hover": "0 15px 35px rgba(15, 118, 110, 0.25)"
      },
      borderRadius: {
        xl: "1.25rem"
      },
      backgroundImage: {
        "eco-aurora": "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.3), transparent 55%), radial-gradient(circle at 80% 0%, rgba(16, 185, 129, 0.35), transparent 50%), radial-gradient(circle at 0% 80%, rgba(250, 204, 21, 0.25), transparent 45%)"
      }
    }
  },
  plugins: []
};
