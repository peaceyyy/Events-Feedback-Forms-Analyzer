// components/analysis/textAnalytics/AIInsights.tsx
'use client'
import { useState, useEffect } from 'react'
import { 
  Psychology as PsychologyIcon,
  AutoAwesome as AIIcon,
  Error as ErrorIcon,
  ChevronRight as ChevronRightIcon,
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
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          No text feedback available for AI analysis. Upload feedback with text responses to unlock AI insights.
        </p>
        {/* Disabled button state with tooltip-like explanation */}
        <button
          disabled
          className="px-6 rounded-lg font-medium inline-flex items-center justify-center gap-2"
          style={{
            height: '44px',
            background: 'linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))',
            color: 'white',
            opacity: 0.4,
            cursor: 'not-allowed'
          }}
          aria-label="Generate AI Insights (disabled - no text feedback available)"
          title="Upload feedback with text responses to enable AI analysis"
        >
          <AIIcon sx={{ fontSize: 20 }} />
          Generate AI Insights
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </button>
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
        <p className="mb-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {error}
        </p>
        <button
          onClick={generateAIInsights}
          className="px-6 rounded-lg transition-all font-medium inline-flex items-center justify-center gap-2"
          style={{
            height: '44px',
            backgroundColor: 'var(--color-google-blue)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(66, 133, 244, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.25)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'none'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-ring-offset), 0 0 0 6px var(--color-ring)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.25)'
          }}
          aria-label="Retry AI analysis"
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
        
        {/* Improved Typography & Copy */}
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Insights
        </h3>
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Sentiment, themes & recommended actions
        </p>
        
        {/* Primary CTA Button - Improved Design */}
        <button
          onClick={generateAIInsights}
          className="px-6 rounded-lg font-medium transition-all inline-flex items-center justify-center gap-2.5 mb-4"
          style={{
            height: '44px',
            background: 'linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))',
            color: 'white',
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
            transitionDuration: '120ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(66, 133, 244, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = 'none'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-ring-offset), 0 0 0 6px var(--color-ring)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)'
          }}
          aria-label={`Generate AI insights for ${feedbackData.length} responses`}
        >
          <AIIcon sx={{ fontSize: 20 }} />
          <span>Generate AI Insights</span>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </button>
        
        {/* Supporting Text - Brief & Confidence-Building */}
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
          Analyze {feedbackData.length} response{feedbackData.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Uses Gemini AI — private, on-demand analysis
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
        {/* Accessibility: announce to screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          AI analysis in progress. Please wait.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Accessibility: announce when insights are loaded */}
      {aiResults && (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          AI insights have been generated successfully. {aiResults.strategic_insights ? 'Strategic insights, ' : ''}{aiResults.sentiment ? 'sentiment analysis, ' : ''}{aiResults.themes ? 'and theme analysis are now available.' : ''}
        </div>
      )}
      
      {/* Strategic Insights - Primary card at top */}
      {aiResults?.strategic_insights && (
        <StrategicInsights 
          data={aiResults.strategic_insights.data}
          based_on={aiResults.strategic_insights.based_on}
          error={aiResults.strategic_insights.error}
          onRefresh={generateAIInsights}
          isRefreshing={loading}
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