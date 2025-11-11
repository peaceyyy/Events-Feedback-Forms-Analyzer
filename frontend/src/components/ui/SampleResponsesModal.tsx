// components/ui/SampleResponsesModal.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      // Focus close button when modal opens for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      }
      
      // Trap focus inside modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return
        
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
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
            <AIIcon sx={{ fontSize: 24, color: themeColors.colorVar }} aria-hidden="true" />
            <div>
              <h3 id="modal-title" className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h3>
              {theme && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Theme: {theme}
                </p>
              )}
              <p id="modal-description" className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {samples.length} sample response{samples.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
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
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]"
          role="region"
          aria-label="Sample responses list"
          tabIndex={0}
        >
              {samples.length > 0 ? (
            <div className="space-y-4" role="list">
              {samples.map((sample, index) => (
                <div 
                  key={index}
                  role="listitem"
                  className="p-4 rounded-lg border-l-4 focus-within:ring-2 focus-within:ring-offset-2"
                  style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        borderLeftColor: badgeBorder
                  }}
                  tabIndex={0}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded flex-shrink-0"
                          style={{ 
                            backgroundColor: badgeBg,
                            color: themeColors.colorVar
                          }}
                          aria-label={`Response ${index + 1} of ${samples.length}`}>
                      #{index + 1}
                    </span>
                    <p className="flex-1 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                      "{sample}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }} role="status">
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
