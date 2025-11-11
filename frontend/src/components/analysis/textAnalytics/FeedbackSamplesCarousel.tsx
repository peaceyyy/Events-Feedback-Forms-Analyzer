/**
 * Feedback Samples Component
 * 
 * Displays sample feedback cards in a clean, accessible layout.
 * Shows 3 preview cards with a "Show more" button to open full modal.
 * Improved from auto-rotating carousel for better UX and accessibility.
 */

'use client'

import { useState } from 'react'
import type { FeedbackRecord } from '@/types/upload'
import { Visibility as ViewIcon } from '@mui/icons-material'
import SampleResponsesModal from '@/components/ui/SampleResponsesModal'

interface FeedbackSamplesCarouselProps {
  feedbackData: FeedbackRecord[]
}

export default function FeedbackSamplesCarousel({ feedbackData }: FeedbackSamplesCarouselProps) {
  const [modalOpen, setModalOpen] = useState(false)

  // Extract feedback from both columns, tagging each
  type Sample = { text: string; tag: 'Suggestion' | 'Additional Comment'; sentiment?: 'positive' | 'neutral' | 'negative' }
  const feedbackSamples: Sample[] = []
  
  feedbackData.forEach(record => {
    // Backend renames 'What could be improved?' to 'improvement_feedback'
    const suggestion = record.improvement_feedback
    if (suggestion && suggestion.trim().length > 0 && suggestion !== 'No comment') {
      feedbackSamples.push({ text: suggestion.trim(), tag: 'Suggestion', sentiment: 'neutral' })
    }
    
    // Backend renames 'Any additional comments?' to 'additional_comments'
    const additional = record.additional_comments
    if (additional && additional.trim().length > 0 && additional !== 'No comment') {
      feedbackSamples.push({ text: additional.trim(), tag: 'Additional Comment', sentiment: 'neutral' })
    }
  })

  // Get sentiment color for tag badges
  const getTagColor = (tag: string) => {
    if (tag === 'Suggestion') {
      return {
        bg: 'rgba(255, 152, 0, 0.15)',
        border: 'var(--color-usc-orange)',
        text: 'var(--color-usc-orange)'
      }
    }
    return {
      bg: 'rgba(66, 133, 244, 0.15)',
      border: 'var(--color-google-blue)',
      text: 'var(--color-google-blue)'
    }
  }

  const handleShowAll = () => {
    setModalOpen(true)
  }

  if (feedbackSamples.length === 0) {
    return (
      <div className="glass-card-dark p-8 rounded-xl border-theme-light">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Feedback Samples
        </h3>
        <div className="p-6 rounded-lg" 
             style={{ 
               backgroundColor: 'rgba(251, 188, 5, 0.1)',
               border: '1px solid rgba(251, 188, 5, 0.2)'
             }}>
          <p className="text-sm" style={{ color: 'var(--color-google-yellow)' }}>
            No feedback found in uploaded data. Ensure your CSV has "What could be improved?" or "Any additional comments?" columns with responses.
          </p>
        </div>
      </div>
    )
  }

  // Show first 3 samples as preview
  const previewSamples = feedbackSamples.slice(0, 3)
  const hasMore = feedbackSamples.length > 3

  return (
    <>
      <div className="glass-card-dark p-6 rounded-xl border-theme-light">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Participant Responses
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {feedbackSamples.length} response{feedbackSamples.length !== 1 ? 's' : ''} collected
            </p>
          </div>
          {hasMore && (
            <button
              onClick={handleShowAll}
              className="text-xs px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5 font-medium"
              style={{
                backgroundColor: 'rgba(66, 133, 244, 0.15)',
                color: 'var(--color-google-blue)',
                border: '1px solid rgba(66, 133, 244, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.15)'
              }}
              aria-label={`View all ${feedbackSamples.length} responses`}
            >
              <ViewIcon sx={{ fontSize: 14 }} />
              View all ({feedbackSamples.length})
            </button>
          )}
        </div>

        {/* Sample Cards Grid */}
        <div 
          className="grid gap-4"
          role="list"
          aria-label="Sample feedback responses"
        >
          {previewSamples.map((sample, index) => {
            const tagColors = getTagColor(sample.tag)
            return (
              <div
                key={index}
                role="listitem"
                className="p-4 rounded-lg border transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-border-light)',
                  maxWidth: '100%'
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleShowAll()
                  }
                }}
              >
                {/* Tag Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: tagColors.bg,
                      color: tagColors.text,
                      border: `1px solid ${tagColors.border}`
                    }}
                  >
                    {sample.tag}
                  </span>
                  <span 
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--color-text-tertiary)'
                    }}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Feedback Text */}
                <p 
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: 'var(--color-text-primary)' }}
                  title={sample.text}
                >
                  {sample.text}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom "Show more" for mobile/small screens */}
        {hasMore && (
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
            <button
              onClick={handleShowAll}
              className="text-sm px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 font-medium w-full sm:w-auto justify-center"
              style={{
                backgroundColor: 'rgba(66, 133, 244, 0.12)',
                color: 'var(--color-google-blue)',
                border: '1px solid rgba(66, 133, 244, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.2)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.12)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              aria-label={`Show all ${feedbackSamples.length} responses`}
            >
              <ViewIcon sx={{ fontSize: 18 }} />
              Show {feedbackSamples.length - 3} more response{feedbackSamples.length - 3 !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      {/* Modal for all responses */}
      <SampleResponsesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="All Participant Responses"
        samples={feedbackSamples.map(s => s.text)}
        theme="recommendations"
      />
    </>
  )
}
