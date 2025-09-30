"""
Web API version of the data extractor for Next.js integration.
This module provides clean functions for web endpoints without CLI interface.
"""

import pandas as pd
from typing import Dict, Any, List
import os
import json
from datetime import datetime
import tempfile


def validate_csv_content(file_content: bytes) -> Dict[str, Any]:
    """
    Validates CSV content from uploaded file bytes.
    Returns validation result without requiring file system access.
    """
    temp_path = None
    try:
        # Create temporary file to validate pandas can read it
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name
        
        # Test if pandas can read the file
        pd.read_csv(temp_path, nrows=1)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        return {"valid": True, "message": "File content is valid CSV"}
    
    except Exception as e:
        # Clean up temp file if it exists
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass
        return {"valid": False, "message": f"Invalid CSV format: {str(e)}"}


def process_feedback_csv(file_content: bytes) -> Dict[str, Any]:
    """
    Processes CSV file content for web API.
    Returns standardized response with success/error status and data.
    """
    temp_path = None
    try:
        # Create temporary file for pandas processing
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name
        
        # Process the file using existing logic
        extracted_data = extract_feedback_data(temp_path)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        # Generate summary statistics for the frontend
        summary = generate_data_summary(extracted_data)
        
        return {
            "success": True,
            "message": "CSV processed successfully",
            "data": extracted_data,
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        }
    
    except ValueError as e:
        return {
            "success": False,
            "error": "Data validation error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Processing error",
            "message": f"Failed to process CSV: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
    finally:
        # Ensure cleanup even if processing fails
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass


def extract_feedback_data(file_path: str) -> List[Dict[str, Any]]:
    """
    Core data extraction logic (unchanged from original).
    Processes CSV file and returns cleaned data structure.
    """
    df = pd.read_csv(file_path)

    # Column mapping for shorter, API-friendly names
    rename_map = {
        'Overall Satisfaction': 'satisfaction',
        'How likely are you to recommend our events to a friend or colleague?': 'recommendation_score',
        'Which sessions did you attend?': 'sessions_attended',
        'Please rate the following aspects of the event [Venue]': 'venue_rating',
        'Please rate the following aspects of the event [Speakers]': 'speaker_rating',
        'Please rate the following aspects of the event [Content Relevance]': 'content_rating',
        'What did you like most about the event?': 'positive_feedback',
        'What could be improved?': 'improvement_feedback',
        'Any additional comments?': 'additional_comments',
        'Preferred Time Slot': 'preferred_time',
        'Preferred Venue': 'preferred_venue',
        'Pacing': 'pacing',
        'Event Discovery Channel': 'event_discovery',
        'One-Word Description': 'one_word_desc'
    }
    df.rename(columns=rename_map, inplace=True)

    # Validate required columns exist
    required_columns = set(rename_map.values())
    missing_columns = required_columns - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {sorted(list(missing_columns))}")

    extracted_df = df[list(required_columns)].copy()

    # Clean recommendation scores (extract numbers)
    if 'recommendation_score' in extracted_df.columns:
        extracted_df['recommendation_score'] = pd.to_numeric(
            extracted_df['recommendation_score'].astype(str).str.extract(r'(\d+)', expand=False),
            errors='coerce'
        ).fillna(0)

    # Parse sessions attended into arrays
    if "sessions_attended" in extracted_df.columns:
        extracted_df["sessions_attended"] = (
            extracted_df["sessions_attended"].fillna("").astype(str)
            .apply(lambda s: [item.strip() for item in s.split(',')] if s else [])
        )

    # Clean text columns
    text_columns = ['positive_feedback', 'improvement_feedback', 'additional_comments']
    for col in text_columns:
        if col in extracted_df.columns:
            extracted_df[col] = extracted_df[col].fillna('No comment provided')

    return [dict(row) for row in extracted_df.to_dict(orient='records')]


def generate_data_summary(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generates summary statistics for frontend display.
    This helps the frontend show immediate insights without processing raw data.
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
        "common_feedback_themes": []
    }
    
    # Satisfaction distribution
    if 'satisfaction' in df.columns:
        satisfaction_counts = df['satisfaction'].value_counts().to_dict()
        summary["response_distribution"]["satisfaction"] = satisfaction_counts
    
    # Most popular sessions
    if 'sessions_attended' in df.columns:
        all_sessions = []
        for sessions in df['sessions_attended']:
            if isinstance(sessions, list):
                all_sessions.extend(sessions)
        
        if all_sessions:
            from collections import Counter
            session_counts = Counter(all_sessions)
            summary["most_attended_sessions"] = [
                {"session": session, "count": count} 
                for session, count in session_counts.most_common(5)
            ]
    
    return summary


def save_processed_data(data: List[Dict[str, Any]], filename_prefix: str = "processed") -> str:
    """
    Saves processed data to temporary location for download.
    Returns the file path for serving to user.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{filename_prefix}_{timestamp}.json"
    
    # Save to temp directory (Vercel will handle cleanup)
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({
            "processed_at": datetime.now().isoformat(),
            "total_records": len(data),
            "data": data
        }, f, indent=2, ensure_ascii=False)
    
    return file_path