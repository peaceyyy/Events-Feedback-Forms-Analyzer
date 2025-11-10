// components/analysis/textAnalytics/AIInsights.tsx
'use client'
import { useState, useEffect } from 'react'
import { 
  Psychology as PsychologyIcon,
  AutoAwesome as AIIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'
import SentimentAnalysis from './SentimentAnalysis'
import ThemeAnalysis from './ThemeAnalysis'
import StrategicInsights from './StrategicInsights'
import logger from '../../../lib/logger'

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
      const response = await fetch('/api/ai-analysis', {
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
      logger.error('AI Analysis Error:', err)
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
          className="px-4 py-2 rounded-lg transition-all font-medium"
          style={{
            backgroundColor: 'var(--color-google-blue)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
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
          className="px-6 py-3 rounded-lg font-medium transition-all transform inline-flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
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
      {/* Strategic Insights - Primary card at top */}
      {aiResults?.strategic_insights && (
        <StrategicInsights 
          data={aiResults.strategic_insights.data}
          based_on={aiResults.strategic_insights.based_on}
          error={aiResults.strategic_insights.error}
          onRefresh={generateAIInsights}
          isRefreshing={loading}
          devMode={aiResults?.sentiment?.dev_mode}
          feedbackSamples={feedbackData}
        />
      )}

      {/* Two-column layout for Sentiment and Theme Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  )
}