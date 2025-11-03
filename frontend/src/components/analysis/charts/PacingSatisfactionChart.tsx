/**
 * Pacing vs Satisfaction Chart Component
 * 
 * Shows how event pacing affects overall satisfaction.
 * Answers: "Does Pacing Affect Satisfaction?"
 */

'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'

interface PacingSatisfactionChartProps {
  data: any
  className?: string
}

export default function PacingSatisfactionChart({
  data,
  className = ''
}: PacingSatisfactionChartProps) {
  
  const chartData = React.useMemo(() => {
    if (!data || !data.data || !data.data.chart_data) {
      return []
    }
    
    return data.data.chart_data.map((item: any) => ({
      category: item.category,
      satisfaction: item.value,
      count: item.count
    }))
  }, [data])

  // Color mapping based on pacing category
  const getColorForPacing = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'just right':
        return '#4CAF50' // Green - optimal
      case 'too slow':
        return '#FF9800' // Orange
      case 'too fast':
        return '#F44336' // Red
      default:
        return '#9E9E9E' // Gray
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    
    const item = payload[0].payload
    
    return (
      <div className="glass-card-dark p-3 rounded-lg border border-white/20">
        <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Pacing: {item.category}
        </p>
        <div className="space-y-1 text-xs">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Avg Satisfaction: <span className="font-semibold text-green-400">{item.satisfaction}/5.0</span>
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Responses: <span className="font-semibold">{item.count}</span>
          </p>
        </div>
      </div>
    )
  }

  if (!data || !data.data || chartData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
          <p>No pacing satisfaction data available</p>
        </div>
      </div>
    )
  }

  const stats = data.data.stats

  return (
    <div className={`glass-card ${className}`}>
      {/* Chart with Header Inside */}
      <div className="glass-card-dark p-4 rounded-lg mb-4" style={{ minHeight: '400px' }}>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Does Pacing Affect Satisfaction?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Average satisfaction scores grouped by event pacing feedback
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="category"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="rgba(255,255,255,0.3)"
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              stroke="rgba(255,255,255,0.3)"
              label={{
                value: 'Average Satisfaction',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="satisfaction" name="Avg Satisfaction" barSize={80}>
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getColorForPacing(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card-dark p-2 rounded-lg flex flex-col justify-center items-center" style={{ lineHeight: 1.2, minHeight: '56px' }}>
          <p className="text-xs mb-0" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.2 }}>Best Pacing</p>
          <p className="text-base font-bold mt-1 mb-0" style={{ color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            {stats?.best_pacing || 'N/A'}
          </p>
        </div>
        <div className="glass-card-dark p-2 rounded-lg flex flex-col justify-center items-center" style={{ lineHeight: 1.2, minHeight: '56px' }}>
          <p className="text-xs mb-0" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.2 }}>Highest Score</p>
          <p className="text-base font-bold mt-1 mb-0" style={{ color: '#4CAF50', lineHeight: 1.2 }}>
            {stats?.satisfaction_range?.highest || 'N/A'}/5.0
          </p>
        </div>
      </div>

      {/* Insights - reduce top margin and padding for compactness */}
      {data.insights && data.insights.length > 0 && (
        <div className="mt-2 p-2 glass-card-dark rounded-lg" style={{ lineHeight: 1.3 }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-tertiary)', lineHeight: 1.2 }}>
            Key Insight
          </p>
          <p className="text-sm mb-0" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
            {data.insights[0]}
          </p>
        </div>
      )}
    </div>
  )
}
