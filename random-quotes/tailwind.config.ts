
const config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '1px 1px 2px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;