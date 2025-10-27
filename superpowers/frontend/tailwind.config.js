/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        choco: {
          primary: '#3D6BFF',
          navy: '#0B145B',
          purple: '#3F2665',
          lightBlue: '#AFC9FF',
          accent: '#C0D5FF',
        },
        hero: {
          good: '#10b981',
          bad: '#ef4444',
          neutral: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
