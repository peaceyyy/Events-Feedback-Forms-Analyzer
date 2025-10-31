// components/analysis/textAnalytics/StrategicInsights.tsx
'use client'
import { 
  AccountTree as StrategyIcon,
  Refresh as RefreshIcon,
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
        
        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-600/20 text-blue-300 disabled:text-gray-400 rounded text-sm transition-colors"
          >
            {isRefreshing ? <><RefreshIcon className="w-4 h-4 mr-1" />Refreshing...</> : <><RefreshIcon className="w-4 h-4 mr-1" />Refresh Analysis</>}
          </button>
        )}
      </div>

      <div className="p-4 bg-blue-500/10 rounded-lg border-l-4" 
           style={{ borderLeftColor: 'var(--color-google-blue)' }}>
        <h4 className="font-semibold mb-2" style={{ color: 'var(--color-google-blue)' }}>
          Executive Summary
        </h4>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {data.executive_summary}
        </p>
      </div>
    </div>

  )
}