// components/features/analysis/text/AIInsights.tsx
'use client'
import { useState, useEffect } from 'react'
import { 
  Psychology as PsychologyIcon,
  AutoAwesome as AIIcon,
  Error as ErrorIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  FlashOn as FlashOnIcon,
  Flag as FlagIcon,
} from '@mui/icons-material'
import SentimentAnalysis from './text/SentimentAnalysis'
import ThemeAnalysis from './text/ThemeAnalysis'
import StrategicInsights from './text/StrategicInsights'

interface AIInsightsContainerProps {
  feedbackData: any[]
  analysisData?: any
  cachedInsights?: any
  onInsightsGenerated?: (insights: any) => void
  onError?: (error: string) => void
}

export default function AIInsightsContainer({ 
  feedbackData, 
  analysisData, 
  cachedInsights,
  onInsightsGenerated,
  onError 
}: AIInsightsContainerProps) {
  const [aiResults, setAiResults] = useState<any>(cachedInsights || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update local state when cached insights change
  useEffect(() => {
    if (cachedInsights && !aiResults) {
      setAiResults(cachedInsights)
    }
  }, [cachedInsights, aiResults])

  const generateAIInsights = async () => {
    if (!feedbackData || feedbackData.length === 0) {
      setError('No feedback data available for AI analysis')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: feedbackData,
          analysis: analysisData
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'AI analysis failed')
      }

      setAiResults(result.ai_analysis)
      onInsightsGenerated?.(result.ai_analysis) // Cache the results
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI insights'
      setError(errorMessage)
      onError?.(errorMessage)
      console.error('AI Analysis Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const hasValidTextData = () => {
    if (!feedbackData || feedbackData.length === 0) return false
    
    return feedbackData.some(item => 
      (item.positive_feedback && item.positive_feedback !== 'No comment') ||
      (item.improvement_feedback && item.improvement_feedback !== 'No comment') ||
      (item.additional_comments && item.additional_comments !== 'No comment')
    )
  }

  if (!hasValidTextData()) {
    return (
      <div className="glass-card-dark p-8 rounded-xl text-center">
        <PsychologyIcon sx={{ fontSize: 48, color: 'var(--color-text-secondary)', mb: 2 }} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Insights Unavailable
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          No text feedback available for AI analysis. Upload feedback with text responses to unlock AI insights.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <ErrorIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            AI Analysis Error
          </h3>
        </div>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {error}
        </p>
        <button
          onClick={generateAIInsights}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    )
  }

  if (!aiResults && !loading) {
    return (
      <div className="glass-card-dark p-8 rounded-xl text-center">
        <AIIcon sx={{ fontSize: 48, color: 'var(--color-google-blue)', mb: 2 }} />
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          AI-Powered Insights Available
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Generate advanced sentiment analysis, theme extraction, and strategic recommendations using Google's Gemini AI.
        </p>
        <button
          onClick={generateAIInsights}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
        >
          <AIIcon sx={{ fontSize: 20 }} />
          Generate AI Insights
        </button>
        <p className="mt-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Analyzing {feedbackData.length} responses with text feedback
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass-card-dark p-8 rounded-xl text-center">
        <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Analysis in Progress
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Gemini AI is analyzing your feedback data... This may take a few moments.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Strategic Insights - with integrated refresh button */}
      {aiResults?.strategic_insights && (
        <StrategicInsights 
          data={aiResults.strategic_insights.data}
          based_on={aiResults.strategic_insights.based_on}
          error={aiResults.strategic_insights.error}
          onRefresh={generateAIInsights}
          isRefreshing={loading}
          devMode={aiResults?.sentiment?.dev_mode}
        />
      )}

      {/* Sentiment Analysis */}
      {aiResults?.sentiment && (
        <SentimentAnalysis 
          data={aiResults.sentiment.data} 
          error={aiResults.sentiment.error}
        />
      )}

      {/* Theme Analysis */}
      {aiResults?.themes && (
        <ThemeAnalysis 
          data={aiResults.themes.data}
          analyzed_responses={aiResults.themes.analyzed_responses}
          error={aiResults.themes.error}
        />
      )}

      {/* Individual Strategic Components */}
      {aiResults?.strategic_insights?.data && (
        <>
          {/* Top Strengths */}
          {aiResults.strategic_insights.data.top_strengths && (
            <div className="glass-card-dark p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                  style={{ color: 'var(--color-usc-green)' }}>
                <StarIcon sx={{ fontSize: 20, color: 'var(--color-usc-green)' }} />
                Top Strengths
              </h3>
              <div className="space-y-3">
                {aiResults.strategic_insights.data.top_strengths.map((strength: string, index: number) => (
                  <div key={index} className="p-3 bg-green-500/15 rounded-lg border-l-4 border-r-2 border-r-green-400/30 shadow-sm" 
                       style={{ borderLeftColor: 'var(--color-usc-green)', backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
                    <p style={{ color: 'var(--color-text-primary)' }}>{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Improvements */}
          {aiResults.strategic_insights.data.critical_improvements && (
            <div className="glass-card-dark p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                  style={{ color: 'var(--color-usc-orange)' }}>
                <WarningIcon sx={{ fontSize: 20, color: 'var(--color-usc-orange)' }} />
                Critical Improvements
              </h3>
              <div className="space-y-3">
                {aiResults.strategic_insights.data.critical_improvements.map((improvement: string, index: number) => (
                  <div key={index} className="p-3 bg-red-500/12 rounded-lg border-l-4 border-r-2 border-r-red-400/25 shadow-sm" 
                       style={{ borderLeftColor: 'var(--color-usc-orange)', backgroundColor: 'rgba(239, 68, 68, 0.12)' }}>
                    <p style={{ color: 'var(--color-text-primary)' }}>{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Recommendations */}
          {aiResults.strategic_insights.data.strategic_recommendations && (
            <div className="glass-card-dark p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                  style={{ color: 'var(--color-google-blue)' }}>
                <LightbulbIcon sx={{ fontSize: 20, color: 'var(--color-google-blue)' }} />
                Detailed Strategic Recommendations
              </h3>
              <div className="space-y-3">
                {aiResults.strategic_insights.data.strategic_recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-500/13 rounded-lg border-l-4 border-r-2 border-r-blue-400/30 shadow-sm" 
                       style={{ borderLeftColor: 'var(--color-google-blue)', backgroundColor: 'rgba(59, 130, 246, 0.13)' }}>
                    <p style={{ color: 'var(--color-text-primary)' }}>{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins and Long Term Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Wins */}
            {aiResults.strategic_insights.data.quick_wins && (
              <div className="glass-card-dark p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                    style={{ color: 'var(--color-google-yellow)' }}>
                  <FlashOnIcon sx={{ fontSize: 20, color: 'var(--color-google-yellow)' }} />
                  Quick Wins
                </h3>
                <div className="space-y-2">
                  {aiResults.strategic_insights.data.quick_wins.map((win: string, index: number) => (
                    <div key={index} className="p-3 bg-yellow-500/14 rounded-lg border-l-3 border-r-1 border-r-yellow-400/25 shadow-sm text-sm" 
                         style={{ borderLeftColor: 'var(--color-google-yellow)', backgroundColor: 'rgba(234, 179, 8, 0.14)' }}>
                      <p style={{ color: 'var(--color-text-secondary)' }}>• {win}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Long Term Goals */}
            {aiResults.strategic_insights.data.long_term_goals && (
              <div className="glass-card-dark p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" 
                    style={{ color: 'var(--color-purple-400)' }}>
                  <FlagIcon sx={{ fontSize: 20, color: 'var(--color-purple-400)' }} />
                  Long Term Goals
                </h3>
                <div className="space-y-2">
                  {aiResults.strategic_insights.data.long_term_goals.map((goal: string, index: number) => (
                    <div key={index} className="p-3 bg-purple-500/12 rounded-lg border-l-3 border-r-1 border-r-purple-400/25 shadow-sm text-sm" 
                         style={{ borderLeftColor: 'var(--color-purple-400)', backgroundColor: 'rgba(168, 85, 247, 0.12)' }}>
                      <p style={{ color: 'var(--color-text-secondary)' }}>• {goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}