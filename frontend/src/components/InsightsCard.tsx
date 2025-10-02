// components/InsightsCard.tsx - Modular insights display component
'use client'
import { 
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

interface InsightsCardProps {
  results?: any
  error?: string
}

/**
 * InsightsCard Component - Displays analysis results in a clean, organized format
 * Separated from FileUpload for better component modularity and scalability
 */
export default function InsightsCard({ results, error }: InsightsCardProps) {
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
                    {results.summary.average_recommendation?.toFixed(1) || 'N/A'}
                    <span className="text-lg">/10</span>
                  </div>
                  <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>
                    NPS Score
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

          {/* Sample Data Preview */}
          {results.data && results.data.length > 0 && (
            <div className="glass-card-dark p-8 rounded-xl elevation-2">
              <div className="flex items-center gap-3 mb-6">
                <InsightsIcon sx={{ fontSize: 28, color: 'var(--color-usc-orange)' }} />
                <h3 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                  Sample Response
                </h3>
              </div>
              
              <div className="glass-card-dark p-6 rounded-xl border" style={{borderColor: 'var(--color-border-light)'}}>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{color: 'var(--color-text-secondary)'}}>Satisfaction Rating:</span>
                    <span className="text-xl font-bold" style={{color: 'var(--color-usc-green)'}}>
                      {results.data[0].satisfaction}/5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{color: 'var(--color-text-secondary)'}}>Recommendation Score:</span>
                    <span className="text-xl font-bold" style={{color: 'var(--color-google-blue)'}}>
                      {results.data[0].recommendation_score}/10
                    </span>
                  </div>
                  <div>
                    <span className="font-medium block mb-2" style={{color: 'var(--color-text-secondary)'}}>Feedback Sample:</span>
                    <p className="text-base leading-relaxed" style={{color: 'var(--color-text-primary)'}}>
                      "{results.data[0].positive_feedback}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}