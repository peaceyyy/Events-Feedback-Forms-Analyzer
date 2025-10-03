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
  variant: 'bar' | 'pie' | 'donut'
  options?: ChartOptions
  config: ChartConfig
}

/**
 * DistributionChart - Template for categorical frequency data
 * 
 * Industry Use Cases:
 * • Satisfaction ratings (1-5 scale) - Bar preferred for comparison
 * • NPS categories (Detractors/Passives/Promoters) - Donut good for proportions
 * • Event discovery channels - Pie good for source attribution
 * 
 * Design Principles:
 * • Bar charts > Pie charts for accuracy (easier to compare lengths than angles)
 * • Donut charts > Pie charts for aesthetics (center space for key metrics)
 * • Sort bars by value (descending) unless natural order exists (like 1-5 ratings)
 */
export default function DistributionChart({ data, variant, options, config }: DistributionChartProps) {
  
  // Transform backend data to chart format
  const chartData = React.useMemo(() => {
    if (!data) return []

    // Handle satisfaction distribution data structure
    if (data.categories && data.values) {
      return data.categories.map((category: string | number, index: number) => ({
        name: `Rating ${category}`,
        value: data.values[index],
        count: data.values[index], // Alias for different chart types
        fill: options?.colors?.[index] || `hsl(${index * 60}, 70%, 50%)`
      }))
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
        <div className="glass-card-dark p-3 rounded-lg border border-white/20">
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
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        {options?.gridLines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="rgba(255,255,255,0.3)"
        />
        <YAxis 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          stroke="rgba(255,255,255,0.3)"
        />
        {options?.showTooltip && <Tooltip content={<CustomTooltip />} />}
        {options?.showLegend && <Legend />}
        <Bar 
          dataKey="value" 
          fill="var(--color-usc-green)"
          radius={[4, 4, 0, 0]} // Rounded tops for modern look
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={variant === 'donut' ? "30%" : 0}
            outerRadius="80%"
            paddingAngle={2}
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
            wrapperStyle={{color: 'var(--color-text-secondary)', fontSize: '12px'}}
            iconType="circle"
          />
        )}
        
        {/* Center content for donut charts */}
        {variant === 'donut' && (
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan 
              x="50%" 
              dy="0" 
              fontSize="20" 
              fontWeight="bold"
              fill="var(--color-text-primary)"
            >
              {total}
            </tspan>
            <tspan 
              x="50%" 
              dy="16" 
              fontSize="10" 
              fill="var(--color-text-secondary)"
            >
              Total Responses
            </tspan>
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
    </div>
  )

  return (
    <div className="w-full h-full">
      {variant === 'bar' && renderBarChart()}
      {(variant === 'pie' || variant === 'donut') && renderPieChart()}
    </div>
  )
}

// Sidebar Theory: Distribution Chart Selection Guidelines
/*
WHEN TO USE EACH VARIANT:

📊 BAR CHARTS (Default Recommendation):
• Best for: 1-5 ratings, ranked categories, ordinal data
• Why: Humans judge length more accurately than angles/areas
• Use when: Users need precise comparison between categories

🥧 PIE CHARTS: 
• Best for: < 6 categories, part-to-whole relationships
• Why: Good for showing proportions of a whole
• Use when: Emphasizing market share, percentage breakdowns

🍩 DONUT CHARTS:
• Best for: Single key metric + breakdown
• Why: Center space for total/average display
• Use when: Want to highlight both total and distribution

INDUSTRY BEST PRACTICES:
1. Sort bars by value (except ordinal data like ratings)
2. Limit pie slices to 5-7 maximum
3. Start pie at 12 o'clock position
4. Use consistent colors across related charts
5. Always include data labels or tooltips for exact values
*/