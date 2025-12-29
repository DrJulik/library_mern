/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Library color palette - Custom colors
        library: {
          // Dark scale (blue-tinted dark colors)
          900: '#0a0f14', // Darkest - almost black with blue tint
          800: '#081f2d', // Dark blue
          700: '#093748', // Medium-dark blue
          600: '#195465', // Medium blue
          // Accent color
          accent: '#d26939', // Orange/rust accent
        },
        // Primary color scale - mapped to library colors for semantic use
        primary: {
          DEFAULT: '#195465', // library-600 - main brand color
          // Light shades (generated for hover/light states)
          50: '#e8f2f4',
          100: '#d1e5ea',
          200: '#a3cbd5',
          300: '#75b1c0',
          400: '#4797ab',
          500: '#195465', // Main primary (library-600)
          600: '#195465', // Same as main
          700: '#093748', // library-700 - darker for hover
          800: '#081f2d', // library-800 - darkest for active
          900: '#0a0f14', // library-900 - darkest
        },
      },
    },
  },
  plugins: [],
}

