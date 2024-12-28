/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your component files
  ],
  theme: {
    extend: {}, // You can customize your theme here
  },
  plugins: [require('@tailwindcss/forms')],

};
