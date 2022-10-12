/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // @info: specify an option for the class-based dark mode
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // @info: Adding a utility class for the font
        mplus: ["'M PLUS Rounded 1c'", 'Verdana', 'sans-serif']
      }
    }
  },
  plugins: []
}
