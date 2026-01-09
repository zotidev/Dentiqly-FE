/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dental: {
          primary: '#026498',
          secondary: '#9d9d9d',
          'primary-light': '#0284c7',
          'primary-dark': '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-[#026498]',
    'bg-[#9d9d9d]',
    'bg-[#0284c7]',
    'bg-[#0c4a6e]',
    'text-[#026498]',
    'text-[#9d9d9d]',
    'border-[#026498]',
    'border-[#9d9d9d]',
    'ring-[#026498]',
    'hover:bg-[#0c4a6e]',
    'hover:border-[#026498]',
    // Add more color variations as needed
    'bg-[#f9fafb]',
    'bg-[#f3f4f6]',
    'bg-[#e5e7eb]',
    'bg-[#d1d5db]',
    'text-[#374151]',
    'text-[#4b5563]',
    'text-[#6b7280]',
    'text-[#9ca3af]',
    'border-[#e5e7eb]',
    'border-[#d1d5db]',
    'border-[#9ca3af]',
    'text-[#ef4444]',
    'border-[#ef4444]',
    'text-[#10b981]',
    'bg-[#10b981]',
    'ring-[#3b82f6]',
    'bg-[#3b82f6]',
    // Admin panel colors
    'bg-[#026498]/10',
    'bg-[#026498]/5',
    'text-[#026498]',
    'border-[#026498]/50',
    'hover:bg-[#026498]/5',
    'hover:border-[#026498]/50',
    'line-clamp-2',
  ]
};