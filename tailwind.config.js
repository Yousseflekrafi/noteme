/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1B1A2E',
        indigo: {
          950: '#171A3A',
          900: '#1F2352',
          800: '#272C6B',
          700: '#333A8C',
          600: '#4048AD',
          500: '#5860C9',
        },
        coral: {
          500: '#E8674A',
          600: '#D4573B',
        },
        moss: {
          500: '#4E7A5C',
          600: '#3E6349',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,26,46,0.06), 0 8px 24px -12px rgba(27,26,46,0.18)',
      },
    },
  },
  plugins: [],
}