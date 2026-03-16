/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#080808',
        bg2:     '#111111',
        bg3:     '#181818',
        bg4:     '#1e1e1e',
        ink:     '#ECECEC',
        muted:   'rgba(236,236,236,0.35)',
        lime:    '#BAFF29',
        lime2:   '#8FCC00',
        red:     '#FF3B00',
        border:  'rgba(236,236,236,0.08)',
        border2: 'rgba(236,236,236,0.18)',
      },
      fontFamily: {
        disp: ['Bebas Neue', 'Impact', 'sans-serif'],
        edit: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
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
