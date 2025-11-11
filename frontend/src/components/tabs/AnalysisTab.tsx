/**
 * Analysis Tab Component
 * 
 * The main analysis dashboard with two states:
 * 1. Upload State - File upload interface with "How It Works" guide
 * 2. Results State - Executive summary, KPI cards, and core analytics charts
 * 
 * 
 */

'use client'

import type { UploadResponse } from '@/types/upload'
import type { AspectHighlight } from '@/lib/dataHelpers'
import FileUpload from '@/components/upload/FileUpload'
import UploadPill from '@/components/upload/UploadPill'
import ChartFactory, { createChartConfig } from '@/components/analysis/charts/ChartFactory'
import PacingAnalysisChart from '@/components/analysis/charts/PacingAnalysisChart'
import UnifiedWordCloud from '@/components/analysis/charts/WordCloud/WordCloud'
import TimeSlotPreferencesChart from '@/components/analysis/charts/TimeSlotPreferencesChart'
import VenueModalityPreferencesChart from '@/components/analysis/charts/VenueModalityPreferencesChart'
import ChannelSatisfactionChart from '@/components/analysis/charts/ChannelSatisfactionChart'

import {
  UploadFile as UploadFileIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
} from "@mui/icons-material"

interface AnalysisTabProps {
  analysisResults: UploadResponse | null
  uploadedFilename: string
  topAspect: AspectHighlight | null
  lowestAspect: AspectHighlight | null
  analysisError: string
  onUploadSuccess: (results: UploadResponse, filename?: string) => void
  onResetToUpload: () => void
}

