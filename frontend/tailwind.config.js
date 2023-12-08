/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkmode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'custom-blue': '#1fb6ff',
        },
        spacing: {
          '128': '32rem',
        },
      },
    },  
    variants: {
      extend: {
        backgroundColor: ['responsive', 'hover', 'focus'],
        fontSize: ['responsive', 'hover'],
      },
    },  
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };