/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#EFF6FF',
          lighter: '#F5F8FC',
          hover: '#1D4ED8',
        },
        navy: {
          DEFAULT: '#0F2747',
          light: '#1E3A5F',
        },
        surface: '#F5F8FC',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#172033',
          secondary: '#64748B',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#0891B2',
        input: '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'section-title': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['14px', { lineHeight: '1.5' }],
        secondary: ['13px', { lineHeight: '1.45' }],
        small: ['12px', { lineHeight: '1.4' }],
        'stat-number': ['28px', { lineHeight: '1.1', fontWeight: '700' }],
      },
      borderRadius: {
        card: '14px',
        input: '8px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 39, 71, 0.04), 0 1px 3px 0 rgba(15, 39, 71, 0.06)',
        'card-hover':
          '0 4px 12px -2px rgba(15, 39, 71, 0.08), 0 2px 4px -2px rgba(15, 39, 71, 0.06)',
        dropdown:
          '0 8px 24px -4px rgba(15, 39, 71, 0.12), 0 4px 8px -4px rgba(15, 39, 71, 0.08)',
        modal:
          '0 20px 50px -8px rgba(15, 39, 71, 0.25)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        shimmer: 'shimmer 1.2s infinite linear',
      },
    },
  },
  plugins: [],
};
