/**
 * Button Component - Unified button with full variant support
 * 
 * Supports all existing button patterns in the application:
 * - Google-style gradient buttons (btn-google)
 * - Secondary/ghost buttons (btn-secondary)
 * - Primary solid buttons (btn-primary)
 * - Custom inline styles via style prop
 * 
 * Features:
 * - Full TypeScript support
 * - Flexible size system (sm, md, lg)
 * - Loading states with spinner
 * - Icon support (start/end positions)
 * - Disabled state handling
 * - Full accessibility (ARIA)
 * - className merging for custom styles
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'google' | 'primary' | 'secondary' | 'ghost' | 'custom'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * - google: Gradient from Google blue to USC green
   * - primary: Solid gradient (existing btn-primary)
   * - secondary: Secondary style (existing btn-secondary)
   * - ghost: Minimal ghost button
   * - custom: No preset styles, relies on className/style
   */
  variant?: ButtonVariant
  
  /**
   * Size of the button
   * - sm: Small (text-sm, py-2 px-4)
   * - md: Medium (text-base, py-3 px-6) [default]
   * - lg: Large (text-lg, py-4 px-8)
   */
  size?: ButtonSize
  
  /**
   * Full width button
   */
  fullWidth?: boolean
  
  /**
   * Loading state - shows spinner and disables interaction
   */
  loading?: boolean
  
  /**
   * Icon to show before children
   */
  startIcon?: ReactNode
  
  /**
   * Icon to show after children
   */
  endIcon?: ReactNode
  
  /**
   * Children content
   */
  children?: ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'google',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      children,
      className = '',
      style,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    // Variant styles - matches existing patterns exactly
    const variantClasses = {
      google: 'btn-google',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10',
      custom: '', // No preset styles for custom
    }

    // Size classes - matches existing usage patterns
    const sizeClasses = {
      sm: 'text-sm py-2 px-4',
      md: 'text-base py-3 px-6',
      lg: 'text-lg py-4 px-8',
    }

    // Base classes that apply to all buttons (except custom)
    const baseClasses = variant !== 'custom' 
      ? 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      : 'inline-flex items-center justify-center gap-2'

    // Disabled/loading state
    const stateClasses = (disabled || loading)
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer'

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : ''

    // Combine all classes
    const combinedClasses = [
      baseClasses,
      variant !== 'custom' && variantClasses[variant],
      variant !== 'custom' && sizeClasses[size],
      stateClasses,
      widthClasses,
      className, // User's custom classes override/extend
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClasses}
        style={style}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...rest}
      >
        {/* Loading spinner */}
        {loading && (
          <div
            className="animate-spin rounded-full border-2 border-current border-t-transparent"
            style={{ width: '1em', height: '1em' }}
            aria-hidden="true"
          />
        )}

        {/* Start icon */}
        {!loading && startIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {startIcon}
          </span>
        )}

        {/* Button content */}
        {children && <span>{children}</span>}

        {/* End icon */}
        {!loading && endIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
