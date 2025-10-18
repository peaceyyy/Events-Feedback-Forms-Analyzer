"use client";
import FileUpload from "../components/features/upload/FileUpload";
import Tabs, { Tab } from "../components/ui/Tabs";
import UploadPill from "../components/features/upload/UploadPill";
import Image from "next/image";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import AspectComparisonChart from "../components/features/analysis/charts/AspectComparisonChart";
import UnifiedWordCloud from "../components/features/analysis/charts/WordCloud/WordCloud";
import PacingAnalysisChart from "../components/features/analysis/charts/PacingAnalysisChart";
import EventAspects from "../components/features/analysis/EventAspects";
import PerAspectAveragesChart from "../components/features/analysis/charts/PerAspectAveragesChart";

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
} from "@mui/icons-material";

import {
  SiNextdotjs,
  SiFastapi,
  SiPython,
  SiTypescript,
  SiMui,
  SiVercel,
} from "react-icons/si";

import ChartFactory, {
  createChartConfig,
} from "../components/features/analysis/charts/ChartFactory";
import AIInsightsContainer from "../components/features/analysis/AIInsights";
import RecurringTopics from "../components/features/analysis/text/RecurringTopics";

/**
 * The `Home` component serves as the main landing page for the Event Insights Generator web application.
 * It provides users with an interface to upload event feedback CSV files, explains the workflow of the app,
 * and highlights key features such as data processing, NPS analysis, and insights generation.
 *
 * @returns {JSX.Element}
 */
import { useState, useEffect } from "react";

// Define a type for our aspect highlights for better type safety.
type AspectHighlight = {
  aspect: string;
  value: number;
} | null;

