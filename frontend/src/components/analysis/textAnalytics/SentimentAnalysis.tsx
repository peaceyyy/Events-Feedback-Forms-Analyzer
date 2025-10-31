// components/analysis/textAnalytics/SentimentAnalysis.tsx
'use client'
import { 
  Mood as MoodIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material'

interface SentimentData {
  overall_sentiment: 'positive' | 'neutral' | 'negative'
  confidence_score: number
  sentiment_distribution: {
    positive: number
    neutral: number
    negative: number
  }
  key_emotions: string[]
  notable_patterns: string[]
}

interface SentimentAnalysisProps {
  data: SentimentData
  error?: string
}

export default function SentimentAnalysis({ data, error }: SentimentAnalysisProps) {
  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <MoodIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Sentiment Analysis
          </h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'var(--color-usc-green)'
      case 'negative': return 'var(--color-google-red)'
      default: return 'var(--color-usc-orange)'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    const color = getSentimentColor(sentiment)
    return <MoodIcon sx={{ fontSize: 32, color }} />
  }

  return (
    <div className="glass-card-dark p-6 rounded-xl elevation-2">
      <div className="flex items-center gap-3 mb-6">
        <PsychologyIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
        <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          AI Sentiment Analysis
        </h3>
      </div>

      {/* Overall Sentiment */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          {getSentimentIcon(data.overall_sentiment)}
          <div>
            <div className="text-xl font-bold capitalize" 
                 style={{ color: getSentimentColor(data.overall_sentiment) }}>
              {data.overall_sentiment}
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Overall Sentiment
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <TrendingUpIcon sx={{ fontSize: 32, color: 'var(--color-google-blue)' }} />
          <div>
            <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {data.confidence_score}%
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Confidence Score
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Sentiment Distribution
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(data.sentiment_distribution).map(([sentiment, count]) => (
            <div key={sentiment} className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-lg font-bold" 
                   style={{ color: getSentimentColor(sentiment) }}>
                {count}
              </div>
              <div className="text-sm capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                {sentiment}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Emotions */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Key Emotions Detected
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.key_emotions.map((emotion, index) => (
            <span key={index} 
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {emotion}
            </span>
          ))}
        </div>
      </div>

      {/* Notable Patterns */}
      <div>
        <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Notable Patterns
        </h4>
        <ul className="space-y-2">
          {data.notable_patterns.map((pattern, index) => (
            <li key={index} 
                className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
              <span className="text-blue-400 font-bold">•</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{pattern}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}