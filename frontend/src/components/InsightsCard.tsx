// components/InsightsCard.tsx - Modular insights display component
'use client'
import { 
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import Dashboard from './Dashboard'

interface InsightsCardProps {
  results?: any
  error?: string
}

export default function InsightsCard({ results, error }: InsightsCardProps) {
  console.log('=== INSIGHTS CARD RECEIVED ===', results, error)
  
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
          {/* Success Message */}
          <div className="glass-card-dark p-6 rounded-xl elevation-2 flex items-start gap-4"
               style={{borderLeft: '4px solid var(--color-usc-green)'}}>
            <CheckCircleIcon sx={{ fontSize: 32, color: 'var(--color-usc-green)' }} />
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--color-usc-green)'}}>
                Analysis Complete!
              </h3>
              <p className="text-lg" style={{color: 'var(--color-text-secondary)'}}>
                {results.message}
              </p>
            </div>
          </div>

          {/* Summary Statistics */}
          {results.summary && (
            <div className="glass-card-dark p-8 rounded-xl elevation-2">
              <div className="flex items-center gap-3 mb-6">
                <AssessmentIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
                <h3 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                  Key Insights
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-usc-green)'}}>
                    {results.summary.total_responses}
                  </div>
                  <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                    Total Responses
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-google-blue)'}}>
                    {results.summary.average_satisfaction?.toFixed(1) || 'N/A'}
                    <span className="text-lg">/5</span>
                  </div>
                  <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                    Avg Satisfaction
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-usc-orange)'}}>
                    {results.nps?.data?.nps_score?.toFixed(1) || results.summary.average_recommendation?.toFixed(1) || 'N/A'}
                    <span className="text-lg">{results.nps?.data?.nps_score !== undefined ? '' : '/10'}</span>
                  </div>
                  <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                    {results.nps?.data?.nps_score !== undefined ? 'NPS Score' : 'Avg Recommendation'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold mb-2" style={{color: 'var(--color-google-yellow)'}}>
                    {new Date(results.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                    Processed At
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Dashboard with Charts */}
          <Dashboard analysisData={results} />
        </>
      )}
    </div>
  )
}