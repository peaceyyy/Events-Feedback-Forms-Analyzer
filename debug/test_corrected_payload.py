#!/usr/bin/env python3
"""
Quick test for corrected AI endpoint payloads
"""

import requests
import json

BASE_URL = "http://localhost:5000"

# Test session insights with CORRECT payload format
session_payload = {
    "session_data": [
        {
            "session": "Introduction to Python",
            "attendance": 45,
            "avg_satisfaction": 4.2,
            "response_count": 30,
            "category": "Star",
            "color": "#10b981"
        },
        {
            "session": "Advanced React Hooks",
            "attendance": 20,
            "avg_satisfaction": 4.8,
            "response_count": 18,
            "category": "Hidden Gem",
            "color": "#8b5cf6"
        }
    ],
    "quadrants": {
        "stars": 1,
        "hidden_gems": 1,
        "crowd_favorites": 0,
        "needs_improvement": 0
    },
    "stats": {
        "total_sessions": 2,
        "avg_attendance": 32.5,
        "avg_satisfaction": 4.5
    }
}

print("🧪 Testing Session Insights with corrected payload...")
print(f"POST {BASE_URL}/api/ai/session-insights\n")

try:
    response = requests.post(
        f"{BASE_URL}/api/ai/session-insights",
        json=session_payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}\n")
    result = response.json()
    
    if result.get("success"):
        print("✅ SUCCESS!\n")
        print("AI INSIGHTS:")
        print(json.dumps(result.get("insights"), indent=2))
    else:
        print(f"❌ ERROR: {result.get('error')}")
        if 'message' in result:
            print(f"Message: {result['message']}")
            
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
