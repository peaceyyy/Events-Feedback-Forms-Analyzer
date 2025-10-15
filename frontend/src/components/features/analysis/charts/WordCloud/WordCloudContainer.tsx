'use client'
import React from 'react'
import WordCloudComponent from './WordCloud'

interface WordCloudContainerProps {
  data: {
    word_cloud: { word: string; count: number }[]
    stats: {
      total_responses: number
      unique_words: number
      most_common?: [string, number]
      response_rate: number
    }
  }
  className?: string
}

/**
 * WordCloudContainer - Transforms backend one-word description data for WordCloud visualization
 * 
 * Data Flow:
 * • Backend sends {word_cloud: [{word, count}], stats: {...}}
 * • Transform to Carbon Charts format {word, value, group}
 * • Add metadata display for context
 */
export default function WordCloudContainer({ data, className = '' }: WordCloudContainerProps) {
  
  // Transform backend data to Carbon Charts WordCloud format
  const transformedData = React.useMemo(() => {
    if (!data?.word_cloud || !Array.isArray(data.word_cloud)) {
      return []
    }
    
    return data.word_cloud.map(item => ({
      word: item.word,
      value: item.count,
      group: 'descriptions' // Group all words under one category
    }))
  }, [data])

  if (!data || !data.word_cloud || data.word_cloud.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          One-Word Descriptions
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            No one-word descriptions found in the uploaded data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* WordCloud Visualization */}
      <WordCloudComponent
        data={transformedData}
        title="One-Word Descriptions"
        className="w-full"
        height={450}
      />

      {/* Statistics Summary */}
      <div className="glass-card-dark p-4 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold mb-1" style={{ color: 'var(--color-usc-green)' }}>
              {data.stats.total_responses}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Total Descriptions
            </div>
          </div>
          
          <div>
            <div className="text-xl font-bold mb-1" style={{ color: 'var(--color-google-blue)' }}>
              {data.stats.unique_words}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Unique Words
            </div>
          </div>
          
          <div>
            <div className="text-xl font-bold mb-1" style={{ color: 'var(--color-usc-orange)' }}>
              {data.stats.response_rate}%
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Response Rate
            </div>
          </div>

          {data.stats.most_common && (
            <div>
              <div className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                "{data.stats.most_common[0]}"
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Most Common ({data.stats.most_common[1]}x)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sidebar Theory: WordCloud Data Visualization
/*
ONE-WORD DESCRIPTION ANALYSIS:

WHY IT MATTERS:
• Sentiment capture: Single words often reveal emotional responses
• Quick insights: Immediate visual feedback on event perception
• Trend identification: Compare across events to see improvement/decline
• Stakeholder communication: Easy to present to executives and sponsors

DATA TRANSFORMATION PIPELINE:
1. CSV Column: "One-Word Description" → backend processing
2. Python Counter: Count frequency of each word (case-insensitive)
3. API Response: {word_cloud: [{word, count}], stats: {...}}
4. Frontend Transform: Add 'group' field and 'value' mapping for Carbon Charts
5. Visualization: Size-weighted cloud with hover details

INTERPRETATION GUIDELINES:
• Word Size = Frequency (bigger = more respondents used this word)
• Color Grouping = Sentiment category (positive/neutral/negative)
• Position = Random but optimized for readability
• Hover = Show exact count and percentage

DESIGN CONSIDERATIONS:
• Minimum font size: Ensure even single-use words are readable
• Color palette: Use brand colors with sufficient contrast
• Responsive sizing: Adjust word scaling based on container size
• Performance: Limit to top 50-100 words for large datasets

BUSINESS VALUE:
• Marketing copy: Use positive words in promotional materials
• Problem identification: Negative words highlight improvement areas
• Trend tracking: Compare word clouds across time periods
• Stakeholder reports: Visual summaries that tell a story at a glance
*/