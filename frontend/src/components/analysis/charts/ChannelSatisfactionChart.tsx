/**
 * Discovery Channel Satisfaction Chart Component
 * 
 * Shows which event discovery channels bring the happiest attendees.
 * Answers: "Which Channels Bring in the Happiest Attendees?"
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
  Cell
} from 'recharts'

interface ChannelSatisfactionChartProps {
  data: any
  className?: string
}

export default function ChannelSatisfactionChart({
  data,
  className = ''
}: ChannelSatisfactionChartProps) {
  
  const chartData = React.useMemo(() => {
    if (!data || !data.channels) {
      return []
    }
    
    // Sort by satisfaction descending
    return [...data.channels]
      .sort((a: any, b: any) => b.avg_satisfaction - a.avg_satisfaction)
      .map((channel: any) => ({
        name: channel.event_discovery,
        satisfaction: channel.avg_satisfaction,
        count: channel.count,
        effectiveness: channel.effectiveness_score
      }))
  }, [data])

  // Color gradient based on satisfaction level
  const getColorForSatisfaction = (satisfaction: number): string => {
    if (satisfaction >= 4.5) return '#4CAF50' // Green
    if (satisfaction >= 4.0) return '#81C784' // Light Green
    if (satisfaction >= 3.5) return '#FFC107' // Yellow
    if (satisfaction >= 3.0) return '#FF9800' // Orange
    return '#F44336' // Red
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    
    const item = payload[0].payload
    
    return (
      <div className="glass-card-dark p-3 rounded-lg border border-white/20">
        <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {item.name}
        </p>
        <div className="space-y-1 text-xs">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Avg Satisfaction: <span className="font-semibold text-green-400">{item.satisfaction}/5.0</span>
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Attendees: <span className="font-semibold">{item.count}</span>
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Effectiveness: <span className="font-semibold">{Math.round(item.effectiveness)}%</span>
          </p>
        </div>
      </div>
    )
  }

  if (!data || !data.channels || chartData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
          <p>No discovery channel data available</p>
        </div>
      </div>
    )
  }

  const stats = data.stats
  const topChannel = chartData[0]

  return (
    <div className={`glass-card ${className}`}>
      {/* Chart with Header Inside */}
      <div className="glass-card-dark p-4 rounded-lg mb-4" style={{ minHeight: '400px' }}>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Which Channels Bring the Happiest Attendees?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Average satisfaction by event discovery channel
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              stroke="rgba(255,255,255,0.3)"
              angle={-35}
              textAnchor="end"
              height={80}
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
            <Bar dataKey="satisfaction" name="Avg Satisfaction" barSize={60}>
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getColorForSatisfaction(entry.satisfaction)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Top Channel</p>
          <p className="text-sm font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {topChannel?.name || 'N/A'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>
            {topChannel?.satisfaction}/5.0
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Total Channels</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {stats?.total_channels || 0}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Avg Overall</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {stats?.overall_avg_satisfaction || 'N/A'}/5
          </p>
        </div>
      </div>


    </div>
  )
}
