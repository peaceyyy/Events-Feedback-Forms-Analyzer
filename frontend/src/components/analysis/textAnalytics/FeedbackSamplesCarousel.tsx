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
      <div className="glass-card-dark p-8 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Feedback Samples
        </h3>
        <div className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-sm text-yellow-300">
            No feedback found in uploaded data. Ensure your CSV has "What could be improved?" or "Any additional comments?" columns with responses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card-dark p-8 rounded-xl border border-white/10">
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

      {/* Carousel Display */}
      <div className="relative min-h-[120px] mb-6">
        <div 
          className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="text-3xl text-blue-400/40">❝</div>
              <p 
                className="text-base leading-relaxed flex-1 italic"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {feedbackSamples[currentIndex].text}
              </p>
              <div className="text-3xl text-blue-400/40 self-end">❞</div>
            </div>
            {/* Tag for source */}
            <div className="mt-4 text-xs font-semibold px-3 py-1 rounded-full inline-block bg-blue-600/20 text-blue-300 border border-blue-400/20">
              {feedbackSamples[currentIndex].tag}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        {/* Previous/Next Buttons */}
        <div className="flex gap-2">
          <button
            onClick={goToPrevious}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Previous
          </button>
          <button
            onClick={goToNext}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            style={{ color: 'var(--color-text-secondary)' }}
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
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-blue-400 w-6' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to feedback ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
