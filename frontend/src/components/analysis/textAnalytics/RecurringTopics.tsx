// components/analysis/textAnalytics/RecurringTopics.tsx
'use client'
import { 
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material'

interface RecurringTopicsProps {
  topics: string[]
  error?: string
}

export default function RecurringTopics({ topics, error }: RecurringTopicsProps) {
  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <LightbulbIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recurring Topics
          </h4>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="glass-card-dark p-6 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <LightbulbIcon sx={{ fontSize: 24, color: 'var(--color-text-secondary)' }} />
          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recurring Topics
          </h4>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          No recurring topics identified in the feedback analysis.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card-dark p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <LightbulbIcon sx={{ fontSize: 24, color: 'var(--color-usc-orange)' }} />
        <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Recurring Topics
        </h4>
        <span className="ml-auto text-sm px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
          {topics.length} topics identified
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <span 
            key={index} 
            className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}