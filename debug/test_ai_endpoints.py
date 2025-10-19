#!/usr/bin/env python3
"""
Test script for AI insights API endpoints
Tests session insights and marketing insights generation
"""

import requests
import json

BASE_URL = "http://localhost:5000"

# Sample session data
SESSION_DATA = [
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
    },
    {
        "session": "Git Workshop",
        "attendance": 60,
        "avg_satisfaction": 3.9,
        "response_count": 55,
        "category": "Crowd Favorite",
        "color": "#3b82f6"
    }
]

# Sample channel data
CHANNEL_DATA = [
    {
        "event_discovery": "Social Media",
        "avg_satisfaction": 4.5,
        "count": 120,
        "std_dev": 0.5,
        "effectiveness_score": 85.5
    },
    {
        "event_discovery": "Friend Referral",
        "avg_satisfaction": 4.7,
        "count": 80,
        "std_dev": 0.3,
        "effectiveness_score": 90.2
    },
    {
        "event_discovery": "Email Campaign",
        "avg_satisfaction": 3.8,
        "count": 150,
        "std_dev": 0.7,
        "effectiveness_score": 72.1
    }
]

def test_session_insights():
    """Test session insights endpoint"""
    print("\n" + "="*60)
    print("TESTING SESSION INSIGHTS ENDPOINT")
    print("="*60 + "\n")
    
    endpoint = f"{BASE_URL}/api/ai/session-insights"
    payload = {"session_data": SESSION_DATA}
    
    try:
        print(f"POST {endpoint}")
        print(f"Request payload: {json.dumps(payload, indent=2)}\n")
        
        response = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        if result.get("success"):
            print("\n✅ SUCCESS!\n")
            print("AI INSIGHTS:")
            insights = result.get("insights", {})
            
            if "key_insights" in insights:
                print("\n🔑 Key Insights:")
                for i, insight in enumerate(insights["key_insights"], 1):
                    print(f"  {i}. {insight}")
            
            if "strategic_recommendations" in insights:
                print("\n🎯 Strategic Recommendations:")
                for i, rec in enumerate(insights["strategic_recommendations"], 1):
                    print(f"  {i}. {rec}")
            
            if "growth_opportunities" in insights:
                print("\n💡 Growth Opportunities:")
                for i, opp in enumerate(insights["growth_opportunities"], 1):
                    print(f"  {i}. {opp}")
            
            if "risk_areas" in insights:
                print("\n⚠️ Risk Areas:")
                for i, risk in enumerate(insights["risk_areas"], 1):
                    print(f"  {i}. {risk}")
        else:
            print(f"\n❌ ERROR: {result.get('error')}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to backend server")
        print("Make sure the Flask server is running: python run_server.py")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def test_marketing_insights():
    """Test marketing insights endpoint"""
    print("\n" + "="*60)
    print("TESTING MARKETING INSIGHTS ENDPOINT")
    print("="*60 + "\n")
    
    endpoint = f"{BASE_URL}/api/ai/marketing-insights"
    payload = {"channel_data": CHANNEL_DATA}
    
    try:
        print(f"POST {endpoint}")
        print(f"Request payload: {json.dumps(payload, indent=2)}\n")
        
        response = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        if result.get("success"):
            print("\n✅ SUCCESS!\n")
            print("AI MARKETING INSIGHTS:")
            insights = result.get("insights", {})
            
            if "key_insights" in insights:
                print("\n🔑 Key Insights:")
                for i, insight in enumerate(insights["key_insights"], 1):
                    print(f"  {i}. {insight}")
            
            if "marketing_recommendations" in insights:
                print("\n📢 Marketing Recommendations:")
                for i, rec in enumerate(insights["marketing_recommendations"], 1):
                    print(f"  {i}. {rec}")
            
            if "growth_opportunities" in insights:
                print("\n💡 Growth Opportunities:")
                for i, opp in enumerate(insights["growth_opportunities"], 1):
                    print(f"  {i}. {opp}")
            
            if "budget_allocation" in insights:
                print("\n💰 Budget Allocation:")
                for i, budget in enumerate(insights["budget_allocation"], 1):
                    print(f"  {i}. {budget}")
        else:
            print(f"\n❌ ERROR: {result.get('error')}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to backend server")
        print("Make sure the Flask server is running: python run_server.py")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def test_health_check():
    """Test backend health"""
    print("\n" + "="*60)
    print("BACKEND HEALTH CHECK")
    print("="*60 + "\n")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Backend server is running!")
            result = response.json()
            print(f"Status: {result.get('status')}")
            print(f"Message: {result.get('message')}")
            print(f"Version: {result.get('version')}")
            return True
        else:
            print(f"⚠️ Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running")
        print("Start it with: python run_server.py")
        return False

if __name__ == "__main__":
    print("\n🧪 AI INSIGHTS API TEST SUITE")
    
    # Health check first
    if test_health_check():
        # Run tests
        test_session_insights()
        test_marketing_insights()
        
        print("\n" + "="*60)
        print("TEST SUITE COMPLETE")
        print("="*60 + "\n")
    else:
        print("\n⚠️ Skipping tests - backend not available\n")
