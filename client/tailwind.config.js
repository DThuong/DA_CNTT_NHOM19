/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    fontFamily: {
      main: ["Poppins", "serif"], // Define custom font family
    },
    extend: {
      width: {
        main: "1220px", // Custom width
      },
      backgroundColor: {
        main: "#ee3131", // Custom background color
        overlay: 'rgba(0,0,0,0.3)'
      },
      textColor: {
        main: "#ee3131", // Custom text color
      },
      scale: {
        175: "1.75", // 175%
        200: "2",    // 200%
        250: "2.5",  // 250%
        300: "3",    // 300%
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      keyframes: {
        "slide-top": {
          "0%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)", // Removed unnecessary semicolon
          },
          "100%": {
            "-webkit-transform": "translateY(-100px)",
            transform: "translateY(-100px)", // Removed unnecessary semicolon
          },
        },

        "slide-top-sm": {
          "0%": {
            "-webkit-transform": "translateY(4px)",
            transform: "translateY(4px)", // Removed unnecessary semicolon
          },
          "100%": {
            "-webkit-transform": "translateY(0)",
            transform: "translateY(0)", // Removed unnecessary semicolon
          },
        },

        "slide-right": {
          "0%": {
            "-webkit-transform": "translateX(-1000px)",
            transform: "translateX(-1000px)", // Removed unnecessary semicolon
          },
          "100%": {
            "-webkit-transform": "translateX(0)",
            transform: "translateX(0)", // Removed unnecessary semicolon
          },
        },
      },
      animation: {
        "slide-top": "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-right": "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-top-sm": "slide-top-sm 0.2s linear both",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
};
