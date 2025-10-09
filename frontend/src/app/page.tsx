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
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

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
              
              {/* Main Dashboard */}
              <InsightsCard 
                results={analysisResults}
                error={analysisError}
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Left Column - Upload Card (3/5 width on desktop, full width on mobile) - The component now controls its own max-width */}
              <div className="lg:col-span-3">
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

              {/* Right Column - How it Works Steps (2/5 width on desktop, full width on mobile) */}
              <div className="lg:col-span-2 space-y-6 lg:mt-0 mt-8">
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
        content: createPlaceholderContent(
          'Event Component Analysis',
          'Detailed breakdown of venue, speakers, and content performance',
          [
            'Venue satisfaction and facility ratings',
            'Speaker performance and engagement metrics',
            'Content quality and relevance scoring',
            'Cross-aspect correlation analysis',
            'Improvement recommendations per component'
          ]
        )
      })

      // SESSION ANALYTICS TAB - For technical session details
      tabs.push({
        id: 'sessions',
        label: 'Session Analytics',
        icon: <EventIcon sx={{ fontSize: 20 }} />,
        content: createPlaceholderContent(
          'Technical Session Performance',
          'In-depth analysis of session popularity, attendance, and satisfaction',
          [
            'Session attendance patterns and trends',
            'Time-slot effectiveness analysis',
            'Popular vs. underperforming sessions',
            'Session format comparison (workshop vs. talk)',
            'Duration and pacing satisfaction metrics'
          ]
        )
      })

      // ATTENDEE SEGMENTATION TAB - For demographic and behavioral analysis
      tabs.push({
        id: 'attendee-insights',
        label: 'Attendee Insights',
        icon: <PeopleIcon sx={{ fontSize: 20 }} />,
        content: createPlaceholderContent(
          'Attendee Segmentation & Behavior',
          'Understanding attendee preferences and satisfaction drivers',
          [
            'Pacing preference vs. satisfaction correlation',
            'Discovery channel impact on experience quality',
            'Venue modality preferences (online vs. in-person)',
            'Demographic satisfaction patterns',
            'Repeat attendee vs. first-timer analysis'
          ]
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

      <div className="relative z-20 container mx-auto px-6 py-12">
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

        <main className="max-w-7xl mx-auto">
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
