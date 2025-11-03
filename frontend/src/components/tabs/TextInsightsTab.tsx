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
import FeedbackSamplesCarousel from '@/components/analysis/textAnalytics/FeedbackSamplesCarousel'

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

      {/* Feedback Samples - Auto-rotating carousel */}
      <FeedbackSamplesCarousel feedbackData={feedbackData} />

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
