// components/charts/types.ts - Shared chart type definitions
export interface ChartConfig {
  id: string
  title: string
  subtitle?: string
  type: 'distribution' | 'comparison' | 'score' | 'relationship'
  chartVariant?: string // e.g., 'bar', 'pie', 'gauge', 'radar'
  data: any
  options?: ChartOptions
  allowVariantToggle?: boolean
  availableVariants?: string[] // Restrict which variants are available for this specific chart
}

export interface ChartOptions {
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  responsive?: boolean
  animation?: boolean
  gridLines?: boolean
  dataLabels?: boolean
}