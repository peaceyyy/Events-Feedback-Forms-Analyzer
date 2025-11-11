// components/ui/SampleResponsesModal.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { Close as CloseIcon, Psychology as AIIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

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
  const [searchQuery, setSearchQuery] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setSearchQuery('') // Reset search on open
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

  // Filter samples based on search query
  const filteredSamples = samples.filter(sample =>
    sample.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClearSearch = () => {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  // Highlight search matches in text
  const highlightText = (text: string, query: string) => {
    if (!query) return `"${text}"`
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <span>
        "
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              style={{
                backgroundColor: `rgba(${themeColors.accentRgb}, 0.3)`,
                color: themeColors.colorVar,
                fontWeight: 600,
                padding: '0 2px',
                borderRadius: '2px'
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
        "
      </span>
    )
  }
  return (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: isVisible ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-out'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="flex flex-col h-full w-full"
        style={{
          animation: isVisible ? 'slideUp 0.25s ease-out' : 'slideDown 0.25s ease-out'
        }}
      >
        {/* Header - Fixed at top */}
        <div 
          className="flex-shrink-0 px-8 py-6 border-b"
          style={{ 
            borderBottomColor: 'var(--color-border-light)',
            backgroundColor: 'var(--color-surface-base)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <AIIcon sx={{ fontSize: 28, color: themeColors.colorVar }} aria-hidden="true" />
                <div>
                  <h3 id="modal-title" className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {title}
                  </h3>
                  {theme && (
                    <p className="text-sm mt-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Theme: <span className="font-medium" style={{ color: themeColors.colorVar }}>{theme}</span>
                    </p>
                  )}
                  <p id="modal-description" className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    {filteredSamples.length} of {samples.length} response{samples.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2.5 rounded-lg transition-all"
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
                <CloseIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <SearchIcon sx={{ fontSize: 20, color: 'var(--color-text-tertiary)' }} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search responses..."
                className="w-full pl-12 pr-12 py-3 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border-light)',
                  color: 'var(--color-text-primary)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = themeColors.colorVar
                  e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${themeColors.accentRgb}, 0.15)`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-light)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                aria-label="Search through responses"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all"
                  style={{ color: 'var(--color-text-tertiary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-tertiary)'
                  }}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <ClearIcon sx={{ fontSize: 20 }} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable body */}
        <div 
          className="flex-1 overflow-y-auto px-8 py-6"
          style={{ backgroundColor: 'var(--color-surface-base)' }}
          role="region"
          aria-label="Sample responses list"
          tabIndex={0}
          aria-live="polite"
          aria-atomic="false"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-7xl mx-auto">
            {filteredSamples.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
                {filteredSamples.map((sample, index) => {
                  // Find original index for numbering
                  const originalIndex = samples.indexOf(sample)
                  
                  return (
                    <div 
                      key={originalIndex}
                      role="listitem"
                      className="p-4 rounded-lg border-l-4 transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        borderLeftColor: badgeBorder,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                      tabIndex={0}
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="text-xs font-mono px-2.5 py-1 rounded flex-shrink-0"
                          style={{ 
                            backgroundColor: badgeBg,
                            color: themeColors.colorVar,
                            fontWeight: 600
                          }}
                          aria-label={`Response ${originalIndex + 1} of ${samples.length}`}
                        >
                          #{originalIndex + 1}
                        </span>
                        <p className="flex-1 leading-relaxed text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {searchQuery ? (
                            highlightText(sample, searchQuery)
                          ) : (
                            `"${sample}"`
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <SearchIcon sx={{ fontSize: 56, color: 'var(--color-text-tertiary)', mb: 2, opacity: 0.5 }} />
                <p className="text-base font-medium " style={{ color: 'var(--color-text-secondary)' }} role="status">
                  {searchQuery ? `No responses match "${searchQuery}"` : 'No sample responses available for this item.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm mt-3 px-4 py-2 rounded-lg transition-all font-medium"
                    style={{
                      backgroundColor: 'rgba(66, 133, 244, 0.15)',
                      color: 'var(--color-google-blue)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.25)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.15)'
                    }}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
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
