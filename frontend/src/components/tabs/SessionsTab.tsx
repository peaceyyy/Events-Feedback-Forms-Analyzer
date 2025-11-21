'use client'

import type { UploadResponse } from '@/types/upload'
import ChartFactory, { createChartConfig } from '@/components/analysis/charts/ChartFactory'
import DiscoveryChannelImpactChart from '@/components/analysis/charts/DiscoveryChannelImpactChart'
import ChannelSatisfactionChart from '@/components/analysis/charts/ChannelSatisfactionChart'
import VenueSatisfactionChart from '@/components/analysis/charts/VenueSatisfactionChart'
import DataUnavailableCard from '@/components/ui/DataUnavailableCard'

interface SessionsTabProps {
  analysisResults: UploadResponse
  onGenerateMarketingInsights: (data: any) => Promise<any>
}

export default function SessionsTab({ 
  analysisResults,
  onGenerateMarketingInsights
}: SessionsTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Marketing & Event Analytics
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Marketing channel effectiveness, venue preferences, and strategic insights for event optimization
        </p>
      </div>

      {/* Marketing & Event Analytics */}
      <div className="grid grid-cols-1 gap-8">
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
        {(analysisResults as any)?.discovery_channels ? (
          <ChannelSatisfactionChart 
            data={(analysisResults as any).discovery_channels}
          />
        ) : (
          <DataUnavailableCard
            title="Channel Satisfaction Data"
            message="Discovery channel satisfaction data was not collected in this form."
          />
        )}

        {/* Venue/Modality vs Satisfaction */}
        {(analysisResults as any)?.venue_preferences ? (
          <VenueSatisfactionChart 
            data={(analysisResults as any).venue_preferences}
          />
        ) : (
          <DataUnavailableCard
            title="Venue Preference Data"
            message="Venue and modality preferences were not collected in this form."
          />
        )}
      </div>


    </div>
  )
}
