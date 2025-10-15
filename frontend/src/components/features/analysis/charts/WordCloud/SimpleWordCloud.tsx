// SimpleWordCloud.tsx - Fallback implementation without Carbon Charts
'use client'
import React from 'react'

interface WordCloudData {
  word: string
  value: number
  group?: string
}

interface SimpleWordCloudProps {
  data?: WordCloudData[]
  title?: string
  className?: string
  height?: number
}

export default function SimpleWordCloud({ 
  data = [], 
  title = "One Word Descriptions", 
  className = "",
  height = 400 
}: SimpleWordCloudProps) {

  // If no data provided, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Generate AI analysis to see one-word descriptions from feedback
          </p>
        </div>
      </div>
    )
  }

  // Simple word cloud using CSS and flexbox
  const maxValue = Math.max(...data.map(item => item.value))
  
  const getWordSize = (value: number) => {
    const ratio = value / maxValue
    return Math.max(0.8, ratio * 2.5) // Min size 0.8rem, max 2.5rem
  }

  const getWordColor = (group?: string) => {
    switch (group?.toLowerCase()) {
      case 'positive': return 'var(--color-usc-green)'
      case 'negative': return 'var(--color-google-red)'
      case 'neutral': return 'var(--color-google-blue)'
      default: return 'var(--color-text-primary)'
    }
  }

  return (
    <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      
      <div 
        className="flex flex-wrap items-center justify-center gap-2 p-4"
        style={{ height: `${height}px`, overflow: 'hidden' }}
      >
        {data.map((item, index) => (
          <span
            key={`${item.word}-${index}`}
            className="font-semibold transition-transform hover:scale-110 cursor-default"
            style={{
              fontSize: `${getWordSize(item.value)}rem`,
              color: getWordColor(item.group),
              opacity: 0.8 + (item.value / maxValue) * 0.2, // Opacity based on frequency
              lineHeight: 1.2,
              margin: '0.2rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
            title={`${item.word}: mentioned ${item.value} times`}
          >
            {item.word}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-usc-green)' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-google-blue)' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-google-red)' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Negative</span>
        </div>
      </div>
      
      <div className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
        Simple word cloud visualization
      </div>
    </div>
  )
}