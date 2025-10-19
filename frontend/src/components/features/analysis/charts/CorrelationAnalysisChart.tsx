// CorrelationAnalysisChart.tsx - Aspect impact analysis on overall satisfaction
'use client'
import React, { useState } from 'react'
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material'

interface CorrelationData {
  aspect: string
  correlation: number
  impact_level: 'high' | 'medium' | 'low'
  sample_size: number
}

interface CorrelationAnalysisChartProps {
  data?: {
    correlations: CorrelationData[]
    scatter_data?: {
      aspect: string
      points: Array<{ aspect_rating: number; satisfaction: number }>
    }[]
  }
  title?: string
  className?: string
  height?: number
}

type ChartVariant = 'bar' | 'scatter'

export default function CorrelationAnalysisChart({
  data,
  title = "Aspect Impact Analysis",
  className = "",
  height = 400
}: CorrelationAnalysisChartProps) {
  const [variant, setVariant] = useState<ChartVariant>('bar')

  // Custom tooltip for correlation bars
  const CorrelationTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 shadow-lg">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {data.aspect}
          </p>
          <p style={{ color: data.correlation > 0.7 ? '#42be65' : data.correlation > 0.5 ? '#ffab00' : '#ff8389' }}>
            Correlation: {(data.correlation * 100).toFixed(1)}%
          </p>
          <p style={{ color: 'var(--color-google-blue)' }} className="text-sm">
            Impact: {data.impact_level.toUpperCase()}
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mt-1">
            Based on {data.sample_size} responses
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for scatter plots
  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      return (
        <div className="glass-card-dark p-3 rounded-lg border border-white/20 shadow-lg">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Aspect Rating: {point.aspect_rating}/5
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Satisfaction: {point.satisfaction}/5
          </p>
        </div>
      )
    }
    return null
  }

  // Get color based on correlation strength
  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return '#42be65' // Strong - Green
    if (correlation > 0.5) return '#78a9ff' // Moderate - Blue
    if (correlation > 0.3) return '#ffab00' // Weak - Yellow
    return '#ff8389' // Very Weak - Red
  }

  // Get aspect color for scatter plots
  const getAspectColor = (aspect: string) => {
    if (aspect.toLowerCase().includes('venue')) return '#78a9ff'
    if (aspect.toLowerCase().includes('speaker')) return '#42be65'
    if (aspect.toLowerCase().includes('content')) return '#ffab00'
    return '#ff8389'
  }

  if (!data || !data.correlations || data.correlations.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.5, marginBottom: 2 }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No correlation data available for analysis
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Sort correlations by strength (highest first)
  const sortedCorrelations = [...data.correlations].sort((a, b) => b.correlation - a.correlation)

  return (
    <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
      {/* Header with variant toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        
        {/* Chart variant selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setVariant('bar')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              variant === 'bar'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Correlation Bars
          </button>
          {data.scatter_data && (
            <button
              onClick={() => setVariant('scatter')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                variant === 'scatter'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Scatter Plot
            </button>
          )}
        </div>
      </div>

      {/* Subtitle explanation */}
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        {variant === 'bar' 
          ? 'Higher correlation = stronger impact on overall satisfaction'
          : 'Visual relationship between aspect ratings and overall satisfaction'
        }
      </p>

      {/* Chart Display */}
      <div style={{ height: `${height}px` }}>
        {variant === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedCorrelations} 
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number"
                domain={[0, 1]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Correlation Strength (0-1)', 
                  position: 'insideBottom',
                  offset: -5,
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
              />
              <YAxis 
                type="category"
                dataKey="aspect" 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                width={10}
              />
              <Tooltip content={<CorrelationTooltip />} />
              <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                {sortedCorrelations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorrelationColor(entry.correlation)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : data.scatter_data ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number"
                dataKey="aspect_rating"
                domain={[0, 5]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Aspect Rating (1-5)', 
                  position: 'insideBottom',
                  offset: -15,
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
              />
              <YAxis 
                type="number"
                dataKey="satisfaction"
                domain={[0, 5]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Overall Satisfaction (1-5)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
              />
              <Tooltip content={<ScatterTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
              {data.scatter_data.map((aspectData, index) => (
                <Scatter
                  key={index}
                  name={aspectData.aspect}
                  data={aspectData.points}
                  fill={getAspectColor(aspectData.aspect)}
                  fillOpacity={0.6}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Scatter plot data not available
            </p>
          </div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="mt-4 p-4 bg-white/5 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--color-text-primary)' }}>
          Key Findings
        </h4>
        <ul className="space-y-1 text-sm">
          <li className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="text-green-400">•</span>
            <span>
              <strong style={{ color: '#42be65' }}>{sortedCorrelations[0].aspect}</strong> has the strongest impact 
              ({(sortedCorrelations[0].correlation * 100).toFixed(0)}% correlation)
            </span>
          </li>
          {sortedCorrelations.length > 1 && (
            <li className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="text-yellow-400">•</span>
              <span>
                Focus on improving <strong>{sortedCorrelations[0].aspect.toLowerCase()}</strong> for maximum satisfaction boost
              </span>
            </li>
          )}
          {sortedCorrelations.some(c => c.correlation < 0.5) && (
            <li className="flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="text-red-400">•</span>
              <span>
                {sortedCorrelations.filter(c => c.correlation < 0.5).map(c => c.aspect).join(' and ')} show weaker correlation - 
                less impact on overall satisfaction
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Correlation Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#42be65' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Strong (&gt;70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#78a9ff' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Moderate (50-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ffab00' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Weak (30-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ff8389' }}></div>
          <span style={{ color: 'var(--color-text-secondary)' }}>Very Weak (&lt;30%)</span>
        </div>
      </div>
    </div>
  )
}

// Sidebar Theory: Correlation Analysis for Event Aspects
/*
CORRELATION ANALYSIS - UNDERSTANDING IMPACT:

WHAT IT MEASURES:
• Statistical relationship between aspect ratings (Venue, Speakers, Content) and overall satisfaction
• Correlation coefficient ranges from 0 (no relationship) to 1 (perfect relationship)
• **Higher correlation = aspect has stronger influence on overall satisfaction**

WHY IT MATTERS:
• Resource Allocation: Focus improvements on high-correlation aspects for maximum ROI
• Priority Setting: Identify which aspects drive satisfaction vs. which are secondary
• Strategic Planning: Understand cause-and-effect relationships in event success
• Budget Justification: Data-backed decisions on where to invest resources

INTERPRETATION GUIDE:
• **Strong (>0.7)**: Major satisfaction driver - prioritize improvements here
• **Moderate (0.5-0.7)**: Meaningful impact - consider as secondary priority
• **Weak (0.3-0.5)**: Minor impact - improvements have limited effect
• **Very Weak (<0.3)**: Little relationship - may not influence overall satisfaction

REAL-WORLD EXAMPLE:
If "Speakers" has 0.85 correlation and "Venue" has 0.45 correlation:
→ Investing in better speakers will dramatically boost satisfaction
→ Upgrading venue has less impact on overall satisfaction
→ Budget allocation should prioritize speaker quality over venue aesthetics

CHART VARIANTS:
1. **Bar Chart (Default)**: Direct comparison of correlation strengths - best for quick insights
2. **Scatter Plot**: Visual representation of individual responses - shows relationship patterns

BUSINESS IMPLICATIONS:
• High-correlation aspects are your "satisfaction levers"
• Low-correlation aspects might be "table stakes" (expected but don't drive satisfaction)
• Use this to justify budget allocations to stakeholders
• Track changes over time to see if correlation patterns shift

STATISTICAL NOTE:
• Correlation ≠ Causation (but suggests strong relationship)
• Based on Pearson correlation coefficient
• Requires sufficient sample size (30+ responses minimum)
• Can reveal unexpected insights about what truly matters to attendees
*/
