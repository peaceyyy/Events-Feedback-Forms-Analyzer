"""
Test script for Session Performance Matrix and Discovery Channel Impact analysis
"""

import sys
sys.path.append('.')

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.insights import generate_session_performance_matrix, generate_discovery_channel_impact
import json

# Load test data
print("=" * 80)
print("TESTING SESSION & DISCOVERY CHANNEL ANALYTICS")
print("=" * 80)

data = extract_feedback_data('test_data/feedback_forms-3.csv')
print(f"\nLoaded {len(data)} responses\n")

# Test 1: Session Performance Matrix
print("=" * 80)
print("TEST 1: SESSION PERFORMANCE MATRIX")
print("=" * 80)
session_matrix = generate_session_performance_matrix(data)
print(json.dumps(session_matrix, indent=2))

# Test 2: Discovery Channel Impact
print("\n" + "=" * 80)
print("TEST 2: DISCOVERY CHANNEL IMPACT")
print("=" * 80)
discovery_impact = generate_discovery_channel_impact(data)
print(json.dumps(discovery_impact, indent=2))

print("\n" + "=" * 80)
print("✅ TESTS COMPLETE")
print("=" * 80)
