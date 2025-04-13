/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF9F3',
        primary: {
          DEFAULT: '#FF7E5F',
          light: '#FF9E88'
        },
        'booking-blue': '#003580',
        'action-green': '#00A699',
        'highlight-yellow': '#FACC15',
        text: {
          primary: '#222222',
          secondary: '#555555'
        },
        'icon-gray': '#666666',
        dark: {
          background: '#1F1F23',
          text: '#E5E5E5'
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Circular', 'Avenir', 'sans-serif']
      },
      fontSize: {
        'heading-1': ['2.5rem', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }]
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        'full': '9999px'
      },
      boxShadow: {
        'sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'md': '0 15px 30px -8px rgba(0, 0, 0, 0.08)',
        'lg': '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
      },
      backdropBlur: {
        'glass': '10px'
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}