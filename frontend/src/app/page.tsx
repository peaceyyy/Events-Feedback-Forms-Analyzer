"use client";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import Tabs from "../components/ui/TabNavigationBar";
import useTabs from '@/lib/useTabs'
import SpaceBackground from "@/components/ui/SpaceBackground";
import Header from '@/components/ui/Header'
import PageControls from '@/components/ui/PageControls'
import { useState, useEffect } from "react";
import type { UploadResponse, FeedbackRecord } from '@/types/upload'
import logger from '@/lib/logger'
import { calculateAspectHighlights, type AspectHighlight } from '@/lib/dataHelpers'
import { 
  generateSessionInsights, 
  generateMarketingInsights, 
  generateAspectInsights 
} from '@/lib/aiService'

export default function Home() {
  logger.debug("Home page component loaded.");
  const [darkMode, setDarkMode] = useState(true); // Start with dark mode (GDG style)
  const [analysisResults, setAnalysisResults] = useState<UploadResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("analysis"); // Track current tab
  const [uploadedFilename, setUploadedFilename] = useState<string>(""); // Store uploaded filename
  const [feedbackData, setFeedbackData] = useState<FeedbackRecord[]>([]); // Store raw feedback data for AI analysis
  const [aiInsights, setAiInsights] = useState<any>(null); // Cache AI insights across tab switches
  const [aspectChartVariant, setAspectChartVariant] = useState<
    "diverging" | "grouped" | "bullet" | "radar"
  >("diverging"); // Aspect chart variant
  const [topAspect, setTopAspect] = useState<AspectHighlight | null>(null);
  const [lowestAspect, setLowestAspect] = useState<AspectHighlight | null>(null);
  // Toggle for the decorative animated space background. Default respects user's reduced-motion preference.
  const [enableSpaceBackground, setEnableSpaceBackground] = useState<boolean>(false); // off by default

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduce) setEnableSpaceBackground(false);
    } catch (e) {
      // ignore - default to enabled
    }
  }, []);

  // Apply dark mode 
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  // Handle successful upload results
  const handleUploadSuccess = (results: UploadResponse, filename?: string) => {
    logger.debug('UPLOAD RESULTS:', results);
    setAnalysisResults(results);
    setAnalysisError("");
    // analysisResults being set is used as the source of truth for "analysis complete"
    if (filename) setUploadedFilename(filename);
    
    // Extract raw feedback data for AI analysis
    if (results && results.data) {
      setFeedbackData(results.data as FeedbackRecord[]);
    }

  };

  // Reset to upload state (for "Upload another CSV" functionality)
  const handleResetToUpload = () => {
    setAnalysisResults(null);
    setAnalysisError("");
    setUploadedFilename("");
    setFeedbackData([]); // Clear feedback data
    setAiInsights(null); // Clear AI insights cache
    setActiveTab("analysis"); // Stay on analysis tab
  };

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // AI Insight Handlers - Delegated to centralized service
  const handleGenerateSessionInsights = (sessionMatrixData: any) => 
    generateSessionInsights(sessionMatrixData);

  const handleGenerateMarketingInsights = (channelImpactData: any) => 
    generateMarketingInsights(channelImpactData);

  const handleGenerateAspectInsights = () => 
    generateAspectInsights((analysisResults as any)?.ratings?.data);

  
  // Effect to calculate top and lowest aspects when analysis results are available
  useEffect(() => {
    if (analysisResults?.ratings?.data) {
      const highlights = calculateAspectHighlights(analysisResults.ratings.data)
      setTopAspect(highlights.top)
      setLowestAspect(highlights.lowest)
    }
  }, [analysisResults]);

  const tabs = useTabs({
    analysisResults,
    uploadedFilename,
    topAspect,
    lowestAspect,
    analysisError,
    feedbackData,
    aiInsights,
    aspectChartVariant,
    onUploadSuccess: handleUploadSuccess,
    onResetToUpload: handleResetToUpload,
    onInsightsGenerated: setAiInsights,
    onVariantChange: setAspectChartVariant,
    onGenerateAspectInsights: handleGenerateAspectInsights,
    onGenerateSessionInsights: handleGenerateSessionInsights,
    onGenerateMarketingInsights: handleGenerateMarketingInsights,
  })

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Decorative background: render only when enabled and in dark mode */}
      {enableSpaceBackground && darkMode && <SpaceBackground isDark={darkMode} />}

      <PageControls
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        enableSpaceBackground={enableSpaceBackground}
        toggleSpaceBackground={() => setEnableSpaceBackground(v => !v)}
      />

      <ScrollToTopButton />

      <div className="relative z-20 container mx-auto px-6 py-12 max-w-6xl">
        <Header darkMode={darkMode} />

        <main className="max-w-6xl mx-auto">
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={handleTabChange}
            className="mt-8"
          />
        </main>

        <footer className="mt-20 text-center">
          <p
            className={`text-sm opacity-60 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Built with love, passion & AI • Made in Cebu
          </p>
        </footer>
      </div>
    </div>
  );
}
