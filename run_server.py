#!/usr/bin/env python
"""
Simple script to run the Flask API server.
This handles import paths correctly for conda environments.
"""

import sys
import os

# Add the project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)


from backend.app.main import app

if __name__ == '__main__':
    print("Starting Feedback Form Analyzer API...")
    # List available endpoints and their descriptions
    print("Available endpoints:")
    print("  GET  /                  - Health check (returns status of the API)")
    print("  POST /api/upload        - Upload CSV file (accepts feedback data for analysis)")
    print("  POST /api/analyze       - Analyze processed data (returns analysis results)")
    print("  POST /api/ai-analysis   - Generate AI-powered insights using Gemini")
    print("  GET  /api/test          - Test with sample data (runs analysis on sample data)")
    print()
    print("🌐 API will be available at: http://localhost:5000")
    print("🔧 Use Ctrl+C to stop the server")
    print("=" * 50)
    
 
    app.run(debug=True, host='0.0.0.0', port=5000)