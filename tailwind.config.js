/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5B',
          dark: '#E04912'
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#7ED7D1',
          dark: '#3AA39C'
        },
        accent: '#FFD93D',
        saiyan: {
          gold: '#FFD700',
          blue: '#4169E1',
          orange: '#FF6B35',
          red: '#DC143C',
          purple: '#8A2BE2'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'power': '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
        'saiyan': '0 0 50px rgba(255, 107, 53, 0.5), inset 0 0 50px rgba(255, 215, 0, 0.1)'
      },
borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'power-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
            transform: 'scale(1.02)'
          }
        },
        'saiyan-glow': {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 60px rgba(255, 107, 53, 0.8)'
          }
        },
        'confetti-fall': {
          '0%': { 
            transform: 'translateY(-100vh) rotate(0deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          }
        },
        'achievement-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 107, 53, 0.2)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 107, 53, 0.4)',
            transform: 'scale(1.05)'
          }
        },
        'badge-bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' }
        },
        'power-surge': {
          '0%': { 
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.3)',
            transform: 'scale(1) rotate(0deg)'
          },
          '50%': { 
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 107, 53, 0.6)',
            transform: 'scale(1.1) rotate(180deg)'
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)',
            transform: 'scale(1) rotate(360deg)'
          }
        },
        'exercise-demo-pushup': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-20px) rotate(0deg)' },
          '75%': { transform: 'translateY(-10px) rotate(2deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' }
        },
        'exercise-demo-situp': {
          '0%': { transform: 'rotate(0deg) translateY(0px)' },
          '50%': { transform: 'rotate(45deg) translateY(-5px)' },
          '100%': { transform: 'rotate(0deg) translateY(0px)' }
        },
        'exercise-demo-crunch': {
          '0%': { transform: 'scaleY(1) translateY(0px)' },
          '50%': { transform: 'scaleY(0.8) translateY(-3px)' },
          '100%': { transform: 'scaleY(1) translateY(0px)' }
        },
        'exercise-demo-run': {
          '0%': { transform: 'translateX(-5px) scaleX(1)' },
          '25%': { transform: 'translateX(0px) scaleX(1.05)' },
          '50%': { transform: 'translateX(5px) scaleX(1)' },
          '75%': { transform: 'translateX(0px) scaleX(0.95)' },
          '100%': { transform: 'translateX(-5px) scaleX(1)' }
        },
        'mistake-warning': {
          '0%, 100%': { transform: 'rotate(0deg)', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
          '25%': { transform: 'rotate(1deg)', backgroundColor: 'rgba(239, 68, 68, 0.2)' },
          '75%': { transform: 'rotate(-1deg)', backgroundColor: 'rgba(239, 68, 68, 0.2)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'power-pulse': 'power-pulse 2s ease-in-out infinite',
        'saiyan-glow': 'saiyan-glow 1.5s ease-in-out infinite',
        'confetti-fall': 'confetti-fall 3s linear infinite',
        'achievement-glow': 'achievement-glow 2s ease-in-out infinite',
        'badge-bounce': 'badge-bounce 1s ease-in-out',
        'power-surge': 'power-surge 1.5s ease-in-out',
        'exercise-demo-pushup': 'exercise-demo-pushup 2s ease-in-out infinite',
        'exercise-demo-situp': 'exercise-demo-situp 2.5s ease-in-out infinite',
        'exercise-demo-crunch': 'exercise-demo-crunch 1.8s ease-in-out infinite',
        'exercise-demo-run': 'exercise-demo-run 1.5s ease-in-out infinite',
'mistake-warning': 'mistake-warning 0.5s ease-in-out infinite'
      }
  },
  plugins: [tailwindcssAnimate],
}