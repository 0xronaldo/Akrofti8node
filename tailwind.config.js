/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'orbitron': ['var(--font-orbitron)', 'Orbitron', 'monospace'],
      },
      colors: {
        // Akroft logo inspired colors
        'akroft-blue': {
          900: '#1E3A8A', // Deep blue from logo
          700: '#1D4ED8',
          500: '#3B82F6', // Medium blue from logo
          400: '#60A5FA',
          300: '#93C5FD',
        },
        'akroft-cyan': {
          500: '#00FFFF', // Pure cyan from logo
          400: '#22D3EE',
          300: '#67E8F9',
        },
        // Keep existing colors for compatibility
        'neon-cyan': '#00FFFF',
        'neon-magenta': '#FF00FF',
        'magenta': {
          500: '#FF00FF',
          600: '#E600E6',
        },
        'cyan': {
          400: '#00FFFF',
          500: '#00FFFF',
          600: '#00E6E6',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00FFFF',
        'neon-blue': '0 0 20px #3B82F6',
        'akroft-glow': '0 0 30px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 3s ease-in-out infinite',
      },
      backgroundImage: {
        'akroft-gradient': 'linear-gradient(to right, #1E3A8A, #3B82F6, #00FFFF)',
        'hero-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #00FFFF 100%)',
      },
    },
  },
  plugins: [],
}