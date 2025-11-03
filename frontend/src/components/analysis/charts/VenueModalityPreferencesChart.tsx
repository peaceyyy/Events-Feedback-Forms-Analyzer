// components/VenueModalityPreferencesChart.tsx - Venue and modality preference visualization
'use client'
import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts'

interface VenueModalityPreferencesChartProps {
  data: any
  variant?: 'venue_breakdown' | 'modality_split'
  className?: string
}

export default function VenueModalityPreferencesChart({ 
  data, 
  variant = 'venue_breakdown',
  className = "" 
}: VenueModalityPreferencesChartProps) {

  // Transform data for charts
  const venueData = React.useMemo(() => {
    if (!data || !data.data || !data.data.venue_distribution) {
      return []
    }
    
    return data.data.venue_distribution.map((item: any) => ({
      name: item.venue_type,
      value: item.count,
      percentage: item.percentage,
      modality: item.modality,
      satisfaction: data.data.satisfaction_by_venue?.[item.venue_type] || null,
      fill: item.modality === 'Online' ? '#ea4335' : '#4CAF50' // Google Red for Online, USC Green for In-Person
    }))
  }, [data])

  const modalityData = React.useMemo(() => {
    if (!data || !data.data || !data.data.modality_breakdown) {
      return []
    }
    
    return data.data.modality_breakdown.map((item: any) => ({
      name: item.modality,
      value: item.count,
      percentage: item.percentage,
      fill: item.modality === 'Online' ? '#ea4335' : '#4CAF50' // Google Red for Online, USC Green for In-Person
    }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    
    const item = payload[0].payload
    
    return (
      <div className="glass-card-dark p-3 rounded-lg border border-white/20">
        <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
          {item.name}
        </p>
        <div className="space-y-1 text-xs">
          {item.modality && (
            <p style={{color: 'var(--color-text-secondary)'}}>
              Type: <span className="font-semibold">{item.modality}</span>
            </p>
          )}
          <p style={{color: 'var(--color-text-secondary)'}}>
            Responses: <span className="font-semibold">{item.value}</span> ({item.percentage}%)
          </p>
          {item.satisfaction && (
            <p style={{color: 'var(--color-text-secondary)'}}>
              Avg Satisfaction: <span className="font-semibold text-green-400">{item.satisfaction}/5.0</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  const renderVenueBreakdown = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={venueData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ 
              value: 'Number of Preferences', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Preferences" barSize={50}>
            {venueData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderModalitySplit = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={modalityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            dataKey="value"
          >
            {modalityData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px', 
              paddingTop: '10px',
              color: 'var(--color-text-secondary)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (!data || !data.data) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{color: 'var(--color-text-secondary)'}}>
          <p>No venue preference data available</p>
        </div>
      </div>
    )
  }

  if (venueData.length === 0 && modalityData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{color: 'var(--color-text-secondary)'}}>
          <p>No venue data to display</p>
        </div>
      </div>
    )
  }

  const stats = data.data.stats

  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
          Venue & Modality Preferences
        </h3>
        <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
          {variant === 'venue_breakdown' 
            ? 'Preferred venue types by attendees' 
            : 'Online vs In-Person preference split'}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.specified_responses}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Venues</p>
          <p className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.unique_venues}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Online</p>
          <p className="text-2xl font-bold mt-1" style={{color: '#ea4335'}}>
            {stats.online_preference_count}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>In-Person</p>
          <p className="text-2xl font-bold mt-1" style={{color: 'var(--color-usc-green)'}}>
            {stats.in_person_preference_count}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4">
        {variant === 'venue_breakdown' ? renderVenueBreakdown() : renderModalitySplit()}
      </div>

      {/* Most Popular Venue Callout */}
      {stats.most_popular_venue && variant === 'venue_breakdown' && (
        <div className="mt-4 glass-card-dark p-4 rounded-lg border-l-4" style={{borderColor: 'var(--color-usc-green)'}}>
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Most Preferred</p>
          <p className="text-lg font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.most_popular_venue.venue_type}
          </p>
          <p className="text-sm mt-1" style={{color: 'var(--color-text-secondary)'}}>
            {stats.most_popular_venue.count} responses ({stats.most_popular_venue.percentage}%)
          </p>
        </div>
      )}
    </div>
  )
}
