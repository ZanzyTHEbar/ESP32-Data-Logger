/** @type {import('tailwindcss').Config} */

const labelsClasses = [
  "indigo",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
];

module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    //Because we made a dynamic class with the label we need to add those classes
    // to the safe list so the purge does not remove that
    safelist: [
      ...labelsClasses.map((lbl) => `bg-${lbl}-500`),
      ...labelsClasses.map((lbl) => `bg-${lbl}-200`),
      ...labelsClasses.map((lbl) => `text-${lbl}-400`)
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans"]
      },
      gridTemplateColumns: {
        "1/5": "1fr 5fr"
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}


//content: [
//  "./index.html",
//  "./src/**/*.{js,ts,jsx,tsx}",
//],
