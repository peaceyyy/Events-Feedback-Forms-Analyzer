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
import logging

logger = logging.getLogger(__name__)


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
        logger.info("Root keys: %s", list(result.keys()))
        logger.info("success: %s", result['success'])
        logger.info("data: %s records", len(result.get('data', [])))
        logger.info("summary keys: %s", list(result.get('summary', {}).keys()))

        # Log each analysis section
        for key in result.keys():
            if key not in ['success', 'message', 'data', 'summary', 'timestamp']:
                section = result[key]
                if isinstance(section, dict):
                    logger.info("%s: %s", key, list(section.keys()))
        logger.info("%s", "=" * 80)
        
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