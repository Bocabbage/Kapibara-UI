/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "oswald-bold": ["Oswald-Bold", "sans-serif"],
      "oswald-regular": ["Oswald-Regular", "sans-serif"],
      "worksans-black": ["WorkSans-Black", "sans-serif"],
      "worksans-regular": ["WorkSans-Regular", "sans-serif"],
      "worksans-bold": ["WorkSans-Bold", "sans-serif"],
      "worksans-extrabold": ["WorkSans-ExtraBold", "sans-serif"],
      "worksans-medium": ["WorkSans-Medium", "sans-serif"],
    },
    extend: {
      colors: {
        groovyfunk: {
          1: "#9ac1f0",
          2: "#72fa93",
          3: "#a0e548",
          4: "#e45f2b",
          5: "#f6c445",
        },
        guavaguava: {
          1: "#f0c9ba",
          2: "#ca8f7a",
          3: "#c46f4d",
          4: "#c86a58",
          5: "#c64e2f",
        }
      }
    },
  },
  plugins: [],
};
