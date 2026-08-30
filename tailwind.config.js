/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matches the project pages' palette (see kalp-residency tailwind.config).
        ink: '#1E1E1E',
        bg: '#FAFAFA',
        accent: '#E63946',
        'accent-dark': '#C42D39',
        text: '#1E1E1E',
        muted: '#6B7280',
        card: '#FFFFFF',
        line: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        alt: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -12px rgba(0,0,0,0.10)',
        lift: '0 8px 20px rgba(0,0,0,0.06), 0 30px 60px -20px rgba(0,0,0,0.18)',
        accent: '0 18px 40px -14px rgba(230,57,70,0.45)',
      },
      borderRadius: {
        xl2: '1.75rem',
        xl3: '2.5rem',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        shell: '1440px',
      },
      keyframes: {
        'scroll-wheel': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(0, -24px)' },
        },
      },
      animation: {
        'scroll-wheel': 'scroll-wheel 1.8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
