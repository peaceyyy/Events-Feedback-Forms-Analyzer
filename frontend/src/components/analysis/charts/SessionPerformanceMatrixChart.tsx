// SessionPerformanceMatrixChart.tsx - Bubble chart showing session attendance vs satisfaction
'use client'
import React, { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis, Legend, ReferenceLine } from 'recharts'
import { 
  Assessment as AssessmentIcon, 
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  TrackChanges as TrackChangesIcon
} from '@mui/icons-material'

interface SessionData {
  session: string
  attendance: number
  avg_satisfaction: number
  response_count: number
  category: 'Star' | 'Hidden Gem' | 'Crowd Favorite' | 'Needs Improvement'
  color: string
}

interface AIInsights {
  key_insights?: string[]
  strategic_recommendations?: string[]
  growth_opportunities?: string[]
  risk_areas?: string[]
  error?: string
}

interface SessionPerformanceMatrixChartProps {
  data?: {
    sessions: SessionData[]
    quadrants: {
      stars: number
      hidden_gems: number
      crowd_favorites: number
      needs_improvement: number
    }
    thresholds: {
      median_attendance: number
      median_satisfaction: number
    }
    insights: string[]
    stats: {
      total_sessions: number
      avg_attendance: number
      avg_satisfaction: number
    }
  }
  title?: string
  className?: string
  height?: number
  onGenerateAIInsights?: (sessionMatrixData: SessionPerformanceMatrixChartProps['data']) => Promise<AIInsights>
}

