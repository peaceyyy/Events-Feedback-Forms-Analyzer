// components/Dashboard.tsx - Main dashboard with configurable charts
'use client'
import React from 'react'
import ChartFactory, { createChartConfig, ChartConfig } from './charts/ChartFactory'
import InsightsSummary from './EventAspects'
import WordCloudContainer from './charts/WordCloud'
import { Refresh as RefreshIcon, Dashboard as DashboardIcon } from '@mui/icons-material'

interface DashboardProps {
  analysisData?: any // Data from your Flask backend
  className?: string
}

/**
 * Dashboard - Orchestrates the display of analytics charts
 * 
 * Architecture Benefits:
 * • Automatic chart configuration from backend data
 * • Responsive grid layout that adapts to screen size  
 * • Easy to add new chart types without code changes
 * • Consistent spacing and styling across all charts
 */
export default function Dashboard({ analysisData, className = '' }: DashboardProps) {
  
  console.log('=== DASHBOARD RECEIVED ===', analysisData)
  
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
      console.log('=== NPS DATA FOR CHART ===', analysisData.nps.data)
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
      console.log('=== SESSIONS DATA FOR CHART ===', analysisData.sessions.data)
      
      // Use grouped bar if we have satisfaction data, otherwise horizontal bar
      const hassatisfaction = analysisData.sessions.data.average_satisfaction && 
                             Array.isArray(analysisData.sessions.data.average_satisfaction)
      const variant = hassatisfaction ? 'groupedBar' : 'horizontalBar'
      
      console.log(`Sessions chart variant: ${variant} (has satisfaction: ${hassatisfaction})`)
      
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
      console.log('=== RATINGS DATA FOR CHART ===', analysisData.ratings.data)
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
      console.log('=== SCATTER DATA FOR CHART ===', analysisData.scatter_data.data)
      configs.push(createChartConfig(
        'satisfaction-vs-recommendation',
        'Satisfaction vs Recommendation Correlation',
        'relationship',
        analysisData.scatter_data.data,
        {
          subtitle: `Individual responses correlation (${analysisData.scatter_data.data.total_points || 0} points)`,
          chartVariant: 'scatter', // Perfect for correlation analysis
          allowVariantToggle: true, // Scatter and line both work for this data
          availableVariants: ['scatter', 'line'] // Exclude radar - doesn't make sense for correlation data
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
            <WordCloudContainer 
              data={analysisData.one_word_descriptions.data} 
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

// Sidebar Theory: Dashboard Design Principles
/*
EFFECTIVE DASHBOARD ARCHITECTURE:

LAYOUT STRATEGY:
• F-Pattern: Most important metrics top-left (where eyes start)
• Progressive disclosure: Key metrics → Detailed breakdowns → Context
• Responsive breakpoints: 1 col (mobile) → 2 cols (tablet) → 2-4 cols (desktop)

CHART HIERARCHY:
1. Scorecards/KPIs: Single metrics users care about most (NPS, Avg Satisfaction)  
2. Distributions: Show the "shape" of your data (rating breakdowns)
3. Comparisons: Rank categories for decision-making (session popularity)
4. Relationships: Explore correlations for insights (aspect ratings)

COGNITIVE LOAD MANAGEMENT:
• Limit to 4-6 charts maximum per view
• Group related metrics together
• Use consistent color schemes across charts
• Provide chart type options but sensible defaults

🔄 SCALABILITY FEATURES:
• ChartFactory pattern: Add new chart types without touching dashboard
• Configuration-driven: Backend sends chart specs, frontend renders automatically
• Modular components: Each chart type is independent and reusable
• Responsive design: Works on all devices out of the box

INDUSTRY BENCHMARKS TO INCLUDE:
• NPS: World-class (70+), Excellent (50-69), Good (30-49), Critical (<0)
• Satisfaction: Excellent (4.5+), Good (4.0-4.4), Fair (3.0-3.9), Poor (<3.0)  
• Response rates: High (>60%), Good (40-60%), Low (<40%)

PERFORMANCE CONSIDERATIONS:
• Lazy load charts below the fold  
• Use React.memo for chart components
• Debounce chart type switching
• Consider virtualization for large datasets (50+ data points)
*/