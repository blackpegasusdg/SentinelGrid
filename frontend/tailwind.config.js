/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#080B10',
        'bg-secondary': '#10151D',
        'bg-card':      '#141B25',
        'bg-card-hover':'#19212E',
        'accent-cyan':  '#35D6E8',
        'accent-blue':  '#638CFF',
        'success':      '#10B981',
        'warning':      '#F59E0B',
        'critical':     '#EF4444',
        'text-primary': '#E8EDF5',
        'text-secondary':'#6B7A99',
        'border-default':'rgba(255,255,255,0.06)',
        'border-active': 'rgba(53,214,232,0.3)',
      },
      fontFamily: {
        'space':   ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        'inter':   ['Inter', 'system-ui', 'sans-serif'],
        'sora':    ['Sora', 'system-ui', 'sans-serif'],
        'mono':    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        'hero-radial':  'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(53,214,232,0.15), transparent)',
        'card-spotlight': 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(53,214,232,0.06), transparent 40%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(53,214,232,0.2)',
        'glow-cyan':   '0 0 20px rgba(53,214,232,0.4), 0 0 60px rgba(53,214,232,0.15)',
        'glow-blue':   '0 0 20px rgba(99,140,255,0.4)',
        'inner-cyan':  'inset 0 0 20px rgba(53,214,232,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':     'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
