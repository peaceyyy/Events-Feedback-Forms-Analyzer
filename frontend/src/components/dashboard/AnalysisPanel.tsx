// components/Dashboard.tsx - Main dashboard with configurable charts
'use client'
import React from 'react'
import ChartFactory, { createChartConfig, ChartConfig } from '../analysis/charts/ChartFactory'
import InsightsSummary from '../analysis/EventAspectsInsights'
import { UnifiedWordCloud } from '../analysis/charts/WordCloud'
import { Refresh as RefreshIcon, Dashboard as DashboardIcon } from '@mui/icons-material'

interface DashboardProps {
  analysisData?: any // Data from Flask backend
  className?: string
}

/**
 * Dashboard - Orchestrates the display of analytics charts
 */
export default function Dashboard({ analysisData, className = '' }: DashboardProps) {

  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log('Dashboard received analysisData:', analysisData)
  }
  
  // Transform backend analysis data into chart configurations
  const chartConfigs = React.useMemo((): ChartConfig[] => {
    if (!analysisData) return []

    const configs: ChartConfig[] = []

    // 1. SATISFACTION DISTRIBUTION CHART 
    if (analysisData.satisfaction?.data) {
      configs.push(createChartConfig(
        'satisfaction-dist',
        'Satisfaction Distribution', 
        'distribution',
        analysisData.satisfaction.data,
        {
          subtitle: `${analysisData.satisfaction.data.stats?.total_responses || 0} responses analyzed`,
          chartVariant: 'horizontalBar', // Default to horizontal for better satisfaction label reading
          allowVariantToggle: true
        }
      ))
    }

    // 2. NPS SCORE GAUGE (Gauge/Progress/Donut options)
    if (analysisData.nps?.data) {
      configs.push(createChartConfig(
        'nps-score',
        'Net Promoter Score',
        'score', 
        analysisData.nps.data,
        {
          subtitle: `${analysisData.nps.data.nps_category || 'Score Analysis'}`,
          chartVariant: 'gauge', // Gauge is most intuitive for NPS
          allowVariantToggle: true
        }
      ))
    }

    // 3. SESSION POPULARITY COMPARISON (Grouped Bar when satisfaction data available)
    if (analysisData.sessions?.data) {
      // Use grouped bar if we have satisfaction data, otherwise horizontal bar
      const hassatisfaction = analysisData.sessions.data.average_satisfaction &&
                             Array.isArray(analysisData.sessions.data.average_satisfaction)
      const variant = hassatisfaction ? 'groupedBar' : 'horizontalBar'
      
      configs.push(createChartConfig(
        'session-popularity',
        hassatisfaction ? 'Session Performance Analysis' : 'Session Popularity',
        'comparison',
        analysisData.sessions.data,
        {
          subtitle: hassatisfaction 
            ? `Attendance vs Satisfaction for top ${analysisData.sessions.data.sessions?.length || 0} sessions`
            : `Top ${analysisData.sessions.data.sessions?.length || 0} attended sessions`,
          chartVariant: variant,
          allowVariantToggle: true
        }
      ))
    }

    // 4. RATING COMPARISON RADAR (Multi-dimensional analysis)
    if (analysisData.ratings?.data) {
      configs.push(createChartConfig(
        'rating-comparison',
        'Aspect Ratings Comparison',
        'relationship',
        analysisData.ratings.data,
        {
          subtitle: 'Venue • Speakers • Content performance',
          chartVariant: 'radar', // Perfect for multi-aspect comparison
          allowVariantToggle: false // Radar is the best choice for this data type
        }
      ))
    }

    // 5. CORRELATION ANALYSIS (Individual response correlation - scatter/line only)
    if (analysisData.scatter_data?.data) {
      configs.push(createChartConfig(
        'satisfaction-vs-recommendation',
        'Satisfaction vs Recommendation Correlation',
        'relationship',
        analysisData.scatter_data.data,
        {
          subtitle: `Individual responses correlation (${analysisData.scatter_data.data.total_points || 0} points)`,
          chartVariant: 'scatter', // Perfect for correlation analysis
          allowVariantToggle: true, // Scatter and line both work for this data
          availableVariants: ['scatter', 'line'] 
        }
      ))
    }

    return configs
  }, [analysisData]
)

  // Loading state
  if (!analysisData || chartConfigs.length === 0) {
    return (
      <div className={`glass-card-dark p-12 rounded-2xl text-center ${className}`}>
        <DashboardIcon sx={{ fontSize: 48, color: 'var(--color-text-tertiary)', marginBottom: 2 }} />
        <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--color-text-primary)'}}>
          Waiting for Analysis Data
        </h3>
        <p style={{color: 'var(--color-text-secondary)'}}>
          Upload a CSV file to see comprehensive analytics dashboard
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{color: 'var(--color-text-primary)'}}>
            Analytics Dashboard
          </h2>
          <p style={{color: 'var(--color-text-secondary)'}}>
            Interactive insights from {analysisData.summary?.total_responses || 0} survey responses
          </p>
        </div>
        
        {/* Refresh button for future use */}
        <button 
          className="glass-card-dark p-3 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-300"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon sx={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* THE FIX: Re-architected the grid for a more logical and visually appealing layout */}
      <div className="space-y-10">
        {/* Row 1: Satisfaction Distribution (Full Width) */}
        {chartConfigs.filter(c => c.id === 'satisfaction-dist').map(config => (
          <div key={config.id} className="grid grid-cols-1 gap-8">
            <div className="w-full min-h-[450px]">
              <ChartFactory config={config} className="w-full h-full" />
            </div>
          </div>
        ))}

        {/* Row 2: NPS Score and Aspect Ratings (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartConfigs
            .filter(c => c.id === 'nps-score' || c.id === 'rating-comparison')
            .map(config => (
              <div key={config.id} className="w-full min-h-[450px]">
                <ChartFactory config={config} className="w-full h-full" />
              </div>
            ))}
        </div>

        {/* Row 2.5: Comparative Insights Summary (Full Width) */}
        {analysisData.ratings?.data && (
          <div className="grid grid-cols-1 gap-8">
            <InsightsSummary 
              data={analysisData.ratings.data} 
              title="Event Strengths & Weaknesses Analysis"
              className="w-full"
            />
          </div>
        )}

        {/* Row 3: Session Performance Analysis (Full Width) */}
        {chartConfigs.filter(c => c.id === 'session-popularity').map(config => (
          <div key={config.id} className="grid grid-cols-1 gap-8">
            <div className="w-full min-h-[450px]">
              <ChartFactory config={config} className="w-full h-full" />
            </div>
          </div>
        ))}

        {/* Row 4: Satisfaction vs Recommendation Correlation (Full Width) */}
        {chartConfigs.filter(c => c.id === 'satisfaction-vs-recommendation').map(config => (
          <div key={config.id} className="grid grid-cols-1 gap-8">
            <div className="w-full min-h-[450px]">
              <ChartFactory config={config} className="w-full h-full" />
            </div>
          </div>
        ))}

        {/* Row 5: One-Word Descriptions WordCloud (Full Width) */}
        {analysisData.one_word_descriptions?.data && (
          <div className="grid grid-cols-1 gap-8">
            <UnifiedWordCloud 
              data={
                analysisData.one_word_descriptions.data.word_cloud
                  ? analysisData.one_word_descriptions.data.word_cloud.map((item: any) => ({
                      word: item.word,
                      value: item.count,
                      group: 'descriptions'
                    }))
                  : []
              }
              stats={analysisData.one_word_descriptions.data.stats}
              title="One-Word Descriptions Analysis"
              showStats={true}
              height={500}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Summary Insights Card */}
      <div className="glass-card-dark p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
          Key Insights Summary
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold mb-1" style={{color: 'var(--color-usc-green)'}}>
              {analysisData?.summary?.total_responses || analysisData?.satisfaction?.data?.stats?.total_responses || 0}
            </div>
            <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              Total Responses
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold mb-1" style={{color: 'var(--color-google-blue)'}}>
              {(analysisData?.summary?.average_satisfaction || analysisData?.satisfaction?.data?.stats?.average || 0).toFixed(1)}/5
            </div>
            <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              Avg Satisfaction
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold mb-1" style={{color: 'var(--color-usc-orange)'}}>
              {analysisData?.nps?.data?.nps_score?.toFixed(1) || (analysisData?.summary?.average_recommendation || 0).toFixed(1)}
              <span className="text-lg">{analysisData?.nps?.data?.nps_score !== undefined ? '' : '/10'}</span>
            </div>
            <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
              {analysisData?.nps?.data?.nps_score !== undefined ? 'NPS Score' : 'Avg Recommendation'}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        {analysisData?.nps?.data?.nps_score !== undefined && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-xl font-bold mb-1" style={{color: 'var(--color-usc-green)'}}>
                  {analysisData.nps.data.nps_score.toFixed(1)}
                </div>
                <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  Net Promoter Score
                </div>
              </div>
              
              <div>
                <div className="text-xl font-bold mb-1" style={{color: 'var(--color-text-primary)'}}>
                  {analysisData.nps.data.nps_category || 'Assessment'}
                </div>
                <div className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  NPS Category
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
