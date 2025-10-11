// components/InsightsSummary.tsx - Simplified placeholder for future Gemini API integration
"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  StarBorder as StarIcon,
  Build as BuildIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";

interface InsightsSummaryProps {
  data: any;
  title?: string;
  className?: string;
}

export default function InsightsSummary({
  data,
  title = "Event Performance Insights",
  className = "",
}: InsightsSummaryProps) {
  // Simple state for swipeable card navigation
  const [currentView, setCurrentView] = React.useState<
    "summary" | "details" | "recommendations"
  >("summary");

  if (!data) {
    return (
      <div
        className={`glass-card-dark p-6 rounded-2xl border border-white/10 ${className}`}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Upload feedback data to see AI-generated insights.
        </p>
      </div>
    );
  }

  const views = {
    summary: {
      title: "AI Insights Summary",
      content: (
        <div className="space-y-4">
          {/* Summary Statistics - Static for now, will be dynamic with Gemini */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-green-500/10 rounded-lg">
              <div className="text-lg font-bold text-green-400">2</div>
              <div className="text-xs text-green-300">Strengths</div>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded-lg">
              <div className="text-lg font-bold text-red-400">1</div>
              <div className="text-xs text-red-300">To Improve</div>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
              <div className="text-lg font-bold text-yellow-400">2</div>
              <div className="text-xs text-yellow-300">Adequate</div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* THE FIX: Replaced emojis with Material-UI icons for a cleaner, more professional look. */}
            <div className="flex items-start gap-2">
              <StarIcon
                sx={{
                  fontSize: 18,
                  color: "var(--color-chart-green)",
                  mt: "1px",
                }}
              />
              <p>
                <span className="font-semibold text-green-400">Strengths:</span>{" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                eligendi quisquam quae iste maiores quasi soluta voluptatum
                atque expedita voluptas dolores obcaecati, voluptatibus quia
                incidunt qui. Mollitia, eveniet repellendus? Eveniet.{" "}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <BuildIcon
                sx={{
                  fontSize: 16,
                  color: "var(--color-chart-red)",
                  mt: "2px",
                }}
              />
              <p>
                <span className="font-semibold text-red-400">Priority:</span>{" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus sed, illo facilis enim odit impedit tempore, tenetur
                placeat ea sint iure asperiores perspiciatis magni consequatur
                deserunt. Unde possimus dolores laudantium?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: 16,
                  color: "var(--color-chart-yellow)",
                  mt: "2px",
                }}
              />
              <p>
                <span className="font-semibold text-yellow-400">Adequate:</span>{" "}
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga quam dicta, blanditiis molestias debitis eaque aliquid, recusandae repellendus impedit excepturi pariatur fugiat possimus harum mollitia nostrum! Facere eos tenetur iure.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    details: {
      title: "Detailed Analysis",
      content: (
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-green-500/10 rounded-lg border-l-4 border-green-400">
            <div className="font-medium text-green-300">
              Speaker Performance
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              4.2/5 - Excellent engagement and expertise
            </div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg border-l-4 border-green-400">
            <div className="font-medium text-green-300">Content Quality</div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              4.1/5 - Highly relevant and well-structured
            </div>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg border-l-4 border-red-400">
            <div className="font-medium text-red-300">Venue Experience</div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              3.2/5 - Accessibility and comfort issues reported
            </div>
          </div>
        </div>
      ),
    },
    recommendations: {
      title: "AI Recommendations",
      content: (
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <div className="font-medium text-blue-300 mb-1">
              Leverage Strengths
            </div>
            <div style={{ color: "var(--color-text-secondary)" }}>
              Highlight speaker quality in future marketing
            </div>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <div className="font-medium text-orange-300 mb-1">
              Address Venue Issues
            </div>
            <div style={{ color: "var(--color-text-secondary)" }}>
              Consider accessibility audit and comfort improvements
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <div className="font-medium text-purple-300 mb-1">
              Future Enhancements
            </div>
            <div style={{ color: "var(--color-text-secondary)" }}>
              Build on content strength with advanced tracks
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <div
      className={`glass-card-dark p-6 rounded-2xl border border-white/10 h-full flex flex-col ${className}`}
    >
      {/* Card Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {views[currentView].title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentView((prev) =>
                prev === "summary"
                  ? "recommendations"
                  : prev === "details"
                  ? "summary"
                  : "details"
              )
            }
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft
              sx={{ fontSize: 20, color: "var(--color-text-secondary)" }}
            />
          </button>
          <div className="flex gap-1">
            {(Object.keys(views) as Array<keyof typeof views>).map((view) => (
              <div
                key={view}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentView === view ? "bg-blue-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentView((prev) =>
                prev === "summary"
                  ? "details"
                  : prev === "details"
                  ? "recommendations"
                  : "summary"
              )
            }
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight
              sx={{ fontSize: 20, color: "var(--color-text-secondary)" }}
            />
          </button>
        </div>
      </div>

      {/* Card Content - Optimized for compact display */}
      <div className="flex-1 overflow-y-auto max-h-[350px]">{views[currentView].content}</div>

      {/* Future Gemini Integration Note - More compact */}
      {currentView === "summary" && (
        <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-400/30">
          <div className="text-xs text-purple-300 font-medium">
            Enhanced AI Analysis Coming Soon
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Powered by Gemini API
          </div>
        </div>
      )}
    </div>
  );
}
