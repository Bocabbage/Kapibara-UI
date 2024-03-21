/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'oswald-bold': ['Oswald-Bold', 'sans-serif'],
      'oswald-regular': ['Oswald-Regular', 'sans-serif'],
    },
    // colors: {
    //   'tutti-frutti-g': '#9dbdba'
    // },
    extend: {},
  },
  plugins: [],
}

