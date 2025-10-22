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
import io
from backend.processing.feedback_service import extract_feedback_data
# Import the summary and analysis functions from the analysis package
from backend.analysis import generate_initial_summary, generate_comprehensive_report


def validate_csv_content(file_content: bytes) -> Dict[str, Any]:
    """
    Validates CSV content from uploaded file bytes.
    Returns validation result without requiring file system access.
    """
    try:
        # Use an in-memory buffer to validate the CSV without writing to disk
        pd.read_csv(io.BytesIO(file_content), nrows=1)
        return {"valid": True, "message": "File content is valid CSV"}
    except Exception as e:
        return {"valid": False, "message": f"Invalid CSV format: {str(e)}"}


def process_feedback_csv(file_content: bytes) -> Dict[str, Any]:
    """
    Processes CSV file content for web API.
    Returns standardized response with success/error status and data.
    """
    try:
        # Create an in-memory file-like object for pandas
        file_buffer = io.BytesIO(file_content)
        # Process the buffer using the existing logic
        extracted_data = extract_feedback_data(file_buffer)

        # Generate summary statistics for the frontend
        summary = generate_initial_summary(extracted_data)
        
        # Generate comprehensive analysis for charts
        comprehensive_analysis = generate_comprehensive_report(extracted_data)
        
        # Debug logging to see what we're returning
        print(f"DEBUG: Generated comprehensive analysis with keys: {comprehensive_analysis.keys()}")
        print(f"DEBUG: NPS analysis: {comprehensive_analysis.get('nps', {}).get('data', {})}")
        print(f"DEBUG: Sessions analysis: {comprehensive_analysis.get('sessions', {}).get('data', {})}")
        
        result = {
            "success": True,
            "message": "CSV processed successfully",
            "data": extracted_data,
            "summary": summary,
            "timestamp": datetime.now().isoformat(),
            **comprehensive_analysis  # Spread comprehensive analysis at root level
        }
        
        return result
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


def save_processed_data(data: List[Dict[str, Any]], filename_prefix: str = "processed") -> str:
    """
    Saves processed data to temporary location for download.
    Returns the file path for serving to user.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{filename_prefix}_{timestamp}.json"
    

    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({
            "processed_at": datetime.now().isoformat(),
            "total_records": len(data),
            "data": data
        }, f, indent=2, ensure_ascii=False)
    
    return file_path