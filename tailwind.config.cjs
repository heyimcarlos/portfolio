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
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        shake: {
          '0%': { transform: 'translate(0rem)' },
          '25%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
          '100%': { transform: 'translate(0rem)' }
        }
      },
      animation: {
        wiggle: 'wiggle 0.2s linear 0s 1 normal none running',
        shake: 'shake 0.2s linear 0s 1 normal none running'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
