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
      slate: {
        50: '#F0F3F5',
        300: '#A3B8C2',
        500: '#668899',
        700: '#3D525C',
        800: '#29363D',
        900: '#181F23',
      },
      red: '#F78F6E',
      black: '#000',
      transparent: 'transparent',
    },
    boxShadow: {
      'md': '0 0 16px black',
    },
    extend: {
      height: {
        'text': '1em',
      },
    },
  },
  plugins: [],
}
