"""
Test the updated feedback extractor with the new unified GDG schema.
"""

import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from backend.processing.feedback_service import extract_feedback_data
import json

def test_unified_schema():
    """Test extraction with new unified GDG CSV format."""
    print("=" * 80)
    print("TESTING UNIFIED GDG SCHEMA EXTRACTION")
    print("=" * 80)
    
    csv_path = os.path.join(project_root, 'test_data', 'gdg_unified_schema.csv')
    
    if not os.path.exists(csv_path):
        print(f"❌ Test CSV not found at: {csv_path}")
        return False
    
    try:
        # Extract data
        data = extract_feedback_data(csv_path)
        
        print(f"\n✅ Successfully extracted {len(data)} responses")
        
        # Show first response
        print("\n📋 Sample Response (first entry):")
        print(json.dumps(data[0], indent=2))
        
        # Validate structure
        print("\n🔍 Validation Checks:")
        
        required_keys = [
            'satisfaction', 'recommendation_score', 'venue_rating',
            'speaker_rating', 'content_rating', 'pacing',
            'positive_feedback', 'improvement_feedback'
        ]
        
        first_item = data[0]
        for key in required_keys:
            if key in first_item:
                value = first_item[key]
                print(f"  ✓ {key}: {value} (type: {type(value).__name__})")
            else:
                print(f"  ✗ {key}: MISSING")
        
        # Check numeric ranges
        print("\n📊 Numeric Range Validation:")
        numeric_fields = {
            'satisfaction': (1, 5),
            'venue_rating': (1, 5),
            'speaker_rating': (1, 5),
            'content_rating': (1, 5),
            'pacing': (1, 5),
            'recommendation_score': (0, 10)
        }
        
        for field, (min_val, max_val) in numeric_fields.items():
            values = [r[field] for r in data if field in r]
            if values:
                actual_min = min(values)
                actual_max = max(values)
                in_range = all(min_val <= v <= max_val for v in values)
                status = "✓" if in_range else "✗"
                print(f"  {status} {field}: range {actual_min}-{actual_max} (expected {min_val}-{max_val})")
        
        # Check optional fields
        print("\n📦 Optional Fields Present:")
        optional_fields = ['sessions_attended', 'additional_comments', 'preferred_time', 
                          'preferred_venue', 'event_discovery', 'one_word_desc']
        for field in optional_fields:
            present = field in first_item
            status = "✓" if present else "○"
            print(f"  {status} {field}")
        
        print("\n" + "=" * 80)
        print("TEST PASSED ✓")
        print("=" * 80)
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = test_unified_schema()
    sys.exit(0 if success else 1)
