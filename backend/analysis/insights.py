"""
Data analysis and insights generation for feedback data.
Prepares data in formats optimized for web charting libraries.
"""

import pandas as pd
from typing import Dict, Any, List
from collections import Counter
import numpy as np


def generate_satisfaction_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes satisfaction ratings and prepares chart data.
    Returns data formatted for bar charts, pie charts, and trend analysis.
    """
    df = pd.DataFrame(data)
    
    if 'satisfaction' not in df.columns:
        return {"error": "No satisfaction data found"}
    
    # Clean satisfaction data
    satisfaction_counts = df['satisfaction'].value_counts().sort_index()
    
    return {
        "chart_type": "satisfaction_distribution",
        "data": {
            # For bar/column charts
            "categories": satisfaction_counts.index.tolist(),
            "values": satisfaction_counts.values.tolist(),
            
            # For pie charts
            "pie_data": [
                {"name": str(rating), "value": int(count)} 
                for rating, count in satisfaction_counts.items()
            ],
            
            # Statistics
            "stats": {
                "average": float(df['satisfaction'].mean()),
                "median": float(df['satisfaction'].median()),
                "mode": float(df['satisfaction'].mode().iloc[0] if not df['satisfaction'].mode().empty else 0),
                "total_responses": len(df)
            }
        },
        "recommendations": generate_satisfaction_insights(df['satisfaction'])
    }


def generate_recommendation_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes NPS (Net Promoter Score) data.
    Categorizes responses into Detractors, Passives, and Promoters.
    """
    df = pd.DataFrame(data)
    
    if 'recommendation_score' not in df.columns:
        return {"error": "No recommendation score data found"}
    
    # Clean and categorize NPS scores
    scores = df['recommendation_score'].dropna()
    
    # NPS categories: 0-6 (Detractors), 7-8 (Passives), 9-10 (Promoters)
    detractors = len(scores[scores <= 6])
    passives = len(scores[(scores >= 7) & (scores <= 8)])
    promoters = len(scores[scores >= 9])
    total = len(scores)
    
    # Calculate NPS score (-100 to +100)
    nps = ((promoters - detractors) / total * 100) if total > 0 else 0
    
    return {
        "chart_type": "nps_analysis",
        "data": {
            # For stacked bar chart
            "categories": ["Detractors (0-6)", "Passives (7-8)", "Promoters (9-10)"],
            "values": [detractors, passives, promoters],
            "percentages": [
                round(detractors/total*100, 1) if total > 0 else 0,
                round(passives/total*100, 1) if total > 0 else 0,
                round(promoters/total*100, 1) if total > 0 else 0
            ],
            
            # NPS score display
            "nps_score": round(nps, 1),
            "nps_category": categorize_nps(nps),
            
            # Distribution for histogram
            "score_distribution": scores.value_counts().sort_index().to_dict()
        }
    }


