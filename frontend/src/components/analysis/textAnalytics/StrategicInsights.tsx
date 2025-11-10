// components/analysis/textAnalytics/StrategicInsights.tsx
'use client'
import { useState } from 'react'
import { 
  AccountTree as StrategyIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  FlashOn as FlashOnIcon,
  Visibility as ViewIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from '@mui/icons-material'
import TruncatedText from '@/components/ui/TruncatedText'
import CopyButton from '@/components/ui/CopyButton'
import SampleResponsesModal from '@/components/ui/SampleResponsesModal'

interface StrategicInsightsData {
  executive_summary: string
  top_strengths: string[]
  critical_improvements: string[]
  strategic_recommendations: string[]
  quick_wins: string[]
  long_term_goals: string[]
  success_metrics: string[]
}

interface StrategicInsightsProps {
  data: StrategicInsightsData
  based_on: {
    total_responses: number
    metrics_analyzed: number
    sample_size?: number
  }
  error?: string
  onRefresh?: () => Promise<void>
  isRefreshing?: boolean
  feedbackSamples?: any[] 
}

export default function StrategicInsights({ 
  data, 
  based_on, 
  error, 
  onRefresh, 
  isRefreshing = false, 
    feedbackSamples = []
}: StrategicInsightsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{ title: string; samples: string[]; theme?: string }>({
    title: '',
    samples: [],
    theme: undefined
  })
  
  // Unified tab state for all insights (improvements, recommendations, quick wins, long-term goals)
  const [insightsTab, setInsightsTab] = useState<'improvements' | 'recommendations' | 'quick' | 'longterm'>('improvements')

  const handleShowSamples = (title: string, theme?: string) => {
    // Extract sample text from feedbackSamples for the given theme
    // For now, show generic samples; can be enhanced with actual filtering
    const samples = feedbackSamples
      .slice(0, 5)
      .map((item: any) => 
        item.positive_feedback || item.improvement_feedback || item.additional_comments
      )
      .filter(Boolean)
    
    setModalData({ title, samples, theme })
    setModalOpen(true)
  }

  const copyAllInsights = () => {
    const allText = [
      `AI Strategic Insights (Based on ${based_on.total_responses} responses)`,
      '',
      'EXECUTIVE SUMMARY',
      data.executive_summary,
      '',
      'TOP STRENGTHS',
      ...(data.top_strengths || []).map((s, i) => `${i + 1}. ${s}`),
      '',
      'CRITICAL IMPROVEMENTS',
      ...(data.critical_improvements || []).map((s, i) => `${i + 1}. ${s}`),
      '',
      'STRATEGIC RECOMMENDATIONS',
      ...(data.strategic_recommendations || []).map((s, i) => `${i + 1}. ${s}`),
      '',
      'QUICK WINS',
      ...(data.quick_wins || []).map((s, i) => `• ${s}`),
      '',
      'LONG-TERM GOALS',
      ...(data.long_term_goals || []).map((s, i) => `• ${s}`),
    ].join('\n')
    
    return allText
  }

  if (error) {
    return (
      <div className="glass-card-dark p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <StrategyIcon sx={{ fontSize: 24, color: 'var(--color-google-red)' }} />
          <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Strategic Insights
          </h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="glass-card-dark p-6 rounded-xl elevation-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <StrategyIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
            <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              AI Strategic Insights
            </h3>
            <span className="text-xs px-2 py-1 rounded font-medium"
                  style={{ 
                    backgroundColor: 'rgba(66, 133, 244, 0.15)',
                    color: 'var(--color-google-blue)'
                  }}></span>
          </div>
          
          <div className="flex items-center gap-2">
            <CopyButton text={copyAllInsights()} label="Copy All" size="small" />
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-3 py-1 rounded text-sm transition-all inline-flex items-center gap-1 font-medium"
                style={{
                  backgroundColor: isRefreshing ? 'rgba(156, 163, 175, 0.15)' : 'rgba(66, 133, 244, 0.15)',
                  color: isRefreshing ? 'var(--color-text-tertiary)' : 'var(--color-google-blue)',
                  cursor: isRefreshing ? 'not-allowed' : 'pointer',
                  opacity: isRefreshing ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshing) {
                    e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.25)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRefreshing) {
                    e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.15)'
                  }
                }}
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
              </button>
            )}
          </div>
        </div>

        {/* Two-column layout: Left = Summary + Metadata, Right = Stacked Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Executive Summary + Metadata */}
          <div className="lg:col-span-1 space-y-4">
            {/* Executive Summary Card */}
            <div className="glass-card-dark p-5 rounded-lg border-l-4" 
                 style={{ borderLeftColor: 'var(--color-google-blue)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg" style={{ color: 'var(--color-google-blue)' }}>
                  Executive Summary
                </h4>
                <CopyButton text={data.executive_summary} size="small" />
              </div>
              <TruncatedText 
                text={data.executive_summary} 
                maxLength={280}
                style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}
              />
            </div>

      

            {/* Top Strengths Card (moved from right column) */}
            {data.top_strengths && data.top_strengths.length > 0 && (
              <div className="glass-card-dark p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--color-usc-green)' }}>
                    <StarIcon sx={{ fontSize: 18, color: 'var(--color-usc-green)' }} />
                    Top Strengths
                  </h4>
                  {feedbackSamples.length > 0 && (
                    <button
                      onClick={() => handleShowSamples('Sample Responses: Top Strengths', 'strengths')}
                      className="text-xs px-2 py-1 rounded transition-all inline-flex items-center gap-1"
                      style={{ backgroundColor: 'rgba(76, 175, 80, 0.12)', color: 'var(--color-usc-green)' }}
                    >
                      <ViewIcon sx={{ fontSize: 12 }} /> Show samples
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {data.top_strengths.map((strength: string, index: number) => (
                    <div key={index} className="p-2 bg-green-500/8 rounded-md flex items-start justify-between group">
                      <TruncatedText text={strength} maxLength={160} style={{ color: 'var(--color-text-primary)' }} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={strength} label="" size="small" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          </div>

          {/* RIGHT COLUMN: Stacked Insight Panels */}
          <div className="lg:col-span-2 space-y-5">
          

            {/* Unified Insights Carousel: Improvements, Recommendations, Quick Wins, Long-Term Goals */}
            {((data.critical_improvements && data.critical_improvements.length > 0) || 
              (data.strategic_recommendations && data.strategic_recommendations.length > 0) ||
              (data.quick_wins && data.quick_wins.length > 0) ||
              (data.long_term_goals && data.long_term_goals.length > 0)) && (
              <div className="glass-card-dark p-5 rounded-lg flex flex-col h-[600px] md:h-[620px]">
                {/* Tab Navigation - Single Row at Top */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {/* Critical Improvements Tab */}
                  {data.critical_improvements && data.critical_improvements.length > 0 && (
                    <button
                      onClick={() => setInsightsTab('improvements')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        insightsTab === 'improvements' ? 'shadow-md scale-100' : 'opacity-50 scale-95'
                      }`}
                      style={{
                        backgroundColor: insightsTab === 'improvements' 
                          ? 'rgba(255, 152, 0, 0.2)' 
                          : 'rgba(255, 152, 0, 0.08)',
                        color: 'var(--color-usc-orange)',
                        filter: insightsTab === 'improvements' ? 'none' : 'blur(0.3px)'
                      }}
                    >
                      <WarningIcon sx={{ fontSize: 18 }} />
                      <span className="hidden sm:inline">Critical Improvements</span>
                      <span className="sm:hidden">Improvements</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        {data.critical_improvements.length}
                      </span>
                    </button>
                  )}
                  
                  {/* Strategic Recommendations Tab */}
                  {data.strategic_recommendations && data.strategic_recommendations.length > 0 && (
                    <button
                      onClick={() => setInsightsTab('recommendations')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        insightsTab === 'recommendations' ? 'shadow-md scale-100' : 'opacity-50 scale-95'
                      }`}
                      style={{
                        backgroundColor: insightsTab === 'recommendations' 
                          ? 'rgba(66, 133, 244, 0.2)' 
                          : 'rgba(66, 133, 244, 0.08)',
                        color: 'var(--color-google-blue)',
                        filter: insightsTab === 'recommendations' ? 'none' : 'blur(0.3px)'
                      }}
                    >
                      <LightbulbIcon sx={{ fontSize: 18 }} />
                      Recommendations
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        {data.strategic_recommendations.length}
                      </span>
                    </button>
                  )}

                  {/* Quick Wins Tab */}
                  {data.quick_wins && data.quick_wins.length > 0 && (
                    <button
                      onClick={() => setInsightsTab('quick')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        insightsTab === 'quick' ? 'shadow-md scale-100' : 'opacity-50 scale-95'
                      }`}
                      style={{
                        backgroundColor: insightsTab === 'quick' 
                          ? 'rgba(250, 204, 21, 0.2)' 
                          : 'rgba(250, 204, 21, 0.08)',
                        color: 'var(--color-google-yellow)',
                        filter: insightsTab === 'quick' ? 'none' : 'blur(0.3px)'
                      }}
                    >
                      <FlashOnIcon sx={{ fontSize: 18 }} />
                      Quick Wins
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        {data.quick_wins.length}
                      </span>
                    </button>
                  )}

                  {/* Long-Term Goals Tab */}
                  {data.long_term_goals && data.long_term_goals.length > 0 && (
                    <button
                      onClick={() => setInsightsTab('longterm')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        insightsTab === 'longterm' ? 'shadow-md scale-100' : 'opacity-50 scale-95'
                      }`}
                      style={{
                        backgroundColor: insightsTab === 'longterm' 
                          ? 'rgba(168, 85, 247, 0.2)' 
                          : 'rgba(168, 85, 247, 0.08)',
                        color: 'var(--color-google-purple)',
                        filter: insightsTab === 'longterm' ? 'none' : 'blur(0.3px)'
                      }}
                    >
                      <StrategyIcon sx={{ fontSize: 18 }} />
                      Long-Term Goals
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        {data.long_term_goals.length}
                      </span>
                    </button>
                  )}
                </div>

                {/* Content: flex-grow to take remaining space with internal scrolling */}
                <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                  {/* Critical Improvements Content */}
                  {insightsTab === 'improvements' && data.critical_improvements?.map((improvement: string, index: number) => (
                    <div key={index} 
                         className="p-3 bg-red-500/8 rounded-lg border-l-3 group hover:bg-red-500/12 transition-all" 
                         style={{ borderLeftColor: 'var(--color-usc-orange)' }}>
                      <div className="flex items-start justify-between gap-2">
                        <TruncatedText 
                          text={improvement}
                          maxLength={200}
                          style={{ color: 'var(--color-text-primary)' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <CopyButton text={improvement} label="" size="small" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Strategic Recommendations Content */}
                  {insightsTab === 'recommendations' && data.strategic_recommendations?.map((recommendation: string, index: number) => (
                    <div key={index} 
                         className="p-3 bg-blue-500/8 rounded-lg border-l-3 group hover:bg-blue-500/12 transition-all" 
                         style={{ borderLeftColor: 'var(--color-google-blue)' }}>
                      <div className="flex items-start justify-between gap-2">
                        <TruncatedText 
                          text={recommendation}
                          maxLength={200}
                          style={{ color: 'var(--color-text-primary)' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <CopyButton text={recommendation} label="" size="small" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Quick Wins Content */}
                  {insightsTab === 'quick' && data.quick_wins?.map((win: string, index: number) => (
                    <div key={index} 
                         className="p-2 bg-yellow-500/8 rounded-lg text-sm group hover:bg-yellow-500/12 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <TruncatedText 
                          text={`• ${win}`}
                          maxLength={180}
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <CopyButton text={win} label="" size="small" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Long-Term Goals Content */}
                  {insightsTab === 'longterm' && data.long_term_goals?.map((goal: string, index: number) => (
                    <div key={index} 
                         className="p-2 bg-purple-500/8 rounded-lg text-sm group hover:bg-purple-500/12 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <TruncatedText 
                          text={`• ${goal}`}
                          maxLength={180}
                          style={{ color: 'var(--color-text-secondary)' }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <CopyButton text={goal} label="" size="small" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Controls: Navigation Arrows + Show Samples Button */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/5">
                  {feedbackSamples.length > 0 && (
                    <button
                      onClick={() => {
                        const titles = {
                          improvements: 'Sample Responses: Critical Improvements',
                          recommendations: 'Sample Responses: Strategic Context',
                          quick: 'Sample Responses: Quick Wins',
                          longterm: 'Sample Responses: Long-Term Goals'
                        };
                        handleShowSamples(titles[insightsTab], insightsTab);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                      style={{
                        backgroundColor: 
                          insightsTab === 'improvements' ? 'rgba(255, 152, 0, 0.15)' :
                          insightsTab === 'recommendations' ? 'rgba(66, 133, 244, 0.15)' :
                          insightsTab === 'quick' ? 'rgba(250, 204, 21, 0.15)' :
                          'rgba(168, 85, 247, 0.15)',
                        color: 
                          insightsTab === 'improvements' ? 'var(--color-usc-orange)' :
                          insightsTab === 'recommendations' ? 'var(--color-google-blue)' :
                          insightsTab === 'quick' ? 'var(--color-google-yellow)' :
                          'var(--color-google-purple)'
                      }}
                    >
                      <ViewIcon sx={{ fontSize: 12 }} />
                      Show sample responses
                    </button>
                  )}
                  
                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const tabs: Array<'improvements' | 'recommendations' | 'quick' | 'longterm'> = [];
                        if (data.critical_improvements?.length) tabs.push('improvements');
                        if (data.strategic_recommendations?.length) tabs.push('recommendations');
                        if (data.quick_wins?.length) tabs.push('quick');
                        if (data.long_term_goals?.length) tabs.push('longterm');
                        const currentIndex = tabs.indexOf(insightsTab);
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                        setInsightsTab(tabs[prevIndex]);
                      }}
                      className="p-1 rounded hover:bg-white/5 transition-all"
                      style={{ color: 'var(--color-text-secondary)' }}
                      title="Previous"
                    >
                      <PrevIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => {
                        const tabs: Array<'improvements' | 'recommendations' | 'quick' | 'longterm'> = [];
                        if (data.critical_improvements?.length) tabs.push('improvements');
                        if (data.strategic_recommendations?.length) tabs.push('recommendations');
                        if (data.quick_wins?.length) tabs.push('quick');
                        if (data.long_term_goals?.length) tabs.push('longterm');
                        const currentIndex = tabs.indexOf(insightsTab);
                        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                        setInsightsTab(tabs[nextIndex]);
                      }}
                      className="p-1 rounded hover:bg-white/5 transition-all"
                      style={{ color: 'var(--color-text-secondary)' }}
                      title="Next"
                    >
                      <NextIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SampleResponsesModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        samples={modalData.samples}
        theme={modalData.theme}
      />
    </>
  )
}