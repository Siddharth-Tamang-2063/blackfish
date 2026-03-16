/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Apple-style black & white palette
        bg: '#FFFFFF',   // pure white background
        bg2: '#F5F5F7',   // apple light gray
        bg3: '#E8E8ED',   // slightly darker gray
        bg4: '#D2D2D7',   // border-ish
        ink: '#1D1D1F',   // apple near-black
        muted: 'rgba(29,29,31,0.55)',
        lime: '#1D1D1F',   // accent = black (buttons etc)
        lime2: '#000000',
        red: '#FF3B30',   // keep red for sale badges
        border: 'rgba(29,29,31,0.08)',
        border2: 'rgba(29,29,31,0.18)',
      },
      fontFamily: {
        disp: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        edit: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.3em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16,1,0.3,1)',
      },
      fontSize: {
        '10vw': '10vw',
        '13vw': '13vw',
      },
    },
  },
  plugins: [],
}