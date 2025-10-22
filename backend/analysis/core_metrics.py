"""
Core satisfaction and NPS metrics calculation.

Functions:
- generate_satisfaction_analysis: Analyzes satisfaction ratings and prepares chart data
- generate_recommendation_analysis: Analyzes NPS (Net Promoter Score) data
- generate_satisfaction_insights: Generate actionable insights from satisfaction data (helper)
- categorize_nps: Categorize NPS score into standard ranges (helper)
"""

import pandas as pd
from typing import Dict, Any, List


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
