// components/ui/TruncatedText.tsx
'use client'
import { useState } from 'react'

interface TruncatedTextProps {
  text: string
  maxLength?: number
  className?: string
  style?: React.CSSProperties
}

export default function TruncatedText({ 
  text, 
  maxLength = 200, 
  className = '',
  style = {}
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = text.length > maxLength

  if (!shouldTruncate) {
    return <p className={className} style={style}>{text}</p>
  }

  return (
    <div className={className} style={style}>
      <p style={{ display: 'inline' }}>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-sm font-medium transition-opacity hover:opacity-80 inline-flex items-center gap-1"
        style={{ 
          color: 'var(--color-google-blue)',
          textDecoration: 'underline'
        }}
      >
        {isExpanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  )
}
