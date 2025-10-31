// components/EventAspectsInsights.tsx - AI-powered event insights with swipeable card interface
// Updated: Swipeable tabs with Key Insights, Improvement Recommendations, Quick Wins & Strategic Priorities
"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  StarBorder as StarIcon,
  Build as BuildIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";

interface Theme {
  theme: string;
  frequency: number;
}

interface ThemeData {
  positive_themes: Theme[];
  improvement_themes: Theme[];
  recurring_topics: string[];
  priority_actions: string[];
  theme_categories: Record<string, Theme[]>;
}

interface AIInsights {
  key_insights?: string[]
  improvement_recommendations?: string[]
  quick_wins?: string[]
  strategic_priorities?: string[]
  error?: string
}

interface EventAspectsInsightsProps {
  data: any;
  themeData?: ThemeData;
  aiInsights?: AIInsights;
  onGenerateAIInsights?: () => Promise<AIInsights>;
  title?: string;
  className?: string; 
}

export default function EventAspectsInsights({
  data,
  themeData,
  aiInsights: initialAIInsights,
  onGenerateAIInsights,
  title = "Event Performance Insights",
  className = "",
}: EventAspectsInsightsProps) {
  // Simple state for swipeable card navigation
  const [currentView, setCurrentView] = React.useState<
    "summary" | "details" | "recommendations"
  >("summary");
  
  const [aiInsights, setAiInsights] = React.useState<AIInsights | null>(initialAIInsights || null);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  const handleGenerateAIInsights = async () => {
    if (!onGenerateAIInsights) return;

    setIsLoadingAI(true);
    try {
      const insights = await onGenerateAIInsights();
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      setAiInsights({ error: 'Failed to generate insights' });
    } finally {
      setIsLoadingAI(false);
    }
  };

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
      title: "AI Theme Summary",
      content: (
        <div className="space-y-4">
          {/* Dynamic Statistics from Theme Data */}
          {themeData ? (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-green-500/10 rounded-lg">
                <div className="text-lg font-bold text-green-400">
                  {themeData.positive_themes?.length || 0}
                </div>
                <div className="text-xs text-green-300">Strengths</div>
              </div>
              <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                <div className="text-lg font-bold text-orange-400">
                  {themeData.improvement_themes?.length || 0}
                </div>
                <div className="text-xs text-orange-300">To Improve</div>
              </div>
              <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                <div className="text-lg font-bold text-purple-400">
                  {themeData.recurring_topics?.length || 0}
                </div>
                <div className="text-xs text-purple-300">Key Topics</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-500/10 rounded-lg">
                <div className="text-lg font-bold text-gray-400">-</div>
                <div className="text-xs text-gray-400">Strengths</div>
              </div>
              <div className="text-center p-2 bg-gray-500/10 rounded-lg">
                <div className="text-lg font-bold text-gray-400">-</div>
                <div className="text-xs text-gray-400">To Improve</div>
              </div>
              <div className="text-center p-2 bg-gray-500/10 rounded-lg">
                <div className="text-lg font-bold text-gray-400">-</div>
                <div className="text-xs text-gray-400">Key Topics</div>
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm">
            {themeData ? (
              <>
                {/* Top Strength */}
                {themeData.positive_themes?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <StarIcon
                      sx={{
                        fontSize: 16,
                        color: "var(--color-chart-green)",
                        mt: "1px",
                      }}
                    />
                    <p>
                      <span className="font-semibold text-green-400">Top Strength:</span>{" "}
                      {themeData.positive_themes[0].theme} ({themeData.positive_themes[0].frequency} mentions)
                    </p>
                  </div>
                )}
                
                {/* Priority Improvement */}
                {themeData.improvement_themes?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <BuildIcon
                      sx={{
                        fontSize: 16,
                        color: "var(--color-chart-red)",
                        mt: "2px",
                      }}
                    />
                    <p>
                      <span className="font-semibold text-orange-400">Priority:</span>{" "}
                      {themeData.improvement_themes[0].theme} ({themeData.improvement_themes[0].frequency} mentions)
                    </p>
                  </div>
                )}

                {/* Key Topic */}
                {themeData.recurring_topics?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CheckCircleOutlineIcon
                      sx={{
                        fontSize: 16,
                        color: "var(--color-chart-purple)",
                        mt: "2px",
                      }}
                    />
                    <p>
                      <span className="font-semibold text-purple-400">Key Topic:</span>{" "}
                      {themeData.recurring_topics[0]}
                    </p>
                  </div>
                )}

                {/* Key Insights Section - AI Generated */}
                {aiInsights?.key_insights && aiInsights.key_insights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-semibold mb-2 text-purple-400 flex items-center gap-1">
                      <StarIcon sx={{ fontSize: 14 }} />
                      Key Insights
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      {aiInsights.key_insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {onGenerateAIInsights ? 'Click "Generate AI Insights" to see analysis' : 'Generate AI analysis to see theme insights'}
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    details: {
      title: "Theme Breakdown",
      content: (
        <div className="space-y-3 text-sm">
          {themeData ? (
            <>
              {/* Top 3 Positive Themes */}
              {themeData.positive_themes?.slice(0, 3).map((theme, index) => (
                <div key={`positive-${index}`} className="p-3 bg-green-500/10 rounded-lg border-l-4 border-green-400">
                  <div className="font-medium text-green-300">
                    {theme.theme}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {theme.frequency} mentions in positive feedback
                  </div>
                </div>
              ))}

              {/* Top 2 Improvement Themes */}
              {themeData.improvement_themes?.slice(0, 2).map((theme, index) => (
                <div key={`improvement-${index}`} className="p-3 bg-orange-500/10 rounded-lg border-l-4 border-orange-400">
                  <div className="font-medium text-orange-300">
                    {theme.theme}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {theme.frequency} mentions in improvement feedback
                  </div>
                </div>
              ))}

              {/* Improvement Recommendations Section - AI Generated */}
              {aiInsights?.improvement_recommendations && aiInsights.improvement_recommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-semibold mb-2 text-blue-400 flex items-center gap-1">
                    <TrendingUpIcon sx={{ fontSize: 14 }} />
                    Improvement Recommendations
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {aiInsights.improvement_recommendations.map((rec, index) => (
                      <li key={index} className="p-2 bg-blue-500/10 rounded border-l-2 border-blue-400">
                        <span className="text-blue-300">→</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {onGenerateAIInsights ? 'Generate AI insights to see detailed recommendations' : 'No theme data available. Generate AI analysis first.'}
              </p>
            </div>
          )}
        </div>
      ),
    },
    recommendations: {
      title: "Priority Actions",
      content: (
        <div className="space-y-3 text-sm">
          {/* Quick Wins Section - AI Generated */}
          {aiInsights?.quick_wins && aiInsights.quick_wins.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold mb-2 text-yellow-400 flex items-center gap-1">
                <LightbulbIcon sx={{ fontSize: 14 }} />
                Quick Wins
              </h4>
              <ul className="space-y-1.5 text-xs">
                {aiInsights.quick_wins.map((win, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 bg-yellow-500/10 rounded">
                    <span className="text-yellow-400">✓</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategic Priorities Section - AI Generated */}
          {aiInsights?.strategic_priorities && aiInsights.strategic_priorities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold mb-2 text-orange-400 flex items-center gap-1">
                <FlagIcon sx={{ fontSize: 14 }} />
                Strategic Priorities
              </h4>
              <ul className="space-y-1.5 text-xs">
                {aiInsights.strategic_priorities.map((priority, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 bg-orange-500/10 rounded">
                    <span className="text-orange-400">⚡</span>
                    <span>{priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fallback for legacy themeData priority_actions */}
          {themeData?.priority_actions && themeData.priority_actions.length > 0 && !aiInsights?.quick_wins && (
            <>
              {/* Priority Actions */}
              {themeData.priority_actions.map((action, index) => (
                <div key={index} className="p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-bold text-blue-400 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium text-blue-300 mb-1">
                        Priority Action {index + 1}
                      </div>
                      <div style={{ color: "var(--color-text-secondary)" }}>
                        {action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Empty state */}
          {!aiInsights?.quick_wins && !aiInsights?.strategic_priorities && !themeData?.priority_actions && (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {onGenerateAIInsights ? 'Click "Generate AI Insights" to see priority actions' : 'No priority actions available. Generate AI analysis to see recommended actions.'}
              </p>
            </div>
          )}
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

      {/* Generate AI Insights Button */}
      {onGenerateAIInsights && (
        <div className="mt-3 flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <AutoAwesomeIcon sx={{ fontSize: 16 }} className="text-purple-400" />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {aiInsights ? 'AI Insights Active' : 'AI Aspect Analysis'}
            </span>
          </div>
          <button
            onClick={handleGenerateAIInsights}
            disabled={isLoadingAI}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoadingAI
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30'
            }`}
          >
            <AutoAwesomeIcon sx={{ fontSize: 12 }} />
            {isLoadingAI ? 'Generating...' : aiInsights ? 'Refresh' : 'Generate'}
          </button>
        </div>
      )}

      {/* AI Analysis Status Note - Legacy themeData */}
      {!onGenerateAIInsights && currentView === "summary" && (
        <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-400/30">
          <div className="text-xs text-purple-300 font-medium">
            {themeData ? "AI Analysis Active" : "AI Analysis Available"}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {themeData ? "Powered by Gemini AI" : "Generate AI insights to activate"}
          </div>
        </div>
      )}
    </div>
  );
}