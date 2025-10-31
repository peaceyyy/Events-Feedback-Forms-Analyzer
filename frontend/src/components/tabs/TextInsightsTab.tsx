/**
 * Text Insights Tab Component
 * 
 * Displays AI-powered text analysis including:
 * - Feedback samples placeholder (to be implemented)
 * - Recurring topics from text analysis
 * - Complete AI insights suite (themes, sentiment, recommendations)
 */

'use client'

import type { UploadResponse, FeedbackRecord } from '@/types/upload'
import AIInsightsContainer from '@/components/analysis/textAnalytics/AIInsights'
import RecurringTopics from '@/components/analysis/textAnalytics/RecurringTopics'

interface TextInsightsTabProps {
  feedbackData: FeedbackRecord[]
  analysisResults: UploadResponse
  aiInsights: any
  onInsightsGenerated: (insights: any) => void
}

export default function TextInsightsTab({ 
  feedbackData,
  analysisResults,
  aiInsights,
  onInsightsGenerated
}: TextInsightsTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          AI-Powered Text Analysis
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Advanced sentiment analysis, theme extraction, and strategic insights powered by Google Gemini AI
        </p>
      </div>

      {/* Feedback Samples - Placeholder for sliding window */}
      <div className="glass-card-dark p-8 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Feedback Samples
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Interactive sliding window to browse actual feedback responses - to be implemented
        </p>
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
          <p className="text-sm text-blue-300">
            Coming Soon: Sliding window interface to explore individual feedback responses  
          </p>
        </div>
      </div>

      {/* Recurring Topics */}
      {aiInsights?.themes?.data?.recurring_topics && (
        <RecurringTopics 
          topics={aiInsights.themes.data.recurring_topics}
          error={aiInsights.themes.error}
        />
      )}

      {/* AI Insights Container - Complete AI Analysis Suite */}
      <AIInsightsContainer 
        feedbackData={feedbackData}
        analysisData={analysisResults}
        cachedInsights={aiInsights}
        onInsightsGenerated={onInsightsGenerated}
      />
    </div>
  )
}
