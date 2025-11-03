"""
Debug script to test Time Slot and Venue Modality Preference analytics.

Tests:
1. Time slot preference distribution
2. Venue/modality preference analysis
3. Satisfaction correlation with preferences
"""

import sys
import os
import json

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.session_analytics import (
    generate_time_slot_preferences,
    generate_venue_modality_preferences
)


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 80)
    print(f" {title}")
    print("=" * 80 + "\n")


def test_time_slot_preferences():
    """Test time slot preference analysis"""
    print_section("TIME SLOT PREFERENCES ANALYSIS")
    
    # Load test data
    csv_path = "test_data/feedback_forms-1.csv"
    print(f"📂 Loading CSV: {csv_path}")
    
    try:
        data = extract_feedback_data(csv_path)
        print(f"✅ Loaded {len(data)} responses\n")
        
        # Generate time slot analysis
        print("🔍 Analyzing time slot preferences...")
        result = generate_time_slot_preferences(data)
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
            return
        
        print("✅ Analysis complete!\n")
        
        # Display results
        stats = result['data']['stats']
        distribution = result['data']['distribution']
        satisfaction_by_time = result['data'].get('satisfaction_by_time', {})
        
        print("📊 STATISTICS:")
        print(f"   Total Responses: {stats['total_responses']}")
        print(f"   Specified Preferences: {stats['specified_responses']}")
        print(f"   Unique Time Slots: {stats['unique_time_slots']}")
        
        if stats.get('most_popular'):
            mp = stats['most_popular']
            print(f"\n   🏆 Most Popular: {mp['time_slot']} ({mp['count']} responses, {mp['percentage']}%)")
        
        if stats.get('least_popular'):
            lp = stats['least_popular']
            print(f"   📉 Least Popular: {lp['time_slot']} ({lp['count']} responses, {lp['percentage']}%)")
        
        print("\n📈 DISTRIBUTION:")
        for item in distribution:
            sat_info = f" | Avg Satisfaction: {satisfaction_by_time.get(item['time_slot'], 'N/A')}" if satisfaction_by_time else ""
            print(f"   {item['time_slot']:<25} {item['count']:>3} responses ({item['percentage']:>5.1f}%){sat_info}")
        
        print("\n📋 FULL JSON OUTPUT:")
        print(json.dumps(result, indent=2))
        
    except FileNotFoundError:
        print(f"❌ File not found: {csv_path}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


def test_venue_modality_preferences():
    """Test venue and modality preference analysis"""
    print_section("VENUE & MODALITY PREFERENCES ANALYSIS")
    
    # Load test data
    csv_path = "test_data/feedback_forms-1.csv"
    print(f"📂 Loading CSV: {csv_path}")
    
    try:
        data = extract_feedback_data(csv_path)
        print(f"✅ Loaded {len(data)} responses\n")
        
        # Generate venue analysis
        print("🔍 Analyzing venue/modality preferences...")
        result = generate_venue_modality_preferences(data)
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
            return
        
        print("✅ Analysis complete!\n")
        
        # Display results
        stats = result['data']['stats']
        venue_dist = result['data']['venue_distribution']
        modality_breakdown = result['data']['modality_breakdown']
        satisfaction_by_venue = result['data'].get('satisfaction_by_venue', {})
        
        print("📊 STATISTICS:")
        print(f"   Total Responses: {stats['total_responses']}")
        print(f"   Specified Preferences: {stats['specified_responses']}")
        print(f"   Unique Venues: {stats['unique_venues']}")
        print(f"   Online Preferences: {stats['online_preference_count']}")
        print(f"   In-Person Preferences: {stats['in_person_preference_count']}")
        
        if stats.get('most_popular_venue'):
            mp = stats['most_popular_venue']
            print(f"\n   🏆 Most Popular Venue: {mp['venue_type']} ({mp['count']} responses, {mp['percentage']}%)")
        
        if stats.get('least_popular_venue'):
            lp = stats['least_popular_venue']
            print(f"   📉 Least Popular Venue: {lp['venue_type']} ({lp['count']} responses, {lp['percentage']}%)")
        
        print("\n🔄 MODALITY BREAKDOWN:")
        for item in modality_breakdown:
            print(f"   {item['modality']:<15} {item['count']:>3} responses ({item['percentage']:>5.1f}%)")
        
        print("\n🏢 VENUE DISTRIBUTION:")
        for item in venue_dist:
            sat_info = f" | Avg Satisfaction: {satisfaction_by_venue.get(item['venue_type'], 'N/A')}" if satisfaction_by_venue else ""
            print(f"   {item['venue_type']:<20} [{item['modality']:<10}] {item['count']:>3} ({item['percentage']:>5.1f}%){sat_info}")
        
        print("\n📋 FULL JSON OUTPUT:")
        print(json.dumps(result, indent=2))
        
    except FileNotFoundError:
        print(f"❌ File not found: {csv_path}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


def test_with_multiple_datasets():
    """Test with both CSV files to ensure consistency"""
    print_section("MULTI-DATASET VALIDATION")
    
    csv_files = [
        "test_data/feedback_forms-1.csv",
        "test_data/feedback_forms-3.csv"
    ]
    
    for csv_path in csv_files:
        print(f"\n📂 Testing with: {csv_path}")
        print("-" * 80)
        
        try:
            data = extract_feedback_data(csv_path)
            print(f"✅ Loaded {len(data)} responses")
            
            # Quick time slot check
            time_result = generate_time_slot_preferences(data)
            if "error" not in time_result:
                stats = time_result['data']['stats']
                print(f"   Time Slots: {stats['unique_time_slots']} unique, {stats['specified_responses']} specified")
            else:
                print(f"   Time Slots: {time_result['error']}")
            
            # Quick venue check
            venue_result = generate_venue_modality_preferences(data)
            if "error" not in venue_result:
                stats = venue_result['data']['stats']
                print(f"   Venues: {stats['unique_venues']} unique, {stats['online_preference_count']} online, {stats['in_person_preference_count']} in-person")
            else:
                print(f"   Venues: {venue_result['error']}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")


if __name__ == "__main__":
    print("\n🚀 STARTING TIME SLOT & VENUE PREFERENCE ANALYTICS TESTS\n")
    
    # Run all tests
    test_time_slot_preferences()
    test_venue_modality_preferences()
    test_with_multiple_datasets()
    
    print("\n" + "=" * 80)
    print(" ✅ ALL TESTS COMPLETED")
    print("=" * 80 + "\n")
