/**
 * Type definitions for file upload and analysis responses.
 * These interfaces match the backend JSON contracts from Flask API.
 * 
 * @module types/upload
 */

// ============================================================================
// Upload Request/Response Types
// ============================================================================

/**
 * File upload request payload (used in FormData)
 */
export interface UploadRequest {
  file: File;
}

/**
 * Main response from /api/upload endpoint.
 * Includes both summary stats and comprehensive analysis data.
 */
export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: FeedbackRecord[];
  summary?: UploadSummary;
  timestamp?: string;
  
  // Comprehensive analysis sections (spread at root level)
  satisfaction?: AnalysisSection<SatisfactionData>;
  nps?: AnalysisSection<NPSData>;
  sessions?: AnalysisSection<SessionsData>;
  ratings?: AnalysisSection<RatingsData>;
  correlation?: AnalysisSection<CorrelationData>;
  pacing?: AnalysisSection<PacingData>;
  text_insights?: AnalysisSection<TextInsightsData>;
  discovery?: AnalysisSection<DiscoveryData>;
  
  // Error fields (when success: false)
  error?: string;
}

/**
 * Basic summary statistics returned immediately after upload
 */
export interface UploadSummary {
  total_responses: number;
  average_satisfaction: number;
  average_recommendation: number;
  response_distribution: {
    satisfaction: Record<string, number>;
    recommendation?: Record<string, number>;
  };
  most_attended_sessions?: SessionSummary[];
  date_range?: {
    start: string;
    end: string;
  };
}

/**
 * Individual session attendance summary
 */
export interface SessionSummary {
  session: string;
  count: number;
  percentage?: number;
}

/**
 * Individual feedback record from CSV
 */
export interface FeedbackRecord {
  satisfaction: number;
  recommendation_score: number;
  sessions_attended: string[];
  venue_rating?: number;
  speaker_rating?: number;
  content_rating?: number;
  pacing?: string;
  event_discovery?: string;
  feedback_text?: string;
  timestamp?: string;
  // Text feedback fields (backend renames these)
  improvement_feedback?: string;  // "What could be improved?"
  additional_comments?: string;   // "Any additional comments?"
  positive_feedback?: string;     // "What did you like most about the event?"
  one_word_desc?: string;         // "One-Word Description"
  preferred_time?: string;        // "Preferred Time Slot"
  preferred_venue?: string;       // "Preferred Venue"
}


/**
 * Generic wrapper for all analysis sections.
 * Each analysis type (satisfaction, NPS, etc.) follows this structure.
 */
export interface AnalysisSection<T> {
  data: T;
  insights?: string[];
  recommendations?: string[];
}

/**
 * Satisfaction analysis data structure
 */
export interface SatisfactionData {
  distribution: Record<string, number>;
  statistics: {
    mean: number;
    median: number;
    mode: number;
    std_dev: number;
    total_responses: number;
  };
  satisfaction_rate?: number;
  categories?: {
    very_satisfied: number;
    satisfied: number;
    neutral: number;
    dissatisfied: number;
    very_dissatisfied: number;
  };
}

/**
 * Net Promoter Score (NPS) analysis
 */
export interface NPSData {
  nps_score: number;
  promoters: number;
  passives: number;
  detractors: number;
  promoters_percentage: number;
  passives_percentage: number;
  detractors_percentage: number;
  total_responses: number;
  distribution?: Record<string, number>;
}

/**
 * Session popularity and performance analysis
 */
export interface SessionsData {
  popularity: SessionPopularity[];
  performance_matrix?: SessionPerformanceMatrix[];
  total_sessions: number;
  average_attendance: number;
}

export interface SessionPopularity {
  session: string;
  count: number;
  percentage: number;
}

export interface SessionPerformanceMatrix {
  session: string;
  attendance: number;
  avg_satisfaction?: number;
  avg_recommendation?: number;
  avg_venue_rating?: number;
  avg_speaker_rating?: number;
  avg_content_rating?: number;
}

/**
 * Comparative ratings analysis (venue, speaker, content)
 */
export interface RatingsData {
  comparison: {
    venue: RatingStats;
    speaker: RatingStats;
    content: RatingStats;
  };
  overall_average?: number;
}

export interface RatingStats {
  average: number;
  distribution: Record<string, number>;
  total_responses: number;
}

/**
 * Correlation analysis between different metrics
 */
export interface CorrelationData {
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
}

/**
 * Event pacing feedback analysis
 */
export interface PacingData {
  distribution: Record<string, number>;
  total_responses: number;
  most_common?: string;
  percentages?: Record<string, number>;
}

/**
 * Textual feedback insights (word frequency, sentiment)
 */
export interface TextInsightsData {
  common_words?: Array<{ word: string; count: number }>;
  word_frequency?: Record<string, number>;
  total_feedback_entries?: number;
  one_word_descriptions?: Array<{ word: string; count: number }>;
  sentiment_analysis?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

/**
 * Event discovery channel impact analysis
 */
export interface DiscoveryData {
  channels: DiscoveryChannel[];
  total_responses: number;
  impact_analysis?: {
    high_impact: string[];
    medium_impact: string[];
    low_impact: string[];
  };
}

export interface DiscoveryChannel {
  channel: string;
  count: number;
  percentage: number;
  avg_satisfaction?: number;
  avg_recommendation?: number;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Structured error response with actionable suggestions
 */
export interface UploadError {
  code: ErrorCode;
  message: string;
  suggestion?: string;
  details?: string;
}

/**
 * Error codes for different failure scenarios
 */
export type ErrorCode =
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'PARSING_ERROR'
  | 'MISSING_COLUMNS'
  | 'EMPTY_FILE';

// ============================================================================
// Progress Tracking Types
// ============================================================================

/**
 * Upload progress tracking for large files
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: UploadStage;
}

/**
 * Different stages of upload/processing pipeline
 */
export type UploadStage = 'uploading' | 'processing' | 'analyzing' | 'complete';

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic API response wrapper (for future endpoints)
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: UploadError;
  timestamp?: string;
}
