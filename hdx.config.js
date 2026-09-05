export default {
  // HDX CSS Configuration
  prefix: 'hdx_',

  // Content files to scan for used classes
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Dark mode strategy: 'class' | 'media' | 'both'
  darkMode: 'class',

  // Theme customization (override defaults)
  theme: {
    colors: {
      // primary: '#7C3AED',
      // 'primary-hover': '#6D28D9',
    },
    spacing: {},
    fontSize: {},
    breakpoints: {},
    radius: {},
    shadows: {},
  },

  // Plugins
  plugins: [],
};
