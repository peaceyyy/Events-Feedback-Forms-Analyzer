"""
Comparative analysis for ratings, correlations, and pacing.

Functions:
- generate_rating_comparison: Compares aspect ratings (venue, speakers, content) against overall satisfaction
- generate_correlation_analysis: Analyzes correlation between aspect ratings and overall satisfaction
- generate_pacing_analysis: Analyzes pacing satisfaction correlation
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List


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


def generate_correlation_analysis(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes correlation between aspect ratings and overall satisfaction.
    Identifies which aspects have the strongest impact on overall satisfaction.
    """
    df = pd.DataFrame(data)
    
    # Required columns
    if 'satisfaction' not in df.columns:
        return {"error": "No satisfaction data found for correlation analysis"}
    
    # Available aspect rating columns
    rating_columns = ['venue_rating', 'speaker_rating', 'content_rating']
    available_columns = [col for col in rating_columns if col in df.columns]
    
    if not available_columns:
        return {"error": "No aspect rating data found for correlation analysis"}
    
    # Calculate correlations
    correlations = []
    scatter_data = []
    
    for col in available_columns:
        # Clean data
        clean_df = df[[col, 'satisfaction']].dropna()
        
        if len(clean_df) < 10:  # Need minimum sample size
            continue
        
        # Calculate Pearson correlation
        correlation = clean_df[col].corr(clean_df['satisfaction'])
        
        # Categorize impact level
        if correlation > 0.7:
            impact_level = 'high'
        elif correlation > 0.5:
            impact_level = 'medium'
        else:
            impact_level = 'low'
        
        # Format aspect name
        aspect_name = col.replace('_rating', '').replace('_', ' ').title()
        
        correlations.append({
            "aspect": aspect_name,
            "correlation": float(correlation),
            "impact_level": impact_level,
            "sample_size": len(clean_df)
        })
        
        # Prepare scatter data for visualization
        scatter_points = clean_df.rename(columns={
            col: 'aspect_rating',
            'satisfaction': 'satisfaction'
        }).to_dict('records')
        
        scatter_data.append({
            "aspect": aspect_name,
            "points": scatter_points
        })
    
    # Sort by correlation strength
    correlations.sort(key=lambda x: x['correlation'], reverse=True)
    
    # Generate insights
    if correlations:
        strongest = correlations[0]
        insights = [
            f"{strongest['aspect']} has the strongest correlation ({strongest['correlation']:.2%}) with overall satisfaction",
            f"Improving {strongest['aspect'].lower()} will have the greatest impact on attendee satisfaction"
        ]
        
        weak_aspects = [c['aspect'] for c in correlations if c['correlation'] < 0.5]
        if weak_aspects:
            insights.append(f"Focus less on {', '.join(weak_aspects).lower()} as they show weaker impact")
    else:
        insights = []
    
    return {
        "chart_type": "correlation_analysis",
        "data": {
            "correlations": correlations,
            "scatter_data": scatter_data,
            "insights": insights,
            "stats": {
                "strongest_driver": correlations[0]['aspect'] if correlations else None,
                "strongest_correlation": correlations[0]['correlation'] if correlations else 0,
                "total_aspects_analyzed": len(correlations)
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