export default function SessionPerformanceMatrixChart({
  data,
  title = "Session Performance Matrix",
  className = "",
  height = 500,
  onGenerateAIInsights
}: SessionPerformanceMatrixChartProps) {
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const handleGenerateAIInsights = async () => {
    if (!onGenerateAIInsights || !data?.sessions) return
    
    setIsLoadingAI(true)
    try {
      const insights = await onGenerateAIInsights(data)  // Pass entire data object with sessions, quadrants, stats
      setAiInsights(insights)
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
      setAiInsights({ error: 'Failed to generate AI insights' })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const session = payload[0].payload
      return (
        <div className="glass-card-theme p-4 rounded-lg border border-white/20 shadow-lg">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {session.session}
          </p>
          <div className="space-y-1 text-sm">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Attendance: <span className="font-bold text-blue-400">{session.attendance}</span> attendees
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Avg Satisfaction: <span className="font-bold text-green-400">{session.avg_satisfaction}/5</span>
            </p>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
              session.category === 'Star' ? 'bg-green-500/20 text-green-300' :
              session.category === 'Hidden Gem' ? 'bg-blue-500/20 text-blue-300' :
              session.category === 'Crowd Favorite' ? 'bg-orange-500/20 text-orange-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {session.category}
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (!data || !data.sessions || data.sessions.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <AssessmentIcon sx={{ fontSize: 48, opacity: 0.5, marginBottom: 2 }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No session performance data available
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Transform data for bubble chart (z-axis = bubble size)
  const chartData = data.sessions.map(session => ({
    ...session,
    x: session.attendance,
    y: session.avg_satisfaction,
    z: session.attendance * 20 // Bubble size proportional to attendance
  }))

  return (
    <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Bubble size = attendance • Position = satisfaction vs attendance
        </p>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 100, bottom: 60, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-chart)" />
            
            {/* X-axis: Attendance */}
            <XAxis 
              type="number"
              dataKey="x"
              name="Attendance"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-axis-line)' }}
              label={{ 
                value: 'Attendance Count', 
                position: 'insideBottom',
                offset: -15,
                style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
              }}
            />
            
            {/* Y-axis: Satisfaction */}
            <YAxis 
              type="number"
              dataKey="y"
              name="Satisfaction"
              domain={[0, 5]}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-axis-line)' }}
              label={{ 
                value: 'Avg Satisfaction (1-5)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
              }}
            />
            
            {/* Z-axis for bubble size */}
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
            
            {/* Quadrant divider lines */}
            <ReferenceLine 
              x={data.thresholds.median_attendance} 
              stroke="#FFC107" 
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <ReferenceLine 
              y={data.thresholds.median_satisfaction} 
              stroke="#FFC107" 
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Legend */}
            <Legend 
              verticalAlign="middle"
              align="right"
              layout="vertical"
              wrapperStyle={{ paddingLeft: '20px' }}
              content={() => (
                <div className="space-y-2 text-xs">
                  <div className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Quadrants
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Star ({data.quadrants.stars})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Hidden Gem ({data.quadrants.hidden_gems})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Crowd Fav ({data.quadrants.crowd_favorites})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Needs Work ({data.quadrants.needs_improvement})
                    </span>
                  </div>
                </div>
              )}
            />
            
            {/* Scatter plot with colored bubbles */}
            <Scatter name="Sessions" data={chartData} fillOpacity={0.7}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights Panel */}
      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
            {aiInsights ? (
              <>
                <AutoAwesomeIcon sx={{ fontSize: 16 }} className="text-purple-400" />
                <span>AI-Powered Insights</span>
              </>
            ) : (
              <>
                <AssessmentIcon sx={{ fontSize: 16 }} />
                <span>Key Insights</span>
              </>
            )}
          </h4>
          
          {/* AI Insights Button */}
          {onGenerateAIInsights && (
            <button
              onClick={handleGenerateAIInsights}
              disabled={isLoadingAI}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isLoadingAI
                  ? 'bg-gray-500/20 cursor-not-allowed'
                  : 'hover:bg-white/10 border'
              }`}
              style={{
                backgroundColor: isLoadingAI ? undefined : 'var(--color-surface-elevated)',
                color: isLoadingAI ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                borderColor: isLoadingAI ? undefined : 'var(--color-border-theme)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 14 }} />
              {isLoadingAI ? 'Generating...' : aiInsights ? 'Refresh AI Insights' : 'Generate AI Insights'}
            </button>
          )}
        </div>

        {/* Display AI or Basic Insights */}
        <ul className="space-y-2 text-sm">
          {aiInsights && !aiInsights.error ? (
            <>
              {aiInsights.key_insights?.map((insight, index) => (
                <li key={`ai-${index}`} className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="text-purple-400 mt-0.5">✦</span>
                  <span>{insight}</span>
                </li>
              ))}
            </>
          ) : (
            data.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Strategic Recommendations (AI only) */}
      {aiInsights?.strategic_recommendations && aiInsights.strategic_recommendations.length > 0 && (
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <h4 className="font-semibold mb-2 text-sm text-blue-400 flex items-center gap-2">
            <TrackChangesIcon sx={{ fontSize: 16 }} />
            <span>Strategic Recommendations</span>
          </h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {aiInsights.strategic_recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Growth Opportunities (AI only) */}
      {aiInsights?.growth_opportunities && aiInsights.growth_opportunities.length > 0 && (
        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <h4 className="font-semibold mb-2 text-sm text-green-400 flex items-center gap-2">
            <TrendingUpIcon sx={{ fontSize: 16 }} />
            <span>Growth Opportunities</span>
          </h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {aiInsights.growth_opportunities.map((opp, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-400">↗</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Areas (AI only) */}
      {aiInsights?.risk_areas && aiInsights.risk_areas.length > 0 && (
        <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <h4 className="font-semibold mb-2 text-sm text-red-400 flex items-center gap-2">
            <WarningIcon sx={{ fontSize: 16 }} />
            <span>Risk Areas</span>
          </h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {aiInsights.risk_areas.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-400">!</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
          <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.stats.total_sessions}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Total Sessions
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
          <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.stats.avg_attendance.toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Avg Attendance
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
          <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.stats.avg_satisfaction.toFixed(1)}/5
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Avg Satisfaction
          </div>
        </div>
      </div>
    </div>
  )
}

// Sidebar Theory: Session Performance Matrix
/*
SESSION PERFORMANCE MATRIX - QUADRANT ANALYSIS:

WHAT IT SHOWS:
• X-axis (Horizontal): Session attendance count
• Y-axis (Vertical): Average satisfaction rating
• Bubble size: Proportional to attendance (larger = more attendees)
• Color: Category based on quadrant position

FOUR QUADRANTS:
1. **STARS** (Top-Right) - Green
   - High attendance + High satisfaction
   - Your winning sessions - replicate their success
   - Showcase these in marketing materials

2. **HIDDEN GEMS** (Top-Left) - Blue
   - Low attendance BUT high satisfaction
   - Quality content, poor promotion
   - Growth opportunity: increase visibility

3. **CROWD FAVORITES** (Bottom-Right) - Orange
   - High attendance BUT lower satisfaction
   - Popular topic, execution issues
   - Focus: improve content quality, speaker selection

4. **NEEDS IMPROVEMENT** (Bottom-Left) - Red
   - Low attendance + Low satisfaction
   - Consider discontinuing or major overhaul
   - Not resonating with audience

STRATEGIC DECISIONS:
• **Resource Allocation:** Invest more in Star and Hidden Gem sessions
• **Marketing:** Promote Hidden Gems to increase attendance
• **Content Improvement:** Fix Crowd Favorites before next event
• **Sunset Decisions:** Phase out Needs Improvement sessions

BUSINESS IMPLICATIONS:
• Session scheduling: Stars get prime time slots
• Speaker invitations: Replicate successful formats
• Budget planning: Cut losses from underperformers
• Attendee targeting: Promote gems to right audience segments

REAL-WORLD EXAMPLE:
If "Advanced React Patterns" is a Hidden Gem:
→ High satisfaction (4.8/5) but only 15 attendees
→ Action: Better pre-event promotion, clearer session title
→ Potential: Could become a Star with proper marketing
→ ROI: High-quality content already proven, just needs reach

MEDIAN LINES (Yellow Dashed):
• Vertical line: Median attendance (splits left/right quadrants)
• Horizontal line: Median satisfaction (splits top/bottom quadrants)
• These define the performance thresholds for categorization
*/
