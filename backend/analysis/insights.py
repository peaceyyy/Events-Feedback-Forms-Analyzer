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
    
    # Debug logging
    print(f"DEBUG NPS: Detractors={detractors}, Passives={passives}, Promoters={promoters}, Total={total}")
    print(f"DEBUG NPS: Calculated NPS Score = {nps}")
    
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

    # Calculate average satisfaction for each of the top sessions for grouped charts
    session_satisfaction = {}
    if 'satisfaction' in df.columns:
        for session_name, _ in top_sessions:
            # Filter rows where the session was attended
            mask = df['sessions_attended'].apply(lambda x: isinstance(x, list) and session_name in x)
            if mask.any():
                session_satisfaction[session_name] = df.loc[mask, 'satisfaction'].mean()
    
    return {
        "chart_type": "session_popularity",
        "data": {
            # For horizontal bar chart
            "sessions": [session for session, count in top_sessions],
            "attendance": [count for session, count in top_sessions],
            # For grouped bar chart (Attendance vs. Avg. Satisfaction)
            "average_satisfaction": [round(session_satisfaction.get(s, 0), 2) for s, _ in top_sessions],

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
    Compares different aspect ratings (venue, speakers, content) against overall satisfaction baseline.
    Creates radar chart data optimized for strengths/weaknesses analysis.
    """
    df = pd.DataFrame(data)
    
    rating_columns = ['venue_rating', 'speaker_rating', 'content_rating']
    available_ratings = [col for col in rating_columns if col in df.columns]
    
    if not available_ratings:
        return {"error": "No rating data found"}
    
    # Calculate overall satisfaction baseline
    overall_satisfaction = 0
    if 'satisfaction' in df.columns:
        satisfaction_ratings = pd.to_numeric(df['satisfaction'], errors='coerce').dropna()
        if len(satisfaction_ratings) > 0:
            overall_satisfaction = float(satisfaction_ratings.mean())
    
    # Calculate averages for each aspect
    comparison_data = {}
    for col in available_ratings:
        ratings = pd.to_numeric(df[col], errors='coerce').dropna()
        if len(ratings) > 0:
            aspect_name = col.replace('_rating', '').title()
            aspect_avg = float(ratings.mean())
            comparison_data[aspect_name] = {
                "average": aspect_avg,
                "count": len(ratings),
                "distribution": ratings.value_counts().sort_index().to_dict(),
                # NEW: Performance relative to overall satisfaction
                "vs_overall": aspect_avg - overall_satisfaction,
                "performance_category": "strength" if aspect_avg > overall_satisfaction + 0.1 else "weakness" if aspect_avg < overall_satisfaction - 0.1 else "adequate"
            }
    
    print(f"DEBUG: Rating comparison data keys: {list(comparison_data.keys())}")
    print(f"DEBUG: Overall satisfaction baseline: {overall_satisfaction}")
    print(f"DEBUG: Rating comparison data structure: {comparison_data}")
    
    # Prepare data for scatter/line plots comparing two rating aspects
    scatter_pairs = {}
    if 'venue_rating' in available_ratings and 'speaker_rating' in available_ratings:
        scatter_pairs['venue_vs_speaker'] = df[['venue_rating', 'speaker_rating']].dropna().to_dict('records')
    if 'venue_rating' in available_ratings and 'content_rating' in available_ratings:
        scatter_pairs['venue_vs_content'] = df[['venue_rating', 'content_rating']].dropna().to_dict('records')
    if 'speaker_rating' in available_ratings and 'content_rating' in available_ratings:
        scatter_pairs['speaker_vs_content'] = df[['speaker_rating', 'content_rating']].dropna().to_dict('records')

    return {
        "chart_type": "rating_comparison",
        "data": {
            # For radar/spider chart with baseline approach
            "aspects": list(comparison_data.keys()),
            "averages": [data["average"] for data in comparison_data.values()],
            
            # NEW: Overall satisfaction baseline for radar chart
            "overall_satisfaction": overall_satisfaction,
            "baseline_data": [
                {
                    "aspect": aspect,
                    "value": details["average"],
                    "baseline": overall_satisfaction,
                    "performance": details["performance_category"],
                    "difference": details["vs_overall"]
                }
                for aspect, details in comparison_data.items()
            ],
            
            # Add scatter data for correlation analysis
            "scatter_pairs": scatter_pairs,
            
            # For grouped bar chart
            "detailed_comparison": [
                {"aspect": aspect, **details}
                for aspect, details in comparison_data.items()
            ],
            
            # Enhanced insights with baseline context
            "insights": {
                "highest_rated": max(comparison_data.keys(), key=lambda x: comparison_data[x]["average"]) if comparison_data else None,
                "lowest_rated": min(comparison_data.keys(), key=lambda x: comparison_data[x]["average"]) if comparison_data else None,
                "rating_spread": max([data["average"] for data in comparison_data.values()]) - min([data["average"] for data in comparison_data.values()]) if len(comparison_data) > 0 else 0,
                "strengths": [aspect for aspect, details in comparison_data.items() if details["performance_category"] == "strength"],
                "weaknesses": [aspect for aspect, details in comparison_data.items() if details["performance_category"] == "weakness"],
                "overall_satisfaction": overall_satisfaction
            }
        }
    }


def generate_one_word_descriptions(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes one-word descriptions from feedback data.
    Prepares data for WordCloud visualization.
    """
    df = pd.DataFrame(data)
    
    if 'one_word_desc' not in df.columns:
        return {"error": "No one-word description data found"}
    
    # Extract and clean one-word descriptions
    descriptions = df['one_word_desc'].dropna()
    descriptions = descriptions[descriptions != '']
    descriptions = descriptions[descriptions != 'No comment']
    
    if descriptions.empty:
        return {"error": "No valid one-word descriptions found"}
    
    # Count occurrences and prepare for WordCloud
    description_counts = Counter(descriptions.str.strip().str.title())
    
    # Format for WordCloud component (Carbon Charts format)
    word_cloud_data = [
        {"word": word, "count": count}
        for word, count in description_counts.most_common()
    ]
    
    # Calculate statistics
    total_descriptions = len(descriptions)
    unique_descriptions = len(description_counts)
    
    return {
        "chart_type": "one_word_descriptions",
        "data": {
            "word_cloud": word_cloud_data,
            "top_descriptions": description_counts.most_common(10),
            "stats": {
                "total_responses": total_descriptions,
                "unique_words": unique_descriptions,
                "most_common": description_counts.most_common(1)[0] if description_counts else None,
                "response_rate": round((total_descriptions / len(df)) * 100, 1)
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


def generate_pacing_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes pacing satisfaction correlation.
    Shows how event pacing affects overall satisfaction.
    """
    df = pd.DataFrame(data)
    
    required_columns = ['pacing', 'satisfaction']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        return {"error": f"Missing required columns: {missing_columns}"}
    
    # Clean data - remove null values
    clean_df = df[['pacing', 'satisfaction']].dropna()
    
    if clean_df.empty:
        return {"error": "No valid pacing/satisfaction data found"}
    
    # Group by pacing and calculate satisfaction stats
    pacing_groups = clean_df.groupby('pacing')['satisfaction'].agg([
        'count', 'mean', 'std'
    ]).round(2)
    
    # Prepare chart data
    chart_data = []
    stats_summary = {}
    
    # Convert pandas groupby result to dictionary for easier type handling
    pacing_stats = pacing_groups.to_dict('index')
    
    for pacing_category, stats in pacing_stats.items():
        count = int(stats['count'])
        mean_satisfaction = float(stats['mean'])
        std_satisfaction = float(stats['std']) if not pd.isna(stats['std']) else 0.0
        
        chart_data.append({
            "category": pacing_category,
            "value": mean_satisfaction,
            "count": count,
            "std_dev": std_satisfaction
        })
        
        stats_summary[pacing_category] = {
            "count": count,
            "avg_satisfaction": mean_satisfaction,
            "percentage": round((count / len(clean_df)) * 100, 1)
        }
    
    # Sort by satisfaction (highest first)
    chart_data.sort(key=lambda x: x['value'], reverse=True)
    
    # Calculate overall insights
    total_responses = len(clean_df)
    best_pacing = max(chart_data, key=lambda x: x['value'])
    worst_pacing = min(chart_data, key=lambda x: x['value'])
    
    # Generate insights
    insights = []
    if best_pacing['value'] - worst_pacing['value'] > 1.0:
        insights.append(f"Pacing significantly affects satisfaction - '{best_pacing['category']}' leads to {best_pacing['value']:.1f}/5 satisfaction")
    
    if any(cat['category'].lower() in ['just right', 'perfect', 'good'] for cat in chart_data):
        optimal_count = sum(cat['count'] for cat in chart_data if cat['category'].lower() in ['just right', 'perfect', 'good'])
        insights.append(f"{round((optimal_count/total_responses)*100)}% found pacing optimal")
    
    return {
        "chart_type": "pacing_analysis",
        "data": {
            "categories": [item["category"] for item in chart_data],
            "values": [item["value"] for item in chart_data],
            "counts": [item["count"] for item in chart_data],
            "chart_data": chart_data,  # Detailed data for advanced charts
            
            "stats": {
                "total_responses": total_responses,
                "pacing_distribution": stats_summary,
                "satisfaction_range": {
                    "highest": best_pacing['value'],
                    "lowest": worst_pacing['value'],
                    "difference": round(best_pacing['value'] - worst_pacing['value'], 2)
                },
                "best_pacing": best_pacing['category'],
                "worst_pacing": worst_pacing['category']
            },
            
            "insights": insights
        }
    }


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
