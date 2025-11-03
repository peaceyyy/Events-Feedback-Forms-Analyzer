// components/analysis/textAnalytics/StrategicInsights.tsx
'use client'
import { 
  AccountTree as StrategyIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  FlashOn as FlashOnIcon,
  Flag as FlagIcon,
} from '@mui/icons-material'

interface StrategicInsightsData {
  executive_summary: string
  top_strengths: string[]
  critical_improvements: string[]
  strategic_recommendations: string[]
  quick_wins: string[]
  long_term_goals: string[]
  success_metrics: string[]
}

interface StrategicInsightsProps {
  data: StrategicInsightsData
  based_on: {
    total_responses: number
    metrics_analyzed: number
  }
  error?: string
  onRefresh?: () => Promise<void>
  isRefreshing?: boolean
  devMode?: boolean
}

export default function StrategicInsights({ 
  data, 
  based_on, 
  error, 
  onRefresh, 
  isRefreshing = false, 
  devMode = false 
}: StrategicInsightsProps) {
  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <StrategyIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Strategic Insights
          </h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="glass-card-dark p-6 rounded-xl elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StrategyIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            AI Strategic Insights
          </h3>
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
            Based on {based_on.total_responses} responses
            {devMode && (
              <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                DEV MODE
              </span>
            )}
          </span>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-600/20 text-blue-300 disabled:text-gray-400 rounded text-sm transition-colors inline-flex items-center gap-1"
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
          </button>
        )}
      </div>

      {/* Executive Summary */}
      <div className="p-4 bg-blue-500/10 rounded-lg border-l-4 mb-6" 
           style={{ borderLeftColor: 'var(--color-google-blue)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--color-google-blue)' }}>
          Executive Summary
        </h4>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {data.executive_summary}
        </p>
      </div>

      {/* Top Strengths */}
      {data.top_strengths && data.top_strengths.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-usc-green)' }}>
            <StarIcon sx={{ fontSize: 20, color: 'var(--color-usc-green)' }} />
            Top Strengths
          </h3>
          <div className="space-y-3">
            {data.top_strengths.map((strength: string, index: number) => (
              <div key={index} 
                   className="p-3 bg-green-500/15 rounded-lg border-l-4 border-r-2 border-r-green-400/35 shadow-md transition-all hover:shadow-lg hover:bg-green-500/20" 
                   style={{ borderLeftColor: 'var(--color-usc-green)', backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
                <p style={{ color: 'var(--color-text-primary)' }}>{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Improvements */}
      {data.critical_improvements && data.critical_improvements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-usc-orange)' }}>
            <WarningIcon sx={{ fontSize: 20, color: 'var(--color-usc-orange)' }} />
            Critical Improvements
          </h3>
          <div className="space-y-3">
            {data.critical_improvements.map((improvement: string, index: number) => (
              <div key={index} 
                   className="p-3 bg-red-500/10 rounded-lg border-l-4 border-r-2 border-r-red-400/30 shadow-md transition-all hover:shadow-lg hover:bg-red-500/15" 
                   style={{ borderLeftColor: 'var(--color-usc-orange)', backgroundColor: 'rgba(239, 68, 68, 0.10)' }}>
                <p style={{ color: 'var(--color-text-primary)' }}>{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Recommendations */}
      {data.strategic_recommendations && data.strategic_recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: 'var(--color-google-blue)' }}>
            <LightbulbIcon sx={{ fontSize: 20, color: 'var(--color-google-blue)' }} />
            Detailed Strategic Recommendations
          </h3>
          <div className="space-y-3">
            {data.strategic_recommendations.map((recommendation: string, index: number) => (
              <div key={index} 
                   className="p-3 bg-blue-500/12 rounded-lg border-l-4 border-r-2 border-r-blue-400/35 shadow-md transition-all hover:shadow-lg hover:bg-blue-500/18" 
                   style={{ borderLeftColor: 'var(--color-google-blue)', backgroundColor: 'rgba(59, 130, 246, 0.12)' }}>
                <p style={{ color: 'var(--color-text-primary)' }}>{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins and Long Term Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Wins */}
        {data.quick_wins && data.quick_wins.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                style={{ color: 'var(--color-google-yellow)' }}>
              <FlashOnIcon sx={{ fontSize: 20, color: 'var(--color-google-yellow)' }} />
              Quick Wins
            </h3>
            <div className="space-y-2">
              {data.quick_wins.map((win: string, index: number) => (
                <div key={index} 
                     className="p-3 bg-yellow-500/16 rounded-lg border-l-3 border-r-1 border-r-yellow-400/30 shadow-sm text-sm transition-all hover:shadow-md hover:bg-yellow-500/22" 
                     style={{ borderLeftColor: 'var(--color-google-yellow)', backgroundColor: 'rgba(234, 179, 8, 0.16)' }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>• {win}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      
      </div>
    </div>
  )
}