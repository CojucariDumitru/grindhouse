/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0D0D0D',
        red: '#E63312',
        yellow: '#FFD600',
        white: '#F5F5F0',
        grey: '#1A1A1A',
        'grey-mid': '#333333',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 40px rgba(230, 51, 18, 0.55)',
        'neon-sm': '0 0 18px rgba(230, 51, 18, 0.45)',
        'neon-yellow': '0 0 30px rgba(255, 214, 0, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.45' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'marquee-left': 'marquee-left 20s linear infinite',
        'marquee-right': 'marquee-right 20s linear infinite',
        flicker: 'flicker 3s linear infinite',
      },
    },
  },
  plugins: [],
};
