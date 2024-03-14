/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          lg: "1124px",
          xl: "1124px",
          "2xl": "1124px",
        },
      },
      boxShadow: {
        pinterest: "rgb(0 0 0 / 10%) 0px 5px 20px 0px",
      },
      colors: {
        light: {
          strong: "#cacaca",
          medium: "#f2f2f2",
        },
        dark: {
          strong: "#1a1a1a",
          medium: "#222222",
        },
      },
    },
  },

  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },

  plugins: [],
};
