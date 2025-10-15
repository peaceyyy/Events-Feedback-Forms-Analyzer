#!/usr/bin/env python3
"""
Test individual Gemini components for development
Run this to test just one component at a time for faster iteration
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.analysis.gemini_service import GeminiAnalysisService

# Sample test data
test_data = [
    {
        "positive_feedback": "Great event, loved the presentations and networking opportunities!",
        "improvement_feedback": "Could use better wifi and more parking spaces",
        "additional_comments": "Overall fantastic experience, will definitely attend next year"
    },
    {
        "positive_feedback": "Amazing speakers, very knowledgeable and engaging",
        "improvement_feedback": "Food was cold and venue was too crowded",
        "additional_comments": "Content was excellent but logistics need work"
    },
    {
        "positive_feedback": "Excellent organization and smooth registration process",
        "improvement_feedback": "Sessions ran over time, better time management needed",
        "additional_comments": "Great learning experience"
    }
]

def test_component(component_name: str):
    """Test a specific Gemini component"""
    print(f"🧪 Testing {component_name}")
    print("=" * 50)
    
    service = GeminiAnalysisService(dev_mode=True)
    
    if component_name == "sentiment":
        result = service.generate_sentiment_analysis(test_data)
    elif component_name == "themes":
        result = service.generate_theme_extraction(test_data)
    elif component_name == "insights":
        # Mock analysis results for strategic insights
        mock_analysis = {
            "satisfaction": {"data": {"stats": {"average": 4.2}}},
            "nps": {"data": {"nps_score": 42, "nps_category": "Good"}}
        }
        result = service.generate_actionable_insights(test_data, mock_analysis)
    else:
        print("❌ Unknown component. Use: sentiment, themes, or insights")
        return
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
    else:
        print("✅ Success!")
        print(f"📊 Result keys: {list(result.keys())}")
        if 'data' in result:
            print(f"📋 Data keys: {list(result['data'].keys())}")
        
        # Show sample output
        import json
        print("\n📄 Sample output:")
        print(json.dumps(result, indent=2)[:500] + "..." if len(str(result)) > 500 else json.dumps(result, indent=2))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        test_component(sys.argv[1])
    else:
        print("🧪 Individual Component Tester")
        print("Usage:")
        print("  python test_individual.py sentiment")
        print("  python test_individual.py themes") 
        print("  python test_individual.py insights")
        print()
        print("This tests each component individually for faster development.")