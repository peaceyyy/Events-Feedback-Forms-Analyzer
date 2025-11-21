"""
Final comprehensive extraction test for GDG complete test data.
Tests all column mappings, pacing normalization, PII removal, and metadata preservation.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.processing.feedback_service import extract_feedback_data
import json

def test_final_extraction():
    print("=" * 80)
    print("FINAL COMPREHENSIVE EXTRACTION TEST")
    print("=" * 80)
    
    test_file = "test_data/gdg_complete_test_data.csv"
    
    if not os.path.exists(test_file):
        print(f"❌ Test file not found: {test_file}")
        return
    
    print(f"\n📂 Testing file: {test_file}")
    
    try:
        # Extract data
        extracted_data = extract_feedback_data(test_file)
        
        print(f"\n✅ Successfully extracted {len(extracted_data)} responses")
        
        if not extracted_data:
            print("⚠️  No data extracted!")
            return
        
        # Show first response with all fields
        print("\n" + "=" * 80)
        print("SAMPLE EXTRACTED RESPONSE (First Record)")
        print("=" * 80)
        sample = extracted_data[0]
        
        # Group fields by category for better readability
        print("\n📊 CORE RATINGS (1-5 scale):")
        rating_fields = ['satisfaction', 'content_rating', 'speaker_rating', 'venue_rating', 'pacing']
        for field in rating_fields:
            if field in sample:
                print(f"  • {field}: {sample[field]}")
        
        print("\n📈 RECOMMENDATION (0-10 scale):")
        if 'recommendation_score' in sample:
            print(f"  • recommendation_score: {sample['recommendation_score']}")
        
        print("\n💬 TEXT FEEDBACK:")
        text_fields = ['positive_feedback', 'improvement_feedback', 'additional_comments']
        for field in text_fields:
            if field in sample:
                value = sample[field]
                display_value = value[:60] + "..." if len(str(value)) > 60 else value
                print(f"  • {field}: {display_value}")
        
        print("\n🎯 OPTIONAL PROFILE/PREFERENCES:")
        optional_fields = ['course_year', 'would_join', 'gained_insights', 'plan_to_implement', 
                          'felt_included', 'preferred_time', 'event_discovery', 'one_word_desc']
        for field in optional_fields:
            if field in sample:
                print(f"  • {field}: {sample[field]}")
        
        print("\n📍 EVENT METADATA:")
        metadata_fields = ['event_name', 'event_date', 'event_type', 'chapter', 'chapter_country', 'city']
        for field in metadata_fields:
            if field in sample:
                value = sample[field]
                display_value = value[:50] + "..." if len(str(value)) > 50 else value
                print(f"  • {field}: {display_value}")
        
        # Validation checks
        print("\n" + "=" * 80)
        print("VALIDATION CHECKS")
        print("=" * 80)
        
        # Check required fields
        required_fields = ['satisfaction', 'recommendation_score', 'venue_rating', 
                          'speaker_rating', 'content_rating', 'pacing',
                          'positive_feedback', 'improvement_feedback']
        
        missing_required = [f for f in required_fields if f not in sample]
        if missing_required:
            print(f"❌ Missing required fields: {missing_required}")
        else:
            print("✅ All required fields present")
        
        # Check PII removal
        pii_fields = ['First Name', 'Last Name', 'Email', 'User ID', 'Attendee ID']
        pii_found = [f for f in pii_fields if f in sample]
        if pii_found:
            print(f"❌ PII fields still present: {pii_found}")
        else:
            print("✅ All PII fields removed")
        
        # Validate rating ranges
        print("\n📏 RATING RANGE VALIDATION:")
        
        # Check 1-5 scale fields
        for field in ['satisfaction', 'venue_rating', 'speaker_rating', 'content_rating', 'pacing']:
            if field in sample:
                value = sample[field]
                if 1 <= value <= 5:
                    print(f"  ✓ {field}: {value} (valid 1-5 range)")
                else:
                    print(f"  ✗ {field}: {value} (INVALID - outside 1-5 range)")
        
        # Check 0-10 scale for recommendation
        if 'recommendation_score' in sample:
            value = sample['recommendation_score']
            if 0 <= value <= 10:
                print(f"  ✓ recommendation_score: {value} (valid 0-10 range)")
            else:
                print(f"  ✗ recommendation_score: {value} (INVALID - outside 0-10 range)")
        
        # Test pacing normalization specifically
        print("\n⚙️  PACING NORMALIZATION TEST:")
        pacing_values = [r['pacing'] for r in extracted_data if 'pacing' in r]
        if pacing_values:
            min_pacing = min(pacing_values)
            max_pacing = max(pacing_values)
            print(f"  • Pacing range: {min_pacing} to {max_pacing}")
            if max_pacing <= 5:
                print("  ✅ All pacing values normalized to 1-5 scale")
            else:
                print(f"  ❌ Some pacing values exceed 5 (max: {max_pacing})")
        
        # Show all extracted field names
        print("\n" + "=" * 80)
        print("ALL EXTRACTED FIELDS")
        print("=" * 80)
        all_fields = sorted(set(k for record in extracted_data for k in record.keys()))
        print(f"\nTotal unique fields: {len(all_fields)}")
        for i, field in enumerate(all_fields, 1):
            print(f"  {i:2d}. {field}")
        
        # Summary statistics
        print("\n" + "=" * 80)
        print("SUMMARY STATISTICS")
        print("=" * 80)
        print(f"  • Total responses: {len(extracted_data)}")
        print(f"  • Unique fields extracted: {len(all_fields)}")
        print(f"  • Required fields: {len(required_fields)}")
        print(f"  • Optional fields available: {len(all_fields) - len(required_fields)}")
        
        # Final verdict
        print("\n" + "=" * 80)
        all_valid = (
            not missing_required and
            not pii_found and
            max_pacing <= 5
        )
        if all_valid:
            print("✅ TEST PASSED - All validations successful!")
        else:
            print("⚠️  TEST COMPLETED WITH WARNINGS - Review issues above")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ ERROR during extraction:")
        print(f"   {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_final_extraction()
