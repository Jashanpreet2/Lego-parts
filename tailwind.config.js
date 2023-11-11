/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/views/*.ejs","public/views/partials/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['fantasy'],
  }
}

