// components/ui/SampleResponsesModal.tsx
'use client'
import { useState, useEffect } from 'react'
import { Close as CloseIcon, Psychology as AIIcon } from '@mui/icons-material'

interface SampleResponsesModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  samples: string[]
  theme?: string
}

export default function SampleResponsesModal({ 
  isOpen, 
  onClose, 
  title, 
  samples,
  theme 
}: SampleResponsesModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen && !isVisible) return null
  // Map theme keys to accent colors and subtle backgrounds
  const themeMap: Record<string, { colorVar: string; accentRgb: string }> = {
    improvements: { colorVar: 'var(--color-usc-orange)', accentRgb: '255,152,0' },
    recommendations: { colorVar: 'var(--color-google-blue)', accentRgb: '66,133,244' },
    quick: { colorVar: 'var(--color-google-yellow)', accentRgb: '250,204,21' },
    longterm: { colorVar: 'var(--color-google-purple)', accentRgb: '168,85,247' },
    strengths: { colorVar: 'var(--color-usc-green)', accentRgb: '34,197,94' }
  }

  const themeKey = theme || 'recommendations'
  const themeColors = themeMap[themeKey] || themeMap.recommendations
  const badgeBg = `rgba(${themeColors.accentRgb}, 0.15)`
  const badgeBorder = themeColors.colorVar
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        animation: isVisible ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card-dark rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        style={{
          animation: isVisible ? 'slideUp 0.3s ease-out' : 'slideDown 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b"
             style={{ borderBottomColor: 'var(--color-border-light)' }}>
          <div className="flex items-start gap-3">
            <AIIcon sx={{ fontSize: 24, color: themeColors.colorVar }} />
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h3>
              {theme && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Theme: {theme}
                </p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {samples.length} sample response{samples.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--color-text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {samples.length > 0 ? (
            <div className="space-y-4">
              {samples.map((sample, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        borderLeftColor: badgeBorder
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: badgeBg,
                            color: themeColors.colorVar
                          }}>
                      #{index + 1}
                    </span>
                    <p className="flex-1" style={{ color: 'var(--color-text-primary)' }}>
                      "{sample}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
              No sample responses available for this item.
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 1;
            transform: translateY(0);
          }
          to { 
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  )
}
