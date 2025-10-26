// Theme Hook for Light/Dark Mode Management
\
import { useState, useEffect, createContext, useContext } from 'react'

// Theme context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
})

// Theme provider component (ready for use)
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    setTheme(savedTheme || systemTheme)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// Theme-aware component utilities
export const themeClasses = {
  // Background classes
  background: {
    light: 'bg-white',
    dark: 'dark:bg-slate-900',
  },
  
  // Text classes  
  text: {
    primary: {
      light: 'text-slate-900',
      dark: 'dark:text-slate-100',
    },
    secondary: {
      light: 'text-slate-600', 
      dark: 'dark:text-slate-400',
    },
  },
  
  // Border classes
  border: {
    light: 'border-slate-200',
    dark: 'dark:border-slate-700',
  },
  
  // Glass morphism classes
  glass: {
    light: 'bg-white/25 backdrop-blur-md border-white/20',
    dark: 'dark:bg-slate-800/25 dark:backdrop-blur-md dark:border-slate-700/20',
  },
}

// Utility function to combine theme classes
export function getThemeClass(category, variant = 'primary') {
  const classes = themeClasses[category]
  
  if (!classes) return ''
  
  if (typeof classes === 'object' && classes.light && classes.dark) {
    return `${classes.light} ${classes.dark}`
  }
  
  if (typeof classes === 'object' && classes[variant]) {
    const variantClasses = classes[variant]
    return `${variantClasses.light} ${variantClasses.dark}`
  }
  
  return ''
}

// Theme toggle component (ready to use)
export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-250
        hover:bg-slate-100 dark:hover:bg-slate-800
        focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // Moon icon for dark mode toggle
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun icon for light mode toggle  
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  )
}