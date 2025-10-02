// Theme configuration for Tailwind CSS
// Extends Tailwind with your custom color palette and design tokens

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Your custom color palette
      colors: {
        // Brand colors
        brand: {
          green: '#1a9d57',
          'light-green': '#80bc6e', 
          blue: '#5e94eb',
          'light-blue': '#4285f4',
          yellow: '#d5d581',
          red: '#ed5d51',
          'light-red': '#f28b81',
          cream: '#fee293',
        },
        
        // Semantic colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#5e94eb', // Your blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0', 
          300: '#86efac',
          400: '#4ade80',
          500: '#1a9d57', // Your green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        warning: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d', 
          400: '#fbbf24',
          500: '#d5d581', // Your yellow
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ed5d51', // Your red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5e94eb 0%, #1a9d57 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4285f4 0%, #80bc6e 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fee293 0%, #d5d581 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      
      // Custom shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'primary': '0 4px 14px 0 rgba(94, 148, 235, 0.25)',
        'success': '0 4px 14px 0 rgba(26, 157, 87, 0.25)',
        'error': '0 4px 14px 0 rgba(237, 93, 81, 0.25)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      
      // Custom border radius (semi-rounded Google/Samsung style)
      borderRadius: {
        'xl': '0.75rem',   // 12px - Card default
        '2xl': '1rem',     // 16px - Modal default  
        '3xl': '1.25rem',  // 20px - Large cards
      },
      
      // Custom transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
        sm: '4px', 
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      // Custom font family
       fontFamily: {
        'sans': ['var(--font-product-sans)', 'system-ui', 'sans-serif'],
        'product': ['var(--font-product-sans)', 'sans-serif'],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'bold': '700',
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px  
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      
      // Animation keyframes
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Custom animations
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'slide-in': 'slideIn 250ms ease-out',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
    },
  },
  plugins: [
    // Plugins can be added here when needed
    // require('@tailwindcss/forms'),
  ],
  
  // Dark mode configuration (ready for implementation)
  darkMode: 'class', // Enable class-based dark mode
}