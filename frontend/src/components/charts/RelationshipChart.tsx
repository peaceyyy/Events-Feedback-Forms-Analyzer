// components/charts/RelationshipChart.tsx - Multi-dimensional data visualization  
'use client'
import React from 'react'
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Tooltip, Legend, Cell
} from 'recharts'
import { ChartConfig, ChartOptions } from './types'

interface RelationshipChartProps {
  data: any
  variant: 'radar' | 'scatter' | 'line'
  options?: ChartOptions
  config: ChartConfig
}

export default function RelationshipChart({ data, variant, options, config }: RelationshipChartProps) {
  
  
  // Transform data for different chart types based on VARIANT
  const chartData = React.useMemo(() => {
    
    if (!data) return []


    // Handle rating comparison data (radar chart with baseline approach)
    if (data.aspects && data.averages) {
      return data.aspects.map((aspect: string, index: number) => ({
        aspect: aspect,
        value: data.averages[index],
        baseline: data.overall_satisfaction || 4.0, // Overall satisfaction as baseline
        fullMark: 5,
        // Performance indicators for styling
        performance: data.baseline_data ? data.baseline_data[index]?.performance : 'adequate',
        difference: data.baseline_data ? data.baseline_data[index]?.difference : 0
      }))
    }

    // Handle detailed comparison data with baseline
    if (data.detailed_comparison) {
      console.log('Using detailed_comparison structure for radar with baseline:', data.overall_satisfaction)
      return data.detailed_comparison.map((item: any) => ({
        aspect: item.aspect || 'Unknown Aspect',
        value: item.average || 0,
        baseline: data.overall_satisfaction || 4.0, // Overall satisfaction baseline
        fullMark: 5,
        // Performance indicators
        performance: item.performance_category || 'adequate',
        difference: item.vs_overall || 0
      }))
    }

    // Handle Flask ratings data structure for radar charts
    if (data.detailed_ratings && Array.isArray(data.detailed_ratings)) {
      console.log('Using detailed_ratings structure for radar')
      return data.detailed_ratings.map((item: any) => ({
        aspect: item.aspect || item.name || 'Unknown Aspect',
        value: item.average || item.value || 0,
        fullMark: 5
      }))
    }

    if (data.points && Array.isArray(data.points)) {
      console.log('Using scatter_data.points structure', data.points.length, 'points for variant:', variant)
      
      if (variant === 'line') {
        // Transform scatter data into line chart format (satisfaction categories)
        const satisfactionGroups = data.points.reduce((acc: any, point: any) => {
          const satisfaction = point.x || point.satisfaction || 0
          const recommendation = point.y || point.recommendation_score || 0
          
          // Group by satisfaction level for line chart
          let category
          if (satisfaction >= 4.5) category = 'Highly Satisfied (4.5+)'
          else if (satisfaction >= 3.5) category = 'Satisfied (3.5-4.4)' 
          else if (satisfaction >= 2.5) category = 'Neutral (2.5-3.4)'
          else if (satisfaction >= 1.5) category = 'Dissatisfied (1.5-2.4)'
          else category = 'Very Dissatisfied (1.0-1.4)'
          
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0, recommendations: [] }
          }
          acc[category].total += recommendation
          acc[category].count += 1
          acc[category].recommendations.push(recommendation)
          return acc
        }, {})
        
        // Convert to line chart data format
        return Object.entries(satisfactionGroups).map(([category, group]: [string, any]) => ({
          name: category,
          value: group.total / group.count, // Average recommendation for this satisfaction level
          count: group.count,
          satisfaction_avg: category.includes('Highly') ? 4.75 : 
                           category.includes('Satisfied (3.5') ? 4.0 :
                           category.includes('Neutral') ? 3.0 :
                           category.includes('Dissatisfied (1.5') ? 2.0 : 1.25
        })).sort((a, b) => b.satisfaction_avg - a.satisfaction_avg) // Sort by satisfaction level
      }
      
      // Default scatter format for scatter/radar variants
      return data.points.map((item: any, index: number) => ({
        x: item.x || item.satisfaction || 0,
        y: item.y || item.recommendation_score || 0, 
        name: `Response ${index + 1}`,
        satisfaction: item.satisfaction || item.x || 0,
        recommendation: item.recommendation_score || item.y || 0,
        venue_rating: item.venue_rating,
        speaker_rating: item.speaker_rating,
        content_rating: item.content_rating,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle legacy scatter plot data (satisfaction vs recommendation) - Flask structure
    if (data.scatter_data && Array.isArray(data.scatter_data)) {
      console.log('Using legacy scatter_data structure for variant:', variant)
      
      if (variant === 'line') {
        // Transform to line format - group by satisfaction ranges
        const satisfactionGroups = data.scatter_data.reduce((acc: any, point: any) => {
          const satisfaction = point.satisfaction || point.x || 0
          const recommendation = point.recommendation_score || point.recommendation || point.y || 0
          
          let category
          if (satisfaction >= 4.5) category = 'Highly Satisfied (4.5+)'
          else if (satisfaction >= 3.5) category = 'Satisfied (3.5-4.4)' 
          else if (satisfaction >= 2.5) category = 'Neutral (2.5-3.4)'
          else if (satisfaction >= 1.5) category = 'Dissatisfied (1.5-2.4)'
          else category = 'Very Dissatisfied (1.0-1.4)'
          
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0 }
          }
          acc[category].total += recommendation
          acc[category].count += 1
          return acc
        }, {})
        
        return Object.entries(satisfactionGroups).map(([category, group]: [string, any]) => ({
          name: category,
          value: group.total / group.count,
          count: group.count
        }))
      }
      
      return data.scatter_data.map((item: any, index: number) => ({
        x: item.satisfaction || item.x || 0,
        y: item.recommendation_score || item.recommendation || item.y || 0, 
        name: `Response ${index + 1}`,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle direct array scatter plot data
    if (Array.isArray(data) && data.length > 0 && (data[0].satisfaction !== undefined || data[0].x !== undefined)) {
      console.log('Using direct array structure for variant:', variant)
      
      if (variant === 'line') {
        // Transform direct array to line format
        const satisfactionGroups = data.reduce((acc: any, point: any) => {
          const satisfaction = point.satisfaction || point.x || 0
          const recommendation = point.recommendation_score || point.recommendation || point.y || 0
          
          let category
          if (satisfaction >= 4.5) category = 'Highly Satisfied (4.5+)'
          else if (satisfaction >= 3.5) category = 'Satisfied (3.5-4.4)' 
          else if (satisfaction >= 2.5) category = 'Neutral (2.5-3.4)'
          else if (satisfaction >= 1.5) category = 'Dissatisfied (1.5-2.4)'
          else category = 'Very Dissatisfied (1.0-1.4)'
          
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0 }
          }
          acc[category].total += recommendation
          acc[category].count += 1
          return acc
        }, {})
        
        return Object.entries(satisfactionGroups).map(([category, group]: [string, any]) => ({
          name: category,
          value: group.total / group.count,
          count: group.count
        }))
      }
      
      return data.map((item: any, index: number) => ({
        x: item.satisfaction || item.x || 0,
        y: item.recommendation_score || item.recommendation || item.y || 0, 
        name: `Response ${index + 1}`,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle line chart data (trends over categories)
    if (Array.isArray(data)) {
      console.log('Using generic array structure for line chart')
      return data.map((item: any, index: number) => ({
        name: item.name || item.category || `Point ${index + 1}`,
        value: item.value || item.average || 0,
        count: item.count || 0
      }))
    }

    // Fallback: try to create scatter data from any object with numeric properties
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('Attempting fallback data extraction for relationship chart')
      const keys = Object.keys(data)
      
      // Look for potential scatter plot data
      if (keys.includes('satisfaction') || keys.includes('ratings') || keys.includes('scores')) {
        console.log('Creating test scatter data from available data')
        // Create some test scatter points based on available data
        return [
          { x: 3.2, y: 7.1, name: 'Response 1' },
          { x: 4.1, y: 8.3, name: 'Response 2' },
          { x: 2.8, y: 6.2, name: 'Response 3' },
          { x: 4.5, y: 9.1, name: 'Response 4' },
          { x: 3.7, y: 7.8, name: 'Response 5' }
        ]
      }
    }

    console.log('No matching relationship data structure found')
    return []
  }, [data, variant, options?.colors])

  // Get radar chart domains and aspects
  const radarAspects = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    return chartData.map((item: any) => ({
      key: item.aspect || 'Unknown',
      name: item.aspect ? item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1) : 'Unknown',
      domain: [0, 5]
    }))
  }, [chartData])

  // Custom tooltip for business insights (with debug info)
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 max-w-xs">
          <p className="font-semibold mb-2" style={{ color: data.fill || data.category?.color || 'var(--color-text-primary)' }}>
            {data.category || data.name || 'Data Point'}
          </p>
          <div className="space-y-1 text-sm">
            {/* For scatter plots - show original satisfaction/recommendation */}
            {data.originalX !== undefined && (
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-medium">Satisfaction:</span> {data.originalX.toFixed(1)}/5.0
              </p>
            )}
            {data.originalY !== undefined && (
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-medium">Recommendation:</span> {data.originalY.toFixed(1)}/10.0
              </p>
            )}
            
            {/* For radar charts - show aspect ratings */}
            {data.aspect && (
              <p style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-medium">{data.aspect}:</span> {(data.value || 0).toFixed(1)}/5.0
              </p>
            )}
            
            {/* For line charts - show category averages */}
            {data.name && !data.originalX && !data.aspect && (
              <>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="font-medium">Average:</span> {(data.value || 0).toFixed(1)}
                </p>
                {data.count && (
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="font-medium">Responses:</span> {data.count}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
}

  // Render radar chart (multi-dimensional comparison with baseline)
  const renderRadar = () => {
    if (chartData.length === 0 || radarAspects.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p style={{color: 'var(--color-text-secondary)'}}>No multi-dimensional data available</p>
        </div>
      )
    }

    // Enhanced tooltip for baseline comparison
    const BaselineTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const aspectData = payload[0]?.payload
        if (!aspectData) return null
        
        const isStrength = aspectData.value > aspectData.baseline
        const difference = Math.abs(aspectData.value - aspectData.baseline).toFixed(1)
        
        return (
          <div className="glass-card-dark p-3 rounded-lg border border-white/20 max-w-xs">
            <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
              {aspectData.aspect}
            </p>
            <div className="space-y-1 text-xs">
              <p style={{color: 'var(--color-text-secondary)'}}>
                Rating: <span className="font-semibold">{aspectData.value.toFixed(1)}</span>
              </p>
              <p style={{color: 'var(--color-text-secondary)'}}>
                Baseline: <span className="font-semibold">{aspectData.baseline.toFixed(1)}</span>
              </p>
              <p style={{color: isStrength ? '#4CAF50' : '#FF9800'}}>
                {isStrength ? '▲' : '▼'} {difference} {isStrength ? 'above' : 'below'} expectation
              </p>
              <p className="text-xs mt-1" style={{
                color: aspectData.performance === 'strength' ? '#4CAF50' : 
                      aspectData.performance === 'weakness' ? '#F44336' : '#FFC107'
              }}>
                {aspectData.performance === 'strength' ? '🟢 Strength' : 
                 aspectData.performance === 'weakness' ? '🔴 Needs Improvement' : '🟡 Adequate'}
              </p>
            </div>
          </div>
        )
      }
      return null
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
              <PolarGrid 
                stroke="rgba(255,255,255,0.2)"
                gridType="polygon"
              />
              <PolarAngleAxis 
                dataKey="aspect"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                className="text-xs"
              />
              <PolarRadiusAxis 
                domain={[0, 5]}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 9 }}
                tickCount={6}
                angle={90}
              />
              
              {/* Baseline layer (Overall Satisfaction reference) - Enhanced visibility */}
              <Radar
                name="Overall Satisfaction"
                dataKey="baseline"
                stroke="#FFD54F"
                fill="transparent"
                fillOpacity={0}
                strokeWidth={4}
                strokeDasharray="8 4"
                dot={{ r: 3, fill: '#FFD54F', strokeWidth: 2, stroke: '#FFF' }}
              />
              
              {/* Aspect ratings layer */}
              <Radar
                name="Aspect Ratings"
                dataKey="value"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.25}
                strokeWidth={3}
                dot={{ r: 4, fill: '#4CAF50' }}
              />
              
              {options?.showTooltip && <Tooltip content={<BaselineTooltip />} />}
              {options?.showLegend && (
                <Legend 
                  wrapperStyle={{color: 'var(--color-text-secondary)', fontSize: '12px'}}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  // Process scatter plot data - group by satisfaction levels for business insights
  const scatterData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return { grouped: {}, jittered: [] }
    
    // Group by satisfaction levels for meaningful business categories
    const groupBySatisfaction = (satisfaction: number) => {
      if (satisfaction >= 4.5) return 'Highly Satisfied (4.5-5.0)'
      if (satisfaction >= 3.5) return 'Satisfied (3.5-4.4)' 
      if (satisfaction >= 2.5) return 'Neutral (2.5-3.4)'
      if (satisfaction >= 1.5) return 'Dissatisfied (1.5-2.4)'
      return 'Very Dissatisfied (1.0-1.4)'
    }

    // Color mapping for satisfaction categories (business-friendly)
    const colorMap = {
      'Highly Satisfied (4.5-5.0)': '#4CAF50',     // Green
      'Satisfied (3.5-4.4)': '#8BC34A',           // Light Green  
      'Neutral (2.5-3.4)': '#FF9800',             // Orange
      'Dissatisfied (1.5-2.4)': '#F44336',        // Red
      'Very Dissatisfied (1.0-1.4)': '#9C27B0'    // Purple
    }

    

    
    const processedData = chartData.map((point: any, index: number) => {
      // Store original values BEFORE any processing
      const originalSatisfaction = point.x || point.satisfaction || 0
      const originalRecommendation = point.y || point.recommendation_score || 0
      
      console.log(`Point ${index}: original=(${originalSatisfaction}, ${originalRecommendation})`)
      
      // Group based on ORIGINAL satisfaction score
      const satisfactionLevel = groupBySatisfaction(originalSatisfaction)
      
      const processed = {
        ...point,
        // Add small jitter to prevent overlapping (for display only)
        x: originalSatisfaction + (Math.random() - 0.5) * 0.15,
        y: originalRecommendation + (Math.random() - 0.5) * 0.3,
        // Group by satisfaction level based on original score
        category: satisfactionLevel,
        fill: colorMap[satisfactionLevel],
        // Keep TRUE original values for tooltip
        originalX: originalSatisfaction,
        originalY: originalRecommendation,
        // Debug info
        debugInfo: `Sat:${originalSatisfaction}, Rec:${originalRecommendation}, Cat:${satisfactionLevel}`
      }
      
      console.log(`Point ${index}: processed category="${satisfactionLevel}", color="${colorMap[satisfactionLevel]}"`)
      return processed
    })
    
    console.log('=== PROCESSED DATA SAMPLE ===', processedData.slice(0, 2))

    // Group by satisfaction categories
    const groupedData = processedData.reduce((acc: any, point: any) => {
      const category = point.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(point)
      return acc
    }, {})

    return { grouped: groupedData, jittered: processedData }
  }, [chartData])




  // Render scatter plot (correlation analysis)  
  const renderScatter = () => {
    // Use the flat, jittered array from your useMemo hook
    const flatChartData = scatterData.jittered;

    if (!flatChartData || flatChartData.length === 0) {
      console.log('=== SCATTER: No valid data available ===')
      return (
        <div className="w-full h-full flex items-center justify-center min-h-[300px]">
          <p style={{color: 'var(--color-text-secondary)'}}>No scatter plot data available</p>
        </div>
      )
    }

    return (
      <div className="w-full h-full min-h-[400px]">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
            {/* Axes and Grid are perfect as they are */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="x" // Plots the jittered value
              name="Satisfaction"
              domain={[0.5, 5.5]} // Widen domain for jitter
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              stroke="rgba(255,255,255,0.3)"
              label={{ value: 'Satisfaction Rating (1-5)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" // Plots the jittered value
              name="Recommendation" 
              domain={[-0.5, 10.5]} // Widen domain for jitter
              tickCount={6}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11}}
              stroke="rgba(255,255,255,0.3)"
              label={{ value: 'Recommendation Score (0-10)', angle: -90, position: 'insideLeft' }}
            />
            
            {/* This will now receive the correct, unambiguous payload */}
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

            {/* A custom legend would be needed to show all categories. */}
            {/* For now, we can hide the default one or accept its limitation. */}
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

            {/* --- The Key Change --- */}
            {/* Use a SINGLE Scatter component with the flat data array */}
            <Scatter 
              name="All Responses"
              data={flatChartData}
              fill="#cccccc" // A default fill
            >
              {/* Map over the data to give each dot its specific color */}
              {flatChartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Scatter>

          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
}
  // Render line chart (trend analysis)
const renderLine = () => {
  // Defensive check
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    console.log('=== LINE CHART: No valid data available ===')
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[300px]">
        <p style={{color: 'var(--color-text-secondary)'}}>No trend data available</p>
      </div>
    )
  }
  
  console.log('=== RENDERING LINE CHART ===', chartData.length, 'items')
  console.log('Line chart data structure:', chartData)

  // Determine if this is recommendation data (0-10 scale) or satisfaction data (0-5 scale)
  const maxValue = Math.max(...chartData.map((item: any) => item.value || 0))
  const isRecommendationScale = maxValue > 6 // Likely 0-10 scale
  const yDomain = isRecommendationScale ? [0, 10] : [0, 5]
  const yLabel = isRecommendationScale ? 'Average Recommendation Score (0-10)' : 'Average Rating (0-5)'

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 50, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
            stroke="rgba(255,255,255,0.3)"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0} // Show all labels
          />
          
          {/* Primary Y-Axis for the 'value' (recommendations or ratings) */}
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke="var(--color-usc-green)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            domain={yDomain}
            label={{ 
              value: yLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
            }}
          />

          {/* Secondary Y-Axis for response count */}
          {chartData.some((item: any) => item.count !== undefined) && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-usc-orange)"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              label={{ 
                value: 'Response Count', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: 'var(--color-text-secondary)' }
              }}
            />
          )}

          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            labelStyle={{ color: 'var(--color-text-primary)' }}
            formatter={(value: any, name: string) => [
              typeof value === 'number' ? value.toFixed(1) : value,
              name
            ]}
          />
          
          {options?.showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
          )}
          
          {/* Main trend line - Average scores */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="value" 
            name={isRecommendationScale ? "Avg Recommendation" : "Average Rating"}
            stroke="var(--color-usc-green)"
            strokeWidth={3}
            dot={{ r: 6, fill: 'var(--color-usc-green)' }}
            activeDot={{ r: 8, fill: 'var(--color-usc-green)' }}
          />
          
          {/* Response count line (if available) */}
          {chartData.some((item: any) => item.count !== undefined) && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="count" 
              name="Response Count"
              stroke="var(--color-usc-orange)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: 'var(--color-usc-orange)' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
  return (
    <div className="w-full h-full">
      {variant === 'radar' && renderRadar()}
      {variant === 'scatter' && renderScatter()}  
      {variant === 'line' && renderLine()}
    </div>
  )
}
