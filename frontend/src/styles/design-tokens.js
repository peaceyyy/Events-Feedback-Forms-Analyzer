// Design System Color Palette
// Professional Google/Samsung inspired colors with light/dark mode support

export const colors = {
  // Brand Colors - Your specified palette
  primary: {
    green: '#1a9d57',      // Main brand green
    lightGreen: '#80bc6e',  // Secondary green
    blue: '#5e94eb',       // Accent blue
    lightBlue: '#4285f4',  // Google blue
    yellow: '#d5d581',     // Warm yellow
    red: '#ed5d51',        // Alert red
    lightRed: '#f28b81',   // Soft red
    cream: '#fee293',      // Warm cream
  },

  // Light Mode Colors
  light: {
    // Backgrounds
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      overlay: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(255, 255, 255, 0.85)',
    },
    
    // Text Colors
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
      muted: '#cbd5e1',
    },
    
    // UI Elements
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      focus: '#5e94eb',
      error: '#ed5d51',
      success: '#1a9d57',
    },
    
    // Interactive States
    interactive: {
      hover: 'rgba(94, 148, 235, 0.1)',
      active: 'rgba(94, 148, 235, 0.2)',
      disabled: '#f1f5f9',
      focus: 'rgba(94, 148, 235, 0.3)',
    }
  },

  // Dark Mode Colors (prepared for future implementation)
  dark: {
    // Backgrounds
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      card: '#1e293b',
      overlay: 'rgba(15, 23, 42, 0.95)',
      glass: 'rgba(30, 41, 59, 0.85)',
    },
    
    // Text Colors
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      inverse: '#1e293b',
      muted: '#64748b',
    },
    
    // UI Elements
    border: {
      primary: '#334155',
      secondary: '#475569',
      focus: '#5e94eb',
      error: '#f28b81',
      success: '#80bc6e',
    },
    
    // Interactive States
    interactive: {
      hover: 'rgba(94, 148, 235, 0.15)',
      active: 'rgba(94, 148, 235, 0.25)',
      disabled: '#334155',
      focus: 'rgba(94, 148, 235, 0.4)',
    }
  },

  // Semantic Colors (work in both modes)
  semantic: {
    success: '#1a9d57',
    successLight: '#80bc6e',
    warning: '#d5d581',
    warningLight: '#fee293',
    error: '#ed5d51',
    errorLight: '#f28b81',
    info: '#5e94eb',
    infoLight: '#4285f4',
  }
}

// Gradient definitions
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.green} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.primary.lightBlue} 0%, ${colors.primary.lightGreen} 100%)`,
  warm: `linear-gradient(135deg, ${colors.primary.cream} 0%, ${colors.primary.yellow} 100%)`,
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  
  // Dark mode gradients (for future)
  darkPrimary: `linear-gradient(135deg, ${colors.primary.blue} 0%, ${colors.primary.green} 100%)`,
  darkGlass: 'linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(30, 41, 59, 0.1) 100%)',
}

// Shadow system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  
  // Colored shadows for interactive elements
  primary: `0 4px 14px 0 rgba(94, 148, 235, 0.25)`,
  success: `0 4px 14px 0 rgba(26, 157, 87, 0.25)`,
  error: `0 4px 14px 0 rgba(237, 93, 81, 0.25)`,
}

// Border radius system (semi-rounded Google/Samsung style)
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  full: '9999px',
  
  // Component-specific
  card: '0.75rem',
  button: '0.5rem',
  input: '0.5rem',
  modal: '1rem',
}

// Spacing system
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}

// Typography scale
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
}

// Animation and transitions
export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
}

// Glass morphism effects
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: shadows.glass,
  },
  
  dark: {
    background: 'rgba(30, 41, 59, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: shadows.glass,
  }
}