export default function AnalysisTab({ 
  analysisResults,
  uploadedFilename,
  topAspect,
  lowestAspect,
  analysisError,
  onUploadSuccess,
  onResetToUpload
}: AnalysisTabProps) {
  return (
    <>
      {analysisResults ? (
        <div className="space-y-6">
          {/* Upload Pill - Minimized upload status */}
          <UploadPill
            filename={uploadedFilename}
            onReUpload={onResetToUpload}
            className="mb-4"
          />

          {/* Executive Summary - Main Analysis Tab Content */}
          {(analysisResults as any)?.summary && (
            <div className="glass-card-dark p-8 rounded-xl elevation-2">
              <div className="flex items-center gap-3 mb-6">
                <AssessmentIcon
                  sx={{ fontSize: 28, color: "var(--color-google-blue)" }}
                />
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Executive Summary
                </h3>
              </div>

              {/* Enhanced KPI Cards: responsive — 1 / 2 / 3 / 5 columns for sm/md/lg/xl */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 32, color: "var(--color-usc-green)" }}
                  />
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {(analysisResults as any).summary.total_responses}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Total Responses
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <InsightsIcon
                    sx={{ fontSize: 32, color: "var(--color-google-blue)" }}
                  />
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {(
                        (analysisResults as any)?.satisfaction?.data?.stats
                          ?.average || 0
                      ).toFixed(1)}
                      <span className="text-lg">/5</span>
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Avg. Satisfaction
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <TrendingUpIcon
                    sx={{ fontSize: 32, color: "var(--color-usc-orange)" }}
                  />
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {(
                        analysisResults as any
                      )?.nps?.data?.nps_score?.toFixed(0) ?? "N/A"}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      NPS Score
                    </div>
                  </div>
                </div>

                {/* Top Aspect KPI Card */}
                <div className={`flex items-center gap-4 p-4 rounded-lg ${!topAspect ? 'opacity-50' : ''}`} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <CategoryIcon
                    sx={{
                      fontSize: 32,
                      color: topAspect ? "var(--color-google-yellow)" : "var(--color-text-tertiary)",
                    }}
                  />
                  <div>
                    {topAspect ? (
                      <>
                        <div
                          className="text-xl font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {topAspect.aspect}
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Top Aspect ({topAspect.value.toFixed(1)}/5)
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="text-lg font-bold"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          N/A
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          Top Aspect
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Lowest Aspect KPI Card */}
                <div className={`flex items-center gap-4 p-4 rounded-lg ${!lowestAspect ? 'opacity-50' : ''}`} style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <CategoryIcon
                    sx={{
                      fontSize: 32,
                      color: lowestAspect ? "var(--color-usc-orange)" : "var(--color-text-tertiary)",
                    }}
                  />
                  <div>
                    {lowestAspect ? (
                      <>
                        <div
                          className="text-xl font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {lowestAspect.aspect}
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          Lowest Aspect ({lowestAspect.value.toFixed(1)}/5)
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="text-lg font-bold"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          N/A
                        </div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          Lowest Aspect
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Charts for Analysis Tab */}
          <div className="space-y-8">
            {/* Satisfaction Distribution - Core metric */}
            {(analysisResults as any)?.satisfaction?.data && (
              <div className="w-full min-h-[450px]">
                <ChartFactory
                  config={createChartConfig(
                    "satisfaction-dist",
                    "Satisfaction Distribution",
                    "distribution",
                    (analysisResults as any).satisfaction.data,
                    {
                      subtitle: `${
                        (analysisResults as any).satisfaction.data.stats
                          ?.total_responses || 0
                      } responses analyzed`,
                      chartVariant: "horizontalBar",
                      allowVariantToggle: true,
                    }
                  )}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* NPS Score and Recommendation vs Satisfaction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(analysisResults as any)?.nps?.data && (
                <div className="w-full">
                  <ChartFactory
                    config={createChartConfig(
                      "nps-score",
                      "Net Promoter Score",
                      "score",
                      (analysisResults as any).nps.data,
                      {
                        subtitle: `${
                          (analysisResults as any).nps.data.nps_category ||
                          "Score Analysis"
                        }`,
                        chartVariant: "gauge",
                        allowVariantToggle: false,
                      }
                    )}
                    className="w-full h-full"
                  />
                </div>
              )}

              {(analysisResults as any)?.scatter_data?.data && (
                <div className="w-full">
                  <ChartFactory
                    config={createChartConfig(
                      "satisfaction-vs-recommendation",
                      "Satisfaction vs Recommendation",
                      "relationship",
                      (analysisResults as any).scatter_data.data,
                      {
                        subtitle: `Correlation analysis (${
                          (analysisResults as any).scatter_data.data
                            .total_points || 0
                        } points)`,
                        chartVariant: "scatter",
                        allowVariantToggle: true,
                        availableVariants: ["scatter", "line"],
                      }
                    )}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Pacing & Word Cloud Analysis - Aligned & Uniform */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Pacing Analysis Chart */}
              <PacingAnalysisChart
                data={(analysisResults as any)?.pacing?.data}
                title="Pacing vs Satisfaction"
                height={350}
              />
              
              {/* Word Cloud - Larger with More Words */}
              <UnifiedWordCloud
                title="One-Word Descriptions  "
                data={
                  (analysisResults as any)?.one_word_descriptions?.data?.word_cloud
                    ? (analysisResults as any).one_word_descriptions.data.word_cloud.map((item: any) => ({
                        word: item.word,
                        value: item.count,
                        group: 'descriptions'
                      }))
                    : []
                }
                stats={(analysisResults as any)?.one_word_descriptions?.data?.stats}
                height={465}
                showStats={true}
              />
            </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Slot Preferences - Now defaults to Pie Chart */}
        <TimeSlotPreferencesChart
          data={(analysisResults as any)?.time_preferences}
          variant="pie"
        />

        

        {/* Venue/Modality Preferences */}
        <VenueModalityPreferencesChart
          data={(analysisResults as any)?.venue_preferences}
          variant="venue_breakdown"
        />
      </div>

          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Upload Card */}
          <div className="lg:col-span-1">
            <FileUpload
              onUploadSuccess={(results, filename) =>
                onUploadSuccess(results, filename)
              }
              
              onReset={onResetToUpload}
              isMinimized={false}
            />

            {/* Display upload errors */}
            {analysisError && (
              <div className="mt-6 glass-card-dark p-4 rounded-xl border-l-4 border-red-500">
                <p className="text-red-400">{analysisError}</p>
              </div>
            )}
          </div>

          {/* Right Column - How it Works Steps */}
          <div className="lg:col-span-1 space-y-6 lg:mt-0 mt-8">
            <div className="mb-6">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                How It Works
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Simple 3-step process to transform your feedback
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-usc-green), var(--color-usc-green-light))",
                    }}
                  >
                    <UploadFileIcon sx={{ fontSize: 20, color: "white" }} />
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Upload & Validate
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Drag & drop your CSV with automatic validation
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))",
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 20, color: "white" }} />
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Process & Analyze
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      AI cleans and finds patterns in your data
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-usc-orange), var(--color-google-yellow))",
                    }}
                  >
                    <EventIcon sx={{ fontSize: 20, color: "white" }} />
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      View & Act on Insights
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Interactive dashboard with actionable recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Preview */}
            <div className="glass-card-dark p-4 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-lg font-bold mb-1 text-usc-green">
                  Ready to Start?
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Upload your CSV to see comprehensive analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
