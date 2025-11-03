"use client";
import { useMemo } from "react";
import type { Tab } from "../components/ui/TabNavigationBar";

// Tab Components
import AnalysisTab from "../components/tabs/AnalysisTab";
import TextInsightsTab from "../components/tabs/TextInsightsTab";
import AspectTab from "../components/tabs/AspectTab";
import SessionsTab from "../components/tabs/SessionsTab";
import AboutTab from "../components/tabs/AboutTab";

// Icons
import {
  Dashboard as DashboardIcon,
  TextFields as TextFieldsIcon,
  Category as CategoryIcon,
  Event as EventIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

type UseTabsParams = {
  analysisResults: any | null;
  uploadedFilename: string;
  topAspect: any | null;
  lowestAspect: any | null;
  analysisError: string;
  feedbackData: any[];
  aiInsights: any;
  aiTextInsights: any;
  aspectChartVariant: "diverging" | "grouped" | "bullet" | "radar";
  // handlers
  onUploadSuccess: (results: any, filename?: string) => void;
  onResetToUpload: () => void;
  onInsightsGenerated: (v: any) => void;
  onTextInsightsGenerated: (v: any) => void;
  onVariantChange: (v: any) => void;
  onGenerateAspectInsights: () => Promise<any> | any;
  onGenerateSessionInsights: (d: any) => Promise<any> | any;
  onGenerateMarketingInsights: (d: any) => Promise<any> | any;
  // lifted AI aspect state
  aiAspectLoading: boolean;
  aiAspectResult: any;
  aiAspectError: string;
};

export default function useTabs({
  analysisResults,
  uploadedFilename,
  topAspect,
  lowestAspect,
  analysisError,
  feedbackData,
  aiInsights,
  aiTextInsights,
  aspectChartVariant,
  onUploadSuccess,
  onResetToUpload,
  onInsightsGenerated,
  onTextInsightsGenerated,
  onVariantChange,
  onGenerateAspectInsights,
  onGenerateSessionInsights,
  onGenerateMarketingInsights,
  aiAspectLoading,
  aiAspectResult,
  aiAspectError,
}: UseTabsParams): Tab[] {
  const tabs = useMemo(() => {
    const t: Tab[] = [];

    t.push({
      id: "analysis",
      label: "Analysis",
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
      content: (
        <AnalysisTab
          analysisResults={analysisResults}
          uploadedFilename={uploadedFilename}
          topAspect={topAspect}
          lowestAspect={lowestAspect}
          analysisError={analysisError}
          onUploadSuccess={onUploadSuccess}
          onResetToUpload={onResetToUpload}
        />
      ),
    });

    if (analysisResults) {
      t.push({
        id: "text-insights",
        label: "Text Insights",
        icon: <TextFieldsIcon sx={{ fontSize: 20 }} />,
        content: (
          <TextInsightsTab
            feedbackData={feedbackData}
            analysisResults={analysisResults}
            aiInsights={aiTextInsights}
            onInsightsGenerated={onTextInsightsGenerated}
          />
        ),
      });

      t.push({
        id: "aspects",
        label: "Event Aspects",
        icon: <CategoryIcon sx={{ fontSize: 20 }} />,
        content: (
          <AspectTab
            analysisResults={analysisResults}
            aiInsights={aiInsights}
            aspectChartVariant={aspectChartVariant}
            onVariantChange={onVariantChange}
            onGenerateAspectInsights={onGenerateAspectInsights}
            aiAspectLoading={aiAspectLoading}
            aiAspectResult={aiAspectResult}
            aiAspectError={aiAspectError}
          />
        ),
      });

      t.push({
        id: "sessions",
        label: "Session Analytics",
        icon: <EventIcon sx={{ fontSize: 20 }} />,
        content: (
          <SessionsTab
            analysisResults={analysisResults}
            onGenerateSessionInsights={onGenerateSessionInsights}
            onGenerateMarketingInsights={onGenerateMarketingInsights}
          />
        ),
      });
    }

    t.push({
      id: "about",
      label: "About",
      icon: <InfoIcon sx={{ fontSize: 20 }} />,
      content: <AboutTab />,
    });

    return t;
  }, [
    analysisResults,
    uploadedFilename,
    topAspect,
    lowestAspect,
    analysisError,
    feedbackData,
    aiInsights,
    aiTextInsights,
    aspectChartVariant,
    onUploadSuccess,
    onResetToUpload,
    onInsightsGenerated,
    onTextInsightsGenerated,
    onVariantChange,
    onGenerateAspectInsights,
    onGenerateSessionInsights,
    onGenerateMarketingInsights,
    aiAspectLoading,
    aiAspectResult,
    aiAspectError,
  ]);

  return tabs;
}
