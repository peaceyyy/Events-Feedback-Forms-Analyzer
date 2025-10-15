"""
Main API entry point for the Feedback Form Analyzer.
This creates a simple Flask API that your frontend can call.
"""

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from backend.app.handlers import process_feedback_csv, validate_csv_content
from backend.analysis.insights import generate_comprehensive_report
from backend.processing.feedback_service import extract_feedback_data
from backend.utils.file_helpers import get_default_csv_path
from backend.analysis.gemini_service import get_gemini_service

app = Flask(__name__)
CORS(app)  # Allow frontend to call this API

@app.route('/', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        "status": "iz good",
        "message": "Feedback Form Analyzer API is running",
        "version": "1.0.0"
    })

@app.route('/api/upload', methods=['POST'])
def upload_csv():
    """
    Handles CSV file upload and processing.
    Returns processed data and basic summary.
    """
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file uploaded"
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        # Validate file type
        if not file.filename.lower().endswith('.csv'):
            return jsonify({
                "success": False,
                "error": "File must be a CSV"
            }), 400
        
        # Read file content
        file_content = file.read()
        
        # Validate CSV content
        validation = validate_csv_content(file_content)
        if not validation["valid"]:
            return jsonify({
                "success": False,
                "error": validation["message"]
            }), 400
        
        # Process the CSV
        result = process_feedback_csv(file_content)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error",
            "message": str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    """
    Generates comprehensive analysis from processed data.
    Returns chart-ready data for frontend visualization.
    """
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'data' not in data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        # Generate comprehensive analysis
        analysis = generate_comprehensive_report(data['data'])
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Analysis error",
            "message": str(e)
        }), 500

@app.route('/api/test', methods=['GET'])
def test_with_sample():
    """
    Test endpoint using sample data - useful for development.
    """
    try:
        csv_path = get_default_csv_path()
        if not os.path.exists(csv_path):
            # Try alternative paths
            for alt_path in ['ai_studio_code.csv', 'feedback_forms-1.csv']:
                if os.path.exists(alt_path):
                    csv_path = alt_path
                    break
        
        if not os.path.exists(csv_path):
            return jsonify({
                "success": False,
                "error": "No sample CSV file found"
            }), 404
        
        # Process sample data
        data = extract_feedback_data(csv_path)
        analysis = generate_comprehensive_report(data)
        
        return jsonify({
            "success": True,
            "message": f"Test successful with {len(data)} records",
            "sample_data": data[:3],  # First 3 records
            "analysis": analysis
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Test failed",
            "message": str(e)
        }), 500

@app.route('/api/ai-analysis', methods=['POST'])
def ai_enhanced_analysis():
    """
    Generate AI-powered insights using Gemini API.
    Combines traditional analysis with AI-generated insights.
    """
    try:
        data = request.get_json()
        
        if not data or 'data' not in data:
            return jsonify({
                "success": False,
                "error": "No data provided"
            }), 400
        
        feedback_data = data['data']
        existing_analysis = data.get('analysis', {})
        
        # Initialize Gemini service
        gemini_service = get_gemini_service()
        
        # Generate AI insights
        ai_results = {}
        
        # Sentiment analysis
        ai_results['sentiment'] = gemini_service.generate_sentiment_analysis(feedback_data)
        
        # Theme extraction
        ai_results['themes'] = gemini_service.generate_theme_extraction(feedback_data)
        
        # Strategic insights (if we have existing analysis)
        if existing_analysis:
            ai_results['strategic_insights'] = gemini_service.generate_actionable_insights(
                feedback_data, existing_analysis
            )
        
        return jsonify({
            "success": True,
            "ai_analysis": ai_results
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "AI analysis failed",
            "message": str(e)
        }), 500
