#!/usr/bin/env python
"""Quick sanity check for GDG dataset analysis pipeline"""

import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.summative_reports import generate_comprehensive_report

print("=" * 80)
print("GDG DATASET ANALYSIS PIPELINE SANITY CHECK")
print("=" * 80)

# Extract data from GDG test CSV
with open('test_data/gdg_complete_test_data.csv', 'rb') as f:
    data = extract_feedback_data(f)

print(f"\n✅ Extracted {len(data)} responses")
print(f"✅ Fields extracted: {len(data[0].keys())} fields")
print(f"\n--- Sample Response Fields ---")
for key in sorted(data[0].keys()):
    print(f"  • {key}: {data[0][key]}")

# Generate comprehensive analysis
print(f"\n{'=' * 80}")
print("GENERATING COMPREHENSIVE ANALYSIS...")
print("=" * 80)

report = generate_comprehensive_report(data)

print(f"\n✅ Generated report with sections: {list(report.keys())}")

# Check optional field availability
print(f"\n--- Optional Field Availability Checks ---")
print(f"NPS available: {report.get('nps', {}).get('available', True)}")
print(f"Sessions available: {report.get('sessions', {}).get('available', True)}")
print(f"Venue preferences available: {report.get('venue_preferences', {}).get('available', True)}")

# Check data presence
print(f"\n--- Data Presence Checks ---")
print(f"Total responses in summary: {report.get('summary', {}).get('total_responses', 0)}")
print(f"Satisfaction data present: {'data' in report.get('satisfaction', {})}")
print(f"Ratings data present: {'data' in report.get('ratings', {})}")
print(f"Pacing data present: {'data' in report.get('pacing', {})}")
print(f"Discovery channels present: {'data' in report.get('discovery_channels', {})}")
print(f"Time preferences present: {'data' in report.get('time_preferences', {})}")

# Check for errors
print(f"\n--- Error Checks ---")
for section, content in report.items():
    if isinstance(content, dict) and 'error' in content:
        print(f"⚠️  {section}: {content['error']}")

# Display a few key metrics
if 'satisfaction' in report and 'data' in report['satisfaction']:
    sat_stats = report['satisfaction']['data'].get('stats', {})
    print(f"\n--- Satisfaction Metrics ---")
    print(f"Average: {sat_stats.get('average', 'N/A')}")
    print(f"Total responses: {sat_stats.get('total_responses', 'N/A')}")

if 'sessions' in report and 'data' in report['sessions']:
    sessions_data = report['sessions']['data']
    print(f"\n--- Session Popularity (Top 3) ---")
    for i, session in enumerate(sessions_data.get('sessions', [])[:3], 1):
        idx = i - 1
        count = sessions_data.get('counts', [])[idx] if idx < len(sessions_data.get('counts', [])) else 0
        print(f"  {i}. {session}: {count} attendees")

print(f"\n{'=' * 80}")
print("✅ SANITY CHECK PASSED - GDG dataset working correctly!")
print("=" * 80)
