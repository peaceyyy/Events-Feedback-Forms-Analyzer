/**
 * DataUnavailableCard - Reusable fallback UI for missing chart data
 * 
 * Displays a helpful message when optional analytics data is not available
 * (e.g., when GDG exports lack certain fields that unified forms collect)
 */

import { Info as InfoIcon } from '@mui/icons-material'

interface DataUnavailableCardProps {
  title: string
  message?: string
  icon?: React.ReactNode
  className?: string
}

export default function DataUnavailableCard({
  title,
  message = "This data was not collected in this form.",
  icon,
  className = ""
}: DataUnavailableCardProps) {
  return (
    <div 
      className={`glass-card-dark rounded-2xl p-8 text-center ${className}`}
      style={{ 
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Icon */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ 
          background: 'rgba(103, 58, 183, 0.1)',
          border: '2px solid rgba(103, 58, 183, 0.3)'
        }}
      >
        {icon || <InfoIcon sx={{ fontSize: 32, color: 'rgba(103, 58, 183, 0.8)' }} />}
      </div>

      {/* Title */}
      <h3 
        className="text-xl font-semibold mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>

      {/* Message */}
      <p 
        className="text-sm max-w-md"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {message}
      </p>

      {/* Helpful hint */}
      <p 
        className="text-xs mt-4 italic"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        This is normal for certain form types (e.g., GDG exports vs custom feedback forms)
      </p>
    </div>
  )
}
