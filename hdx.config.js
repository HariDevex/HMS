export default {
  // HDX CSS Configuration
  prefix: 'hdx_',

  // Content files to scan for used classes
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Force classes to always be included (not in content)
  safelist: [],

  // Dark mode strategy: 'class' | 'media' | 'both'
  darkMode: 'class',

  // Include the global reset/base styles
  reset: true,

  // Theme customization (deep-merged with defaults)
  theme: {
    colors: {
      // Brand / semantic (project tokens)
      primary: '#2563EB',
      'primary-dark': '#1D4ED8',
      'primary-hover': '#1D4ED8',
      'primary-light': '#EFF6FF',
      'primary-lighter': '#F5F8FC',
      navy: '#0F2747',
      'navy-light': '#1E3A5F',
      surface: '#F5F8FC',
      card: '#FFFFFF',
      ink: '#172033',
      'ink-secondary': '#64748B',
      line: '#E2E8F0',
      success: '#16A34A',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#0891B2',
      input: '#CBD5E1',
      white: '#FFFFFF',
      black: '#000000',

      // Tailwind palette layers actually used in the app
      'slate-50': '#F8FAFC',
      'slate-100': '#F1F5F9',
      'slate-200': '#E2E8F0',
      'slate-300': '#CBD5E1',
      'slate-400': '#94A3B8',
      'slate-600': '#475569',
      'slate-800': '#1E293B',
      'slate-900': '#0F172A',
      'blue-50': '#EFF6FF',
      'blue-100': '#DBEAFE',
      'blue-200': '#BFDBFE',
      'blue-300': '#93C5FD',
      'blue-700': '#1D4ED8',
      'red-50': '#FEF2F2',
      'red-100': '#FEE2E2',
      'red-200': '#FECACA',
      'red-700': '#B91C1C',
      'green-50': '#F0FDF4',
      'green-200': '#BBF7D0',
      'green-700': '#15803D',
      'cyan-50': '#ECFEFF',
      'cyan-100': '#CFFAFE',
      'cyan-200': '#A5F3FC',
      'cyan-500': '#06B6D4',
      'cyan-700': '#0E7490',
      'amber-50': '#FFFBEB',
      'amber-100': '#FEF3C7',
      'amber-200': '#FDE68A',
      'amber-700': '#B45309',
      'violet-50': '#F5F3FF',
      'violet-100': '#EDE9FE',
      'violet-200': '#DDD6FE',
      'violet-600': '#7C3AED',
      'violet-700': '#6D28D9',
      'emerald-50': '#ECFDF5',
      'emerald-100': '#D1FAE5',
      'emerald-200': '#A7F3D0',
      'emerald-700': '#047857',
      'rose-100': '#FFE4E6',
      'rose-700': '#BE123C',
      background: '#F5F8FC',

      // Opacity modifiers expressed as named tints
      'primary-20': 'rgba(37, 99, 235, 0.20)',
      'primary-light-40': 'rgba(239, 246, 255, 0.40)',
      'info-10': 'rgba(8, 145, 178, 0.10)',
      'white-5': 'rgba(255, 255, 255, 0.05)',
      'white-10': 'rgba(255, 255, 255, 0.10)',
      'white-50': 'rgba(255, 255, 255, 0.50)',
      'slate-50-50': 'rgba(248, 250, 252, 0.50)',
      'slate-50-60': 'rgba(248, 250, 252, 0.60)',
      'slate-900-40': 'rgba(15, 23, 42, 0.40)',
      'slate-900-80': 'rgba(15, 23, 42, 0.80)',
      'error-30': 'rgba(220, 38, 38, 0.30)',
    },

    spacing: {
      0.5: '0.125rem',
      1.5: '0.375rem',
      2.5: '0.625rem',
      3.5: '0.875rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      11: '2.75rem',
      14: '3.5rem',
      20: '5rem',
      40: '10rem',
      44: '11rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      // Exact-pixel + percentage-ish arbitrary values, kept as theme keys
      '18px': '18px',
      '44px': '44px',
      '90px': '90px',
      '160px': '160px',
      '200px': '200px',
      '220px': '220px',
      '230px': '230px',
      '260px': '260px',
      '270px': '270px',
      '320px': '320px',
      '420px': '420px',
      '520px': '520px',
      '560px': '560px',
      '580px': '580px',
      '800px': '800px',
      '820px': '820px',
      '860px': '860px',
      '900px': '900px',
      '1440px': '1440px',
      '70vh': '70vh',
      screen: '100vh',
    },

    fontSize: {
      'page-title': '28px',
      'section-title': '20px',
      'card-title': '16px',
      body: '14px',
      'secondary-text': '13px',
      small: '12px',
      'stat-number': '28px',
      11: '11px',
      '14px': '14px',
    },

    radius: {
      card: '14px',
      input: '8px',
      10: '10px',
      8: '8px',
    },

    shadows: {
      card: '0 1px 2px 0 rgba(15, 39, 71, 0.04), 0 1px 3px 0 rgba(15, 39, 71, 0.06)',
      'card-hover':
        '0 4px 12px -2px rgba(15, 39, 71, 0.08), 0 2px 4px -2px rgba(15, 39, 71, 0.06)',
      dropdown:
        '0 8px 24px -4px rgba(15, 39, 71, 0.12), 0 4px 8px -4px rgba(15, 39, 71, 0.08)',
      modal: '0 20px 50px -8px rgba(15, 39, 71, 0.25)',
    },

    zIndex: {
      60: '60',
    },
  },

  // Plugins
  plugins: [],
};