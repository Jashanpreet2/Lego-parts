/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/views/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['fantasy'],
  }
}

