"use client";

/**
 * DashboardContainer - Client Component with all interactive logic
 */

import { useState, useEffect } from "react";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import Tabs from "../ui/TabNavigationBar";
import useTabs from '@/lib/useTabs'
import SpaceBackground from "../ui/SpaceBackground";
import PageControls from '../ui/PageControls'
import type { UploadResponse, FeedbackRecord } from '@/types/upload'
import logger from '@/lib/logger'
import { calculateAspectHighlights, type AspectHighlight } from '@/lib/dataHelpers'
import { 
  generateSessionInsights, 
  generateMarketingInsights, 
  generateAspectInsights 
} from '@/lib/aiService'

export default function DashboardContainer() {
  logger.debug("Dashboard container loaded (client-side).");
  
  // Theme & UI state
  const [darkMode, setDarkMode] = useState(true); // Start with dark mode (GDG style)
  const [enableSpaceBackground, setEnableSpaceBackground] = useState<boolean>(false); // off by default
  
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<UploadResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [uploadedFilename, setUploadedFilename] = useState<string>("");
  const [feedbackData, setFeedbackData] = useState<FeedbackRecord[]>([]);
  
  // AI & visualization state
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aspectChartVariant, setAspectChartVariant] = useState<
    "diverging" | "grouped" | "bullet" | "radar"
  >("diverging");
  const [topAspect, setTopAspect] = useState<AspectHighlight | null>(null);
  const [lowestAspect, setLowestAspect] = useState<AspectHighlight | null>(null);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState("analysis");

  // Respect user's reduced-motion preference for background animation
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduce) setEnableSpaceBackground(false);
    } catch (e) {
      // ignore - default to disabled
    }
  }, []);

  // Apply dark mode to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  // Calculate aspect highlights when analysis results change
  useEffect(() => {
    if (analysisResults?.ratings?.data) {
      const highlights = calculateAspectHighlights(analysisResults.ratings.data)
      setTopAspect(highlights.top)
      setLowestAspect(highlights.lowest)
    }
  }, [analysisResults]);

  // Event handlers
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleUploadSuccess = (results: UploadResponse, filename?: string) => {
    logger.debug('UPLOAD RESULTS:', results);
    setAnalysisResults(results);
    setAnalysisError("");
    if (filename) setUploadedFilename(filename);
    
    // Extract raw feedback data for AI analysis
    if (results && results.data) {
      setFeedbackData(results.data as FeedbackRecord[]);
    }
  };

  const handleResetToUpload = () => {
    setAnalysisResults(null);
    setAnalysisError("");
    setUploadedFilename("");
    setFeedbackData([]);
    setAiInsights(null);
    setActiveTab("analysis");
  };

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

  // Generate tab configuration using custom hook
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
    <>
      {/* Decorative background: render only when enabled and in dark mode */}
      {enableSpaceBackground && darkMode && <SpaceBackground isDark={darkMode} />}

      {/* Theme & background controls */}
      <PageControls
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        enableSpaceBackground={enableSpaceBackground}
        toggleSpaceBackground={() => setEnableSpaceBackground(v => !v)}
      />

      {/* Scroll to top button */}
      <ScrollToTopButton />

      {/* Main content area */}
      <div className="relative z-20 container mx-auto px-6 py-12 max-w-6xl">
        <main className="max-w-6xl mx-auto">
          <Tabs
            tabs={tabs}
            defaultTab={activeTab}
            onTabChange={handleTabChange}
            className="mt-8"
          />
        </main>
      </div>
    </>
  );
}
