// components/TimeSlotPreferencesChart.tsx - Time slot preference visualization
'use client'
import React from 'react'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

interface TimeSlotPreferencesChartProps {
  data: any
  variant?: 'pie' | 'bar'
  className?: string
}

export default function TimeSlotPreferencesChart({
  data,
  variant: initialVariant = 'pie',
  className = "flex-1" 
}: TimeSlotPreferencesChartProps) { 
  const [variant, setVariant] = React.useState<'pie' | 'bar'>(initialVariant) 
  const chartData = React.useMemo(() => {
    if (!data || !data.data || !data.data.distribution) {
      return []
    }
    
    return data.data.distribution.map((item: any) => ({
      name: item.time_slot,
      value: item.count,
      percentage: item.percentage,
      satisfaction: data.data.satisfaction_by_time?.[item.time_slot] || null
    }))
  }, [data])

  // Color palette for time slots - using app theme colors
  const COLORS = ['#4CAF50', '#FF9800', '#4285f4', '#FFC107', '#81C784']

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null
    
    const data = payload[0].payload
    
    return (
      <div className="glass-card-theme p-3 rounded-lg border border-white/20">
        <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
          {data.name}   
        </p>
        <div className="space-y-1 text-xs">
          <p style={{color: 'var(--color-text-secondary)'}}>
            Responses: <span className="font-semibold">{data.value}</span> ({data.percentage}%)
          </p>
          {data.satisfaction && (
            <p style={{color: 'var(--color-text-secondary)'}}>
              Avg Satisfaction: <span className="font-semibold text-green-400">{data.satisfaction}/5.0</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    return (
      <div style={{ overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            {/* Custom label renderer positions labels outside the pie to avoid clipping */}
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={true}
              label={renderCustomizedLabel}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      </div>
    )
  }

  // Custom label renderer for Pie to place labels outside slices with connector lines
  function renderCustomizedLabel({ cx, cy, midAngle, outerRadius, index, percent }: any) {
    const RAD = Math.PI / 180
    const radius = outerRadius + 22 // offset labels slightly outside the slice
    const x = cx + radius * Math.cos(-midAngle * RAD)
    const y = cy + radius * Math.sin(-midAngle * RAD)

    const textAnchor = x > cx ? 'start' : 'end'
    const entry = chartData && chartData[index]
    const label = entry ? `${entry.name}: ${entry.percentage}%` : `${Math.round((percent || 0) * 100)}%`

    return (
      <text x={x} y={y} fill="var(--color-text-primary)" textAnchor={textAnchor} dominantBaseline="central" style={{ fontSize: 12 }}>
        {label}
      </text>
    )
  }

  const renderBarChart = () => {
    return (
      <div style={{ overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-chart)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="var(--color-axis-line)"
            angle={-25}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="var(--color-axis-line)"
            label={{ 
              value: 'Number of Responses', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Preferences" barSize={60}>
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    )
  }

  if (!data || !data.data) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{color: 'var(--color-text-secondary)'}}>
          <p>No time slot preference data available</p>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{color: 'var(--color-text-secondary)'}}>
          <p>No time slot data to display</p>
        </div>
      </div>
    )
  }

  const stats = data.data.stats

  return (
    <div className={`glass-card  ${className}`}>
      {/* Chart */}
      <div className="glass-card-dark p-4 rounded-lg mb-4" style={{minHeight: '420px'}}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
              Preferred Time Slots
            </h3>
            <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              When attendees prefer sessions to be scheduled
            </p>
          </div>
          {/* Toggle between Pie and Bar */}
          <div className="flex gap-2">
            <button
              onClick={() => setVariant('pie')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors border ${
                variant === 'pie' 
                  ? 'bg-blue-500/30 border-blue-400/50' 
                  : ''
              }`}
              style={variant !== 'pie' ? {
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border-theme)'
              } : { color: 'var(--color-text-secondary)' }}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setVariant('bar')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors border ${
                variant === 'bar' 
                  ? 'bg-blue-500/30 border-blue-400/50' 
                  : ''
              }`}
              style={variant !== 'bar' ? {
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border-theme)'
              } : { color: 'var(--color-text-secondary)' }}
            >
              Bar Chart
            </button>
          </div>
        </div>
        {variant === 'pie' ? renderPieChart() : renderBarChart()}
      </div>

      {/* Stats Summary */}
      <div className="glass-card-dark p-3 rounded-lg flex flex-row items-center justify-between">
        <div className="flex-1 text-center">
          <div className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Total Responses</div>
          <div className="text-xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.specified_responses}
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Time Slots</div>
          <div className="text-xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.unique_time_slots}
          </div>
        </div>
      </div>
    </div>
  )
}
