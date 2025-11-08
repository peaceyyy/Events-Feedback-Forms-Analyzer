'use client'

import type { UploadResponse } from '@/types/upload'
import ChartFactory, { createChartConfig } from '@/components/analysis/charts/ChartFactory'
import SessionPerformanceMatrixChart from '@/components/analysis/charts/SessionPerformanceMatrixChart'
import DiscoveryChannelImpactChart from '@/components/analysis/charts/DiscoveryChannelImpactChart'
import ChannelSatisfactionChart from '@/components/analysis/charts/ChannelSatisfactionChart'
import VenueSatisfactionChart from '@/components/analysis/charts/VenueSatisfactionChart'

interface SessionsTabProps {
  analysisResults: UploadResponse
  onGenerateSessionInsights: (data: any) => Promise<any>
  onGenerateMarketingInsights: (data: any) => Promise<any>
}

export default function SessionsTab({ 
  analysisResults,
  onGenerateSessionInsights,
  onGenerateMarketingInsights
}: SessionsTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Session & Event Analytics
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Performance metrics, attendance patterns, and strategic insights for event optimization
        </p>
      </div>

      {/* Session Performance Chart */}
      {(analysisResults as any)?.sessions?.data && (
        <div className="w-full min-h-[450px]">
          <ChartFactory
            config={createChartConfig(
              "session-popularity",
              "Session Performance Analysis",
              "comparison",
              (analysisResults as any).sessions.data,
              {
                subtitle: `Attendance vs Satisfaction for top ${
                  (analysisResults as any).sessions.data.sessions
                    ?.length || 0
                } sessions`,
                chartVariant: "groupedBar",
                allowVariantToggle: true,
              }
            )}
            className="w-full h-full"
          />
        </div>
      )}



      {/* Session Analytics - Detailed Views */}
      <div className="grid grid-cols-1 gap-8">
        {/* Session Performance Matrix - Bubble Chart */}
        <SessionPerformanceMatrixChart
          data={(analysisResults as any)?.session_matrix}
          title="Session Performance Matrix"
          height={500}
          onGenerateAIInsights={onGenerateSessionInsights}
        />

        {/* Discovery Channel Impact */}
        <DiscoveryChannelImpactChart
          data={(analysisResults as any)?.discovery_channels}
          title="Discovery Channel Impact"
          height={450}
          onGenerateAIInsights={onGenerateMarketingInsights}
        />
      </div>

            {/* Satisfaction Correlation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Discovery Channel vs Satisfaction */}
        {(analysisResults as any)?.discovery_channels && (
          <ChannelSatisfactionChart 
            data={(analysisResults as any).discovery_channels}
          />
        )}

        {/* Venue/Modality vs Satisfaction */}
        {(analysisResults as any)?.venue_preferences && (
          <VenueSatisfactionChart 
            data={(analysisResults as any).venue_preferences}
          />
        )}
      </div>


    </div>
  )
}