export default function Home() {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log("Home page component loaded.");
  }
  const [darkMode, setDarkMode] = useState(true); // Start with dark mode (GDG style)
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false); // Track if analysis is complete
  const [activeTab, setActiveTab] = useState("analysis"); // Track current tab
  const [uploadedFilename, setUploadedFilename] = useState<string>(""); // Store uploaded filename
  const [feedbackData, setFeedbackData] = useState<any[]>([]); // Store raw feedback data for AI analysis
  const [aiInsights, setAiInsights] = useState<any>(null); // Cache AI insights across tab switches
  const [aspectChartVariant, setAspectChartVariant] = useState<
    "diverging" | "grouped" | "bullet" | "radial"
  >("diverging"); // Aspect chart variant
  const [topAspect, setTopAspect] = useState<AspectHighlight>(null);
  const [lowestAspect, setLowestAspect] = useState<AspectHighlight>(null);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Effect to calculate top and lowest aspects when analysis results are available
  useEffect(() => {
    if (analysisResults && (analysisResults as any).ratings?.data) {
      const ratingsData = (analysisResults as any).ratings.data;
      let baselineData = null;

      // This logic mirrors the data handling in AspectComparisonChart
      if (ratingsData.baseline_data && Array.isArray(ratingsData.baseline_data)) {
        baselineData = ratingsData.baseline_data;
      } else if (ratingsData.detailed_comparison && Array.isArray(ratingsData.detailed_comparison)) {
        baselineData = ratingsData.detailed_comparison;
      } else if (ratingsData.aspects && ratingsData.averages && Array.isArray(ratingsData.aspects)) {
        baselineData = ratingsData.aspects.map((aspect: string, index: number) => ({
          aspect: aspect,
          value: ratingsData.averages[index] || 0,
        }));
      }

      if (baselineData && baselineData.length > 0) {
        // Sort by value descending to find the top and lowest aspects
        const sortedAspects = [...baselineData].sort((a: any, b: any) => (b.value || 0) - (a.value || 0));
        
        setTopAspect(sortedAspects[0]);
        setLowestAspect(sortedAspects[sortedAspects.length - 1]);
      }
    }
  }, [analysisResults]);

  // Handle successful upload results
  const handleUploadSuccess = (results: any, filename?: string) => {
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      console.log('UPLOAD SUCCESS RESULTS:', results);
    }
    setAnalysisResults(results);
    setAnalysisError("");
    setIsAnalyzed(true); // Trigger transition to analysis view
    if (filename) setUploadedFilename(filename);
    
    // Extract raw feedback data for AI analysis
    if (results && results.data) {
      setFeedbackData(results.data);
    }

    // Stay on current tab after analysis - no auto-switching needed
  };

  // Handle upload errors
  const handleUploadError = (error: string) => {
    setAnalysisError(error);
    setAnalysisResults(null);
    setIsAnalyzed(false); // Keep in upload view on error
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

  // Create placeholder content for future tabs
  const createPlaceholderContent = (
    title: string,
    description: string,
    features: string[]
  ) => (
    <div className="glass-card-dark p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h3
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
        <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-usc-green">
            Planned Features
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="text-usc-green mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card-dark p-6 rounded-xl border border-white/10">
          <h5 className="text-md font-semibold mb-3 text-usc-orange">
            Coming Soon
          </h5>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            This section will be populated with advanced analytics once we have
            sufficient data patterns and user feedback to create meaningful
            insights.
          </p>
        </div>
      </div>
    </div>
  );

  // Create tab configuration dynamically
  const createTabs = (): Tab[] => {
    const tabs: Tab[] = [];

    tabs.push({
      id: "analysis",
      label: "Analysis",
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

                  {/* Enhanced KPI Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
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

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
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

                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
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
                    <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-lg ${!topAspect ? 'opacity-50' : ''}`}>
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
                    <div className="w-full min-h-[450px]">
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
                            allowVariantToggle: true,
                          }
                        )}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {(analysisResults as any)?.scatter_data?.data && (
                    <div className="w-full min-h-[450px]">
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
                    title="One-Word Descriptions"
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
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Upload Card */}
              <div className="lg:col-span-1">
                <FileUpload
                  onUploadSuccess={(results, filename) =>
                    handleUploadSuccess(results, filename)
                  }
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
      ),
    });

    // Additional tabs only show after analysis is complete
    if (analysisResults) {
      // TEXT ANALYTICS TAB - For open-ended responses
      tabs.push({
        id: "text-insights",
        label: "Text Insights",
        icon: <TextFieldsIcon sx={{ fontSize: 20 }} />,
        content: (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                AI-Powered Text Analysis
              </h2>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Advanced sentiment analysis, theme extraction, and strategic insights powered by Google Gemini AI
              </p>
            </div>

            {/* Feedback Samples - Placeholder for sliding window */}
            <div className="glass-card-dark p-8 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Feedback Samples
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Interactive sliding window to browse actual feedback responses - to be implemented
              </p>
              <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-blue-300">
                  Coming Soon: Sliding window interface to explore individual feedback responses  
                </p>
              </div>
            </div>

            {/* Recurring Topics */}
            {aiInsights?.themes?.data?.recurring_topics && (
              <RecurringTopics 
                topics={aiInsights.themes.data.recurring_topics}
                error={aiInsights.themes.error}
              />
            )}

            {/* AI Insights Container - Complete AI Analysis Suite */}
            <AIInsightsContainer 
              feedbackData={feedbackData}
              analysisData={analysisResults}
              cachedInsights={aiInsights}
              onInsightsGenerated={setAiInsights}
            />

            
          </div>
        ),
      });

      // EVENT ASPECTS TAB - For venue, speakers, content analysis
      tabs.push({
        id: "aspects",
        label: "Event Aspects",
        icon: <CategoryIcon sx={{ fontSize: 20 }} />,
        content: (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Event Aspects Analysis
              </h2>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Detailed breakdown of venue, speakers, and content performance
              </p>
            </div>

            {/* First Row - Radar Chart & Aspect Performance Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart - Aspect Ratings Comparison */}
              {(analysisResults as any)?.ratings?.data && (
                <div className="w-full min-h-[450px]">
                  <ChartFactory
                    config={createChartConfig(
                      "rating-comparison",
                      "Aspect Ratings Comparison",
                      "relationship",

                      {
                        ...(analysisResults as any).ratings.data,
                        insights: undefined,
                      },
                      {
                        subtitle: "Venue • Speakers • Content performance",
                        chartVariant: "radar",
                        allowVariantToggle: true,
                      }
                    )}
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Placeholder for Aspect Performance Comparison */}
                 <div className="glass-card-dark p-6 rounded-2xl border border-white/10">
                <h4 className="text-base font-semibold mb-3 text-usc-orange">
                  Correlation Analysis
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Impact analysis: which aspects drive overall satisfaction most
                </p>
              </div>

              {/* Per Aspect Averages - Spanning full width */}
              {/* Per Aspect Averages Chart - Now implemented */}
              <div className="lg:col-span-2">
                {(analysisResults as any)?.ratings?.data && (
                  <PerAspectAveragesChart
                    data={(analysisResults as any).ratings.data}
                  />
                )}
              </div>
            </div>

            {/* Second Row - Unified Aspect Performance Card */}
            <div className="glass-card-dark rounded-2xl p-6">
              {/* Flexible internal layout - chart takes available space, insights get optimal width */}
              <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                
                {/* Left Side - Chart Area (flexible, takes remaining space) */}
                <div className="flex-1 min-w-0 min-h-[500px]">
                  {(analysisResults as any)?.ratings?.data && (
                    <AspectComparisonChart
                      data={(analysisResults as any).ratings.data}
                      variant={aspectChartVariant}
                      onVariantChange={setAspectChartVariant}
                      className="h-full"
                    />
                  )}
                </div>

                {/* Right Side - AI Insights (optimal fixed width, not squished) */}
                <div className="w-full lg:w-[450px] flex-shrink-0">
                  {(analysisResults as any)?.ratings?.data && (
                    <EventAspects 
                      data={(analysisResults as any).ratings.data} 
                      themeData={aiInsights?.themes?.data}
                      className="h-full"
                    />
                  )}
                </div>
                
              </div>
            </div>
          
            
          </div>
        ),
      });

      // SESSION ANALYTICS TAB - For technical session details
      tabs.push({
        id: "sessions",
        label: "Session Analytics",
        icon: <EventIcon sx={{ fontSize: 20 }} />,
        content: (
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

            {/* Future Session Analytics - Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">
                  Session Performance Matrix
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Bubble chart showing attendance vs satisfaction to identify
                  Stars, Hidden Gems, and Underperformers
                </p>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Coming Soon: Bubble Chart Implementation
                </div>
              </div>

              <div className="glass-card-dark p-8 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-usc-green">
                  Discovery Channel Impact
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Event discovery channel effectiveness and satisfaction
                  correlation
                </p>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  To be implemented based on discovery channel data
                </div>
              </div>
            </div>

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
        ),
      });
    }

    // ABOUT TAB
    tabs.push({
      id: "about",
      label: "About",
      icon: <InfoIcon sx={{ fontSize: 20 }} />,
      content: (
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-1 space-y-8">
              {/* Main Branding Card (sticky) */}
              <div className="glass-card-dark p-6 rounded-2xl sticky top-8">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-usc-green), var(--color-google-blue))",
                    }}
                  >
                    <InsightsIcon sx={{ fontSize: 32, color: "white" }} />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Insight Forge
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Event Feedback Analyzer
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  An intelligent tool designed to transform raw event feedback
                  into clear, actionable insights for data-driven decision
                  making.
                </p>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Developed by Google Developer Groups USC
                </div>
              </div>

              {/* --- NEW Tech Stack Card (sticky) --- */}
              <div className="glass-card-dark p-6 rounded-2xl sticky top-56">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Technology Stack
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiNextdotjs size={18} className="text-white" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Next.js
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiFastapi size={18} className="text-green-400" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      FastAPI
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiPython size={18} className="text-yellow-400" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Python
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <AssessmentIcon
                      sx={{ fontSize: 18, color: "var(--color-chart-primary)" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Recharts
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiTypescript size={18} className="text-blue-500" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      TypeScript
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiMui size={18} className="text-blue-600" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Material-UI
                    </span>
                  </div>
                  {/* Tech Item */}
                  <div className="flex items-center gap-2">
                    <SiVercel size={18} className="text-white" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Vercel
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN (Unchanged) --- */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mission/Purpose Section */}
              <div className="glass-card-dark p-6 rounded-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Provident, adipisci. Culpa impedit placeat quos vitae ea minima
                quod iure autem ipsam nemo, earum nesciunt, beatae debitis
                incidunt perspiciatis rem saepe!
              </div>
              {/* Core Features Section */}
              <div className="glass-card-dark p-6 rounded-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                tempora id atque distinctio eligendi minima a, nemo aperiam eos
                vitae fuga nisi quisquam facilis, sequi, consequuntur libero.
                Optio, omnis eum!{" "}
              </div>
            </div>
          </div>
        </div>
      ),
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
          {/* Google-style brand badge */}
          

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