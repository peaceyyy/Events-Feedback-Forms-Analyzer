// components/AspectComparisonChart.tsx - Specialized chart for comparing event aspects against baseline
'use client'
import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, ReferenceLine, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts'

interface AspectComparisonChartProps {
  data: any
  variant?: 'diverging' | 'grouped' | 'bullet' | 'radial'
  options?: {
    showBaseline?: boolean
    showTooltip?: boolean
    showLegend?: boolean
    colors?: string[]
  }
  className?: string
}

export default function AspectComparisonChart({ 
  data, 
  variant = 'diverging', 
  options = { showBaseline: true, showTooltip: true, showLegend: true },
  className = "" 
}: AspectComparisonChartProps) {

  // Transform data for comparative visualization
  const chartData = React.useMemo(() => {
    console.log('Processing data for AspectComparisonChart:', data)
    
    // Handle multiple possible data structures
    let baselineData = null
    let overallSatisfaction = 4.0

    // Check for baseline_data structure (new format)
    if (data && data.baseline_data && Array.isArray(data.baseline_data)) {
      baselineData = data.baseline_data
      overallSatisfaction = data.overall_satisfaction || 4.0
    }
    // Check for detailed_comparison structure (existing format)
    else if (data && data.detailed_comparison && Array.isArray(data.detailed_comparison)) {
      baselineData = data.detailed_comparison
      overallSatisfaction = data.overall_satisfaction || 4.0
    }
    // Check for aspects/averages structure (radar format)
    else if (data && data.aspects && data.averages && Array.isArray(data.aspects)) {
      baselineData = data.aspects.map((aspect: string, index: number) => ({
        aspect: aspect,
        value: data.averages[index] || 0,
        performance: 'adequate' // Default performance
      }))
      overallSatisfaction = data.overall_satisfaction || 4.0
    }

    if (!baselineData || baselineData.length === 0) {
      console.log('No valid baseline data found')
      return []
    }

    console.log('Using baseline data:', baselineData)
    console.log('Overall satisfaction:', overallSatisfaction)
    
    return baselineData.map((item: any) => {
      const aspectValue = item.value || item.average || 0
      const difference = aspectValue - overallSatisfaction
      
      // Determine performance if not provided
      let performance = item.performance || item.performance_category
      if (!performance) {
        if (difference > 0.1) performance = 'strength'
        else if (difference < -0.1) performance = 'weakness'
        else performance = 'adequate'
      }
      
      const performanceColor = performance === 'strength' ? '#4CAF50' : 
                              performance === 'weakness' ? '#F44336' : '#FFC107'
      
      return {
        aspect: item.aspect || item.name || 'Unknown',
        value: aspectValue,
        baseline: overallSatisfaction,
        difference: difference,
        absDifference: Math.abs(difference),
        performance: performance,
        fill: performanceColor,
        // For diverging bar chart
        positive: difference > 0 ? difference : 0,
        negative: difference < 0 ? Math.abs(difference) : 0,
        // For bullet chart
        target: overallSatisfaction,
        actual: aspectValue,
        // For radial chart
        percentage: (aspectValue / 5) * 100
      }
    }).sort((a: any, b: any) => b.difference - a.difference) // Sort by performance (best first)
  }, [data])

  // Enhanced tooltip for comparative insights
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isStrength = data.difference > 0
      
      return (
        <div className="glass-card-dark p-3 rounded-lg border border-white/20 max-w-xs">
          <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
            {data.aspect}
          </p>
          <div className="space-y-1 text-xs">
            <p style={{color: 'var(--color-text-secondary)'}}>
              Rating: <span className="font-semibold">{data.value.toFixed(1)}/5.0</span>
            </p>
            <p style={{color: 'var(--color-text-secondary)'}}>
              Baseline: <span className="font-semibold">{data.baseline.toFixed(1)}/5.0</span>
            </p>
            <p style={{color: isStrength ? '#4CAF50' : '#F44336'}}>
              {isStrength ? '▲' : '▼'} {Math.abs(data.difference).toFixed(1)} {isStrength ? 'above' : 'below'} expectation
            </p>
            <div className={`text-xs px-2 py-1 rounded text-center ${
              data.performance === 'strength' ? 'bg-green-500/20 text-green-300' : 
              data.performance === 'weakness' ? 'bg-red-500/20 text-red-300' : 
              'bg-yellow-500/20 text-yellow-300'
            }`}>
              {data.performance === 'strength' ? '🟢 Strength' : 
               data.performance === 'weakness' ? '🔴 Needs Improvement' : '🟡 Adequate'}
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // 1. Diverging Bar Chart - Shows positive/negative deviation from baseline
  const renderDivergingBar = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p style={{color: 'var(--color-text-secondary)'}}>No data for diverging chart</p>
        </div>
      )
    }

    // Transform data for diverging chart - combine positive/negative into single bars
    const divergingData = chartData.map((item: any) => ({
      ...item,
      // For diverging chart, use the actual difference value (positive or negative)
      deviation: item.difference || 0,
      // Color based on performance
      barColor: (item.difference || 0) > 0 ? '#4CAF50' : '#F44336'
    }))

    console.log('Diverging chart data:', divergingData)

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <BarChart 
          layout="vertical"
          data={divergingData}
          margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number" 
            domain={['dataMin - 0.2', 'dataMax + 0.2']}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Performance vs Baseline', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="category" 
            dataKey="aspect"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            width={75}
          />
          
          {/* Baseline reference line */}
          {options?.showBaseline && (
            <ReferenceLine x={0} stroke="#FFC107" strokeWidth={2} strokeDasharray="5 5" />
          )}
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {/* Single bar showing deviation */}
          <Bar dataKey="deviation" name="Performance vs Baseline">
            {divergingData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.barColor} />
            ))}
          </Bar>
          
          {options?.showLegend && <Legend />}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // 2. Grouped Bar Chart - Shows actual vs baseline side by side
  const renderGroupedBar = () => {
    console.log('Rendering grouped bar with data:', chartData)
    
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p style={{color: 'var(--color-text-secondary)'}}>No data for grouped chart</p>
        </div>
      )
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="aspect"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Rating (0-5)', angle: -90, position: 'insideLeft' }}
          />
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          {options?.showLegend && <Legend />}
          
          <Bar dataKey="baseline" fill="#FFC107" fillOpacity={0.7} name="Overall Satisfaction (Baseline)" />
          <Bar dataKey="value" fill="#4CAF50" name="Aspect Rating">
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill || '#4CAF50'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // 3. Bullet Chart Style - Performance indicators
  const renderBulletChart = () => {
    console.log('Rendering bullet chart with data:', chartData)
    
    if (chartData.length === 0) {
      return (
        <div className="p-4 text-center" style={{color: 'var(--color-text-secondary)'}}>
          No data available for bullet chart
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {chartData.map((item: any, index: number) => {
          const progressPercentage = Math.min((item.value / 5) * 100, 100)
          const baselinePercentage = Math.min((item.baseline / 5) * 100, 100)
          
          return (
            <div key={index} className="relative">
              {/* Aspect name */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm" style={{color: 'var(--color-text-primary)'}}>
                  {item.aspect}
                </span>
                <span className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
                  {item.value.toFixed(1)}/5.0
                </span>
              </div>
              
              {/* Progress bar background */}
              <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
                {/* Baseline indicator */}
                <div 
                  className="absolute top-0 h-full w-1 bg-yellow-400 z-20"
                  style={{ left: `${baselinePercentage}%` }}
                />
                
                {/* Actual performance bar */}
                <div 
                  className="h-full rounded-full transition-all duration-500 relative z-10"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: item.fill || '#4CAF50'
                  }}
                />
                
                {/* Performance indicator text */}
                <div className="absolute inset-0 flex items-center px-3 z-30">
                  <span className="text-xs text-white font-medium">
                    {item.performance === 'strength' ? '🟢' : 
                     item.performance === 'weakness' ? '🔴' : '🟡'}
                  </span>
                </div>
              </div>
              
              {/* Difference indicator */}
              <div className="flex justify-end mt-1">
                <span 
                  className={`text-xs ${
                    item.difference > 0 ? 'text-green-400' : 
                    item.difference < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}
                >
                  {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)} vs baseline
                </span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 4. Radial Comparison - Circular performance view
  const renderRadialChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p style={{color: 'var(--color-text-secondary)'}}>No data for radial chart</p>
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="20%" 
          outerRadius="80%" 
          data={chartData}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar 
            dataKey="percentage" 
            cornerRadius={10} 
            fill="#4CAF50"
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </RadialBar>
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          {options?.showLegend && <Legend />}
        </RadialBarChart>
      </ResponsiveContainer>
    )
  }

  // Debug logging
  console.log('=== ASPECT COMPARISON CHART DEBUG ===')
  console.log('Raw data:', data)
  console.log('Processed chartData:', chartData)
  console.log('Chart variant:', variant)

  if (chartData.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center" style={{color: 'var(--color-text-secondary)'}}>
          <div className="text-4xl mb-2">📊</div>
          <p>No aspect comparison data available</p>
          <div className="mt-2 text-xs">
            Debug: {JSON.stringify(data, null, 2).substring(0, 200)}...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>
          Aspect Performance Comparison
        </h3>
        <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
          {variant === 'diverging' && 'Performance deviation from overall satisfaction baseline'}
          {variant === 'grouped' && 'Direct comparison of aspect ratings vs baseline'}
          {variant === 'bullet' && 'Performance indicators with baseline reference'}
          {variant === 'radial' && 'Circular performance visualization'}
        </p>
      </div>
      
      <div className="min-h-[300px]">
        {variant === 'diverging' && renderDivergingBar()}
        {variant === 'grouped' && renderGroupedBar()}
        {variant === 'bullet' && renderBulletChart()}
        {variant === 'radial' && renderRadialChart()}
      </div>
    </div>
  )
}