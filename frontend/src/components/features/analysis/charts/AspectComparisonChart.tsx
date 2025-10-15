// components/AspectComparisonChart.tsx - Specialized chart for comparing event aspects against baseline
'use client'
import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
  ResponsiveContainer, Cell, ReferenceLine, PolarAngleAxis,  RadialBarChart, RadialBar
} from 'recharts'

interface AspectComparisonChartProps {
  data: any
  variant?: 'diverging' | 'grouped' | 'bullet' | 'radial'
  onVariantChange?: (variant: 'diverging' | 'grouped' | 'bullet' | 'radial') => void
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
  onVariantChange,
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
  // Unified CustomTooltip that adapts to chart type (radial or bar)
  const CustomTooltip = ({ active, payload, label, radial }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    // Get data from payload - handle different structures
    const data = payload[0]?.payload || payload.payload;
    
    // Safety check for data existence
    if (!data) {
      return null;
    }

    // Extract values with fallbacks
    const aspect = data.aspect || 'Unknown';
    const value = data.value || 0;
    const baseline = data.baseline || 0;
    const difference = data.difference !== undefined ? data.difference : (value - baseline);
    const fill = data.fill || '#4CAF50';
    const performance = data.performance || 'adequate';

    // If 'radial' prop is true, use the radial style
    if (radial) {
      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 w-64">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fill }} />
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {aspect}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>Performance Score:</span>
              <span className="font-bold" style={{ color: fill }}>
                {value.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-secondary)' }}>Baseline Score:</span>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {baseline.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/10 mt-2 pt-2">
              <span style={{ color: 'var(--color-text-secondary)' }}>Deviation:</span>
              <span className={`font-bold ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {difference > 0 ? '+' : ''}{difference.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )
    }

    // Default (bar) tooltip style
    const isStrength = difference > 0;
    return (
      <div className="glass-card-dark p-3 rounded-lg border border-white/20 max-w-xs">
        <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
          {aspect}
        </p>
        <div className="space-y-1 text-xs">
          <p style={{color: 'var(--color-text-secondary)'}}>
            Rating: <span className="font-semibold">{value.toFixed(1)}/5.0</span>
          </p>
          <p style={{color: 'var(--color-text-secondary)'}}>
            Baseline: <span className="font-semibold">{baseline.toFixed(1)}/5.0</span>
          </p>
          <p style={{color: isStrength ? '#4CAF50' : '#F44336'}}>
            {isStrength ? '▲' : '▼'} {Math.abs(difference).toFixed(1)} {isStrength ? 'above' : 'below'} expectation
          </p>
          <div className={`text-xs px-2 py-1 rounded text-center ${
            performance === 'strength' ? 'bg-green-500/20 text-green-300' : 
            performance === 'weakness' ? 'bg-red-500/20 text-red-300' : 
            'bg-yellow-500/20 text-yellow-300'
          }`}>
            {performance.charAt(0).toUpperCase() + performance.slice(1)}
          </div>
          <div className="flex justify-between border-t border-white/10 mt-2 pt-2">
            <span style={{ color: 'var(--color-text-secondary)' }}>Deviation:</span>
            <span className={`font-bold ${difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {difference > 0 ? '+' : ''}{difference.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 1. Diverging Bar Chart - Shows positive/negative deviation from baseline
  const renderDivergingBar = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-center" style={{color: 'var(--color-text-secondary)'}}>No data available for diverging chart</p>
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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          layout="vertical"
          data={divergingData}
          margin={{ top: 20, right: 60, left: 80, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number" 
            domain={['dataMin - 0.3', 'dataMax + 0.3']}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Performance vs Baseline', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' } }}
            tickFormatter={(value) => Number(value).toFixed(1)}
          />
          <YAxis 
            type="category" 
            dataKey="aspect"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            width={70}
          />
          
          {/* Baseline reference line */}
          {options?.showBaseline && (
            <ReferenceLine x={0} stroke="#FFC107" strokeWidth={2} strokeDasharray="5 5" />
          )}
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {/* Legend for diverging chart */}
          {options?.showLegend && (
            <Legend 
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{ 
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                paddingTop: '15px'
              }}
              iconType="rect"
              content={() => (
                <div className="flex justify-center items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Above Baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Below Baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-yellow-500 border-dashed"></div>
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Baseline Reference</span>
                  </div>
                </div>
              )}
            />
          )}
          
          {/* Single bar showing deviation */}
          <Bar dataKey="deviation" name="Performance vs Baseline" barSize={24}>
            {divergingData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
    }

  // 2. Grouped Bar Chart - Shows actual vs baseline side by side
  const renderGroupedBar = () => {
    console.log('Rendering grouped bar with data:', chartData)
    
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-center" style={{color: 'var(--color-text-secondary)'}}>No data available for grouped chart</p>
        </div>
      )
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="aspect"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            angle={-30}
            textAnchor="end"
            height={55}
            interval={0}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Rating (0-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' } }}
          />
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          {options?.showLegend && (
            <Legend 
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{ 
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                paddingTop: '15px'
              }}
              iconType="rect"
            />
          )}
          
          {/* Baseline bar is now orange */}
          <Bar dataKey="baseline" fill="#FF9800" name="Baseline" barSize={30} />
          <Bar dataKey="value" fill="var(--color-usc-green)" name="Aspect Rating" barSize={30}>
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // 3. Bullet Chart Style - Performance indicators
  const renderBulletChart = () => {
    
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-center" style={{color: 'var(--color-text-secondary)'}}>No data available for bullet chart</p>
        </div>
      )
    }

    return (
      <div className="space-y-6 p-4 h-[400px] overflow-y-auto">
        {chartData.map((item: any, index: number) => {
          // --- Data preparation is perfect, no changes needed ---
          const progressPercentage = Math.min((item.value / 5) * 100, 100);
          const baselinePercentage = Math.min((item.baseline / 5) * 100, 100);
          
          return (
            <div key={index}>
              {/* --- Header: Aspect name and score --- */}
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm" style={{color: 'var(--color-text-primary)'}}>
                  {item.aspect}
                </span>
                <span className="font-bold text-lg" style={{color: item.fill || 'var(--color-text-primary)'}}>
                  {item.value.toFixed(1)}
                  <span className="text-xs font-medium" style={{color: 'var(--color-text-secondary)'}}>/5.0</span>
                </span>
              </div>
              
              {/* --- THE CORE VISUAL REWORK --- */}
              <div className="relative h-4 bg-slate-700/50 rounded-md">
                
                {/* Background Performance Ranges (Optional but very professional) */}
                {/* These add context, like a "poor" to "excellent" scale */}
                <div className="absolute top-0 left-0 h-full w-1/2 bg-red-500/10 rounded-l-md"></div>
                <div className="absolute top-0 left-1/2 h-full w-1/4 bg-yellow-500/10"></div>
                <div className="absolute top-0 left-3/4 h-full w-1/4 bg-green-500/10 rounded-r-md"></div>

                {/* Actual Performance Bar (Thinner than the background) */}
                <div 
                  className="absolute top-1/2 left-0 h-2 bg-green-400 rounded-md transition-all duration-500 transform -translate-y-1/2 z-10"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: item.fill || '#4CAF50'
                  }}
                />
                
                {/* Baseline Indicator (A vertical line) */}
                <div 
                  className="absolute top-0 h-full w-1 bg-white z-20"
                  style={{ left: `${baselinePercentage}%` }}
                  title={`Baseline: ${item.baseline.toFixed(1)}`} // Add a tooltip for accessibility
                />
              </div>
              
              {/* --- Difference Indicator --- */}
              <div className="text-right mt-1">
                <span 
                  className={`text-xs font-medium ${
                    item.difference > 0 ? 'text-green-400' : 
                    item.difference < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {item.difference > 0 ? '▲' : '▼'} {Math.abs(item.difference).toFixed(1)} vs. baseline
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
}


// A custom legend that acts as a summary panel
const CustomLegend = ({ payload }: any) => {
  if (!payload || !payload.length) return null;

  return (
    <div className="w-32 space-y-2">
      {payload.map((entry: any, index: number) => {
        const { payload: data } = entry; // Destructure the nested payload
        return (
          <div key={`item-${index}`} className="p-2 bg-white/5 rounded-md text-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{data.aspect}</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {data.value.toFixed(1)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  // 4. Radial Comparison - Circular performance view
  const renderRadialChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-center" style={{color: 'var(--color-text-secondary)'}}>No data available for radial chart</p>
        </div>
      )
    }

    // Enhanced data with more distinguishing colors
    const radialData = chartData.map((item: any, index: number) => {
      // Create more varied colors for better distinction
      const colorPalette = [
        '#4CAF50', // Green
        '#FF9800', // Orange  
        '#2196F3', // Blue
        '#9C27B0', // Purple
        '#F44336', // Red
        '#00BCD4', // Cyan
        '#FFEB3B', // Yellow
        '#795548'  // Brown
      ];
      
      return {
        ...item,
        // Use palette color or fallback to performance color
        fill: colorPalette[index % colorPalette.length] || item.fill,
        // Ensure proper percentage for radial display
        percentage: (item.value / 5) * 100
      }
    });

    return (
      <div className="flex items-center justify-center h-full w-full">
        <ResponsiveContainer width="100%" height={400}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="25%" 
            outerRadius="85%" 
            data={radialData}
            startAngle={90}
            endAngle={-270} 
            barSize={25}
            margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 5]}
              angleAxisId={0}
              tick={false}
            />
            
            <RadialBar 
              angleAxisId={0} 
              dataKey="value"
              cornerRadius={8} 
              background={{ fill: 'rgba(255,255,255,0.08)' }}
            >
              {radialData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RadialBar>
            
            <Tooltip content={(props) => <CustomTooltip {...props} radial={true} />} />
            <Legend 
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ 
                fontSize: '13px', 
                color: 'var(--color-text-secondary)',
                paddingLeft: '10px'
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
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
          <div className="text-center mb-2">
            <div className="text-lg font-semibold text-gray-500">No Data</div>
          </div>
          <p>No aspect comparison data available</p>
          <div className="mt-2 text-xs">
            Debug: {JSON.stringify(data, null, 2).substring(0, 200)}...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-card p-4 flex flex-col ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold" style={{color: 'var(--color-text-primary)'}}>
            Aspect Performance Comparison
          </h3>
          
          {/* Variant Toggle Buttons */}
          {onVariantChange && (
            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
              {(['diverging', 'grouped', 'bullet', 'radial'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onVariantChange(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                    variant === v 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  }`}
                  title={
                    v === 'diverging' ? 'Diverging Bar Chart' :
                    v === 'grouped' ? 'Grouped Bar Chart' :
                    v === 'bullet' ? 'Bullet Chart' : 'Radial Chart'
                  }
                >
                  {v === 'diverging' ? 'Diverging' :
                   v === 'grouped' ? 'Grouped' :
                   v === 'bullet' ? 'Bullet' : 'Radial'}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
          {variant === 'diverging' && 'Performance deviation from overall satisfaction baseline'}
          {variant === 'grouped' && 'Direct comparison of aspect ratings vs baseline'}
          {variant === 'bullet' && 'Performance indicators with baseline reference'}
          {variant === 'radial' && 'Circular performance visualization'}
        </p>
      </div>
      
      <div className="flex-1 min-h-[400px] h-[400px]">
        {variant === 'diverging' && renderDivergingBar()}
        {variant === 'grouped' && renderGroupedBar()}
        {variant === 'bullet' && renderBulletChart()}
        {variant === 'radial' && renderRadialChart()}
      </div>
    </div>
  )
}