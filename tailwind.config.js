module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    namedGroups: ['option'],
  },
  variants: {},
  plugins: [require('tailwindcss-named-groups')],
};
