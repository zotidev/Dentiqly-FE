/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dental: {
          primary: '#2563FF',
          secondary: '#02E3FF',
          'primary-light': '#5A8BFF',
          'primary-dark': '#1D4ED8',
        }
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-[#2563FF]',
    'bg-[#02E3FF]',
    'bg-[#5A8BFF]',
    'bg-[#1D4ED8]',
    'bg-[#0A0F2D]',
    'text-[#2563FF]',
    'text-[#02E3FF]',
    'text-[#0A0F2D]',
    'border-[#2563FF]',
    'border-[#02E3FF]',
    'ring-[#2563FF]',
    'hover:bg-[#1D4ED8]',
    'hover:border-[#2563FF]',
    // Add more color variations as needed
    'bg-[#F4F7FB]',
    'bg-[#F3F4F6]',
    'bg-[#E5E7EB]',
    'bg-[#D1D5DB]',
    'text-[#374151]',
    'text-[#4B5563]',
    'text-[#5C6B7B]',
    'text-[#9CA3AF]',
    'border-[#E5E7EB]',
    'border-[#D1D5DB]',
    'border-[#9CA3AF]',
    'text-[#EF4444]',
    'border-[#EF4444]',
    'text-[#10B981]',
    'bg-[#10B981]',
    'ring-[#3B82F6]',
    'bg-[#3B82F6]',
    // Admin panel colors
    'bg-[#2563FF]/10',
    'bg-[#2563FF]/5',
    'text-[#2563FF]',
    'border-[#2563FF]/50',
    'hover:bg-[#2563FF]/5',
    'hover:border-[#2563FF]/50',
    'line-clamp-2',
  ]
};