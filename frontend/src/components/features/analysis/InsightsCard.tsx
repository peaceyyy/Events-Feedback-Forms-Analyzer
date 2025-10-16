// components/InsightsCard.tsx - Modular insights display component
'use client'
import { 
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import Dashboard from './Dashboard'
import AIInsightsContainer from './AIInsights'

interface InsightsCardProps {
  results?: any
  error?: string
  feedbackData?: any[]
}

export default function InsightsCard({ results, error, feedbackData }: InsightsCardProps) {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log('InsightsCard received results:', results, 'error:', error)
  }
  
  // Don't render anything if no results or error
  if (!results && !error) return null

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="glass-card-dark p-6 rounded-xl elevation-1 flex items-start gap-4"
             style={{borderLeft: '4px solid var(--color-google-red)'}}>
          <ErrorIcon sx={{ fontSize: 24, color: 'var(--color-google-red)', marginTop: '2px' }} />
          <div>
            <h4 className="font-semibold mb-1" style={{color: 'var(--color-google-red)'}}>
              Analysis Error
            </h4>
            <p style={{color: 'var(--color-text-secondary)'}}>{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <>
          {/* Summary Statistics */}
          {results.summary && (
            <div className="glass-card-dark p-8 rounded-xl elevation-2">
              <div className="flex items-center gap-3 mb-6">
                <AssessmentIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
                <h3 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                  Executive Summary
                </h3>
              </div>
              
              {/* THE FIX: Improved KPI card layout for better readability and visual appeal */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Responses */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <CheckCircleIcon sx={{ fontSize: 32, color: 'var(--color-usc-green)' }} />
                  <div>
                    <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>{results.summary.total_responses}</div>
                    <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>Total Responses</div>
                  </div>
                </div>

                {/* Average Satisfaction */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <InsightsIcon sx={{ fontSize: 32, color: 'var(--color-google-blue)' }} />
                  <div>
                    {/* THE FIX: Correctly access satisfaction score from nested object */}
                    <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                      {(results.satisfaction?.data?.stats?.average || 0).toFixed(1)}<span className="text-lg">/5</span>
                    </div>
                    <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>Avg. Satisfaction</div>
                  </div>
                </div>

                {/* NPS Score */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <TrendingUpIcon sx={{ fontSize: 32, color: 'var(--color-usc-orange)' }} />
                  <div>
                    <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                      {results.nps?.data?.nps_score?.toFixed(0) ?? 'N/A'}
                    </div>
                    <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>NPS Score</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Dashboard with Charts */}
          <Dashboard analysisData={results} />

          {/* AI-Powered Insights */}
          {feedbackData && (
            <AIInsightsContainer 
              feedbackData={feedbackData}
              analysisData={results}
            />
          )}
        </>
      )}
    </div>
  )
}