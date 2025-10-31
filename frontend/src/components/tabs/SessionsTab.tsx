/**
 * Sessions Tab Component
 * 
 * Displays session performance analytics including:
 * - Session popularity and attendance metrics
 * - Session performance matrix (bubble chart)
 * - Discovery channel impact analysis
 * - Future analytics placeholders
 */

'use client'

import type { UploadResponse } from '@/types/upload'
import ChartFactory, { createChartConfig } from '@/components/analysis/charts/ChartFactory'
import SessionPerformanceMatrixChart from '@/components/analysis/charts/SessionPerformanceMatrixChart'
import DiscoveryChannelImpactChart from '@/components/analysis/charts/DiscoveryChannelImpactChart'

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
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Session Performance Analysis
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          In-depth analysis of session popularity, attendance, and
          satisfaction
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

      {/* Future Analytics - Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
          <h4 className="text-base font-semibold mb-3 text-usc-orange">
            Preferred Time Analysis
          </h4>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Time slot preferences and effectiveness metrics
          </p>
        </div>

        <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
          <h4 className="text-base font-semibold mb-3 text-usc-orange">
            Venue/Modality Preferences
          </h4>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Online vs in-person preference analysis for hybrid events
          </p>
        </div>
      </div>
    </div>
  )
}
