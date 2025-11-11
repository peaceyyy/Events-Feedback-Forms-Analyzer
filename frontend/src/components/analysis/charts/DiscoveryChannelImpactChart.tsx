// DiscoveryChannelImpactChart.tsx - Analyzing which marketing channels bring satisfied attendees
'use client'
import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, Line, ComposedChart, ReferenceLine } from 'recharts'
import { 
  TrendingUp as TrendingUpIcon, 
  AutoAwesome as AutoAwesomeIcon,
  Campaign as CampaignIcon,
  Lightbulb as LightbulbIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material'

interface ChannelData {
  event_discovery: string
  avg_satisfaction: number
  count: number
  std_dev: number
  effectiveness_score: number
}

interface AIInsights {
  key_insights?: string[]
  marketing_recommendations?: string[]
  growth_opportunities?: string[]
  budget_allocation?: string[]
  error?: string
}

interface DiscoveryChannelImpactChartProps {
  data?: {
    channels: ChannelData[]
    stats: {
      total_channels: number
      total_responses: number
      overall_avg_satisfaction: number
      channel_satisfaction_correlation: number | null
    }
    insights: string[]
    recommendations: string[]
  }
  title?: string
  className?: string
  height?: number
  onGenerateAIInsights?: (channelImpactData: DiscoveryChannelImpactChartProps['data']) => Promise<AIInsights>
}

type ChartVariant = 'satisfaction' | 'effectiveness' | 'dual'

export default function DiscoveryChannelImpactChart({
  data,
  title = "Discovery Channel Impact",
  className = "",
  height = 450,
  onGenerateAIInsights
}: DiscoveryChannelImpactChartProps) {
  const [variant, setVariant] = useState<ChartVariant>('dual')
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const handleGenerateAIInsights = async () => {
    if (!onGenerateAIInsights || !data?.channels) return
    
    setIsLoadingAI(true)
    try {
      const insights = await onGenerateAIInsights(data)  // Pass entire data object with channels and stats
      setAiInsights(insights)
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
      setAiInsights({ error: 'Failed to generate AI insights' })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const channel = payload[0].payload
      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 shadow-lg backdrop-blur-sm bg-opacity-95">
          <p className="font-semibold mb-3 text-base" style={{ color: 'var(--color-text-primary)' }}>
            {channel.event_discovery}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getSatisfactionColor(channel.avg_satisfaction) }}></span>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Satisfaction: <span className="font-bold text-white">{channel.avg_satisfaction}/5</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Attendees: <span className="font-bold text-white">{channel.count}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Effectiveness: <span className="font-bold text-white">{channel.effectiveness_score.toFixed(1)}%</span>
              </span>
            </div>
            {channel.std_dev > 0 && (
              <p className="text-xs text-gray-400 mt-1 pt-1 border-t border-white/10">
                Std Dev: ±{channel.std_dev}
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Get color based on satisfaction level
  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 4.5) return '#4CAF50'  // Excellent - Green
    if (satisfaction >= 4.0) return '#33b5e5'  // Good - Light Blue (changed from dark blue)
    if (satisfaction >= 3.5) return '#ffab00'  // Moderate - Yellow
    return '#ff8389'  // Poor - Red
  }

  // Get color based on effectiveness score with visual hierarchy
  const getEffectivenessColor = (score: number) => {
    if (score >= 90) return '#ff6f00'  // Excellent - Deep Orange
    if (score >= 80) return '#ff8f00'  // Very Good - Bright Orange
    if (score >= 70) return '#ffa726'  // Good - Medium Orange
    if (score >= 60) return '#ffb74d'  // Moderate - Light Orange
    return '#ffcc80'  // Lower - Pale Orange
  }

  if (!data || !data.channels || data.channels.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.5, marginBottom: 2 }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No discovery channel data available
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
      {/* Header with variant toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Which marketing channels bring the most satisfied attendees?
          </p>
        </div>
        
        {/* Chart variant selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setVariant('satisfaction')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              variant === 'satisfaction'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Satisfaction
          </button>
          <button
            onClick={() => setVariant('effectiveness')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              variant === 'effectiveness'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Effectiveness
          </button>
          <button
            onClick={() => setVariant('dual')}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              variant === 'dual'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Combined
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div style={{ height: `${height}px` }}>
        {variant === 'dual' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={data.channels} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="event_discovery"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                angle={-20}
                textAnchor="end"
                height={75}
                interval={0}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Avg Satisfaction (1-5)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
                domain={[0, 5]}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Attendee Count', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line for overall average satisfaction */}
              <ReferenceLine 
                yAxisId="left" 
                y={data.stats.overall_avg_satisfaction} 
                stroke="rgba(139, 92, 246, 0.4)" 
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{ 
                  value: `Overall Avg (${data.stats.overall_avg_satisfaction.toFixed(1)})`, 
                  position: 'insideTopRight',
                  fill: 'rgba(139, 92, 246, 0.8)',
                  fontSize: 11,
                  fontWeight: 500
                }}
              />
              
              <Bar yAxisId="left" dataKey="avg_satisfaction" name="Satisfaction" radius={[4, 4, 0, 0]} fill="#33b5e5">
                {data.channels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSatisfactionColor(entry.avg_satisfaction)} />
                ))}
              </Bar>
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="count" 
                name="Attendees"
                stroke="#ff9100" 
                strokeWidth={3}
                dot={{ fill: '#ff9100', r: 6, strokeWidth: 2.5, stroke: '#0f1720' }}
                activeDot={{ r: 8, strokeWidth: 2.5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data.channels} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="event_discovery"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                angle={-20}
                textAnchor="end"
                height={75}
                interval={0}
              />
              <YAxis 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: variant === 'satisfaction' ? 'Avg Satisfaction (1-5)' : 'Effectiveness Score (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
                domain={variant === 'satisfaction' ? [0, 5] : [0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Satisfaction-only: no reference line here (kept in Combined view) */}
              
              <Bar 
                dataKey={variant === 'satisfaction' ? 'avg_satisfaction' : 'effectiveness_score'} 
                radius={[4, 4, 0, 0]}
                fill="#33b5e5"
              >
                {data.channels.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={variant === 'satisfaction' 
                      ? getSatisfactionColor(entry.avg_satisfaction)
                      : getEffectivenessColor(entry.effectiveness_score)
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

  {/* Insights Panel */}
  <div className="mt-4 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
            {aiInsights ? (
              <>
                <AutoAwesomeIcon sx={{ fontSize: 16 }} className="text-purple-400" />
                <span>AI-Powered Insights</span>
              </>
            ) : (
              <>
                <TrendingUpIcon sx={{ fontSize: 16 }} />
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
              {/* Key Insights */}
              {aiInsights.key_insights?.map((insight, index) => (
                <li key={`ai-${index}`} className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="text-purple-400 mt-0.5">✦</span>
                  <span>{insight}</span>
                </li>
              ))}
            </>
          ) : (
            /* Fallback to basic insights */
            data.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Recommendations: Only show if AI insights have been generated */}
      {aiInsights?.marketing_recommendations && aiInsights.marketing_recommendations.length > 0 && (
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <h4 className="font-semibold mb-2 text-sm text-blue-400 flex items-center gap-2">
            <CampaignIcon sx={{ fontSize: 16 }} />
            <span>Strategic Recommendations</span>
          </h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {aiInsights.marketing_recommendations.map((rec, index) => (
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
            <LightbulbIcon sx={{ fontSize: 16 }} />
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

      {/* Budget Allocation (AI only) */}
      {aiInsights?.budget_allocation && aiInsights.budget_allocation.length > 0 && (
        <div className="mt-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <h4 className="font-semibold mb-2 text-sm text-orange-400 flex items-center gap-2">
            <AttachMoneyIcon sx={{ fontSize: 16 }} />
            <span>Budget Allocation</span>
          </h4>
          <ul className="space-y-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {aiInsights.budget_allocation.map((alloc, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-400">$</span>
                <span>{alloc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.stats.total_channels}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Channels
          </div>
        </div>
        
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {data.stats.overall_avg_satisfaction.toFixed(1)}/5
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Overall Avg
          </div>
        </div>
      </div>
    </div>
  )
}

