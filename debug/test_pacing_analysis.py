#!/usr/bin/env python3
"""
Debug script to test pacing analysis
"""

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.insights import generate_pacing_analysis
import json

# Load test data
print("Loading test data...")
data = extract_feedback_data('test_data/feedback_forms-3.csv')
print(f"Loaded {len(data)} records\n")

# Test pacing analysis
print("Running pacing analysis...")
result = generate_pacing_analysis(data)

# Pretty print the result
print("\n=== PACING ANALYSIS RESULT ===")
print(json.dumps(result, indent=2))

# Check if there are any errors
if "error" in result:
    print(f"\n❌ ERROR: {result['error']}")
else:
    print(f"\n✅ Success! Found {len(result['data']['chart_data'])} pacing categories")
    print(f"Best pacing: {result['data']['stats']['best_pacing']}")
    print(f"Worst pacing: {result['data']['stats']['worst_pacing']}")
    print(f"\nInsights:")
    for insight in result['data']['insights']:
        print(f"  • {insight}")