def generate_session_popularity(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes which sessions were most popular.
    Prepares data for horizontal bar charts and session comparison.
    """
    df = pd.DataFrame(data)
    
    if 'sessions_attended' not in df.columns:
        return {"error": "No session attendance data found"}
    
    # Flatten all sessions into a single list
    all_sessions = []
    for sessions in df['sessions_attended']:
        if isinstance(sessions, list):
            all_sessions.extend([s.strip() for s in sessions if s.strip()])
    
    if not all_sessions:
        return {"error": "No session data found"}
    
    # Count session attendance
    session_counts = Counter(all_sessions)
    top_sessions = session_counts.most_common(10)  # Top 10 sessions
    
    return {
        "chart_type": "session_popularity",
        "data": {
            # For horizontal bar chart
            "sessions": [session for session, count in top_sessions],
            "attendance": [count for session, count in top_sessions],
            
            # For comparison with total responses
            "attendance_rates": [
                {"session": session, "count": count, "percentage": round(count/len(df)*100, 1)}
                for session, count in top_sessions
            ],
            
            # Summary stats
            "stats": {
                "total_unique_sessions": len(session_counts),
                "avg_attendance_per_session": np.mean(list(session_counts.values())),
                "most_popular": top_sessions[0] if top_sessions else None
            }
        }
    }


def generate_rating_comparison(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compares different aspect ratings (venue, speakers, content).
    Creates multi-series data for comparison charts.
    """
    df = pd.DataFrame(data)
    
    rating_columns = ['venue_rating', 'speaker_rating', 'content_rating']
    available_ratings = [col for col in rating_columns if col in df.columns]
    
    if not available_ratings:
        return {"error": "No rating data found"}
    
    # Calculate averages for each aspect
    comparison_data = {}
    for col in available_ratings:
        ratings = pd.to_numeric(df[col], errors='coerce').dropna()
        if len(ratings) > 0:
            comparison_data[col.replace('_rating', '').title()] = {
                "average": float(ratings.mean()),
                "count": len(ratings),
                "distribution": ratings.value_counts().sort_index().to_dict()
            }
    
    return {
        "chart_type": "rating_comparison",
        "data": {
            # For radar/spider chart
            "aspects": list(comparison_data.keys()),
            "averages": [data["average"] for data in comparison_data.values()],
            
            # For grouped bar chart
            "detailed_comparison": [
                {"aspect": aspect, **details}
                for aspect, details in comparison_data.items()
            ],
            
            # Best and worst performing aspects
            "insights": {
                "highest_rated": max(comparison_data.keys(), key=lambda x: comparison_data[x]["average"]) if comparison_data else None,
                "lowest_rated": min(comparison_data.keys(), key=lambda x: comparison_data[x]["average"]) if comparison_data else None,
                "rating_spread": max([data["average"] for data in comparison_data.values()]) - min([data["average"] for data in comparison_data.values()]) if comparison_data else 0
            }
        }
    }


def generate_text_insights(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes text feedback for common themes and sentiment.
    Prepares word frequency and theme data.
    """
    df = pd.DataFrame(data)
    
    text_columns = ['positive_feedback', 'improvement_feedback', 'additional_comments']
    available_text = [col for col in text_columns if col in df.columns]
    
    if not available_text:
        return {"error": "No text feedback found"}
    
    # Combine all text feedback
    all_feedback = []
    feedback_by_type = {}
    
    for col in available_text:
        texts = df[col].dropna()
        # Filter out placeholder text
        texts = texts[texts != 'No comment provided']
        texts = texts[texts != 'No comment']
        
        feedback_by_type[col] = texts.tolist()
        all_feedback.extend(texts.tolist())
    
    # Simple word frequency analysis (you might want to add more sophisticated NLP)
    common_words = extract_common_words(all_feedback)
    
    return {
        "chart_type": "text_insights",
        "data": {
            "feedback_counts": {
                col.replace('_', ' ').title(): len(texts) 
                for col, texts in feedback_by_type.items()
            },
            
            # Word cloud data
            "word_frequency": common_words[:20],  # Top 20 words
            
            # Sample comments for display
            "sample_feedback": {
                col: texts[:3] if len(texts) > 0 else []
                for col, texts in feedback_by_type.items()
            },
            
            "stats": {
                "total_text_responses": len(all_feedback),
                "avg_response_length": np.mean([len(text.split()) for text in all_feedback]) if all_feedback else 0
            }
        }
    }


def generate_comprehensive_report(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates a complete analysis report combining all insights.
    This is the main function to call for dashboard data.
    """
    return {
        "summary": {
            "total_responses": len(data),
            "analysis_timestamp": pd.Timestamp.now().isoformat()
        },
        "satisfaction": generate_satisfaction_analysis(data),
        "nps": generate_recommendation_analysis(data),
        "sessions": generate_session_popularity(data),
        "ratings": generate_rating_comparison(data),
        "feedback": generate_text_insights(data)
    }


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


# Helper functions
def generate_satisfaction_insights(satisfaction_series) -> List[str]:
    """Generate actionable insights from satisfaction data"""
    avg_satisfaction = satisfaction_series.mean()
    insights = []
    
    if avg_satisfaction >= 4.5:
        insights.append("Excellent satisfaction levels - maintain current standards")
    elif avg_satisfaction >= 4.0:
        insights.append("Good satisfaction - look for opportunities to reach excellence")
    elif avg_satisfaction >= 3.5:
        insights.append("Moderate satisfaction - identify key improvement areas")
    else:
        insights.append("Below average satisfaction - urgent improvements needed")
    
    return insights


def categorize_nps(nps_score: float) -> str:
    """Categorize NPS score into standard ranges"""
    if nps_score >= 70:
        return "World Class"
    elif nps_score >= 50:
        return "Excellent" 
    elif nps_score >= 30:
        return "Good"
    elif nps_score >= 0:
        return "Needs Improvement"
    else:
        return "Critical"


def extract_common_words(texts: List[str], min_length: int = 3) -> List[Dict[str, Any]]:
    """Extract common words from text feedback (simple implementation)"""
    # Simple word extraction - you might want to use NLTK or spaCy for production
    import re
    
    # Common stop words to exclude
    stop_words = {
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
        'by', 'a', 'an', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 
        'has', 'had', 'do', 'did', 'will', 'would', 'could', 'should', 'it',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they'
    }
    
    all_words = []
    for text in texts:
        if isinstance(text, str):
            # Extract words (letters only, minimum length)
            words = re.findall(r'\b[a-zA-Z]{' + str(min_length) + r',}\b', text.lower())
            all_words.extend([word for word in words if word not in stop_words])
    
    word_counts = Counter(all_words)
    return [
        {"word": word, "count": count}
        for word, count in word_counts.most_common()
    ]
