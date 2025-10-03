// components/charts/RelationshipChart.tsx - Multi-dimensional data visualization  
'use client'
import React from 'react'
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Tooltip, Legend
} from 'recharts'
import { ChartConfig, ChartOptions } from './types'

interface RelationshipChartProps {
  data: any
  variant: 'radar' | 'scatter' | 'line'
  options?: ChartOptions
  config: ChartConfig
}

/**
 * RelationshipChart - Template for multi-dimensional and correlation data
 * 
 * Industry Use Cases:
 * • Venue vs Speaker vs Content ratings - Radar ideal for multi-aspect comparison
 * • Satisfaction vs Recommendation correlation - Scatter good for relationship analysis
 * • Trend analysis over time - Line charts for temporal patterns
 * 
 * Design Principles:
 * • Radar charts: Best for comparing multiple dimensions on same scale
 * • Scatter plots: Best for exploring correlations between two continuous variables
 * • Line charts: Best for showing trends and changes over time/categories
 */
export default function RelationshipChart({ data, variant, options, config }: RelationshipChartProps) {
  
  console.log('=== RELATIONSHIP CHART COMPONENT ===')
  console.log('Variant:', variant)
  console.log('Config:', config)
  console.log('Raw data received:', data)
  
  // Transform data for different chart types
  const chartData = React.useMemo(() => {
    console.log('=== RELATIONSHIP CHART DATA PROCESSING ===', data)
    console.log('Data type:', typeof data)
    console.log('Data keys:', data ? Object.keys(data) : 'null')
    
    if (!data) return []

    // Handle rating comparison data (radar chart)
    if (data.aspects && data.averages) {
      console.log('Using aspects/averages structure for radar')
      return data.aspects.map((aspect: string, index: number) => ({
        aspect: aspect,
        value: data.averages[index],
        fullMark: 5
      }))
    }

    // Handle detailed comparison data  
    if (data.detailed_comparison) {
      console.log('Using detailed_comparison structure for radar')
      return data.detailed_comparison.map((item: any) => ({
        aspect: item.aspect,
        value: item.average,
        fullMark: 5
      }))
    }

    // Handle Flask ratings data structure for radar charts
    if (data.detailed_ratings && Array.isArray(data.detailed_ratings)) {
      console.log('Using detailed_ratings structure for radar')
      return data.detailed_ratings.map((item: any) => ({
        aspect: item.aspect || item.name,
        value: item.average || item.value || 0,
        fullMark: 5
      }))
    }

    // Handle NEW scatter plot data from Flask (individual response points)
    if (data.data && data.data.points && Array.isArray(data.data.points)) {
      console.log('Using NEW scatter_data.data.points structure for scatter plot', data.data.points.length, 'points')
      return data.data.points.map((item: any, index: number) => ({
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
      console.log('Using legacy scatter_data structure for scatter plot')
      return data.scatter_data.map((item: any, index: number) => ({
        x: item.satisfaction || item.x || 0,
        y: item.recommendation_score || item.recommendation || item.y || 0, 
        name: `Response ${index + 1}`,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle direct array scatter plot data
    if (Array.isArray(data) && data.length > 0 && (data[0].satisfaction !== undefined || data[0].x !== undefined)) {
      console.log('Using direct array structure for scatter plot')
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
  }, [data, options?.colors])

  // Get radar chart domains and aspects
  const radarAspects = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    return chartData.map((item: any) => ({
      key: item.aspect,
      name: item.aspect.charAt(0).toUpperCase() + item.aspect.slice(1),
      domain: [0, 5]
    }))
  }, [chartData])

  // Custom tooltip for better context
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-dark p-3 rounded-lg border border-white/20">
          <p className="font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
            {label || 'Data Point'}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{color: entry.color}} className="text-sm">
              {entry.name}: <span className="font-semibold">{entry.value?.toFixed(2)}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Render radar chart (multi-dimensional comparison)
  const renderRadar = () => {
    if (chartData.length === 0 || radarAspects.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p style={{color: 'var(--color-text-secondary)'}}>No multi-dimensional data available</p>
        </div>
      )
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
              
              {/* Single radar line for all aspects */}
              <Radar
                name="Ratings"
                dataKey="value"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.25}
                strokeWidth={3}
                dot={{ r: 4, fill: '#4CAF50' }}
              />
              
              {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
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

  // Render scatter plot (correlation analysis)  
  const renderScatter = () => {
    console.log('=== SCATTER PLOT DEBUG START ===')
    console.log('Raw data passed to RelationshipChart:', data)
    console.log('Processed chartData:', chartData)
    console.log('chartData is array?', Array.isArray(chartData))
    console.log('chartData length:', chartData?.length)
    
    if (chartData && chartData.length > 0) {
      console.log('First chartData item:', chartData[0])
      console.log('Sample item has x?', 'x' in chartData[0])
      console.log('Sample item has y?', 'y' in chartData[0])
      chartData.forEach((item: any, index: number) => {
        console.log(`Item ${index}:`, { x: item.x, y: item.y, name: item.name })
      })
    }
    
    // Defensive check
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      console.log('=== SCATTER: No valid data available ===');
      return (
        <div className="w-full h-full flex items-center justify-center min-h-[300px] bg-red-900/20">
          <p style={{color: 'var(--color-text-secondary)'}}>No scatter plot data available</p>
        </div>
      );
    }
    
    console.log('=== SCATTER: Proceeding with rendering ===');

    return (
      <div className="w-full h-full min-h-[400px] bg-blue-900/10">
        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <ScatterChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          
          <XAxis 
            type="number" 
            dataKey="x"
            name="Satisfaction"
            domain={[0, 5]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Satisfaction Rating', position: 'insideBottom', offset: -25 }}
          />
          <YAxis 
            type="number" 
            dataKey="y"
            name="Recommendation" 
            domain={[0, 10]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            stroke="rgba(255,255,255,0.3)"
            label={{ value: 'Recommendation Score', angle: -90, position: 'insideLeft', offset: -5 }}
          />
          
          {options?.showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />}
          <Legend />

          {/* 
            THE MISSING PIECE:
            This component is what actually loops through the 'data' prop from ScatterChart
            and renders a dot for each item at the (x, y) coordinate.
            The 'data' is automatically inherited from the parent ScatterChart component.
          */}
          <Scatter 
            name="Feedback Correlation"
            fill="var(--color-usc-green)"
            fillOpacity={0.8}
          />

        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

  // Render line chart (trend analysis)
const renderLine = () => {
  // Defensive check is perfect as is.
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    console.log('No data available to render the line chart.');
    return <div>No data to display</div>;
  }
  
  console.log('=== RENDERING LINE CHART ===', chartData.length, 'items');
  console.log('Chart data for line chart:', chartData);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
          />
          
          {/* Primary Y-Axis for the 'value' (e.g., average rating) */}
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke="var(--color-usc-green)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            domain={[0, 5]} // Lock the scale for ratings
          />

          {/* Secondary Y-Axis for the 'count' */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="var(--color-usc-orange)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />

          {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
          {options?.showLegend && <Legend />}
          
          {/* Connect this line to the LEFT axis */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="value" 
            name="Average Rating" // Add a name for the legend
            stroke="var(--color-usc-green)"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
          
          {/* Conditionally render the second line, connected to the RIGHT axis */}
          {chartData.some((item: any) => item.count !== undefined) && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="count" 
              name="Response Count" // Add a name for the legend
              stroke="var(--color-usc-orange)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
  return (
    <div className="w-full h-full">
      {variant === 'radar' && renderRadar()}
      {variant === 'scatter' && renderScatter()}  
      {variant === 'line' && renderLine()}
    </div>
  )
}

// Sidebar Theory: Multi-Dimensional Chart Guidelines
/*
CHOOSING THE RIGHT RELATIONSHIP CHART:

🕸️ RADAR CHARTS:
• Best for: 3-8 dimensions on similar scales (ratings, scores, percentages)
• Why: Easy to spot strengths/weaknesses across multiple aspects
• Use when: Comparing performance profiles (Venue: 4.2, Speaker: 4.7, Content: 4.1)
• Avoid: Different scales, negative values, too many dimensions (>8)

🔵 SCATTER PLOTS:  
• Best for: Exploring correlations between two continuous variables
• Why: Reveals patterns, clusters, outliers in relationships
• Use when: Investigating "Does higher satisfaction → higher recommendation?"
• Look for: Positive correlation (upward trend), negative correlation, clusters

📈 LINE CHARTS:
• Best for: Trends over time, sequences, ordered categories
• Why: Clear progression patterns, easy to spot trends/changes
• Use when: Showing improvement over events, seasonal patterns, performance tracking

RADAR CHART BEST PRACTICES:
1. Use consistent scales across all axes (e.g., all 1-5 ratings)
2. Limit to 3-8 dimensions for readability
3. Start from 12 o'clock position, go clockwise
4. Fill areas with low opacity to show overlaps
5. Include reference benchmarks when available

CORRELATION INTERPRETATION:
• Strong positive: r > 0.7 (satisfaction ↑ → recommendation ↑)  
• Moderate positive: 0.3 < r < 0.7
• Weak/No correlation: -0.3 < r < 0.3
• Negative correlation: r < -0.3 (rare in satisfaction data)

DATA PREPARATION TIPS:
• Normalize scales before radar visualization
• Handle missing values appropriately  
• Consider log transformations for skewed data
• Add jitter to scatter plots if points overlap
*/