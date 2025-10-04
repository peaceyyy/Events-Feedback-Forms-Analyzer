// components/charts/ChartFactory.tsx - Scalable chart system with configurable templates
'use client'
import React from 'react'
import DistributionChart from './DistributionChart'
import ComparisonChart from './ComparisonChart'  
import ScoreChart from './ScoreChart'
import RelationshipChart from './RelationshipChart'
import { Tune as TuneIcon } from '@mui/icons-material'
import { ChartConfig, ChartOptions } from './types'

// Re-export types for convenience
export type { ChartConfig, ChartOptions }

interface ChartFactoryProps {
  config: ChartConfig
  className?: string
}

export default function ChartFactory({ config, className = '' }: ChartFactoryProps) {
  const [selectedVariant, setSelectedVariant] = React.useState(config.chartVariant || getDefaultVariant(config.type))


  // Default chart variants based on data type (industry best practices)
  function getDefaultVariant(type: string): string {
    switch (type) {
      case 'distribution': return 'bar' // Bar charts are clearer than pie for most users
      case 'comparison': return 'horizontalBar' // Better for text labels
      case 'score': return 'gauge' // Most intuitive for single metrics
      case 'relationship': return 'scatter' // Default to scatter for correlation analysis
      default: return 'bar'
    }
  }

  // Available variants per chart type (extensible system)
  const getAvailableVariants = (type: string): Array<{value: string, label: string}> => {
    switch (type) {
      case 'distribution':
        return [
          { value: 'bar', label: 'Bar Chart' },
          { value: 'pie', label: 'Pie Chart' }
        ]
      case 'comparison':
        return [
          { value: 'groupedBar', label: 'Grouped Bar' },
          { value: 'horizontalBar', label: 'Horizontal Bar' },
          { value: 'stackedBar', label: 'Stacked Bar' }
        ]
      case 'score':
        return [
          { value: 'gauge', label: 'Gauge' },
        ]
      case 'relationship':
        return [
          { value: 'radar', label: 'Radar Chart' },
          { value: 'scatter', label: 'Scatter Plot' },
          { value: 'line', label: 'Line Chart' }
        ]
      default: return []
    }
  }

  // Render appropriate chart component
  const renderChart = () => {
    const baseProps = {
      data: config.data,
      options: config.options,
      config
    }

    switch (config.type) {
      case 'distribution':
        return <DistributionChart {...baseProps} variant={selectedVariant as 'bar' | 'pie' | 'donut'} />
      case 'comparison':
        return <ComparisonChart {...baseProps} variant={selectedVariant as 'horizontalBar' | 'groupedBar' | 'stackedBar'} />
      case 'score':
        return <ScoreChart {...baseProps} variant={selectedVariant as 'gauge' | 'progress' | 'donut'} />
      case 'relationship':
        return <RelationshipChart {...baseProps} variant={selectedVariant as 'radar' | 'scatter' | 'line'} />
      default:
        return <div>Unsupported chart type: {config.type}</div>
    }
  }

  const variants = getAvailableVariants(config.type)

  // Helper function to determine optimal aspect ratio for different chart types
  const getChartAspectRatio = (type: string): string => {
    switch (type) {
      case 'distribution': return '16/10' // Good for bar/pie charts
      case 'comparison': return '16/9'    // Wide for horizontal bars
      case 'score': return '4/3'          // Square-ish for gauges
      case 'relationship': return '1/1'   // Square for radar charts
      default: return '16/10'
    }
  }

  return (
    <div className={`glass-card-dark p-6 rounded-2xl elevation-2 ${className}`}>
      {/* Chart Header with Title and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
            {config.title}
          </h3>
          {config.subtitle && (
            <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              {config.subtitle}
            </p>
          )}
        </div>
        
        {/* Chart Type Selector - Only show if multiple variants available */}
        {config.allowVariantToggle && variants.length > 1 && (
          <div className="flex items-center gap-2">
            <TuneIcon sx={{ fontSize: 20, color: 'var(--color-text-tertiary)' }} />
            <select 
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-1 text-sm"
              style={{color: 'var(--color-text-secondary)'}}
            >
              {variants.map(variant => (
                <option key={variant.value} value={variant.value} className="bg-gray-800">
                  {variant.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Content with Responsive Container - Much larger */}
      <div className="w-full h-96" style={{ minHeight: '400px' }}>
        {renderChart()}
      </div>

      {/* Chart Insights/Summary Footer */}
      {config.data?.insights && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm" style={{color: 'var(--color-text-tertiary)'}}>
            <span className="font-medium">Key Insight:</span>
            <span>{config.data.insights[0]}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to create chart configs (makes it easy to add new charts)
export function createChartConfig(
  id: string,
  title: string, 
  type: ChartConfig['type'],
  data: any,
  options: Partial<ChartConfig> = {}
): ChartConfig {
  return {
    id,
    title,
    type,
    data,
    chartVariant: options.chartVariant || getDefaultVariant(type),
    subtitle: options.subtitle,
    allowVariantToggle: options.allowVariantToggle ?? true,
    options: {
      colors: ['#4CAF50', '#FF9800', '#4285f4', '#f28b81', '#fee293'], // USC + Google colors
      showLegend: true,
      showTooltip: true,
      responsive: true,
      animation: true,
      ...options.options
    }
  }
}

function getDefaultVariant(type: string): string {
  switch (type) {
    case 'distribution': return 'bar'
    case 'comparison': return 'horizontalBar' 
    case 'score': return 'gauge'
    case 'relationship': return 'scatter'
    default: return 'bar'
  }
}