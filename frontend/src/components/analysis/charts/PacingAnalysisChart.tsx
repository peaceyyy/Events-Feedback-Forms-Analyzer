// PacingAnalysisChart.tsx - Visualization for pacing vs satisfaction correlation
'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PacingData {
  category: string
  value: number
  count: number
  std_dev?: number
}

interface PacingAnalysisChartProps {
  data?: {
    chart_data: PacingData[]
    stats: {
      total_responses: number
      best_pacing: string
      worst_pacing: string
      satisfaction_range: {
        highest: number
        lowest: number
        difference: number
      }
    }
    insights: string[]
  }
  title?: string
  className?: string
  height?: number
}

export default function PacingAnalysisChart({
  data,
  title = "Pacing vs Satisfaction Analysis",
  className = "",
  height = 400
}: PacingAnalysisChartProps) {

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload
      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 shadow-lg">
          <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Pacing: {label}
          </p>
          <p style={{ color: 'var(--color-usc-green)' }}>
            Avg Satisfaction: {itemData.value?.toFixed(1) || '0'}/5
          </p>
          <p style={{ color: 'var(--color-google-blue)' }}>
            Responses: {itemData.count || 0} ({((itemData.count / (itemData.total || 1)) * 100).toFixed(1)}%)
          </p>
          {(itemData.std_dev !== undefined && itemData.std_dev !== null) && (
            <p style={{ color: 'var(--color-text-secondary)' }} className="text-xs mt-1">
              Std Dev: ±{itemData.std_dev.toFixed(2)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Color mapping based on satisfaction level
  const getBarColor = (value: number) => {
    if (value >= 4.5) return '#42be65' // Excellent - Green
    if (value >= 4.0) return '#78a9ff' // Good - Blue
    if (value >= 3.5) return '#ffab00' // Fair - Yellow
    if (value >= 3.0) return '#ff832b' // Poor - Orange
    return '#ff8389' // Very Poor - Red
  }

  if (!data || !data.chart_data || data.chart_data.length === 0) {
    return (
      <div className={`glass-card-dark p-6 rounded-xl ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-50">⏱️</div>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No pacing data available for analysis
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Add total responses to each data point for percentage calculation
  const chartData = data.chart_data.map(item => ({
    ...item,
    total: data.stats.total_responses
  }))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Chart */}
      <div className="glass-card-dark p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
        
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                domain={[0, 5]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                label={{ 
                  value: 'Average Satisfaction (1-5)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        {data.insights && data.insights.length > 0 && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Key Insights
            </h4>
            <ul className="space-y-1">
              {data.insights.map((insight, index) => (
                <li 
                  key={index}
                  className="text-sm flex items-start gap-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span className="text-blue-400">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="glass-card-dark p-4 rounded-xl">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center justify-center px-2 py-1" style={{ minWidth: '0', lineHeight: 1.15 }}>
            <span className="font-bold text-base mb-0" style={{ color: '#78a9ff', lineHeight: 1.7 }}>{data.stats.best_pacing}</span>
            <span className="text-s" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.15 }}>Best Pacing</span>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-1" style={{ minWidth: '0', lineHeight: 1.10 }}>
            <span className="font-bold text-base mb-0" style={{ color: '#ffab00', lineHeight: 1.7 }}>{data.stats.satisfaction_range.highest.toFixed(1)}/5</span>
            <span className="text-s" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.15 }}>Highest Satisfaction</span>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-1" style={{ minWidth: '0', lineHeight: 1.15 }}>
            <span className="font-bold text-base mb-0" style={{ color: '#ff8389', lineHeight: 1.7 }}>±{data.stats.satisfaction_range.difference.toFixed(1)}</span>
            <span className="text-s" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.15 }}>Pacing Impact</span>
          </div>
        </div>
      </div>
    </div>
  )
}