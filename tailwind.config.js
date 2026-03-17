/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // deep blue
        secondary: '#FFFFFF',
        accent: '#F97316', // orange
      },
    },
  },
  plugins: [],
};
