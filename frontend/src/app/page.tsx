"use client";
import Image from "next/image";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import Tabs, { Tab } from "../components/ui/TabNavigationBar";

// Tab Components
import AnalysisTab from "../components/tabs/AnalysisTab";
import TextInsightsTab from "../components/tabs/TextInsightsTab";
import AspectTab from "../components/tabs/AspectTab";
import SessionsTab from "../components/tabs/SessionsTab";
import AboutTab from "../components/tabs/AboutTab";
import SpaceBackground from "@/components/ui/SpaceBackground";

// Icons
import {
  Dashboard as DashboardIcon,
  TextFields as TextFieldsIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  Info as InfoIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";


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
  const [isAnalyzed, setIsAnalyzed] = useState(false); // Track if analysis is complete
  const [activeTab, setActiveTab] = useState("analysis"); // Track current tab
  const [uploadedFilename, setUploadedFilename] = useState<string>(""); // Store uploaded filename
  const [feedbackData, setFeedbackData] = useState<FeedbackRecord[]>([]); // Store raw feedback data for AI analysis
  const [aiInsights, setAiInsights] = useState<any>(null); // Cache AI insights across tab switches
  const [aspectChartVariant, setAspectChartVariant] = useState<
    "diverging" | "grouped" | "bullet" | "radar"
  >("diverging"); // Aspect chart variant
  const [topAspect, setTopAspect] = useState<AspectHighlight | null>(null);
  const [lowestAspect, setLowestAspect] = useState<AspectHighlight | null>(null);

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
    logger.debug('UPLOAD SUCCESS RESULTS:', results);
    setAnalysisResults(results);
    setAnalysisError("");
    setIsAnalyzed(true); // Trigger transition to analysis view
    if (filename) setUploadedFilename(filename);
    
    // Extract raw feedback data for AI analysis
    if (results && results.data) {
      setFeedbackData(results.data as FeedbackRecord[]);
    }

    // Stay on current tab after analysis - no auto-switching needed
  };

  // Reset to upload state (for "Upload another CSV" functionality)
  const handleResetToUpload = () => {
    setAnalysisResults(null);
    setAnalysisError("");
    setIsAnalyzed(false);
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

  // Create tab configuration using extracted tab components
  const createTabs = (): Tab[] => {
    const tabs: Tab[] = [];

    // Analysis Tab - Main dashboard (always shown)
    tabs.push({
      id: "analysis",
      label: "Analysis",
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
      content: (
        <AnalysisTab
          analysisResults={analysisResults}
          uploadedFilename={uploadedFilename}
          topAspect={topAspect}
          analysisError={analysisError}
          onUploadSuccess={handleUploadSuccess}
          onResetToUpload={handleResetToUpload}
        />
      ),
    });

    // Additional tabs only show after analysis is complete
    if (analysisResults) {
      // Text Insights Tab - AI-powered text analysis
      tabs.push({
        id: "text-insights",
        label: "Text Insights [AI]",
        icon: <TextFieldsIcon sx={{ fontSize: 20 }} />,
        content: (
          <TextInsightsTab
            feedbackData={feedbackData}
            analysisResults={analysisResults}
            aiInsights={aiInsights}
            onInsightsGenerated={setAiInsights}
          />
        ),
      });

      // Event Aspects Tab - Venue, speaker, content analysis
      tabs.push({
        id: "aspects",
        label: "Event Aspects",
        icon: <CategoryIcon sx={{ fontSize: 20 }} />,
        content: (
          <AspectTab
            analysisResults={analysisResults}
            aiInsights={aiInsights}
            aspectChartVariant={aspectChartVariant}
            onVariantChange={setAspectChartVariant}
            onGenerateAspectInsights={handleGenerateAspectInsights}
          />
        ),
      });

      // Session Analytics Tab - Session performance
      tabs.push({
        id: "sessions",
        label: "Session Analytics",
        icon: <EventIcon sx={{ fontSize: 20 }} />,
        content: (
          <SessionsTab
            analysisResults={analysisResults}
            onGenerateSessionInsights={handleGenerateSessionInsights}
            onGenerateMarketingInsights={handleGenerateMarketingInsights}
          />
        ),
      });
    }

    // About Tab - Always available
    tabs.push({
      id: "about",
      label: "About",
      icon: <InfoIcon sx={{ fontSize: 20 }} />,
      content: <AboutTab />,
    });

    return tabs;
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* <SpaceBackground isDark={darkMode} /> DO NOT REMOVE — COMMENTED OUT FOR PERFORMANCE*/} 


      <ScrollToTopButton />

      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="glass-card-dark p-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
        >
          {darkMode ? (
            <Brightness7Icon sx={{ fontSize: 24, color: "#FFB74D" }} />
          ) : (
            <Brightness4Icon sx={{ fontSize: 24, color: "#4A5568" }} />
          )}
        </button>
      </div>

      <div className="relative z-20 container mx-auto px-6 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } transition-colors duration-500`}
            >
              Event Insights
            </span>
            <br />
            <span
              className="bg-clip-text text-transparent font-extrabold"
              style={{
                background: "linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Generator
            </span>
          </h1>

          <div
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 backdrop-blur-md border transition-all duration-300 ${
              darkMode
                ? "bg-white/10 border-white/20"
                : "bg-white/60 border-white/40"
            }`}
          >
            <Image
              src="/assets/GDG-logo.png"
              alt="Google Developer Groups Logo"
              width={24}
              height={24}
            />
            <span
              className={`font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Powered by Google Developer Groups - USC
            </span>
          </div>

          <p
            className={`text-xl max-w-3xl mx-auto mb-8 leading-relaxed transition-colors duration-500 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Transform your event feedback into actionable insights with
            AI-powered analysis
            <br />
            <span
              className={`text-base opacity-80 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Statistical analysis • NPS scoring • Clean visualizations!
            </span>
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <Tabs
            tabs={createTabs()}
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
