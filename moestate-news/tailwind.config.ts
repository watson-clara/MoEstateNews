import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          card: 'var(--color-card)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        border: 'var(--color-border)',
        shadow: {
          DEFAULT: 'var(--shadow-default)',
          card: 'var(--shadow-card)',
          active: 'var(--shadow-active)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius-default)',
        card: 'var(--radius-card)',
        input: 'var(--radius-input)',
        button: 'var(--radius-button)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        default: 'var(--shadow-default)',
        card: 'var(--shadow-card)',
        active: 'var(--shadow-active)',
      },
    },
  },
  plugins: [],
}
export default config

