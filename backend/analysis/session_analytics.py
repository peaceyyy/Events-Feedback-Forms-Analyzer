"""
Session-level analytics.

Functions:
- generate_time_slot_preferences: Analyzes preferred time slots for sessions
- generate_venue_modality_preferences: Analyzes preferred venue/modality types
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List
from collections import Counter


def generate_time_slot_preferences(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes preferred time slots for event sessions.
    
    Returns data for:
    - Time slot distribution (pie/donut chart)
    - Time slot vs satisfaction correlation
    - Peak preference times
    """
    df = pd.DataFrame(data)
    
    # Check for preferred time slot column
    time_col = None
    for col in ['preferred_time_slot', 'Preferred Time Slot', 'time_slot', 'preferred_time']:
        if col in df.columns:
            time_col = col
            break
    
    if not time_col:
        return {"error": "No preferred time slot data found"}
    
    # Clean and normalize time slot data
    df[time_col] = df[time_col].fillna('Not Specified')
    df[time_col] = df[time_col].astype(str).str.strip()
    
    # Count preferences
    time_counts = df[time_col].value_counts().to_dict()
    
    # Remove 'Not Specified' from main analysis if present
    total_responses = len(df)
    specified_responses = total_responses - time_counts.get('Not Specified', 0)
    
    # Calculate percentages
    time_distribution = []
    for time_slot, count in time_counts.items():
        if time_slot != 'Not Specified':
            time_distribution.append({
                'time_slot': time_slot,
                'count': int(count),
                'percentage': round((count / total_responses) * 100, 1)
            })
    
    # Sort by count descending
    time_distribution.sort(key=lambda x: x['count'], reverse=True)
    
    # Calculate satisfaction correlation if available
    satisfaction_by_time = {}
    if 'satisfaction' in df.columns:
        for time_slot in time_counts.keys():
            if time_slot != 'Not Specified':
                mask = df[time_col] == time_slot
                if mask.any():
                    avg_sat = df.loc[mask, 'satisfaction'].mean()
                    satisfaction_by_time[time_slot] = round(float(avg_sat), 2)
    
    # Identify most and least popular slots
    most_popular = time_distribution[0] if time_distribution else None
    least_popular = time_distribution[-1] if time_distribution else None
    
    return {
        "chart_type": "time_slot_preferences",
        "data": {
            "distribution": time_distribution,
            "satisfaction_by_time": satisfaction_by_time,
            "stats": {
                "total_responses": total_responses,
                "specified_responses": specified_responses,
                "unique_time_slots": len([t for t in time_counts.keys() if t != 'Not Specified']),
                "most_popular": most_popular,
                "least_popular": least_popular
            }
        }
    }


def generate_venue_modality_preferences(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes preferred venue types and modality (in-person vs online).
    
    Returns data for:
    - Venue type distribution (bar chart)
    - Modality breakdown (online vs physical venues)
    - Venue satisfaction correlation
    """
    df = pd.DataFrame(data)
    
    # Check for preferred venue column
    venue_col = None
    for col in ['preferred_venue', 'Preferred Venue', 'venue', 'venue_type']:
        if col in df.columns:
            venue_col = col
            break
    
    if not venue_col:
        return {"error": "No preferred venue data found"}
    
    # Clean and normalize venue data
    df[venue_col] = df[venue_col].fillna('Not Specified')
    df[venue_col] = df[venue_col].astype(str).str.strip()
    
    # Count preferences
    venue_counts = df[venue_col].value_counts().to_dict()
    
    # Classify venues as Online or In-Person
    online_keywords = ['online', 'virtual', 'remote', 'webinar', 'zoom']
    
    modality_breakdown = {
        'online': 0,
        'in_person': 0,
        'not_specified': 0
    }
    
    venue_details = []
    total_responses = len(df)
    
    for venue_type, count in venue_counts.items():
        is_online = any(keyword in venue_type.lower() for keyword in online_keywords)
        
        if venue_type == 'Not Specified':
            modality_breakdown['not_specified'] += count
        elif is_online:
            modality_breakdown['online'] += count
        else:
            modality_breakdown['in_person'] += count
        
        if venue_type != 'Not Specified':
            venue_details.append({
                'venue_type': venue_type,
                'count': int(count),
                'percentage': round((count / total_responses) * 100, 1),
                'modality': 'Online' if is_online else 'In-Person'
            })
    
    # Sort by count descending
    venue_details.sort(key=lambda x: x['count'], reverse=True)
    
    # Calculate satisfaction correlation if available
    satisfaction_by_venue = {}
    if 'satisfaction' in df.columns:
        for venue_type in venue_counts.keys():
            if venue_type != 'Not Specified':
                mask = df[venue_col] == venue_type
                if mask.any():
                    avg_sat = df.loc[mask, 'satisfaction'].mean()
                    satisfaction_by_venue[venue_type] = round(float(avg_sat), 2)
    
    # Calculate modality percentages
    specified_responses = total_responses - modality_breakdown['not_specified']
    modality_distribution = []
    
    if modality_breakdown['online'] > 0:
        modality_distribution.append({
            'modality': 'Online',
            'count': modality_breakdown['online'],
            'percentage': round((modality_breakdown['online'] / total_responses) * 100, 1)
        })
    
    if modality_breakdown['in_person'] > 0:
        modality_distribution.append({
            'modality': 'In-Person',
            'count': modality_breakdown['in_person'],
            'percentage': round((modality_breakdown['in_person'] / total_responses) * 100, 1)
        })
    
    # Most and least popular venues
    most_popular_venue = venue_details[0] if venue_details else None
    least_popular_venue = venue_details[-1] if venue_details else None
    
    return {
        "chart_type": "venue_modality_preferences",
        "data": {
            "venue_distribution": venue_details,
            "modality_breakdown": modality_distribution,
            "satisfaction_by_venue": satisfaction_by_venue,
            "stats": {
                "total_responses": total_responses,
                "specified_responses": specified_responses,
                "unique_venues": len([v for v in venue_counts.keys() if v != 'Not Specified']),
                "online_preference_count": modality_breakdown['online'],
                "in_person_preference_count": modality_breakdown['in_person'],
                "most_popular_venue": most_popular_venue,
                "least_popular_venue": least_popular_venue
            }
        }
    }

