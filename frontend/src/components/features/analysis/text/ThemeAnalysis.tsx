// components/features/analysis/text/ThemeAnalysis.tsx
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

  return (
    <div className="glass-card-dark p-6 rounded-xl elevation-2">
      <div className="flex items-center gap-3 mb-6">
        <CategoryIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          AI Theme Analysis
        </h3>
        <span className="ml-auto text-sm px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
          {analyzed_responses.positive + analyzed_responses.improvement} responses analyzed
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Positive Themes */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-usc-green)' }}>
            <CategoryIcon sx={{ fontSize: 20, color: 'var(--color-usc-green)' }} />
            Top Strengths
          </h4>
          <div className="space-y-3">
            {data.positive_themes?.slice(0, 5).map((theme, index) => (
              <div key={index} className="p-3 bg-green-500/10 rounded-lg border-l-2" 
                   style={{ borderLeftColor: 'var(--color-usc-green)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {theme.theme}
                  </span>
                  <span className="text-sm px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {theme.frequency} mentions
                  </span>
                </div>
              </div>
            )) || (
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
            {data.improvement_themes?.slice(0, 5).map((theme, index) => (
              <div key={index} className="p-3 bg-orange-500/10 rounded-lg border-l-2" 
                   style={{ borderLeftColor: 'var(--color-usc-orange)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {theme.theme}
                  </span>
                  <span className="text-sm px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                    {theme.frequency} mentions
                  </span>
                </div>
              </div>
            )) || (
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