/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0B0F14',
        'secondary-bg': '#0E1218',
        'card-header': '#101419',
        'neon-accent': '#39FF14',
        'light-text': '#E5E7EB',
        'danger': '#EF4444',
      },
    },
  },
  plugins: [],
};