#!/usr/bin/env python
"""Debug script to test correlation analysis implementation"""

import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.insights import generate_correlation_analysis

# Test with sample CSV
print("=== Testing Correlation Analysis ===\n")

try:
    # Extract data from test CSV
    with open('test_data/feedback_forms-3.csv', 'rb') as f:
        data = extract_feedback_data(f)
    
    print(f"Loaded {len(data)} feedback entries\n")
    
    # Generate correlation analysis
    correlation_result = generate_correlation_analysis(data)
    
    if "error" in correlation_result:
        print(f"Error: {correlation_result['error']}")
    else:
        print("Correlation Analysis Generated Successfully!\n")
        
        # Display correlations
        print("CORRELATION STRENGTHS:")
        print("-" * 50)
        for corr in correlation_result['data']['correlations']:
            print(f"  {corr['aspect']:15} | {corr['correlation']:6.2%} | Impact: {corr['impact_level'].upper()}")
        
        print(f"\nSTRONGEST DRIVER: {correlation_result['data']['stats']['strongest_driver']}")
        print(f"Correlation: {correlation_result['data']['stats']['strongest_correlation']:.2%}\n")
        
        # Display insights
        if correlation_result['data']['insights']:
            print("KEY INSIGHTS:")
            print("-" * 50)
            for insight in correlation_result['data']['insights']:
                print(f"  • {insight}")
        
        print("\nTest passed! Correlation analysis working correctly.")

except FileNotFoundError:
    print("Test CSV file not found")
except Exception as e:
    print(f"Test failed: {e}")
    import traceback
    traceback.print_exc()
