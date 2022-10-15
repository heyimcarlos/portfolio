/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // @info: specify an option for the class-based dark mode
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'custom-teal': '#5de4c7',
        'custom-zinc': '#252b37'
      },
      fontFamily: {
        // @info: Adding a utility class for the font
        mplus: ["'M PLUS Rounded 1c'", 'Verdana', 'sans-serif']
      }
    }
  },
  plugins: []
}
