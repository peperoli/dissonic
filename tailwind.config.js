/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Albert Sans', 'sans-serif'],
    },
    colors: {
      venom: '#99F162',
      deepPurple: '#661881',
      blue: {
        300: '#75C8F0',
      },
      slate: {
        50: '#F0F3F5',
        300: '#A3B8C2',
        500: '#668899',
        600: '#516D7B',
        700: '#3D525C',
        750: '#33434D',
        800: '#29363D',
        850: '#1F282E',
      },
      red: '#F78F6E',
      black: '#000',
      transparent: 'transparent',
    },
    boxShadow: {
      'md': '0 2px 8px rgba(0, 0, 0, 0.1)',
      'lg': '0 4px 16px rgba(0, 0, 0, 0.1)',
      'shine': '0 0 16px',
    },
    extend: {
      height: {
        'text': '1em',
      },
    },
  },
  plugins: [],
}
