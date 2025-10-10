"use client";
import FileUpload from '../components/features/upload/FileUpload';
import InsightsCard from '../components/features/analysis/InsightsCard';
import Tabs, { Tab } from '../components/ui/Tabs';
import UploadPill from '../components/features/upload/UploadPill';
import Image from 'next/image';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';

import {
  UploadFile as UploadFileIcon,
  Dashboard as DashboardIcon,
  TextFields as TextFieldsIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import ChartFactory, { createChartConfig } from '../components/features/analysis/charts/ChartFactory';
import InsightsSummary from '../components/features/analysis/InsightsSummary';

/**
 * The `Home` component serves as the main landing page for the Event Insights Generator web application.
 * It provides users with an interface to upload event feedback CSV files, explains the workflow of the app,
 * and highlights key features such as data processing, NPS analysis, and insights generation.

 * @returns {JSX.Element}
 */
import { useState, useEffect } from 'react';



export default function Home() {
  console.log('=== PAGE COMPONENT LOADING ===')
  
  const [darkMode, setDarkMode] = useState(true); // Start with dark mode (GDG style)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalyzed, setIsAnalyzed] = useState(false) // Track if analysis is complete
  const [activeTab, setActiveTab] = useState('analysis') // Track current tab
  const [uploadedFilename, setUploadedFilename] = useState<string>('') // Store uploaded filename
  
  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? 'light' : 'dark');
    root.classList.add(darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle successful upload results
  const handleUploadSuccess = (results: any, filename?: string) => {
    setAnalysisResults(results)
    setAnalysisError('')
    setIsAnalyzed(true) // Trigger transition to analysis view
    if (filename) setUploadedFilename(filename)
    
    // Stay on current tab after analysis - no auto-switching needed
  }

  // Handle upload errors
  const handleUploadError = (error: string) => {
    setAnalysisError(error)
    setAnalysisResults(null)
    setIsAnalyzed(false) // Keep in upload view on error
  }

  // Reset to upload state (for "Upload another CSV" functionality)
  const handleResetToUpload = () => {
    setAnalysisResults(null)
    setAnalysisError('')
    setIsAnalyzed(false)
    setUploadedFilename('')
    setActiveTab('analysis') // Stay on analysis tab
  }

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    console.log('Tab changed to:', tabId)
    setActiveTab(tabId)
  }

  // Create placeholder content for future tabs
  const createPlaceholderContent = (title: string, description: string, features: string[]) => (
    <div className="glass-card-dark p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-3" style={{color: 'var(--color-text-primary)'}}>
          {title}
        </h3>
        <p className="text-lg" style={{color: 'var(--color-text-secondary)'}}>
          {description}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-usc-green">Planned Features</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3" style={{color: 'var(--color-text-secondary)'}}>
                <span className="text-usc-green mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-card-dark p-6 rounded-xl border border-white/10">
          <h5 className="text-md font-semibold mb-3 text-usc-orange">Coming Soon</h5>
          <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-tertiary)'}}>
            This section will be populated with advanced analytics once we have sufficient data patterns and user feedback to create meaningful insights.
          </p>
        </div>
      </div>
    </div>
  )

  // Create tab configuration dynamically
  const createTabs = (): Tab[] => {
    const tabs: Tab[] = []

    tabs.push({
      id: 'analysis',
      label: 'Analysis',
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
      content: (
        <>
          {analysisResults ? (
            <div className="space-y-6">
              {/* Upload Pill - Minimized upload status */}
              <UploadPill 
                filename={uploadedFilename}
                onReUpload={handleResetToUpload}
                className="mb-4"
              />
              
              {/* Executive Summary - Main Analysis Tab Content */}
              {(analysisResults as any)?.summary && (
                <div className="glass-card-dark p-8 rounded-xl elevation-2">
                  <div className="flex items-center gap-3 mb-6">
                    <AssessmentIcon sx={{ fontSize: 28, color: 'var(--color-google-blue)' }} />
                    <h3 className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                      Executive Summary
                    </h3>
                  </div>
                  
                  {/* Enhanced KPI Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <CheckCircleIcon sx={{ fontSize: 32, color: 'var(--color-usc-green)' }} />
                      <div>
                        <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>{(analysisResults as any).summary.total_responses}</div>
                        <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>Total Responses</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <InsightsIcon sx={{ fontSize: 32, color: 'var(--color-google-blue)' }} />
                      <div>
                        <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                          {((analysisResults as any)?.satisfaction?.data?.stats?.average || 0).toFixed(1)}<span className="text-lg">/5</span>
                        </div>
                        <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>Avg. Satisfaction</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <TrendingUpIcon sx={{ fontSize: 32, color: 'var(--color-usc-orange)' }} />
                      <div>
                        <div className="text-2xl font-bold" style={{color: 'var(--color-text-primary)'}}>
                          {(analysisResults as any)?.nps?.data?.nps_score?.toFixed(0) ?? 'N/A'}
                        </div>
                        <div className="text-sm font-medium" style={{color: 'var(--color-text-secondary)'}}>NPS Score</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg opacity-50">
                      <CategoryIcon sx={{ fontSize: 32, color: 'var(--color-text-tertiary)' }} />
                      <div>
                        <div className="text-lg font-bold" style={{color: 'var(--color-text-tertiary)'}}>Coming Soon</div>
                        <div className="text-sm font-medium" style={{color: 'var(--color-text-tertiary)'}}>Top Aspect</div>
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
                    <ChartFactory config={createChartConfig(
                      'satisfaction-dist',
                      'Satisfaction Distribution', 
                      'distribution',
                      (analysisResults as any).satisfaction.data,
                      {
                        subtitle: `${(analysisResults as any).satisfaction.data.stats?.total_responses || 0} responses analyzed`,
                        chartVariant: 'horizontalBar',
                        allowVariantToggle: true
                      }
                    )} className="w-full h-full" />
                  </div>
                )}

                {/* NPS Score and Recommendation vs Satisfaction */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {(analysisResults as any)?.nps?.data && (
                    <div className="w-full min-h-[450px]">
                      <ChartFactory config={createChartConfig(
                        'nps-score',
                        'Net Promoter Score',
                        'score', 
                        (analysisResults as any).nps.data,
                        {
                          subtitle: `${(analysisResults as any).nps.data.nps_category || 'Score Analysis'}`,
                          chartVariant: 'gauge',
                          allowVariantToggle: true
                        }
                      )} className="w-full h-full" />
                    </div>
                  )}

                  {(analysisResults as any)?.scatter_data?.data && (
                    <div className="w-full min-h-[450px]">
                      <ChartFactory config={createChartConfig(
                        'satisfaction-vs-recommendation',
                        'Satisfaction vs Recommendation',
                        'relationship',
                        (analysisResults as any).scatter_data.data,
                        {
                          subtitle: `Correlation analysis (${(analysisResults as any).scatter_data.data.total_points || 0} points)`,
                          chartVariant: 'scatter',
                          allowVariantToggle: true,
                          availableVariants: ['scatter', 'line']
                        }
                      )} className="w-full h-full" />
                    </div>
                  )}
                </div>

                {/* Future Charts - Placeholders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-usc-green">Pacing Analysis</h3>
                    <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                      Chart showing satisfaction by pacing preference - to be implemented
                    </p>
                  </div>

                  <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-usc-green">One Word Descriptions</h3>
                    <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                      Word cloud of event descriptors - to be implemented
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Upload Card */}
              <div className="lg:col-span-1">
                <FileUpload 
                  onUploadSuccess={(results, filename) => handleUploadSuccess(results, filename)}
                  onUploadError={handleUploadError}
                  onReset={handleResetToUpload}
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
                  <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-text-primary)'}}>
                    How It Works
                  </h3>
                  <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                    Simple 3-step process to transform your feedback
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                           style={{background: 'linear-gradient(135deg, var(--color-usc-green), var(--color-usc-green-light))'}}>
                        <UploadFileIcon sx={{ fontSize: 20, color: 'white' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
                          Upload & Validate
                        </h4>
                        <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                          Drag & drop your CSV with automatic validation
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{background: 'linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))'}}>
                        <DashboardIcon sx={{ fontSize: 20, color: 'white' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
                          Process & Analyze
                        </h4>
                        <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                          AI cleans and finds patterns in your data
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="glass-card-dark p-6 rounded-xl elevation-1 hover:elevation-2 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{background: 'linear-gradient(135deg, var(--color-usc-orange), var(--color-google-yellow))'}}>
                        <EventIcon sx={{ fontSize: 20, color: 'white' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--color-text-primary)'}}>
                          View & Act on Insights
                        </h4>
                        <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                          Interactive dashboard with actionable recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Preview */}
                <div className="glass-card-dark p-4 rounded-xl border border-white/10">
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1 text-usc-green">Ready to Start?</div>
                    <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                      Upload your CSV to see comprehensive analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )
    })

    // Additional tabs only show after analysis is complete
    if (analysisResults) {
      // TEXT ANALYTICS TAB - For open-ended responses
      tabs.push({
        id: 'text-insights',
        label: 'Text Insights',
        icon: <TextFieldsIcon sx={{ fontSize: 20 }} />,
        content: createPlaceholderContent(
          'Open-Ended Response Analysis',
          'Comprehensive text analytics for qualitative feedback',
          [
            'Sentiment analysis on free-text responses',
            'Keyword frequency and topic modeling',
            'Comment categorization and themes',
            'Word clouds and semantic analysis',
            'Response length and engagement metrics'
          ]
        )
      })

      // EVENT ASPECTS TAB - For venue, speakers, content analysis
      tabs.push({
        id: 'aspects',
        label: 'Event Aspects', 
        icon: <CategoryIcon sx={{ fontSize: 20 }} />,
        content: (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--color-text-primary)'}}>
                Event Aspects Analysis
              </h2>
              <p style={{color: 'var(--color-text-secondary)'}}>
                Detailed breakdown of venue, speakers, and content performance
              </p>
            </div>

            {/* Aspect Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart - Aspect Ratings Comparison */}
              {(analysisResults as any)?.ratings?.data && (
                <div className="w-full min-h-[450px]">
                  <ChartFactory config={createChartConfig(
                    'rating-comparison', 
                    'Aspect Ratings Comparison',
                    'relationship',
                    // Remove insights from data since we have InsightsSummary component below
                    { ...(analysisResults as any).ratings.data, insights: undefined },
                    {
                      subtitle: 'Venue • Speakers • Content performance',
                      chartVariant: 'radar',
                      allowVariantToggle: false
                    }
                  )} className="w-full h-full" />
                </div>
              )}

              {/* Placeholder for Aspect Performance Comparison */}
              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">Aspect Performance Comparison</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  Bar chart showing correlation coefficient of each aspect with overall satisfaction
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Coming Soon: What drives overall satisfaction analysis
                </div>
              </div>
            </div>

            {/* Event Strengths & Weaknesses Analysis */}
            {(analysisResults as any)?.ratings?.data && (
              <div className="w-full">
                <InsightsSummary 
                  data={(analysisResults as any).ratings.data} 
                  title="Event Strengths & Weaknesses Analysis"
                  className="w-full"
                />
              </div>
            )}

            {/* Future Features Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Per Aspect Averages</h4>
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  Individual aspect scoring breakdown - to be implemented
                </p>
              </div>

              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Correlation Analysis</h4>
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  Impact analysis: which aspects drive overall satisfaction most
                </p>
              </div>
            </div>
          </div>
        )
      })

      // SESSION ANALYTICS TAB - For technical session details
      tabs.push({
        id: 'sessions',
        label: 'Session Analytics',
        icon: <EventIcon sx={{ fontSize: 20 }} />,
        content: (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--color-text-primary)'}}>
                Session Performance Analysis
              </h2>
              <p style={{color: 'var(--color-text-secondary)'}}>
                In-depth analysis of session popularity, attendance, and satisfaction
              </p>
            </div>

            {/* Session Performance Chart */}
            {(analysisResults as any)?.sessions?.data && (
              <div className="w-full min-h-[450px]">
                <ChartFactory config={createChartConfig(
                  'session-popularity',
                  'Session Performance Analysis',
                  'comparison',
                  (analysisResults as any).sessions.data,
                  {
                    subtitle: `Attendance vs Satisfaction for top ${(analysisResults as any).sessions.data.sessions?.length || 0} sessions`,
                    chartVariant: 'groupedBar',
                    allowVariantToggle: true
                  }
                )} className="w-full h-full" />
              </div>
            )}

            {/* Future Session Analytics - Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">Session Performance Matrix</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  Bubble chart showing attendance vs satisfaction to identify Stars, Hidden Gems, and Underperformers
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Coming Soon: Bubble Chart Implementation
                </div>
              </div>

              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">Discovery Channel Analysis</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  Event discovery channel effectiveness and satisfaction correlation
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  To be implemented based on discovery channel data
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Preferred Time Analysis</h4>
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  Time slot preferences and effectiveness metrics
                </p>
              </div>

              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Venue/Modality Preferences</h4>
                <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>
                  Online vs in-person preference analysis for hybrid events
                </p>
              </div>
            </div>
          </div>
        )
      })

      // ATTENDEE SEGMENTATION TAB - For demographic and behavioral analysis
      tabs.push({
        id: 'attendee-insights',
        label: 'Attendee Insights',
        icon: <PeopleIcon sx={{ fontSize: 20 }} />,
        content: (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{color: 'var(--color-text-primary)'}}>
                Attendee Segmentation & Behavior
              </h2>
              <p style={{color: 'var(--color-text-secondary)'}}>
                Understanding attendee preferences and satisfaction drivers across different segments
              </p>
            </div>

            {/* Key Behavioral Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">Pacing & Engagement Analysis</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  Event pacing satisfaction patterns and engagement correlation analysis
                </p>
                <div className="space-y-3">
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Pacing feedback distribution across segments
                  </div>
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Correlation with overall satisfaction scores
                  </div>
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Optimal pacing recommendations
                  </div>
                </div>
              </div>

              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">Discovery Channel Impact</h3>
                <p className="text-sm mb-4" style={{color: 'var(--color-text-secondary)'}}>
                  How attendees found the event and its correlation with experience quality
                </p>
                <div className="space-y-3">
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Social media vs word-of-mouth effectiveness
                  </div>
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Channel-specific satisfaction patterns
                  </div>
                  <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                    • Marketing ROI and quality correlation
                  </div>
                </div>
              </div>
            </div>

            {/* Demographic & Preference Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Venue Modality Preferences</h4>
                <p className="text-sm mb-3" style={{color: 'var(--color-text-secondary)'}}>
                  Online vs in-person satisfaction by attendee demographics
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Hybrid event optimization insights
                </div>
              </div>

              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Experience Level Impact</h4>
                <p className="text-sm mb-3" style={{color: 'var(--color-text-secondary)'}}>
                  First-time vs returning attendee satisfaction patterns
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Retention and onboarding optimization
                </div>
              </div>

              <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">Demographic Patterns</h4>
                <p className="text-sm mb-3" style={{color: 'var(--color-text-secondary)'}}>
                  Age, background, and affiliation satisfaction drivers
                </p>
                <div className="text-xs" style={{color: 'var(--color-text-tertiary)'}}>
                  Targeted content strategy insights
                </div>
              </div>
            </div>

            {/* Future Advanced Analytics */}
            <div className="glass-card-dark p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
              <div className="flex items-center gap-3">
                <PeopleIcon sx={{ fontSize: 24, color: 'var(--usc-green)' }} />
                <div>
                  <h4 className="font-semibold text-usc-green">Advanced Segmentation Pipeline</h4>
                  <p className="text-sm mt-1" style={{color: 'var(--color-text-secondary)'}}>
                    Machine learning-powered attendee clustering, predictive satisfaction modeling, and personalized experience recommendations will be implemented as comprehensive demographic and behavioral data becomes available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }

    // ABOUT TAB - Always present
    tabs.push({
      id: 'about',
      label: 'About',
      icon: <InfoIcon sx={{ fontSize: 20 }} />,
      content: (
        <div className="glass-card-dark p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6" style={{color: 'var(--color-text-primary)'}}>
            About Event Insights Generator
          </h3>
          
          <div className="space-y-6" style={{color: 'var(--color-text-secondary)'}}>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-usc-green">What We Do</h4>
              <p className="leading-relaxed">
                Transform your event feedback CSV files into comprehensive, actionable insights using advanced analytics and visualization techniques. Perfect for event organizers, marketers, and data analysts who want to understand participant satisfaction and improve future events.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-usc-green">Features</h4>
              <ul className="space-y-2">
                <li>• Interactive dashboard with multiple chart types</li>
                <li>• Net Promoter Score (NPS) analysis and categorization</li>
                <li>• Satisfaction distribution with meaningful insights</li>
                <li>• Session popularity and performance comparison</li>
                <li>• Correlation analysis between satisfaction and recommendation</li>
                <li>• Comparative aspect analysis with strengths/weaknesses identification</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-usc-green">Built With</h4>
              <p className="leading-relaxed">
                React • TypeScript • Next.js • Recharts • Flask • Python • Material-UI
                <br />
                <span className="text-sm opacity-80">
                  Developed with ❤️ by Google Developer Groups USC
                </span>
              </p>
            </div>
          </div>
        </div>
      )
    })

    return tabs
  }
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* The scroll-to-top button will live here and manage its own visibility */}
      <ScrollToTopButton />

      {/* Dark Mode Toggle - Fixed positioning with high z-index */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="glass-card-dark p-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
        >
          {darkMode ? (
            <Brightness7Icon sx={{ fontSize: 24, color: '#FFB74D' }} />
          ) : (
            <Brightness4Icon sx={{ fontSize: 24, color: '#4A5568' }} />
          )}
        </button>
      </div>

      <div className="relative z-20 container mx-auto px-6 py-12 max-w-6xl">
        <header className="text-center mb-12">


          {/* Google-style brand badge */}
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 backdrop-blur-md border transition-all duration-300 ${
            darkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/60 border-white/40'
          }`}>
            <Image 
              src="/assets/GDG-logo.png" 
              alt="Google Developer Groups Logo"
              width={24}
              height={24}
            />
            <span className={`font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Powered by Google Developer Groups - USC
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-500`}>
              Event Insights
            </span>
            <br />
            <span 
              className="bg-clip-text text-transparent font-extrabold"
              style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Generator
            </span>
          </h1>
          
          <p className={`text-xl max-w-3xl mx-auto mb-8 leading-relaxed transition-colors duration-500 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform your event feedback into actionable insights with AI-powered analysis
            <br />
            <span className={`text-base opacity-80 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Statistical analysis • NPS scoring • Real-time visualizations</span>
          </p>
          
          {/* Spacer for better visual balance - Clean modern look */}
        </header>

        <main className="max-w-6xl mx-auto">
          {/* Tabbed Navigation System */}
          <Tabs 
            tabs={createTabs()} 
            defaultTab={activeTab}
            onTabChange={handleTabChange}
            className="mt-8"
          />
        </main>

        <footer className="mt-20 text-center">

          <p className={`text-sm opacity-60 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Built with love, passion & AI • Made in Cebu 🇵🇭
          </p>
        </footer>
      </div>
    </div>
  );
}
