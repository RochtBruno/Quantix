/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-emerald-100', 'text-emerald-500', 'text-emerald-600',
    'bg-red-100', 'text-red-500', 'text-red-600',
    'bg-blue-100', 'text-blue-500', 'text-blue-600',
  ],
  plugins: [],
}