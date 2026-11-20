/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // REA Master Black & White Design System Palette
        rea: {
          primary: '#111111',
          'primary-dark': '#000000',
          secondary: '#FFFFFF',
          accent: '#222222',
          light: '#F0F0F0',
          bg: '#F7F7F7',
          card: '#FFFFFF',
          text: '#111111',
          'muted-text': '#666666',
          border: '#E5E5E5',
          hover: '#F0F0F0',
          'muted-bg': '#F5F5F5'
        },
        status: {
          success: '#16834A',
          warning: '#D99A25',
          danger: '#D94848',
          info: '#3984CC'
        },
        brand: {
          50: '#F7F7F7',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#111111',
          700: '#0A0A0A',
          800: '#050505',
          900: '#000000',
          950: '#000000'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      fontSize: {
        'page-title': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }], // 32px
        'section-title': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 22px
        'card-title': ['1.0625rem', { lineHeight: '1.5rem', fontWeight: '600' }], // 17px
        'body-base': ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '400' }], // 15px
        'body-sm': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '400' }], // 13px
        'nav-item': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }] // 14px
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(23, 35, 29, 0.04), 0 1px 2px -1px rgba(23, 35, 29, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(23, 35, 29, 0.06), 0 4px 6px -4px rgba(23, 35, 29, 0.04)',
        'modal': '0 20px 25px -5px rgba(23, 35, 29, 0.1), 0 8px 10px -6px rgba(23, 35, 29, 0.1)'
      }
    },
  },
  plugins: [],
}