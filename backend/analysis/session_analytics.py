"""
Session-level analytics for attendance and performance.

Functions:
- generate_session_popularity: Analyzes which sessions were most popular
- generate_session_performance_matrix: Creates performance matrix based on attendance and satisfaction
- generate_time_slot_preferences: Analyzes preferred time slots for sessions
- generate_venue_modality_preferences: Analyzes preferred venue/modality types
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List
from collections import Counter


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


def generate_session_performance_matrix(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Creates a performance matrix for sessions based on attendance and satisfaction.
    Categorizes sessions into quadrants: Stars, Hidden Gems, Crowd Favorites, Underperformers.
    
    Returns bubble chart data where:
    - X-axis: Attendance count
    - Y-axis: Average satisfaction
    - Bubble size: Proportional to attendance
    - Color: Based on quadrant category
    """
    df = pd.DataFrame(data)
    
    # Validate required columns
    if 'sessions_attended' not in df.columns:
        return {"error": "No session attendance data found"}
    
    if 'satisfaction' not in df.columns:
        return {"error": "No satisfaction data found"}
    
    # Flatten sessions and collect satisfaction ratings
    session_data = {}
    for idx, row in df.iterrows():
        sessions = row.get('sessions_attended', [])
        satisfaction = row.get('satisfaction')
        
        # Handle sessions (could be list or comma-separated string)
        if isinstance(sessions, str):
            sessions = [s.strip() for s in sessions.split(',') if s.strip()]
        elif not isinstance(sessions, list):
            continue
            
        # Map satisfaction to each attended session
        if sessions and pd.notna(satisfaction):
            satisfaction_numeric = pd.to_numeric(satisfaction, errors='coerce')
            if pd.notna(satisfaction_numeric):
                for session in sessions:
                    session = session.strip()
                    if session not in session_data:
                        session_data[session] = {
                            'satisfaction_scores': [],
                            'attendance': 0
                        }
                    session_data[session]['satisfaction_scores'].append(satisfaction_numeric)
                    session_data[session]['attendance'] += 1
    
    if not session_data:
        return {"error": "No valid session performance data found"}
    
    # Calculate metrics for each session
    sessions_list = []
    for session_name, metrics in session_data.items():
        if metrics['attendance'] > 0 and metrics['satisfaction_scores']:
            avg_satisfaction = np.mean(metrics['satisfaction_scores'])
            sessions_list.append({
                'session': session_name,
                'attendance': metrics['attendance'],
                'avg_satisfaction': round(float(avg_satisfaction), 2),
                'response_count': len(metrics['satisfaction_scores'])
            })
    
    if not sessions_list:
        return {"error": "No sessions with sufficient data"}
    
    # Calculate median attendance and satisfaction for quadrant classification
    attendances = [s['attendance'] for s in sessions_list]
    satisfactions = [s['avg_satisfaction'] for s in sessions_list]
    
    median_attendance = np.median(attendances)
    median_satisfaction = np.median(satisfactions)
    
    # Categorize sessions into quadrants
    for session in sessions_list:
        high_attendance = session['attendance'] >= median_attendance
        high_satisfaction = session['avg_satisfaction'] >= median_satisfaction
        
        if high_attendance and high_satisfaction:
            session['category'] = 'Star'
            session['color'] = '#4CAF50'  # Green
        elif not high_attendance and high_satisfaction:
            session['category'] = 'Hidden Gem'
            session['color'] = '#2196F3'  # Blue
        elif high_attendance and not high_satisfaction:
            session['category'] = 'Crowd Favorite'
            session['color'] = '#FF9800'  # Orange
        else:
            session['category'] = 'Needs Improvement'
            session['color'] = '#F44336'  # Red
    
    # Sort by attendance for better visualization
    sessions_list.sort(key=lambda x: x['attendance'], reverse=True)
    
    # Calculate quadrant counts
    star_sessions = [s for s in sessions_list if s['category'] == 'Star']
    hidden_gems = [s for s in sessions_list if s['category'] == 'Hidden Gem']
    underperformers = [s for s in sessions_list if s['category'] == 'Needs Improvement']
    
    # No hardcoded insights - instruct user to generate AI insights
    insights = [
        "Click 'Generate AI Insights' for strategic session performance recommendations"
    ]
    
    return {
        "sessions": sessions_list,
        "quadrants": {
            "stars": len(star_sessions),
            "hidden_gems": len(hidden_gems),
            "crowd_favorites": len([s for s in sessions_list if s['category'] == 'Crowd Favorite']),
            "needs_improvement": len(underperformers)
        },
        "thresholds": {
            "median_attendance": round(float(median_attendance), 1),
            "median_satisfaction": round(float(median_satisfaction), 2)
        },
        "insights": insights,
        "stats": {
            "total_sessions": len(sessions_list),
            "avg_attendance": round(float(np.mean(attendances)), 1),
            "avg_satisfaction": round(float(np.mean(satisfactions)), 2)
        }
    }


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

