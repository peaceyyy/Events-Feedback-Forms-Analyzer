// components/charts/DistributionChart.tsx - Scalable distribution visualization
'use client'
import React from 'react'
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { ChartConfig, ChartOptions } from './types'

interface DistributionChartProps {
  data: any
  variant: 'bar' | 'horizontalBar' | 'pie' | 'donut'
  options?: ChartOptions
  config: ChartConfig
}

// THE FIX: Define a type for the data items to resolve implicit 'any' errors.
type ChartDataItem = {
  name: string;
  value: number;
  count: number;
  rating: number;
  fill: string;
};


export default function DistributionChart({ data, variant, options, config }: DistributionChartProps) {
  
  // Transform backend data to chart format with meaningful satisfaction labels
  const chartData = React.useMemo(() => {
    if (!data) return []

    // Satisfaction level mapping for better UX
    const getSatisfactionLabel = (rating: string | number) => {
      const num = typeof rating === 'string' ? parseInt(rating) : rating
      switch (num) {
        case 1: return 'Very Dissatisfied'
        case 2: return 'Dissatisfied'
        case 3: return 'Neutral'
        case 4: return 'Satisfied'
        case 5: return 'Very Satisfied'
        default: return `Rating ${rating}`
      }
    }

    // THE FIX: Use theme-aware satisfaction colors from options
    const satisfactionColors = options?.satisfactionColors || {}
    const getSatisfactionColor = (rating: string | number) => satisfactionColors[String(rating)] || '#9E9E9E'

    // Handle satisfaction distribution data structure
    if (data.categories && data.values) {
      const mappedData = data.categories.map((category: string | number, index: number) => {
        const rating = typeof category === 'string' ? parseInt(category) : category
        const color = getSatisfactionColor(rating) // Use rating for color, not index
        
        if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
          console.log(`Rating ${rating} (${getSatisfactionLabel(rating)}) -> Color: ${color}`)
        }
        return {
          name: getSatisfactionLabel(category),
          shortName: `${category}★`, // For horizontal charts where space is limited
          value: data.values[index],
          count: data.values[index],
          rating: rating, // Keep original rating for sorting
          fill: color // Always use satisfaction-based color, never options.colors
        }
      })
      
      // Sort by rating in descending order for better UX (5-1: Very Satisfied to Very Dissatisfied)
      return mappedData.sort((a: any, b: any) => b.rating - a.rating)
    }

    // Handle pie data structure  
    if (data.pie_data) {
      return data.pie_data.map((item: any, index: number) => ({
        name: item.name,
        value: item.value,
        count: item.value,
        fill: options?.colors?.[index] || `hsl(${index * 60}, 70%, 50%)`
      }))
    }

    // Handle generic array data
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        name: item.name || item.label || `Category ${index + 1}`,
        value: item.value || item.count || 0,
        count: item.value || item.count || 0,
        fill: options?.colors?.[index] || `hsl(${index * 60}, 70%, 50%)`
      }))
    }

    return []
  }, [data, options?.colors])

  // Calculate total for percentage calculations
  const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0)

  // Custom tooltip for better UX
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / total) * 100).toFixed(1)
      
      return (
        <div className="glass-card-theme p-3 rounded-lg border border-white/20">
          <p className="font-medium" style={{color: 'var(--color-text-primary)'}}>
            {data.payload.name}
          </p>
          <p style={{color: 'var(--color-text-secondary)'}}>
            Count: <span className="font-semibold">{data.value}</span>
          </p>
          <p style={{color: 'var(--color-text-secondary)'}}>
            Percentage: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Render different chart variants
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-chart)" />}
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
          stroke="var(--color-axis-line)"
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0} // Show all labels
        />
        <YAxis 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="var(--color-axis-line)"
          label={{ value: 'Response Count', angle: -90, position: 'insideLeft' }}
        />
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-hover-overlay)' }} />}
        <Bar 
          dataKey="value" 
          name="Response Count" // Override the default "value" legend label
          fill="var(--color-usc-green)"
          maxBarSize={60}
          radius={[4, 4, 0, 0]} // Rounded tops for modern look
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  const renderHorizontalBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        layout="vertical" 
        data={chartData} 
        margin={{ top: 5, right: 40, left: 0, bottom: 20 }}
      >
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-chart)" />}
        <XAxis 
          type="number" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="var(--color-axis-line)"
          label={{ value: 'Response Count', position: 'bottom', offset: 0 }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="var(--color-axis-line)" // Keep stroke for consistency
          width={120} // Increase width to comfortably fit "Very Dissatisfied"
          tickLine={false} // Hide the small tick lines for a cleaner look
          axisLine={false} // Hide the vertical axis line itself
        />
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-hover-overlay)' }} />}
        <Bar 
          dataKey="value"
          name="Response Count" // Override the default "value" legend label
          maxBarSize={40}
          fill="var(--color-usc-green)"
          radius={[0, 4, 4, 0]} // Rounded right side for horizontal bars
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <div className="w-full h-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={variant === 'donut' ? "30%" : 0}
            outerRadius="80%"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
        {options?.showLegend && (
          <Legend
            content={() => {
              // Sort legend items by satisfaction level (descending)
              const sorted: ChartDataItem[] = chartData
                .slice()
                .sort((a: ChartDataItem, b: ChartDataItem) => (b.rating ?? 0) - (a.rating ?? 0));
              return (
                <ul style={{ color: 'var(--color-text-secondary)', fontSize: '12px', listStyle: 'none', padding: 0, margin: '12px 0 0 0', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {sorted.map((entry: ChartDataItem) => (
                    <li key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: entry.fill,
                        marginRight: 4,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }} />
                      {entry.name}
                    </li>
                  ))}
                </ul>
              );
            }}
          />
        )}
      </PieChart>
    </ResponsiveContainer>

    {/* THE FIX: Use a perfectly centered HTML div for easier and more robust styling */}
    {variant === 'donut' && (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-16 z-0">
        <div className="text-3xl font-bold" style={{color: 'var(--color-text-primary)'}}>
          {total}
        </div>
        <div className="mt-1" style={{ color: 'var(--color-text-secondary)', fontSize: '10px' }}>
          Total Responses
        </div>
      </div>
    )}
    </div>
  )

  return (
    <div className="w-full h-full">
      {variant === 'bar' && renderBarChart()}
      {variant === 'horizontalBar' && renderHorizontalBarChart()}
      {(variant === 'pie' || variant === 'donut') && renderPieChart()}
    </div>
  )
}
