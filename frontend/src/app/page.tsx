"use client";
import FileUpload from '../components/FileUpload';
import InsightsCard from '../components/InsightsCard';
import Image from 'next/image';
import CombinedBackground from '../components/CombinedBackground';

import {
  UploadFile as UploadFileIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon, 
  ModelTraining as ModelTrainingIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
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
  const handleUploadSuccess = (results: any) => {
    setAnalysisResults(results)
    setAnalysisError('')
    setIsAnalyzed(true) // Trigger transition to analysis view
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
  }
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <CombinedBackground isDark={darkMode} />

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
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className={`px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border transition-all duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-gray-200 hover:bg-white/20' 
                : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
            }`}>
              <ModelTrainingIcon sx={{ fontSize: 18, color: '#4285f4' }} />
              <span>AI Processing</span>
            </span>
            <span className={`px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border transition-all duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-gray-200 hover:bg-white/20' 
                : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
            }`}>
              <AnalyticsIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
              <span>NPS Analysis</span>
            </span>
            <span className={`px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border transition-all duration-300 ${
              darkMode 
                ? 'bg-white/10 border-white/20 text-gray-200 hover:bg-white/20' 
                : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
            }`}>
              <LightbulbIcon sx={{ fontSize: 18, color: '#FF9800' }} />
              <span>Smart Insights</span>
            </span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <FileUpload 
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            onReset={handleResetToUpload}
            isMinimized={isAnalyzed}
          />
          
          {/* Display results or errors */}
          <InsightsCard 
            results={analysisResults}
            error={analysisError}
          />
          
          {/* How it works section - Hidden when analysis is complete */}
          <div className={`mt-16 grid md:grid-cols-3 gap-8 transition-all duration-500 ease-out ${
            isAnalyzed 
              ? 'opacity-0 max-h-0 overflow-hidden pointer-events-none' 
              : 'opacity-100 max-h-none'
          }`}>
            <div className="glass-card-dark p-8 rounded-2xl text-center elevation-2 hover:elevation-3 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{background: 'linear-gradient(135deg, var(--color-usc-green), var(--color-usc-green-light))'}}>
                <UploadFileIcon sx={{ fontSize: 28, color: 'white' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Upload & Validate</h3>
              <p className="leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                Drag & drop your CSV feedback files with automatic format validation and preview
              </p>
            </div>
            
            <div className="glass-card-dark p-8 rounded-2xl text-center elevation-2 hover:elevation-3 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   style={{background: 'linear-gradient(135deg, var(--color-google-blue), var(--color-usc-green))'}}>
                <SettingsIcon sx={{ fontSize: 28, color: 'white' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>Process & Analyze</h3>
              <p className="leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                Initiate the analysis to let our "AI" clean, score, and find patterns in your feedback
              </p>
            </div>
            
            <div className="glass-card-dark p-8 rounded-2xl text-center elevation-2 hover:elevation-3 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   style={{background: 'linear-gradient(135deg, var(--color-usc-orange), var(--color-google-yellow))'}}>
                <BarChartIcon sx={{ fontSize: 28, color: 'white' }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--color-text-primary)'}}>View & Act on Insights</h3>
              <p className="leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                Explore your interactive dashboard with NPS scores, sentiment analysis, and actionable recommendations
              </p>
            </div>
          </div>
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
