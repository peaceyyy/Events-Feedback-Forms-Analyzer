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
      <div className="glass-card-dark p-3 rounded-lg border border-white/20">
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
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={120}
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
    )
  }

  const renderBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            angle={-25}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
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
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                variant === 'pie' 
                  ? 'bg-blue-500/30 border border-blue-400/50' 
                  : 'bg-white/5 border border-white/10'
              }`}
              style={{color: 'var(--color-text-secondary)'}}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setVariant('bar')}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                variant === 'bar' 
                  ? 'bg-blue-500/30 border border-blue-400/50' 
                  : 'bg-white/5 border border-white/10'
              }`}
              style={{color: 'var(--color-text-secondary)'}}
            >
              Bar Chart
            </button>
          </div>
        </div>
        {variant === 'pie' ? renderPieChart() : renderBarChart()}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Total Responses</p>
          <p className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.specified_responses}
          </p>
        </div>
        <div className="glass-card-dark p-3 rounded-lg">
          <p className="text-xs" style={{color: 'var(--color-text-secondary)'}}>Time Slots</p>
          <p className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
            {stats.unique_time_slots}
          </p>
        </div>
 
      </div>
    </div>
  )
}
