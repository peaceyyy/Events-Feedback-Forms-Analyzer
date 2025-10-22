"""
Marketing channel effectiveness analysis.

Functions:
- generate_discovery_channel_impact: Analyzes how event discovery channels correlate with satisfaction
"""

import pandas as pd
from typing import Dict, Any, List


def generate_discovery_channel_impact(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes how event discovery channels correlate with satisfaction.
    Identifies which marketing/promotion channels bring the most satisfied attendees.
    
    Returns:
    - Channel-wise satisfaction averages
    - Attendance counts per channel
    - Channel effectiveness ranking
    """
    df = pd.DataFrame(data)
    
    # Validate required columns
    if 'event_discovery' not in df.columns:
        return {"error": "No event discovery channel data found"}
    
    if 'satisfaction' not in df.columns:
        return {"error": "No satisfaction data found"}
    
    # Clean and filter data
    df_clean = df[['event_discovery', 'satisfaction']].copy()
    df_clean = df_clean.dropna()
    
    # Convert satisfaction to numeric
    df_clean['satisfaction'] = pd.to_numeric(df_clean['satisfaction'], errors='coerce')
    df_clean = df_clean.dropna()
    
    if len(df_clean) == 0:
        return {"error": "No valid discovery channel data found"}
    
    # Group by discovery channel
    channel_analysis = df_clean.groupby('event_discovery').agg({
        'satisfaction': ['mean', 'count', 'std']
    }).round(2)
    
    # Flatten column names
    channel_analysis.columns = ['avg_satisfaction', 'count', 'std_dev']
    channel_analysis = channel_analysis.reset_index()
    
    # Calculate effectiveness score (weighted by count and satisfaction)
    # Channels with high satisfaction AND reasonable sample size get higher scores
    max_count = channel_analysis['count'].max()
    channel_analysis['effectiveness_score'] = (
        (channel_analysis['avg_satisfaction'] / 5.0) * 0.7 +  # 70% weight on satisfaction
        (channel_analysis['count'] / max_count) * 0.3  # 30% weight on reach
    ) * 100
    
    # Sort by effectiveness
    channel_analysis = channel_analysis.sort_values('effectiveness_score', ascending=False)
    
    # Convert to list of dicts
    channels_list = channel_analysis.to_dict('records')
    
    # Calculate correlation between channel and satisfaction (if enough data)
    correlation = None
    if len(df_clean) >= 30:  # Minimum sample size for meaningful correlation
        # Encode channels numerically by their average satisfaction
        channel_mapping = dict(zip(
            channel_analysis['event_discovery'],
            range(len(channel_analysis))
        ))
        df_clean['channel_encoded'] = df_clean['event_discovery'].map(channel_mapping)
        correlation = df_clean[['channel_encoded', 'satisfaction']].corr().iloc[0, 1]
    
    # No hardcoded insights - instruct user to generate AI insights
    insights = [
        "Click 'Generate AI Insights' for marketing channel recommendations and ROI analysis"
    ]
    
    return {
        "channels": channels_list,
        "stats": {
            "total_channels": len(channels_list),
            "total_responses": int(channel_analysis['count'].sum()),
            "overall_avg_satisfaction": round(float(df_clean['satisfaction'].mean()), 2),
            "channel_satisfaction_correlation": round(float(correlation), 3) if correlation is not None and pd.notna(correlation) else None  # type: ignore
        },
        "insights": insights,
        "recommendations": []  # Remove hardcoded recommendations
    }
