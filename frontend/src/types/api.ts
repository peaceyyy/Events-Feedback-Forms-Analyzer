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

export interface NPSData {
  chart_type: string;
  data: {
    nps_score: number;
    promoters: number;
    passives: number;
    detractors: number;
    promoters_percentage: number;
    passives_percentage: number;
    detractors_percentage: number;
    distribution?: Record<string, number>;
  };
  insights?: string[];
}

export interface SessionsData {
  chart_type: string;
  data: {
    sessions: string[];
    counts: number[];
    percentages: number[];
    total_sessions: number;
  };
  insights?: string[];
}

export interface RatingsData {
  chart_type: string;
  data: {
    aspects: string[];
    averages: number[];
    comparison: {
      venue: { average: number; distribution: Record<string, number> };
      speaker: { average: number; distribution: Record<string, number> };
      content: { average: number; distribution: Record<string, number> };
    };
  };
  insights?: string[];
}

export interface FeedbackData {
  chart_type: string;
  data: {
    common_words: Array<{ word: string; count: number }>;
    total_feedback_entries: number;
    sentiment?: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  insights?: string[];
}

export interface OneWordData {
  chart_type: string;
  data: {
    words: Array<{ word: string; count: number }>;
    total_responses: number;
  };
  insights?: string[];
}

export interface PacingData {
  chart_type: string;
  data: {
    categories: string[];
    counts: number[];
    percentages: Record<string, number>;
    most_common?: string;
  };
  insights?: string[];
}

export interface CorrelationData {
  chart_type: string;
  data: {
    correlations: {
      satisfaction_recommendation?: number;
      satisfaction_venue?: number;
      satisfaction_speaker?: number;
      satisfaction_content?: number;
      venue_speaker?: number;
      venue_content?: number;
      speaker_content?: number;
    };
    strongest_correlation?: {
      pair: string;
      value: number;
    };
    weakest_correlation?: {
      pair: string;
      value: number;
    };
  };
  insights?: string[];
}

export interface SessionMatrixData {
  chart_type: string;
  data: {
    sessions: Array<{
      session: string;
      attendance: number;
      avg_satisfaction?: number;
      avg_recommendation?: number;
      avg_venue?: number;
      avg_speaker?: number;
      avg_content?: number;
    }>;
  };
  insights?: string[];
}

export interface DiscoveryChannelsData {
  chart_type: string;
  data: {
    channels: Array<{
      channel: string;
      count: number;
      percentage: number;
      avg_satisfaction?: number;
      avg_recommendation?: number;
    }>;
    total_responses: number;
  };
  insights?: string[];
}

export interface ScatterData {
  chart_type: string;
  data: {
    points: Array<{
      x: number;
      y: number;
      label?: string;
    }>;
    x_axis: string;
    y_axis: string;
  };
  insights?: string[];
}


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
