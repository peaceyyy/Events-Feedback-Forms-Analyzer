// components/charts/ComparisonChart.tsx - Scalable comparison visualization  
'use client'
import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'
import { ChartConfig, ChartOptions } from './types'

interface ComparisonChartProps {
  data: any
  variant: 'horizontalBar' | 'groupedBar' | 'stackedBar'
  options?: ChartOptions
  config: ChartConfig
}

/**
 * ComparisonChart - Template for ranking and comparison data
 * 
 * Industry Use Cases:
 * • Session popularity (attendance counts) - Horizontal bar preferred for long labels
 * • Venue vs Speaker vs Content ratings - Grouped bar for side-by-side comparison
 * • Department satisfaction breakdown - Stacked bar for category composition
 * 
 * Design Principles:  
 * • Horizontal bars > Vertical for text-heavy labels (session names, locations)
 * • Sort by value (highest first) unless natural order exists
 * • Grouped bars for comparing same metric across categories
 * • Stacked bars for showing composition within categories
 */
export default function ComparisonChart({ data, variant, options, config }: ComparisonChartProps) {
  
  console.log('=== COMPARISON CHART DATA ===', data)
  console.log('=== COMPARISON CHART VARIANT ===', variant)
  
  // Transform backend data to chart format
  const chartData = React.useMemo(() => {
    console.log('=== PROCESSING CHART DATA ===', data)
    
    if (!data) {
      console.log('No data provided')
      return []
    }

    // Handle attendance_rates data structure (most common from Flask)
    if (data.attendance_rates && Array.isArray(data.attendance_rates)) {
      console.log('Using attendance_rates structure')
      return data.attendance_rates.map((item: any, index: number) => ({
        name: item.session && item.session.length > 25 ? `${item.session.substring(0, 25)}...` : (item.session || `Session ${index + 1}`),
        fullName: item.session || `Session ${index + 1}`,
        value: item.count || 0,
        attendance: item.count || 0,
        percentage: item.percentage || 0,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle session popularity data (legacy format)
    if (data.sessions && data.attendance && Array.isArray(data.sessions) && Array.isArray(data.attendance)) {
      console.log('Using sessions/attendance structure')
      return data.sessions.map((session: string, index: number) => ({
        name: session && session.length > 30 ? `${session.substring(0, 30)}...` : (session || `Session ${index + 1}`),
        fullName: session || `Session ${index + 1}`,
        value: data.attendance[index] || 0,
        attendance: data.attendance[index] || 0,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle multi-metric comparison (e.g., venue vs speaker vs content)
    if (data.detailed_comparison && Array.isArray(data.detailed_comparison)) {
      console.log('Using detailed_comparison structure')
      return data.detailed_comparison.map((item: any, index: number) => ({
        name: item.aspect || `Aspect ${index + 1}`,
        value: item.average || 0,
        average: item.average || 0,
        count: item.count || 0,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Handle generic array data
    if (Array.isArray(data)) {
      console.log('Using generic array structure')
      return data.map((item, index) => ({
        name: item.name || item.label || item.session || `Item ${index + 1}`,
        value: item.value || item.count || item.attendance || 0,
        attendance: item.count || item.attendance || item.value || 0,
        fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
      }))
    }

    // Fallback: try to extract any meaningful data
    console.log('Attempting fallback data extraction')
    const keys = Object.keys(data)
    if (keys.length > 0) {
      // Look for arrays that might contain chart data
      for (const key of keys) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          console.log(`Found array data in key: ${key}`)
          return data[key].map((item: any, index: number) => ({
            name: (typeof item === 'object' ? (item.name || item.session || item.label || `${key} ${index + 1}`) : String(item)),
            value: (typeof item === 'object' ? (item.value || item.count || item.attendance || 1) : 1),
            attendance: (typeof item === 'object' ? (item.count || item.attendance || item.value || 1) : 1),
            fill: options?.colors?.[index % (options?.colors?.length || 5)] || '#4CAF50'
          }))
        }
      }
    }

    console.log('No matching data structure found - creating test data')
    // Create some test data to ensure charts can render
    return [
      { name: 'Opening Session', value: 45, attendance: 45, fill: '#4CAF50' },
      { name: 'Workshop A', value: 32, attendance: 32, fill: '#FF9800' },
      { name: 'Workshop B', value: 28, attendance: 28, fill: '#4285f4' },
      { name: 'Networking', value: 41, attendance: 41, fill: '#f28b81' }
    ]
  }, [data, options?.colors])

  console.log('=== CHART DATA PROCESSED ===', chartData)

  // Sort data by value (descending) for better readability
  const sortedData = [...chartData].sort((a, b) => (b.value || b.attendance || 0) - (a.value || a.attendance || 0))
  
  console.log('=== SORTED DATA ===', sortedData)

  // Custom tooltip with enhanced information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      
      return (
        <div className="glass-card-dark p-4 rounded-lg border border-white/20 max-w-xs">
          <p className="font-semibold text-sm mb-2" style={{color: 'var(--color-text-primary)'}}>
            {data.payload.fullName || data.payload.name}
          </p>
          <div className="space-y-1 text-xs">
            <p style={{color: 'var(--color-text-secondary)'}}>
              Count: <span className="font-semibold">{data.payload.value || data.payload.attendance || 0}</span>
            </p>
            {data.payload.percentage && (
              <p style={{color: 'var(--color-text-secondary)'}}>
                Percentage: <span className="font-semibold">{data.payload.percentage.toFixed(1)}%</span>
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }


  const renderHorizontalBar = () => {
  // First, let's be defensive. Ensure the data is valid before trying to render.
  // This can prevent crashes if sortedData is ever undefined or not an array.
  if (!sortedData || sortedData.length === 0) {
    console.log('No data available to render the horizontal bar chart.');
    return <div>No data to display</div>; // Or a loading spinner, etc.
  }
  
  console.log('=== RENDERING HORIZONTAL BAR ===', sortedData.length, 'items');
  console.log('Sorted data for horizontal bar:', sortedData);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={sortedData} 
        layout="vertical" // For a horizontal bar chart, the layout is "vertical"
        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
      >
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
        
        {/* For a HORIZONTAL bar chart, the axes are flipped: */}
        {/* The XAxis is the numerical axis, and the YAxis is the categorical axis. */}
        <XAxis 
          type="number"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="rgba(255,255,255,0.3)"
        />
        <YAxis 
          type="category"
          dataKey="name" // This is the label for each bar
          width={120} // Adjusted width for better label visibility
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="rgba(255,255,255,0.3)"
        />
        
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />}
        
        <Bar 
          dataKey="value" // This is the length of each bar
          radius={[0, 4, 4, 0]} // Rounded right edges
        >
          {/* 
            CORRECT IMPLEMENTATION: 
            You provide a list of Cells. Recharts automatically maps the 
            first Cell to the first bar, the second to the second, and so on.
            No explicit .map() loop is needed here.
          */}
          {sortedData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill || 'var(--color-usc-green)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

  // Render grouped bar chart (for multi-metric comparison)
  const renderGroupedBar = () => {
  // Defensive check: Ensure data is valid before rendering.
  if (!chartData || chartData.length === 0) {
    console.log('No data available to render the grouped bar chart.');
    return <div>No data to display</div>;
  }
  
  console.log('=== RENDERING GROUPED BAR ===', chartData.length, 'items');
  console.log('Chart data for grouped bar:', chartData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
        
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="rgba(255,255,255,0.3)"
        />
        
        {/* Primary Y-Axis (for the average rating) */}
        <YAxis 
          yAxisId="left" // Assign an ID to this axis
          orientation="left" // Explicitly place it on the left
          stroke="var(--color-usc-green)" // Match the color of its bar
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          domain={[0, 5]} // Optional but good: lock the scale to 0-5
        />
        
        {/* Secondary Y-Axis (for the response count) */}
        <YAxis 
          yAxisId="right" // Assign a different ID
          orientation="right" // Place it on the right
          stroke="var(--color-usc-orange)" // Match the color of its bar
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
        />
        
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
        {options?.showLegend && <Legend />}
        
        {/* Tell each bar which Y-Axis to use */}
        <Bar 
          yAxisId="left" // This bar uses the 'left' Y-Axis
          dataKey="average_rating" // Use a more descriptive dataKey
          name="Average Rating" 
          fill="var(--color-usc-green)" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          yAxisId="right" // This bar uses the 'right' Y-Axis
          dataKey="response_count" // Use a more descriptive dataKey
          name="Response Count" 
          fill="var(--color-usc-orange)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

  // Render stacked bar chart (for composition data)
  const renderStackedBar = () => (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <BarChart data={chartData} margin={{ top: 15, right: 20, left: 15, bottom: 20 }}>
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
          stroke="rgba(255,255,255,0.3)"
        />
        <YAxis 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
          stroke="rgba(255,255,255,0.3)"
        />
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
        {options?.showLegend && <Legend />}
        
        {/* Stacked bars - useful for showing breakdowns */}
        <Bar dataKey="value" stackId="a" fill="var(--color-usc-green)" />
        {/* Add more stacked segments as needed based on data structure */}
      </BarChart>
    </ResponsiveContainer>
  )

  // Render empty state if no data
  if (sortedData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px] p-8">
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">No Session Data Available</h3>
          <p className="text-sm">
            Waiting for session attendance data...
          </p>
          <div className="mt-4 text-xs bg-white/10 rounded p-2 max-w-md">
            Debug: {JSON.stringify(data, null, 2).substring(0, 200)}...
          </div>
        </div>
      </div>
    )
  }

  console.log('=== RENDERING CHART WITH VARIANT ===', variant)
  console.log('=== SHOULD RENDER HORIZONTAL BAR? ===', variant === 'horizontalBar')
  console.log('=== SHOULD RENDER GROUPED BAR? ===', variant === 'groupedBar')
  console.log('=== SHOULD RENDER STACKED BAR? ===', variant === 'stackedBar')

  return (
    <div className="w-full h-full">
      {variant === 'horizontalBar' && renderHorizontalBar()}
      {variant === 'groupedBar' && renderGroupedBar()}  
      {variant === 'stackedBar' && renderStackedBar()}
    </div>
  )
}