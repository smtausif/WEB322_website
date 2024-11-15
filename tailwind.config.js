/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
  './views/**/*.ejs',
  './src/**/*.js',
  './modules/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['dim'],
  },
};

