module.exports = {
  content: ['./index.html', './src/**/*.{html,js,ts}'],
  theme: {
    colors: {
      primary: '#D73F3F',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    fontFamily: {
      primary: ['Barlow Condensed', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
  prefix: 'tw-',
};
