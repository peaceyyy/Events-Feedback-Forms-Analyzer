// components/analysis/textAnalytics/ThemeAnalysis.tsx
'use client'
import { 
  Category as CategoryIcon,
} from '@mui/icons-material'

interface Theme {
  theme: string
  frequency: number
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
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg"
                     style={{
                       backgroundColor: 'var(--color-surface-elevated)',
                       borderLeft: `4px solid var(--color-usc-green)`
                     }}>
                  <div className="flex-1 min-w-0" style={{ color: 'var(--color-text-primary)' }}>
                    <div className="font-medium truncate">{theme.theme}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {theme.frequency} mentions
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
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg"
                     style={{
                       backgroundColor: 'var(--color-surface-elevated)',
                       borderLeft: `4px solid var(--color-usc-orange)`
                     }}>
                  <div className="flex-1 min-w-0" style={{ color: 'var(--color-text-primary)' }}>
                    <div className="font-medium truncate">{theme.theme}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {theme.frequency} mentions
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
    </div>
  )
}