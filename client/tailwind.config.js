/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brain: {
          bg: "#08090c",
          dark: "#0d0e12",
          card: "#12141a",
          cardHover: "#181b24",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          red: "#ef4444",
          redDark: "#dc2626",
          redGlow: "#ff3b3b",
          cyan: "#06b6d4",
          cyanLight: "#38bdf8",
          gold: "#f59e0b",
          goldLight: "#fbbf24",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'red-glow': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'gold-glow': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

