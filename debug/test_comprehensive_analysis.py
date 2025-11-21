#!/usr/bin/env python3
"""
Quick test script to verify comprehensive analysis generation
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.insights import generate_comprehensive_report

# Test with sample data
test_csv = "test_data/gdg_complete_test_data.csv"

if os.path.exists(test_csv):
    print(f"Testing with {test_csv}")
    
    # Extract data
    data = extract_feedback_data(test_csv)
    print(f"Extracted {len(data)} records")
    
    # Generate comprehensive analysis
    analysis = generate_comprehensive_report(data)
    
    print("\n=== COMPREHENSIVE ANALYSIS STRUCTURE ===")
    print("Keys:", analysis.keys())
    
    if 'nps' in analysis:
        print("\nNPS Analysis:")
        print(f"  - Chart type: {analysis['nps'].get('chart_type')}")
        print(f"  - Has data: {'data' in analysis['nps']}")
        if 'data' in analysis['nps']:
            nps_data = analysis['nps']['data']
            print(f"  - NPS Score: {nps_data.get('nps_score')}")
            print(f"  - NPS Category: {nps_data.get('nps_category')}")
            print(f"  - Values: {nps_data.get('values')}")
    
    if 'sessions' in analysis:
        print("\nSessions Analysis:")
        print(f"  - Chart type: {analysis['sessions'].get('chart_type')}")
        if 'data' in analysis['sessions']:
            sessions_data = analysis['sessions']['data']
            print(f"  - Has sessions: {'sessions' in sessions_data}")
            print(f"  - Has attendance: {'attendance' in sessions_data}")
    
    if 'ratings' in analysis:
        print("\nRatings Analysis:")
        print(f"  - Chart type: {analysis['ratings'].get('chart_type')}")
        if 'data' in analysis['ratings']:
            ratings_data = analysis['ratings']['data']
            print(f"  - Has aspects: {'aspects' in ratings_data}")
            print(f"  - Has averages: {'averages' in ratings_data}")
    
    print("\n=== TEST COMPLETE ===")
    
else:
    print(f"Test CSV not found: {test_csv}")
    print("Available files:")
    for file in os.listdir("test_data"):
        if file.endswith('.csv'):
            print(f"  - {file}")