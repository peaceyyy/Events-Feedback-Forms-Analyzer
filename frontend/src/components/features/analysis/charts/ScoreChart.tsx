// components/charts/ScoreChart.tsx - Single metric visualization (KPIs, scores)
'use client'
import React from 'react'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, Tooltip
} from 'recharts'
import { ChartConfig, ChartOptions } from './types'

interface ScoreChartProps {
  data: any
  variant: 'gauge' | 'progress' | 'donut'
  options?: ChartOptions
  config: ChartConfig
}

/**
 * ScoreChart - Template for single metric/KPI visualization
 * 
 * Industry Use Cases:
 * • NPS Score (-100 to +100) - Gauge ideal for score ranges with context
 * • Average satisfaction (1-5) - Progress bar good for goal comparison  
 * • Completion rates (0-100%) - Donut effective for percentage display
 * 
 * Design Principles:
 * • Gauges: Best for scores with meaningful ranges and thresholds
 * • Progress bars: Best for goal-oriented metrics with targets
 * • Score donuts: Best for percentages and ratios with context
 */
export default function ScoreChart({ data, variant, options, config }: ScoreChartProps) {
  
  
  // Extract score and metadata from data
  const scoreData = React.useMemo(() => {
    console.log('ScoreChart received data:', data)
    if (!data) return { value: 0, max: 100, category: 'No Data' }

    // NPS Score data structure
    if (typeof data.nps_score !== 'undefined') {
      return {
        value: data.nps_score,
        max: 100,
        min: -100,
        category: data.nps_category || 'Needs Assessment',
        total: (data.values?.[0] || 0) + (data.values?.[1] || 0) + (data.values?.[2] || 0),
        detractors: data.values?.[0] || 0,
        passives: data.values?.[1] || 0,
        promoters: data.values?.[2] || 0
      }
    }

    // Handle NPS data structure from comprehensive analysis
    if (data.categories && data.values && data.percentages) {
      return {
        value: data.nps_score || 0,
        max: 100,
        min: -100,
        category: data.nps_category || 'Needs Assessment',
        total: data.values.reduce((sum: number, val: number) => sum + val, 0),
        detractors: data.values[0] || 0,
        passives: data.values[1] || 0,
        promoters: data.values[2] || 0
      }
    }

    // Average score data structure (ratings)
    if (data.average || data.stats?.average) {
      const average = data.average || data.stats.average
      return {
        value: average,
        max: 5,
        min: 1,
        category: average >= 4.5 ? 'Excellent' : average >= 4 ? 'Good' : average >= 3 ? 'Fair' : 'Needs Improvement',
        total: data.stats?.total_responses || data.total || 0
      }
    }

    // Generic score
    if (typeof data.value !== 'undefined') {
      return {
        value: data.value,
        max: data.max || 100,
        min: data.min || 0,
        category: data.category || 'Score'
      }
    }

    return { value: 0, max: 100, category: 'No Data' }
  }, [data])

  // Calculate percentage for progress/gauge
  const percentage = React.useMemo(() => {
    // Handle NPS scores (-100 to +100 range)
    if (scoreData.min === -100 && scoreData.max === 100) {
      // For NPS: convert -100 to +100 range into 0 to 100 percentage
      const npsPercentage = ((scoreData.value + 100) / 200) * 100
      return Math.max(0, Math.min(100, npsPercentage))
    }
    
    // Handle regular scores (0 to max range)
    const range = scoreData.max - (scoreData.min || 0)
    const adjusted = scoreData.value - (scoreData.min || 0)
    const regularPercentage = (adjusted / range) * 100
    return Math.max(0, Math.min(100, regularPercentage))
  }, [scoreData])

  // Color scheme based on score ranges
  const getScoreColor = (score: number, type: 'nps' | 'rating' = 'rating') => {
    if (type === 'nps') {
      if (score >= 50) return '#4CAF50' // Excellent
      if (score >= 30) return '#FF9800' // Good  
      if (score >= 0) return '#f28b81' // Fair
      return '#ed5d51' // Poor
    } else {
      if (score >= 4.5) return '#4CAF50' // Excellent
      if (score >= 4) return '#81C784' // Good
      if (score >= 3) return '#FF9800' // Fair
      return '#f28b81' // Needs Improvement
    }
  }

  const scoreColor = getScoreColor(
    scoreData.value, 
    scoreData.min === -100 ? 'nps' : 'rating'
  )

  // Render gauge chart (semicircle with needle effect)
  const renderGauge = () => {
    // This data setup is perfect. No changes needed.
    const gaugeData = [
      { name: 'Score', value: percentage, fill: scoreColor },
      { name: 'Remaining', value: 100 - percentage, fill: 'rgba(255,255,255,0.1)' }
    ];

    return (
      // The parent container only needs to establish a positioning context.
      // We remove flexbox properties as they are no longer needed for centering.
      <div className="relative w-full h-[400px]"> {/* Use a fixed height for stability */}
      
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              // These coordinates are our anchor point
              cx="50%"
              cy="55%" 
              startAngle={180}
              endAngle={0}
              // Adjust radii slightly for better proportions
              innerRadius="60%"
              outerRadius="80%"
              dataKey="value"
              stroke="none"
              // Add paddingAngle for a cleaner look between segments
              paddingAngle={1} 
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 
          THE FIX: We position this div precisely relative to the parent.
          top/left move the top-left corner of the div to the gauge's center.
          'transform' then pulls the div up and left by half its own size,
          perfectly centering it over the anchor point.
        */}
        <div 
          className="absolute flex flex-col items-center"
          style={{
            top: '85%', // Match the Pie's cy
            left: '50%', // Match the Pie's cx
            transform: 'translate(-50%, -120%)' // Pull it left by 50% of its width and UP by 120% of its height
          }}
        >
          <div 
            className="text-7xl font-extrabold" // Removed mb-3, control spacing with parent
            style={{ color: scoreColor }}
          >
            {scoreData.value.toFixed(0)}
          </div>
          <div className="text-xl font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            {scoreData.category}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            NPS Range: {scoreData.min !== undefined ? `${scoreData.min} to +${scoreData.max}` : `0 to ${scoreData.max}`}
          </div>
          {scoreData.total > 0 && (
            <div className="text-xs mt-3 px-3 py-1 rounded-full bg-white/10" style={{ color: 'var(--color-text-tertiary)' }}>
              Based on {scoreData.total} responses
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render progress bar
  const renderProgress = () => (
    <div className="w-full h-full flex flex-col justify-center p-6 min-h-[200px]">
      <div className="mb-6 text-center">
        <div 
          className="text-5xl font-bold mb-2"
          style={{ color: scoreColor }}
        >
          {scoreData.value.toFixed(1)}
        </div>
        <div className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {scoreData.category}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-4 mb-4">
        <div 
          className="h-4 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: scoreColor
          }}
        />
      </div>

      <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
        <span>{scoreData.min || 0}</span>
        <span>{scoreData.max}</span>
      </div>
    </div>
  )

  // Render score donut with breakdown
  const renderDonut = () => {
    // For NPS, show breakdown of detractors/passives/promoters
    const donutData = scoreData.detractors !== undefined ? [
      { name: 'Promoters (9-10)', value: scoreData.promoters, fill: '#4CAF50' },
      { name: 'Passives (7-8)', value: scoreData.passives, fill: '#FF9800' },
      { name: 'Detractors (0-6)', value: scoreData.detractors, fill: '#f28b81' }
    ] : [
      { name: 'Score', value: percentage, fill: scoreColor },
      { name: 'Remaining', value: 100 - percentage, fill: 'rgba(255,255,255,0.1)' }
    ]

    return (
      <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="70%"
              dataKey="value"
              stroke="none"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="text-3xl font-bold mb-1"
            style={{ color: scoreColor }}
          >
            {scoreData.value.toFixed(0)}
            {scoreData.min === -100 ? '' : '/5'}
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {scoreData.category}
          </div>
          {scoreData.total > 0 && (
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {scoreData.total} responses
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {variant === 'gauge' && renderGauge()}
      {variant === 'progress' && renderProgress()}  
      {variant === 'donut' && renderDonut()}
    </div>
  )
}
