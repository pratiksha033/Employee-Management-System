
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // ✅ ensures Tailwind scans your React code
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
