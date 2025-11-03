/**
 * Venue Satisfaction Chart Component
 * 
 * Shows how venue/modality impacts satisfaction.
 * Answers: "How Does Venue/Modality Impact the Experience?"
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

interface VenueSatisfactionChartProps {
  data: any
  className?: string
}

export default function VenueSatisfactionChart({
  data,
  className = ''
}: VenueSatisfactionChartProps) {
  
  const chartData = React.useMemo(() => {
    if (!data || !data.data || !data.data.venue_distribution || !data.data.satisfaction_by_venue) {
      return []
    }
    
    // Map venue types to their satisfaction scores
    return data.data.venue_distribution
      .map((venue: any) => ({
        name: venue.venue_type,
        satisfaction: data.data.satisfaction_by_venue[venue.venue_type] || 0,
        count: venue.count,
        modality: venue.modality,
        percentage: venue.percentage
      }))
      .filter((item: any) => item.satisfaction > 0)
      .sort((a: any, b: any) => b.satisfaction - a.satisfaction)
  }, [data])

  // Color based on modality
  const getColorForVenue = (modality: string): string => {
    return modality === 'Online' ? '#ea4335' : '#4CAF50' // Red for Online, Green for In-Person
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    
    const item = payload[0].payload
    
    return (
      <div className="glass-card-dark p-2 rounded-lg border border-white/20">
        <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {item.name}
        </p>
        <div className="space-y-1 text-xs">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Type: <span className="font-semibold">{item.modality}</span>
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Avg Satisfaction: <span className="font-semibold text-green-400">{item.satisfaction}/5.0</span>
          </p>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Preferences: <span className="font-semibold">{item.count}</span> ({item.percentage}%)
          </p>
        </div>
      </div>
    )
  }

  if (!data || !data.data || chartData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
          <p>No venue satisfaction data available</p>
        </div>
      </div>
    )
  }

  const stats = data.data.stats
  const topVenue = chartData[0]

  return (
    <div className={`glass-card ${className}`}>
      {/* Chart with Header Inside */}
      <div className="glass-card-dark p-4 rounded-lg mb-4" style={{ minHeight: '400px' }}>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            How Does Venue/Modality Impact the Experience?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Average satisfaction by preferred venue type
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              stroke="rgba(255,255,255,0.3)"
              angle={-35}
              textAnchor="end"
              height={100}
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
            <Bar dataKey="satisfaction" name="Avg Satisfaction" barSize={50}>
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={getColorForVenue(entry.modality)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Top Venue</p>
          <p className="text-sm font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {topVenue?.name || 'N/A'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>
            {topVenue?.satisfaction}/5.0
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>In-Person</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#4CAF50' }}>
            {stats?.in_person_preference_count || 0}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Online</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#ea4335' }}>
            {stats?.online_preference_count || 0}
          </p>
        </div>
      </div>


    </div>
  )
}
