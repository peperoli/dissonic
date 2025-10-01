/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['var(--font-albert-sans)'],
      mono: ['var(--font-fira-code)'],
    },
    colors: {
      venom: {
        DEFAULT: '#99F162',
        600: '#3BB31A',
      },
      purple: {
        DEFAULT: '#DBA1F7',
        700: '#661881',
      },
      blue: {
        DEFAULT: '#75C8F0',
      },
      white: '#F0F3F5',
      slate: {
        300: '#A3B8C2',
        500: '#668899',
        600: '#516D7B',
        650: '#47606B',
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
      current: 'currentColor',
    },
    boxShadow: {
      md: '0 2px 8px rgba(0, 0, 0, 0.2)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.2)',
      xl: '0 8px 32px rgba(0, 0, 0, 0.2)',
      shine: '0 0 16px',
    },
    extend: {
      fontSize: {
        sm: ['0.875rem', '1.125rem'],
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        22: '5.5rem',
      },
      minWidth: {
        48: '12rem',
      },
      height: {
        icon: '1.33em',
      },
      size: {
        icon: '1.25em',
      },
      minHeight: {
        96: '24rem',
      },
      aspectRatio: {
        '2/1': '2 / 1',
        '4/3': '4 / 3',
        '3/4': '3 / 4',
      },
      borderWidth: {
        3: '3px',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(80% 100% at top, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
