// components/analysis/textAnalytics/AIThemeSummary.tsx
'use client'
import { useState } from 'react'
import { 
  AutoAwesome as AutoAwesomeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Label as LabelIcon,
} from '@mui/icons-material'

interface AIThemeSummaryProps {
  aiInsights: any
  onGenerateAIInsights?: () => Promise<void>
  isLoading?: boolean
}

export default function AIThemeSummary({ 
  aiInsights, 
  onGenerateAIInsights,
  isLoading = false 
}: AIThemeSummaryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Extract theme data
  const hasThemeData = aiInsights?.themes?.data
  const strengths = hasThemeData?.positive_themes?.slice(0, 3).map((t: any) => t.theme) || []
  const improvements = hasThemeData?.improvement_themes?.slice(0, 3).map((t: any) => t.theme) || []
  const topics = hasThemeData?.recurring_topics?.slice(0, 3) || []

  const slides = [
    { title: 'Strengths', icon: <StarIcon />, items: strengths, color: 'text-green-400' },
    { title: 'To Improve', icon: <WarningIcon />, items: improvements, color: 'text-orange-400' },
    { title: 'Key Topics', icon: <LabelIcon />, items: topics, color: 'text-blue-400' },
  ]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="glass-card-dark p-6 rounded-2xl relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <AutoAwesomeIcon className="text-purple-400" sx={{ fontSize: 24 }} />
          AI Theme Summary
        </h3>

        {/* Navigation Arrows */}
        {hasThemeData && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon style={{ color: 'var(--color-text-secondary)' }} />
            </button>
            
            {/* Slide Indicators */}
            <div className="flex gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-blue-400 w-4' : 'bg-white/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Next slide"
            >
              <ChevronRightIcon style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {!hasThemeData ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isLoading ? 'bg-blue-500/20' : 'bg-purple-500/20'
            }`}>
              {isLoading ? (
                <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
              ) : (
                <AutoAwesomeIcon className="text-purple-400" sx={{ fontSize: 32 }} />
              )}
            </div>
            <p className="text-base mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {isLoading ? 'Generating AI analysis...' : 'Generate AI analysis to see theme insights'}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {isLoading 
                ? 'Gemini AI is analyzing your feedback data...' 
                : 'Discover strengths, improvement areas, and key topics from your feedback'
              }
            </p>
          </div>

          {!isLoading && onGenerateAIInsights && (
            <button
              onClick={onGenerateAIInsights}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all inline-flex items-center gap-2"
            >
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
              Generate AI Insights
            </button>
          )}
        </div>
      ) : (
        <div className="min-h-[200px]">
          {/* Sliding Content */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  {/* Slide Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`${slide.color}`}>
                      {slide.icon}
                    </div>
                    <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {slide.title}
                    </h4>
                  </div>

                  {/* Slide Content */}
                  {slide.items.length > 0 ? (
                    <div className="space-y-3">
                      {slide.items.map((item: string, itemIndex: number) => (
                        <div 
                          key={itemIndex}
                          className="p-3 bg-white/5 rounded-lg border-l-3 backdrop-blur-sm"
                          style={{ 
                            borderLeftColor: slide.color.includes('green') ? 'var(--color-usc-green)' :
                                            slide.color.includes('orange') ? 'var(--color-usc-orange)' :
                                            'var(--color-google-blue)'
                          }}
                        >
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        No {slide.title.toLowerCase()} identified
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button (if AI insights exist but user wants to refresh) */}
          {onGenerateAIInsights && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={onGenerateAIInsights}
                disabled={isLoading}
                className="w-full py-2 text-sm text-purple-300 hover:text-purple-200 hover:bg-white/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Refresh AI Insights'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
