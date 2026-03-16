/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        bg2: '#F5F5F7',
        bg3: '#EBEBED',
        bg4: '#D2D2D7',
        ink: '#1D1D1F',
        muted: 'rgba(29,29,31,0.55)',
        lime: '#1D1D1F',
        lime2: '#000000',
        red: '#FF3B30',
        border: 'rgba(29,29,31,0.1)',
        border2: 'rgba(29,29,31,0.2)',
      },
      fontFamily: {
        disp: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        edit: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.3em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}