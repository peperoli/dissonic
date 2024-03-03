/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-albert-sans)'],
    },
    colors: {
      venom: {
        'DEFAULT': '#99F162',
        600: '#3BB31A'
      },
      purple: '#C462F1',
      deepPurple: '#661881',
      blue: {
        DEFAULT: '#75C8F0',
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
        900: '#141B1F',
      },
      red: '#F78F6E',
      yellow: '#EEF162',
      black: '#000',
      transparent: 'transparent',
    },
    boxShadow: {
      'md': '0 2px 8px rgba(0, 0, 0, 0.2)',
      'lg': '0 4px 16px rgba(0, 0, 0, 0.2)',
      'xl': '0 8px 32px rgba(0, 0, 0, 0.2)',
      'shine': '0 0 16px',
    },
    extend: {
      spacing: {
        15: '3.75rem',
        22: '5.5rem',
      },
      minWidth: {
        48: '12rem',
      },
      height: {
        'icon': '1.33em',
      },
      size: {
        'icon': '1.25em',
      },
      minHeight: {
        96: '24rem',
      },
      aspectRatio: {
        '2/1': '2 / 1',
        '4/3': '4 / 3',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(80% 100% at top, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
