// frontend/src/types/api.ts

// Upload Response
export interface UploadResponse {
  success: boolean;
  summary: {
    total_responses: number;
    average_satisfaction: number;
    average_recommendation: number;
    response_distribution: Record<string, Record<string, number>>;
    most_attended_sessions: Array<{
      session: string;
      count: number;
    }>;
  };
  message?: string;
  error?: string;
}

// Analysis Response (comprehensive dashboard data)
export interface AnalysisResponse {
  success: boolean;
  summary: {
    total_responses: number;
    analysis_timestamp: string;
  };
  satisfaction: SatisfactionData;
  nps: NPSData;
  sessions: SessionsData;
  ratings: RatingsData;
  feedback: FeedbackData;
  one_word_descriptions: OneWordData;
  pacing: PacingData;
  correlation: CorrelationData;
  session_matrix: SessionMatrixData;
  discovery_channels: DiscoveryChannelsData;
  scatter_data: ScatterData;
  error?: string;
}

// Sub-types (add as needed based on actual backend responses)
export interface SatisfactionData {
  chart_type: string;
  data: {
    categories: number[];
    values: number[];
    pie_data: Array<{ name: string; value: number }>;
    stats: {
      average: number;
      median: number;
      mode: number;
      total_responses: number;
    };
  };
  recommendations?: string[];
}

// ... (add other sub-types for NPS, Sessions, etc.)

// AI Insights Types
export interface SessionAIInsights {
  key_insights?: string[];
  strategic_recommendations?: string[];
  growth_opportunities?: string[];
  risk_areas?: string[];
  error?: string;
}

export interface MarketingAIInsights {
  key_insights?: string[];
  marketing_recommendations?: string[];
  growth_opportunities?: string[];
  budget_allocation?: string[];
  error?: string;
}

export interface AspectAIInsights {
  key_insights?: string[];
  improvement_recommendations?: string[];
  quick_wins?: string[];
  strategic_priorities?: string[];
  error?: string;
}
