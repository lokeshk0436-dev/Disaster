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
        aypo: {
          dark: '#05070E',
          card: '#0C0F17',
          surface: '#121722',
          border: '#1F2636',
          primary: '#00F0FF',
          accent: '#38BDF8',
          teal: '#00E599',
          warning: '#FFB800',
          danger: '#FF2A55',
          success: '#00E599',
          muted: '#94A3B8',
          obsidian: '#020306',
          titanium: '#0E1118',
          carbon: '#161B26'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radar 3s linear infinite',
        'voice-wave': 'voiceWave 1.2s ease-in-out infinite alternate',
        'siri-glow': 'siriGlow 3s ease-in-out infinite alternate',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        voiceWave: {
          '0%': { height: '8px', opacity: '0.4' },
          '50%': { height: '32px', opacity: '1' },
          '100%': { height: '14px', opacity: '0.6' }
        },
        siriGlow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(236, 72, 153, 0.5), 0 0 60px rgba(0, 240, 255, 0.4)' }
        },
        slideDown: {
          '0%': { transform: 'translate(-50%, -100%)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}


