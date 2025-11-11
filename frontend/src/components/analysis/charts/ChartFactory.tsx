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
  
  // Force re-render when theme changes by listening to CSS variable changes
  const [themeKey, setThemeKey] = React.useState(0)
  
  React.useEffect(() => {
    const handleThemeChange = () => {
      // Force component re-render to pick up new CSS variable values
      setThemeKey(prev => prev + 1)
    }
    
    // Listen for class changes on document element (theme switching)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange()
        }
      })
    })
    
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, { attributes: true })
    }
    
    return () => observer.disconnect()
  }, [])


  // Default chart variants based on data type (industry best practices)
  function getDefaultVariant(type: string): string {
    switch (type) {
      case 'distribution': return 'horizontalBar' // Bar charts are clearer than pie for most users
      case 'comparison': return 'horizontalBar' // Better for text labels
      case 'score': return 'gauge' // Most intuitive for single metrics
      case 'relationship': return 'scatter' // Default to scatter for correlation analysis
      default: return 'bar'
    }
  }

  // Available variants per chart type (extensible system)
  const getAvailableVariants = (type: string, restrictedVariants?: string[]): Array<{value: string, label: string}> => {
    let allVariants: Array<{value: string, label: string}> = []
    
    switch (type) {
      case 'distribution':
        allVariants = [
          { value: 'horizontalBar', label: 'Horizontal Bar' },
          { value: 'donut', label: 'Donut Chart' }
        ]
        break
      case 'comparison':
        allVariants = [
          { value: 'groupedBar', label: 'Grouped Bar' },
          { value: 'horizontalBar', label: 'Horizontal Bar' },
          { value: 'stackedBar', label: 'Stacked Bar' }
        ]
        break
      case 'score':
        allVariants = [
          { value: 'gauge', label: 'Gauge' },
        ]
        break
      case 'relationship':
        allVariants = [
          { value: 'scatter', label: 'Scatter Plot' },
          { value: 'line', label: 'Line Chart' }
        ]
        break
      default: 
        return []
    }
    
    // Filter variants if restrictions are provided
    if (restrictedVariants && restrictedVariants.length > 0) {
      return allVariants.filter(variant => restrictedVariants.includes(variant.value))
    }
    
    return allVariants
  }

  // Render appropriate chart component
  const renderChart = () => {
    // Resolve colors dynamically on each render (theme-reactive)
    const dynamicOptions = {
      ...config.options,
      colors: config.options?.colors?.map((color: string) => 
        color.includes('var(') ? resolveCSSVariable(color) : color
      ),
      satisfactionColors: config.options?.satisfactionColors ? 
        Object.entries(config.options.satisfactionColors).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' && value.includes('var(') 
            ? resolveCSSVariable(value) 
            : value
          return acc
        }, {} as any) : {}
    }
    
    const baseProps = {
      data: config.data,
      options: dynamicOptions,
      config: { ...config, options: dynamicOptions }
    }

    switch (config.type) {
      case 'distribution':
        return <DistributionChart {...baseProps} variant={selectedVariant as 'bar' | 'horizontalBar' | 'pie' | 'donut'} />
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

  const variants = getAvailableVariants(config.type, config.availableVariants)

  // Helper function to determine optimal aspect ratio for different chart types
  const getChartAspectRatio = (type: string, variant?: string): string => {
    switch (type) {
      case 'distribution': return '12/4' // Good for bar/pie charts
      case 'comparison': return '16/9'    // Wide for horizontal bars
      case 'score': return '1/1'          // Square for gauges - maximizes vertical space
      case 'relationship': 
        // Line charts need more horizontal space for category labels
        return variant === 'line' ? '16/9' : '1/1'   // Square for radar/scatter, wide for line
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
              className="border border-theme-light rounded-lg px-3 py-1 text-sm transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-surface-elevated)'
              }}
            >
              {variants.map(variant => (
                <option 
                  key={variant.value} 
                  value={variant.value}
                  style={{ backgroundColor: 'var(--color-surface-elevated)' }}
                >
                  {variant.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Content with Responsive Container - Much larger */}
      {/* THE FIX: Use the getChartAspectRatio function to dynamically set the shape of the chart container.
          This replaces the fixed h-96 height with a responsive aspect ratio, improving visual consistency. */}
      <div className="w-full" style={{ aspectRatio: getChartAspectRatio(config.type, selectedVariant), minHeight: '500px' }}>
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

// Helper function to resolve CSS variables to actual hex values (Recharts compatibility fix)
function resolveCSSVariable(cssVar: string): string {
  if (typeof window !== 'undefined') {
    try {
      const style = getComputedStyle(document.documentElement)
      const value = style.getPropertyValue(cssVar.replace('var(', '').replace(')', ''))
      const trimmedValue = value.trim()
      // Return the resolved value or fallback if empty
      return trimmedValue || getFallbackColor(cssVar)
    } catch (error) {
      console.warn(`Failed to resolve CSS variable ${cssVar}:`, error)
      return getFallbackColor(cssVar)
    }
  }
  return getFallbackColor(cssVar)
}

function getFallbackColor(cssVar: string): string {
  const fallbacks: Record<string, string> = {
    '--color-chart-primary': '#4CAF50',
    '--color-chart-secondary': '#FF9800', 
    '--color-chart-tertiary': '#4285f4',
    '--color-chart-quat': '#fbbc05',
    '--color-chart-quint': '#ea4335',
    '--color-chart-green': '#4CAF50',
    '--color-chart-light-green': '#81C784',
    '--color-chart-yellow': '#FFC107',
    '--color-chart-orange': '#FF9800',
    '--color-chart-red': '#F44336',
    '--color-background-gauge': 'rgba(255, 255, 255, 0.1)',
    '--color-background-card': 'rgba(0, 0, 0, 0.8)'
  }
  return fallbacks[cssVar.replace('var(', '').replace(')', '')] || '#9E9E9E'
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
      // THE FIX: Resolve CSS variables to actual hex values for Recharts compatibility
      colors: [
        resolveCSSVariable('--color-chart-primary'), 
        resolveCSSVariable('--color-chart-secondary'), 
        resolveCSSVariable('--color-chart-tertiary'), 
        resolveCSSVariable('--color-chart-quat'),
        resolveCSSVariable('--color-chart-quint')
      ],
      satisfactionColors: {
        '5': resolveCSSVariable('--color-chart-green'), 
        '4': resolveCSSVariable('--color-chart-light-green'),
        '3': resolveCSSVariable('--color-chart-yellow'), 
        '2': resolveCSSVariable('--color-chart-orange'), 
        '1': resolveCSSVariable('--color-chart-red')
      },
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
    case 'distribution': return 'horizontalBar'
    case 'comparison': return 'horizontalBar' 
    case 'score': return 'gauge'
    case 'relationship': return 'scatter'
    default: return 'bar'
  }
}