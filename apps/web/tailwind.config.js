/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#0a0d14',
          panel: 'rgba(16, 22, 34, 0.85)',
          panelElevated: 'rgba(23, 32, 51, 0.95)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(56, 189, 248, 0.4)',
          accent: '#06b6d4',
          accentHover: '#22d3ee',
          textPrimary: '#f8fafc',
          textSecondary: '#94a3b8',
          textMuted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
