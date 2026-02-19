/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/lib/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sido-green': '#008641',
        'sido-gold': '#F6B733',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.08)',
      },
    },
  },
  plugins: [],
}
