// components/analysis/textAnalytics/ThemeAnalysis.tsx
'use client'
import { useState, useEffect } from 'react'
import { 
  Category as CategoryIcon,
  Close as CloseIcon,
  FormatQuote as QuoteIcon
} from '@mui/icons-material'

interface Theme {
  theme: string
  frequency: number
  mentions?: string[]
}

interface ThemeData {
  positive_themes: Theme[]
  improvement_themes: Theme[]
  recurring_topics: string[]
  priority_actions: string[]
  theme_categories: Record<string, Theme[]>
}

interface ThemeAnalysisProps {
  data: ThemeData
  analyzed_responses: {
    positive: number
    improvement: number
    unique_responses?: number
  }
  error?: string
}

export default function ThemeAnalysis({ data, analyzed_responses, error }: ThemeAnalysisProps) {
  const [selectedTheme, setSelectedTheme] = useState<{ theme: Theme; type: 'positive' | 'improvement' } | null>(null)

  // Keyboard support for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTheme) {
        closeModal()
      }
    }

    if (selectedTheme) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedTheme])

  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <CategoryIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            AI Theme Analysis
          </h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  const totalAnalyzed = typeof analyzed_responses?.unique_responses === 'number'
    ? analyzed_responses.unique_responses
    : (analyzed_responses.positive + analyzed_responses.improvement)

  const handleThemeClick = (theme: Theme, type: 'positive' | 'improvement') => {
    if (theme.mentions && theme.mentions.length > 0) {
      setSelectedTheme({ theme, type })
    }
  }

  const closeModal = () => {
    setSelectedTheme(null)
  }

  return (
    <div className="glass-card-dark p-6 rounded-xl elevation-2">
      <div className="flex items-center gap-3 mb-6">
        <CategoryIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
        <div>
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            AI Theme Analysis
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Summary of recurring positive themes and improvement areas
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Positive Themes */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-usc-green)' }}>
            <CategoryIcon sx={{ fontSize: 20, color: 'var(--color-usc-green)' }} />
            Top Strengths
          </h4>

          <div className="space-y-3">
            {data.positive_themes?.length ? (
              data.positive_themes.slice(0, 6).map((theme, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200"
                  onClick={() => handleThemeClick(theme, 'positive')}
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderLeft: `4px solid var(--color-usc-green)`,
                    cursor: theme.mentions && theme.mentions.length > 0 ? 'pointer' : 'default'
                  }}
                  onMouseEnter={(e) => {
                    if (theme.mentions && theme.mentions.length > 0) {
                      e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div className="flex-1 min-w-0" style={{ color: 'var(--color-text-primary)' }}>
                    <div className="font-medium truncate">{theme.theme}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {theme.frequency} mentions
                      {theme.mentions && theme.mentions.length > 0 && (
                        <span className="ml-2 text-xs opacity-70">• Click to view samples</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: 'rgba(76, 175, 80, 0.18)', color: 'var(--color-usc-green)' }}>
                      {theme.frequency}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No positive themes identified
              </p>
            )}
          </div>
        </div>

        {/* Improvement Themes */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-usc-orange)' }}>
            <CategoryIcon sx={{ fontSize: 20, color: 'var(--color-usc-orange)' }} />
            Improvement Areas
          </h4>

          <div className="space-y-3">
            {data.improvement_themes?.length ? (
              data.improvement_themes.slice(0, 6).map((theme, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200"
                  onClick={() => handleThemeClick(theme, 'improvement')}
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderLeft: `4px solid var(--color-usc-orange)`,
                    cursor: theme.mentions && theme.mentions.length > 0 ? 'pointer' : 'default'
                  }}
                  onMouseEnter={(e) => {
                    if (theme.mentions && theme.mentions.length > 0) {
                      e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div className="flex-1 min-w-0" style={{ color: 'var(--color-text-primary)' }}>
                    <div className="font-medium truncate">{theme.theme}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {theme.frequency} mentions
                      {theme.mentions && theme.mentions.length > 0 && (
                        <span className="ml-2 text-xs opacity-70">• Click to view samples</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: 'rgba(255, 152, 0, 0.18)', color: 'var(--color-usc-orange)' }}>
                      {theme.frequency}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No improvement themes identified
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for showing feedback mentions */}
      {selectedTheme && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            position: 'fixed'
          }}
          onClick={closeModal}
        >
          <div 
            className="glass-card-theme rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'modalSlideIn 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div 
              className="p-6 border-b flex items-center justify-between"
              style={{ 
                borderBottomColor: 'var(--color-border-light)',
                background: selectedTheme.type === 'positive' 
                  ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), transparent)'
                  : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), transparent)'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: selectedTheme.type === 'positive' 
                      ? 'rgba(76, 175, 80, 0.18)' 
                      : 'rgba(255, 152, 0, 0.18)'
                  }}
                >
                  <QuoteIcon 
                    sx={{ 
                      fontSize: 20, 
                      color: selectedTheme.type === 'positive' 
                        ? 'var(--color-usc-green)' 
                        : 'var(--color-usc-orange)' 
                    }} 
                  />
                </div>
                <div>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {selectedTheme.theme.theme}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {selectedTheme.theme.frequency} mentions from feedback
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="Close modal"
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <h4 
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Sample Feedback Mentions
              </h4>
              <div className="space-y-3">
                {selectedTheme.theme.mentions?.map((mention, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderLeftColor: selectedTheme.type === 'positive' 
                        ? 'var(--color-usc-green)' 
                        : 'var(--color-usc-orange)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <QuoteIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: 'var(--color-text-tertiary)',
                          opacity: 0.5,
                          marginTop: '2px'
                        }} 
                      />
                      <p 
                        className="text-sm leading-relaxed flex-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        "{mention}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="p-4 border-t flex justify-end"
              style={{ borderTopColor: 'var(--color-border-light)' }}
            >
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}