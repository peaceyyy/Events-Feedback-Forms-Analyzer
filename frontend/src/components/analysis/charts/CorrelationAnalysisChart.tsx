// CorrelationAnalysisChart.tsx - Aspect impact analysis on overall satisfaction
'use client'
import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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

export default function CorrelationAnalysisChart({
  data,
  title = "Aspect Impact Analysis",
  className = "",
  height = 400
}: CorrelationAnalysisChartProps) {

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
      </div>

      {/* Subtitle explanation */}
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        Visual relationship between aspect ratings and overall satisfaction
      </p>

      {/* Scatter Plot */}
      <div style={{ height: `${height}px` }}>
        {data.scatter_data ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ fontSize: '12px', marginTop: '-80px' }}
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
      <div className="mt-2 p-3 bg-white/5 rounded-lg">
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
    </div>
  )
}

