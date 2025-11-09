/**
 * Feedback Samples Carousel Component
 * 
 * Rotating display of actual user feedback from CSV.
 * Auto-cycles through feedback samples every 5 seconds.
 * Displays before AI insights are generated as a preview mechanism.
 */

'use client'

import { useState, useEffect } from 'react'
import type { FeedbackRecord } from '@/types/upload'

interface FeedbackSamplesCarouselProps {
  feedbackData: FeedbackRecord[]
}

export default function FeedbackSamplesCarousel({ feedbackData }: FeedbackSamplesCarouselProps) {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Extract feedback from both columns, tagging each
  type Sample = { text: string; tag: 'Suggestion' | 'Additional Comment' }
  const feedbackSamples: Sample[] = []
  
  feedbackData.forEach(record => {
    // Backend renames 'What could be improved?' to 'improvement_feedback'
    const suggestion = record.improvement_feedback
    if (suggestion && suggestion.trim().length > 0 && suggestion !== 'No comment') {
      feedbackSamples.push({ text: suggestion.trim(), tag: 'Suggestion' })
    }
    
    // Backend renames 'Any additional comments?' to 'additional_comments'
    const additional = record.additional_comments
    if (additional && additional.trim().length > 0 && additional !== 'No comment') {
      feedbackSamples.push({ text: additional.trim(), tag: 'Additional Comment' })
    }
  })

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (feedbackSamples.length === 0) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % feedbackSamples.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [feedbackSamples.length])

  // Manual navigation
  const goToNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbackSamples.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToPrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + feedbackSamples.length) % feedbackSamples.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToIndex = (index: number) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsAnimating(false)
    }, 300)
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

  return (
    <div className="glass-card-dark p-8 rounded-xl border-theme-light">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Participant Responses
          </h3>
        </div>
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {currentIndex + 1} / {feedbackSamples.length}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative min-h-[120px] mb-6">
        <div 
          className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="rounded-lg p-6 border-theme-light" 
               style={{ 
                 background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.08), rgba(156, 39, 176, 0.08))'
               }}>
            <div className="flex items-start gap-3">
              <div className="text-3xl opacity-40" style={{ color: 'var(--color-google-blue)' }}>❝</div>
              <p 
                className="text-base leading-relaxed flex-1 italic"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {feedbackSamples[currentIndex].text}
              </p>
              <div className="text-3xl opacity-40 self-end" style={{ color: 'var(--color-google-blue)' }}>❞</div>
            </div>
            {/* Tag for source */}
            <div className="mt-4 text-xs font-semibold px-3 py-1 rounded-full inline-block"
                 style={{ 
                   backgroundColor: 'rgba(66, 133, 244, 0.15)',
                   color: 'var(--color-google-blue)',
                   border: '1px solid rgba(66, 133, 244, 0.2)'
                 }}>
              {feedbackSamples[currentIndex].tag}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-right justify-between">
        {/* Previous/Next Buttons */}
        <div className="flex gap-2 ml-auto items-center">
          <button
            onClick={goToPrevious}
            className="px-4 py-2 rounded-lg transition-all border-theme-light"
            style={{ 
              backgroundColor: 'var(--color-surface-elevated)',
              color: 'var(--color-text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={goToNext}
            className="px-4 py-2 rounded-lg transition-all border-theme-light"
            style={{ 
              backgroundColor: 'var(--color-surface-elevated)',
              color: 'var(--color-text-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Next →
          </button>
        </div>

        {/* Dot Indicators (only show if <= 10 samples) */}
        {feedbackSamples.length <= 10 && (
          <div className="flex gap-2">
            {feedbackSamples.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex 
                    ? 'var(--color-google-blue)' 
                    : 'var(--color-border-light)',
                  width: index === currentIndex ? '1.5rem' : '0.5rem'
                }}
                aria-label={`Go to feedback ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
