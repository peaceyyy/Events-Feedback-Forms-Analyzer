# Import analysis functions from modularized structure

# Core metrics (satisfaction + NPS)
from .metrics_analysis import (
    generate_satisfaction_analysis,
    generate_recommendation_analysis,
    generate_satisfaction_insights,
    categorize_nps
)

# Session analytics
from .session_analytics import (
    generate_session_popularity,
    generate_session_performance_matrix
)

# Comparative analysis
from .comparative_analysis import (
    generate_rating_comparison,
    generate_correlation_analysis,
    generate_pacing_analysis
)

# Textual analytics
from .textual_analytics import (
    generate_one_word_descriptions,
    generate_text_insights,
    extract_common_words
)

# Marketing analytics
from .marketing_analytics import (
    generate_discovery_channel_impact
)

# Summative reports 
from .summative_reports import (
    generate_comprehensive_report,
    generate_initial_summary
)

__all__ = [
    # Core metrics
    "generate_satisfaction_analysis",
    "generate_recommendation_analysis",
    "generate_satisfaction_insights",
    "categorize_nps",
    
    # Session analytics
    "generate_session_popularity",
    "generate_session_performance_matrix",
    
    # Comparative analysis
    "generate_rating_comparison",
    "generate_correlation_analysis",
    "generate_pacing_analysis",
    
    # Textual analytics
    "generate_one_word_descriptions",
    "generate_text_insights",
    "extract_common_words",
    
    # Marketing analytics
    "generate_discovery_channel_impact",
    
    # Summative reports
    "generate_comprehensive_report",
    "generate_initial_summary"
]
