// components/InsightsSummary.tsx - Generates narrative insights from aspect ratings
'use client'
import React from 'react'
import AspectComparisonChart from './charts/AspectComparisonChart'

interface InsightsSummaryProps {
  data: any
  title?: string
  className?: string
}

export default function InsightsSummary({ data, title = "Event Performance Insights", className = "" }: InsightsSummaryProps) {
  
  // State for chart variant selection
  const [chartVariant, setChartVariant] = React.useState<'diverging' | 'grouped' | 'bullet' | 'radial'>('diverging')
  
  // Generate specific recommendations for each aspect (moved before useMemo)
  const generateAspectRecommendation = React.useCallback((aspect: any) => {
    const { aspect: name, difference, performance } = aspect
    
    if (performance === 'strength') {
      return `Maintain ${name.toLowerCase()} excellence - consider highlighting in marketing`
    } else if (performance === 'weakness') {
      if (name.toLowerCase().includes('venue')) {
        return 'Review accessibility, comfort, and technical setup'
      } else if (name.toLowerCase().includes('speaker')) {
        return 'Improve speaker selection, preparation, or presentation quality'
      } else if (name.toLowerCase().includes('content')) {
        return 'Enhance relevance, depth, and practical applicability'
      } else {
        return `Focus improvement efforts on ${name.toLowerCase()}`
      }
    } else {
      return `${name} meets expectations - monitor for consistency`
    }
  }, [])
  
  // Generate comparative insights from radar chart data
  const insights = React.useMemo(() => {
    if (!data || !data.baseline_data || !Array.isArray(data.baseline_data)) {
      return {
        summaryElements: <p>No comparative data available for analysis.</p>,
        details: [],
        overallSatisfaction: 0,
        aspectCount: 0
      }
    }

    const baselineData = data.baseline_data
    const overallSatisfaction = data.overall_satisfaction || 0
    
    // Categorize aspects by performance
    const strengths = baselineData.filter((item: any) => item.performance === 'strength')
    const weaknesses = baselineData.filter((item: any) => item.performance === 'weakness')
    const adequate = baselineData.filter((item: any) => item.performance === 'adequate')
    
    // Find best and worst performing aspects
    const bestAspect = baselineData.reduce((best: any, current: any) => 
      current.value > best.value ? current : best
    )
    const worstAspect = baselineData.reduce((worst: any, current: any) => 
      current.value < worst.value ? current : worst
    )
    
    // Generate detailed breakdown
    const details = baselineData.map((aspect: any) => ({
      aspect: aspect.aspect,
      value: aspect.value,
      baseline: aspect.baseline,
      difference: aspect.difference,
      performance: aspect.performance,
      recommendation: generateAspectRecommendation(aspect)
    }))
    
    // THE FIX: Generate JSX elements instead of a single string for better styling
    const summaryElements = (
      <div className="space-y-3">
        <p className="font-semibold text-base" style={{color: 'var(--color-text-primary)'}}>
          Event Performance Overview ({baselineData.length} aspects analyzed)
        </p>
        <div className="space-y-2">
          {strengths.length > 0 && (
            <p>
              <span className="font-semibold text-green-400">Strengths: </span>
              {strengths.map((s: any) => `${s.aspect} (${s.value.toFixed(1)}/5)`).join(', ')} 
              {strengths.length > 1 ? ' are' : ' is'} your standout {strengths.length > 1 ? 'areas' : 'area'}, performing above overall satisfaction.
            </p>
          )}
          {weaknesses.length > 0 && (
            <p>
              <span className="font-semibold text-red-400">Areas for Improvement: </span>
              {weaknesses.map((w: any) => `${w.aspect} (${w.value.toFixed(1)}/5)`).join(', ')} 
              {weaknesses.length > 1 ? ' need' : ' needs'} attention, falling below expectations.
            </p>
          )}
          {adequate.length > 0 && (
            <p>
              <span className="font-semibold text-yellow-400">Adequate Performance: </span>
              {adequate.map((a: any) => a.aspect).join(', ')} 
              {adequate.length > 1 ? ' align' : ' aligns'} well with the overall experience.
            </p>
          )}
        </div>
        <div className="pt-2">
          <p className="font-semibold text-base" style={{color: 'var(--color-text-primary)'}}>
            Recommendations
          </p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            {strengths.length > 0 && (
              <li>Leverage <span className="font-medium">{strengths[0].aspect.toLowerCase()}</span> as a competitive advantage.</li>
            )}
            {weaknesses.length > 0 && (
              <li>Prioritize improvements in <span className="font-medium">{weaknesses[0].aspect.toLowerCase()}</span> for maximum impact on overall satisfaction.</li>
            )}
          </ul>
        </div>
      </div>
    );
    
    return {
      summaryElements,
      details,
      overallSatisfaction,
      aspectCount: baselineData.length,
      strengths: strengths.length,
      weaknesses: weaknesses.length,
      adequate: adequate.length
    }
  }, [data, generateAspectRecommendation])

  // Performance indicator colors
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'strength': return 'text-green-400'
      case 'weakness': return 'text-red-400' 
      case 'adequate': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'strength': return '🟢'
      case 'weakness': return '🔴'
      case 'adequate': return '🟡'
      default: return '⚪'
    }
  }

  if (insights.aspectCount === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
          {title}
        </h3>
        <p style={{color: 'var(--color-text-secondary)'}}>
          Upload feedback data to see comparative insights between event aspects.
        </p>
      </div>
    )
  }

  return (
    <div className={`glass-card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
        {title}
      </h3>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-xl font-bold" style={{color: 'var(--color-text-primary)'}}>
            {insights.overallSatisfaction.toFixed(1)}
          </div>
          <div className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
            Overall Satisfaction
          </div>
        </div>
        <div className="text-center p-3 bg-green-500/10 rounded-lg">
          <div className="text-xl font-bold text-green-400">
            {insights.strengths}
          </div>
          <div className="text-xs text-green-300">
            Strengths
          </div>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-lg">
          <div className="text-xl font-bold text-red-400">
            {insights.weaknesses}
          </div>
          <div className="text-xs text-red-300">
            Need Improvement
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
          <div className="text-xl font-bold text-yellow-400">
            {insights.adequate}
          </div>
          <div className="text-xs text-yellow-300">
            Adequate
          </div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <div 
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{color: 'var(--color-text-secondary)'}}
        >
          {insights.summaryElements}
        </div>
      </div>

      {/* Comparative Visualization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium" style={{color: 'var(--color-text-primary)'}}>
            Visual Comparison
          </h4>
          <div className="flex gap-2">
            {(['diverging', 'grouped', 'bullet', 'radial'] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setChartVariant(variant)}
                className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                  chartVariant === variant
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10'
                }`}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <AspectComparisonChart 
          data={data} 
          variant={chartVariant}
          className="w-full"
        />
      </div>

      {/* Detailed Aspect Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium" style={{color: 'var(--color-text-primary)'}}>
          Detailed Aspect Analysis
        </h4>
        {insights.details.map((detail: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {getPerformanceIcon(detail.performance)}
              </span>
              <div>
                <div className="font-medium" style={{color: 'var(--color-text-primary)'}}>
                  {detail.aspect}
                </div>
                <div className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
                  {detail.recommendation}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold" style={{color: 'var(--color-text-primary)'}}>
                {detail.value.toFixed(1)}/5.0
              </div>
              <div className={`text-xs ${getPerformanceColor(detail.performance)}`}>
                {detail.difference > 0 ? '+' : ''}{detail.difference.toFixed(1)} vs baseline
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}