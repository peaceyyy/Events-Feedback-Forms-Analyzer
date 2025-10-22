#!/usr/bin/env python3
"""
Quick test to verify Gemini API integration works correctly.
Run this to test your setup before using the full application.
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all required packages can be imported"""
    print("Testing package imports...")
    
    try:
        import google.generativeai as genai
        print("google-generativeai imported successfully")
    except ImportError as e:
        print(f"google-generativeai import failed: {e}")
        return False
    
    try:
        from dotenv import load_dotenv
        print("python-dotenv imported successfully")
    except ImportError as e:
        print(f"python-dotenv import failed: {e}")
        return False
    
    return True

def test_environment():
    """Test if environment variables are configured"""
    print("\nTesting environment configuration...")
    
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("GEMINI_API_KEY not found in environment")
        print("Solution: Add your API key to .env file")
        return False
    
    if api_key.startswith('your_'):
        print("GEMINI_API_KEY still contains placeholder value")
        print("Solution: Replace with your actual API key from Google AI Studio")
        return False
    
    print(f"GEMINI_API_KEY found (ends with: ...{api_key[-6:]})")
    return True

def test_gemini_connection():
    """Test if Gemini API connection works"""
    print("\nTesting Gemini API connection...")
    
    try:
        from backend.gemini.gemini_service import get_gemini_service
        
        # Create service instance
        service = get_gemini_service()
        
        # Test with minimal data
        test_data = [
            {"positive_feedback": "Great event, loved the presentations!", "improvement_feedback": "Could use better wifi"},
            {"positive_feedback": "Amazing speakers", "improvement_feedback": "Food was cold"}
        ]
        
        print("Testing sentiment analysis...")
        result = service.generate_sentiment_analysis(test_data)
        
        if 'error' in result:
            print(f"Sentiment analysis failed: {result['error']}")
            return False
        
        print("Sentiment analysis successful!")
        print(f"   Analyzed {result.get('total_analyzed', 0)} text fields")
        
        return True
        
    except Exception as e:
        print(f"Gemini connection failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Gemini Integration Test Suite")
    print("=" * 40)
    
    # Run tests
    imports_ok = test_imports()
    env_ok = test_environment()
    
    if not imports_ok or not env_ok:
        print("\nSetup incomplete. Please fix the issues above.")
        return
    
    connection_ok = test_gemini_connection()
    
    print("\n" + "=" * 40)
    if connection_ok:
        print("All tests passed! Gemini integration is ready.")
        print("You can now run the full application.")
    else:
        print("Some tests failed. Please check your configuration.")

if __name__ == '__main__':
    main()