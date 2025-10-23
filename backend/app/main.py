"""
Main API entry point for the Feedback Form Analyzer.
This creates a simple Flask API that your frontend can call.
"""

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from backend.app.csv_handling import process_feedback_csv, validate_csv_content
from backend.analysis import generate_comprehensive_report
from backend.processing.feedback_service import extract_feedback_data
from backend.utils.file_helpers import get_default_csv_path
from backend.gemini.gemini_service import get_gemini_service

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
    Quick test endpoint using sample data - auto-loads test CSV without upload.
    Returns same structure as /api/upload for frontend compatibility.
    """
    try:
        csv_path = get_default_csv_path()
        if not os.path.exists(csv_path):
            # Try alternative paths in test_data folder
            for alt_path in ['test_data/feedback_forms-1.csv', 'test_data/feedback_forms-3.csv', 'feedback_forms-1.csv']:
                if os.path.exists(alt_path):
                    csv_path = alt_path
                    break
        
        if not os.path.exists(csv_path):
            return jsonify({
                "success": False,
                "error": "No sample CSV file found in test_data folder"
            }), 404
        
        # Read CSV file content
        with open(csv_path, 'rb') as f:
            file_content = f.read()
        
        # Process using same pipeline as upload endpoint
        result = process_feedback_csv(file_content)
        
        # Add test indicator
        if result.get('success'):
            result['test_mode'] = True
            result['message'] = f"✨ Quick Test loaded with {result['summary']['total_responses']} sample responses"
        
        return jsonify(result)
    
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

@app.route('/api/ai/session-insights', methods=['POST'])
def generate_session_insights():
    """
    Generate AI-powered insights for session performance matrix.
    Uses Gemini to analyze session quadrant data and provide strategic recommendations.
    """
    try:
        data = request.get_json()
        
        if not data or 'session_data' not in data:
            return jsonify({
                "success": False,
                "error": "No session data provided"
            }), 400
        
        # Wrap session array in expected format for Gemini service
        session_payload = {
            'sessions': data['session_data'],
            'quadrants': data.get('quadrants', {}),
            'stats': data.get('stats', {})
        }
        
        # Initialize Gemini service
        gemini_service = get_gemini_service()
        
        # Generate session-specific AI insights
        ai_insights = gemini_service.generate_session_insights(session_payload)
        
        return jsonify({
            "success": True,
            "insights": ai_insights
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to generate session insights",
            "message": str(e)
        }), 500

@app.route('/api/ai/marketing-insights', methods=['POST'])
def generate_marketing_insights():
    """
    Generate AI-powered insights for discovery channel impact.
    Uses Gemini to analyze marketing attribution and ROI recommendations.
    """
    try:
        data = request.get_json()
        
        if not data or 'channel_data' not in data:
            return jsonify({
                "success": False,
                "error": "No channel data provided"
            }), 400
        
        # Wrap channel array in expected format for Gemini service
        channel_payload = {
            'channels': data['channel_data'],
            'stats': data.get('stats', {})
        }
        
        # Initialize Gemini service
        gemini_service = get_gemini_service()
        
        # Generate marketing-specific AI insights
        ai_insights = gemini_service.generate_marketing_insights(channel_payload)
        
        return jsonify({
            "success": True,
            "insights": ai_insights
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to generate marketing insights",
            "message": str(e)
        }), 500


@app.route('/api/ai/aspect-insights', methods=['POST'])
def generate_aspect_insights():
    """
    Generate AI-powered insights for event aspect performance.
    Uses Gemini to analyze which aspects (food, venue, content) are strengths/weaknesses.
    """
    try:
        data = request.get_json()
        
        if not data or 'aspect_data' not in data:
            return jsonify({
                "success": False,
                "error": "No aspect data provided"
            }), 400
        
        # Aspect data should include: aspects array + overall_satisfaction
        aspect_payload = data['aspect_data']
        
        # Initialize Gemini service
        gemini_service = get_gemini_service()
        
        # Generate aspect-specific AI insights
        ai_insights = gemini_service.generate_aspect_insights(aspect_payload)
        
        return jsonify({
            "success": True,
            "insights": ai_insights
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to generate aspect insights",
            "message": str(e)
        }), 500

