/**
 * Aspects Tab Component
 * 
 * Displays event aspect performance analysis including:
 * - Aspect comparison chart (multiple visualization variants)
 * - Event aspects breakdown with AI insights
 * - Correlation analysis between aspects
 * - Per-aspect average ratings
 */

'use client'

import type { UploadResponse } from '@/types/upload'
import AspectComparisonChart from '@/components/analysis/charts/AspectComparisonChart'
import EventAspectsInsights from '@/components/analysis/textAnalytics/EventAspectsInsights'
import CorrelationAnalysisChart from '@/components/analysis/charts/CorrelationAnalysisChart'
import PerAspectAveragesChart from '@/components/analysis/charts/PerAspectAveragesChart'

interface AspectTabProps {
  analysisResults: UploadResponse
  aiInsights: any
  aspectChartVariant: 'diverging' | 'grouped' | 'bullet' | 'radar'
  onVariantChange: (variant: 'diverging' | 'grouped' | 'bullet' | 'radar') => void
  onGenerateAspectInsights: () => Promise<any>
  aiAspectLoading: boolean
  aiAspectResult: any
  aiAspectError: string
}

export default function AspectTab({ 
  analysisResults,
  aiInsights,
  aspectChartVariant,
  onVariantChange,
  onGenerateAspectInsights,
  aiAspectLoading,
  aiAspectResult,
  aiAspectError
}: AspectTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Event Aspects Analysis
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Detailed breakdown of venue, speakers, and content performance
        </p>
      </div>

      <div className="glass-card-dark rounded-2xl p-6">
    
        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
          
          {/* Left Side - Chart Area (flexible, takes remaining space) */}
          <div className="flex-1 min-w-0 min-h-[500px]">
            {(analysisResults as any)?.ratings?.data && (
              <AspectComparisonChart
                data={(analysisResults as any).ratings.data}
                variant={aspectChartVariant}
                onVariantChange={onVariantChange}
                className="h-full"
              />
            )}
          </div>

          {/* Right Side - AI Insights (optimal fixed width, not squished) */}
          <div className="w-full lg:w-[450px] flex-shrink-0">
            {(analysisResults as any)?.ratings?.data && (
              <EventAspectsInsights 
                data={(analysisResults as any).ratings.data} 
                themeData={aiInsights?.themes?.data}
                aiInsights={aiAspectResult}
                isLoadingAI={aiAspectLoading}
                aiError={aiAspectError}
                onGenerateAIInsights={onGenerateAspectInsights}
                className="h-full"
              />
            )}
          </div>
          
        </div>
      </div>  

        {/* First Row - Per Aspect Averages (Full Width) */}
      <div className="grid grid-cols-1 gap-8">
        {(analysisResults as any)?.ratings?.data && (
          <PerAspectAveragesChart
            data={(analysisResults as any).ratings.data}
          />
        )}
      </div>

      {/* Second Row - Correlation Analysis (Full Width for Detailed View) */}
      <div className="grid grid-cols-1 gap-8">
        <CorrelationAnalysisChart
          data={(analysisResults as any)?.correlation?.data}
          height={450}
        />
      </div>

    
    </div>
  )
}
