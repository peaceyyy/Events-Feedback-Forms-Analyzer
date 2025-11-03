"""
High-level report orchestrators that combine multiple analysis modules.

Functions:
- generate_comprehensive_report: Generates complete analysis report combining all insights
- generate_initial_summary: Generates lightweight summary for immediate frontend display
"""

import pandas as pd
from typing import Dict, Any, List
from collections import Counter

# Import from modularized analysis modules
from .metrics_analysis import generate_satisfaction_analysis, generate_recommendation_analysis
from .session_analytics import (
    generate_session_popularity, 
    generate_session_performance_matrix,
    generate_time_slot_preferences,
    generate_venue_modality_preferences
)
from .comparative_analysis import generate_rating_comparison, generate_correlation_analysis, generate_pacing_analysis
from .textual_analytics import generate_one_word_descriptions, generate_text_insights
from .marketing_analytics import generate_discovery_channel_impact


def generate_comprehensive_report(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates a complete analysis report combining all insights.
    This is the main function to call for dashboard data.
    """
    
    print(f"DEBUG: Starting comprehensive report generation for {len(data)} records")
    
    # Generate individual data points for scatter plots
    scatter_data = []
    for response in data:
        if 'satisfaction' in response and 'recommendation_score' in response:
            # Only include responses that have both satisfaction and recommendation data
            try:
                satisfaction = float(response['satisfaction']) if response['satisfaction'] is not None else None
                recommendation = float(response['recommendation_score']) if response['recommendation_score'] is not None else None
                
                if satisfaction is not None and recommendation is not None:
                    scatter_data.append({
                        'x': satisfaction,
                        'y': recommendation,
                        'satisfaction': satisfaction,
                        'recommendation_score': recommendation,
                        'venue_rating': float(response.get('venue_rating', 0)) if response.get('venue_rating') else None,
                        'speaker_rating': float(response.get('speaker_rating', 0)) if response.get('speaker_rating') else None,
                        'content_rating': float(response.get('content_rating', 0)) if response.get('content_rating') else None
                    })
            except (ValueError, TypeError) as e:
                print(f"DEBUG: Skipping invalid data point: {e}")
                continue
    
    print(f"DEBUG: Generated {len(scatter_data)} scatter plot points")
    
    # Generate each analysis section with error handling
    analysis_result = {
        "summary": {
            "total_responses": len(data),
            "analysis_timestamp": pd.Timestamp.now().isoformat()
        }
    }
    
    # Generate each analysis with individual error handling
    try:
        analysis_result["satisfaction"] = generate_satisfaction_analysis(data)
        print("DEBUG: Satisfaction analysis completed")
    except Exception as e:
        print(f"DEBUG: Satisfaction analysis failed: {e}")
        analysis_result["satisfaction"] = {"error": str(e)}
    
    try:
        analysis_result["nps"] = generate_recommendation_analysis(data)
        print("DEBUG: NPS analysis completed")
    except Exception as e:
        print(f"DEBUG: NPS analysis failed: {e}")
        analysis_result["nps"] = {"error": str(e)}
    
    try:
        analysis_result["sessions"] = generate_session_popularity(data)
        print("DEBUG: Sessions analysis completed")
    except Exception as e:
        print(f"DEBUG: Sessions analysis failed: {e}")
        analysis_result["sessions"] = {"error": str(e)}
    
    try:
        analysis_result["ratings"] = generate_rating_comparison(data)
        print("DEBUG: Ratings analysis completed")
    except Exception as e:
        print(f"DEBUG: Ratings analysis failed: {e}")
        analysis_result["ratings"] = {"error": str(e)}
    
    try:
        analysis_result["feedback"] = generate_text_insights(data)
        print("DEBUG: Feedback analysis completed")
    except Exception as e:
        print(f"DEBUG: Feedback analysis failed: {e}")
        analysis_result["feedback"] = {"error": str(e)}
    
    try:
        analysis_result["one_word_descriptions"] = generate_one_word_descriptions(data)
        print("DEBUG: One-word descriptions analysis completed")
    except Exception as e:
        print(f"DEBUG: One-word descriptions analysis failed: {e}")
        analysis_result["one_word_descriptions"] = {"error": str(e)}
    
    try:
        analysis_result["pacing"] = generate_pacing_analysis(data)
        print("DEBUG: Pacing analysis completed")
    except Exception as e:
        print(f"DEBUG: Pacing analysis failed: {e}")
        analysis_result["pacing"] = {"error": str(e)}
    
    try:
        analysis_result["correlation"] = generate_correlation_analysis(data)
        print("DEBUG: Correlation analysis completed")
    except Exception as e:
        print(f"DEBUG: Correlation analysis failed: {e}")
        analysis_result["correlation"] = {"error": str(e)}
    
    # NEW: Session Performance Matrix
    try:
        analysis_result["session_matrix"] = generate_session_performance_matrix(data)
        print("DEBUG: Session performance matrix completed")
    except Exception as e:
        print(f"DEBUG: Session performance matrix failed: {e}")
        analysis_result["session_matrix"] = {"error": str(e)}
    
    # NEW: Discovery Channel Impact
    try:
        analysis_result["discovery_channels"] = generate_discovery_channel_impact(data)
        print("DEBUG: Discovery channel impact analysis completed")
    except Exception as e:
        print(f"DEBUG: Discovery channel impact failed: {e}")
        analysis_result["discovery_channels"] = {"error": str(e)}
    
    # NEW: Time Slot Preferences
    try:
        analysis_result["time_preferences"] = generate_time_slot_preferences(data)
        print("DEBUG: Time slot preferences analysis completed")
    except Exception as e:
        print(f"DEBUG: Time slot preferences failed: {e}")
        analysis_result["time_preferences"] = {"error": str(e)}
    
    # NEW: Venue Modality Preferences
    try:
        analysis_result["venue_preferences"] = generate_venue_modality_preferences(data)
        print("DEBUG: Venue modality preferences analysis completed")
    except Exception as e:
        print(f"DEBUG: Venue modality preferences failed: {e}")
        analysis_result["venue_preferences"] = {"error": str(e)}
    
    # Add scatter data
    analysis_result["scatter_data"] = {
        "chart_type": "satisfaction_vs_recommendation_scatter",
        "data": {
            "points": scatter_data,
            "total_points": len(scatter_data)
        }
    }
    
    print(f"DEBUG: Comprehensive analysis completed with keys: {list(analysis_result.keys())}")
    return analysis_result


def generate_initial_summary(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates a lightweight summary for immediate frontend display after upload.
    """
    if not data:
        return {"total_responses": 0}
    
    df = pd.DataFrame(data)
    
    summary = {
        "total_responses": len(data),
        "average_satisfaction": float(df['satisfaction'].mean()) if 'satisfaction' in df.columns else 0,
        "average_recommendation": float(df['recommendation_score'].mean()) if 'recommendation_score' in df.columns else 0,
        "response_distribution": {},
        "most_attended_sessions": [],
    }
    
    # Satisfaction distribution
    if 'satisfaction' in df.columns:
        satisfaction_counts = df['satisfaction'].value_counts().to_dict()
        summary["response_distribution"]["satisfaction"] = {str(k): int(v) for k, v in satisfaction_counts.items()}
    
    # Most popular sessions
    if 'sessions_attended' in df.columns:
        all_sessions = []
        for sessions in df['sessions_attended'].dropna():
            if isinstance(sessions, list):
                all_sessions.extend([s for s in sessions if s])
        
        if all_sessions:
            session_counts = Counter(all_sessions)
            summary["most_attended_sessions"] = [
                {"session": session, "count": count} 
                for session, count in session_counts.most_common(5)
            ]
    
    return summary
