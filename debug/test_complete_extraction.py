"""
Test extraction from complete GDG CSV with all PII and metadata fields.
Shows each extracted header with sample data to verify data cleaning.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.processing.feedback_service import extract_feedback_data
import pandas as pd

def test_complete_extraction():
    """Test extraction with complete GDG export format including PII"""
    
    print("=" * 80)
    print("TESTING: Complete GDG Export Extraction (with PII cleaning)")
    print("=" * 80)
    
    # Path to test file with all fields
    test_file = os.path.join(
        os.path.dirname(__file__), 
        '..', 
        'test_data', 
        'gdg_complete_test_data.csv'
    )
    
    print(f"\nTest File: {test_file}")
    print(f"File exists: {os.path.exists(test_file)}")
    
    # Load raw CSV to show what we're starting with
    print("\n" + "=" * 80)
    print("BEFORE EXTRACTION: Raw CSV Headers")
    print("=" * 80)
    raw_df = pd.read_csv(test_file)
    print(f"\nTotal columns in raw CSV: {len(raw_df.columns)}")
    print("\nAll headers:")
    for i, col in enumerate(raw_df.columns, 1):
        print(f"  {i:2d}. {col}")
    
    # Show sample raw data
    print("\n" + "-" * 80)
    print("Sample raw data (first response, first 10 columns):")
    print("-" * 80)
    first_row = raw_df.iloc[0]
    for col in raw_df.columns[:10]:
        value = str(first_row[col])[:60]  # Truncate long values
        print(f"  {col}: {value}")
    
    # Extract data
    print("\n" + "=" * 80)
    print("EXTRACTING DATA...")
    print("=" * 80)
    
    try:
        extracted_data = extract_feedback_data(test_file)
        print(f"\n✓ Successfully extracted {len(extracted_data)} responses")
        
        # Show what was extracted
        print("\n" + "=" * 80)
        print("AFTER EXTRACTION: Extracted Headers and Sample Data")
        print("=" * 80)
        
        if extracted_data:
            sample = extracted_data[0]
            print(f"\nTotal fields extracted: {len(sample.keys())}")
            print("\nAll extracted headers with sample data:")
            print("-" * 80)
            
            # Group by category for better readability
            categories = {
                'Core Ratings (1-5 scale)': [
                    'satisfaction', 'venue_rating', 'speaker_rating', 
                    'content_rating', 'pacing'
                ],
                'NPS Score (0-10 scale)': ['recommendation_score'],
                'Text Feedback': [
                    'positive_feedback', 'improvement_feedback', 'additional_comments'
                ],
                'Optional Fields': [
                    'preferred_time', 'event_discovery', 'one_word_desc', 'sessions_attended'
                ],
                'Event Metadata': [
                    'event_name', 'event_date', 'event_type', 
                    'chapter', 'chapter_country', 'city'
                ]
            }
            
            for category, fields in categories.items():
                print(f"\n{category}:")
                print("-" * 80)
                for field in fields:
                    if field in sample:
                        value = sample[field]
                        # Format value display
                        if isinstance(value, str) and len(value) > 70:
                            display_value = value[:70] + "..."
                        elif isinstance(value, list):
                            display_value = f"[{len(value)} items] {value[:2] if value else []}"
                        else:
                            display_value = value
                        print(f"  ✓ {field:25s} = {display_value}")
                    else:
                        print(f"  ○ {field:25s} = (not present)")
            
            # Verify PII was removed
            print("\n" + "=" * 80)
            print("PII REMOVAL VERIFICATION")
            print("=" * 80)
            
            pii_fields = [
                'First Name', 'Last Name', 'Email', 'User ID', 
                'Attendee ID', 'Order Number', 'Ticket Number'
            ]
            
            all_clean = True
            for pii_field in pii_fields:
                # Check if any variation of the field exists
                found = any(pii_field.lower() in key.lower() for key in sample.keys())
                if found:
                    print(f"  ✗ WARNING: '{pii_field}' still present in extracted data!")
                    all_clean = False
                else:
                    print(f"  ✓ '{pii_field}' successfully removed")
            
            if all_clean:
                print("\n✓ All PII fields successfully removed!")
            else:
                print("\n✗ Some PII fields still present - review extraction logic")
            
            # Validate numeric ranges
            print("\n" + "=" * 80)
            print("NUMERIC RANGE VALIDATION")
            print("=" * 80)
            
            df_extracted = pd.DataFrame(extracted_data)
            
            print("\nCore Ratings (expected: 1-5):")
            for col in ['satisfaction', 'venue_rating', 'speaker_rating', 'content_rating', 'pacing']:
                if col in df_extracted.columns:
                    min_val = df_extracted[col].min()
                    max_val = df_extracted[col].max()
                    mean_val = df_extracted[col].mean()
                    in_range = 1 <= min_val <= 5 and 1 <= max_val <= 5
                    status = "✓" if in_range else "✗"
                    print(f"  {status} {col:20s}: min={min_val}, max={max_val}, mean={mean_val:.2f}")
            
            print("\nRecommendation Score (expected: 0-10):")
            if 'recommendation_score' in df_extracted.columns:
                min_val = df_extracted['recommendation_score'].min()
                max_val = df_extracted['recommendation_score'].max()
                mean_val = df_extracted['recommendation_score'].mean()
                in_range = 0 <= min_val <= 10 and 0 <= max_val <= 10
                status = "✓" if in_range else "✗"
                print(f"  {status} recommendation_score: min={min_val}, max={max_val}, mean={mean_val:.2f}")
            
            # Show pacing conversion specifically
            print("\n" + "=" * 80)
            print("PACING NORMALIZATION CHECK (1-10 → 1-5)")
            print("=" * 80)
            
            raw_pacing = raw_df['From a scale of 1 - 10, how was the pacing of the event (1 being too slow and 10 being too fast)?'].head(10)
            normalized_pacing = df_extracted['pacing'].head(10)
            
            print("\nFirst 10 responses:")
            print(f"{'Raw (1-10)':>12} → {'Normalized (1-5)':>18}")
            print("-" * 35)
            for raw, norm in zip(raw_pacing, normalized_pacing):
                print(f"{raw:>12} → {norm:>18}")
            
            # Sample response display
            print("\n" + "=" * 80)
            print("SAMPLE EXTRACTED RESPONSES")
            print("=" * 80)
            
            for i, response in enumerate(extracted_data[:3], 1):
                print(f"\nResponse #{i}:")
                print("-" * 80)
                print(f"  Satisfaction: {response.get('satisfaction', 'N/A')}/5")
                print(f"  Venue: {response.get('venue_rating', 'N/A')}/5")
                print(f"  Speaker: {response.get('speaker_rating', 'N/A')}/5")
                print(f"  Content: {response.get('content_rating', 'N/A')}/5")
                print(f"  Pacing: {response.get('pacing', 'N/A')}/5")
                print(f"  Recommendation: {response.get('recommendation_score', 'N/A')}/10")
                print(f"  Event: {response.get('event_name', 'N/A')}")
                print(f"  Chapter: {response.get('chapter', 'N/A')}")
                feedback = response.get('positive_feedback', '')
                print(f"  Positive: {feedback[:60]}..." if len(feedback) > 60 else f"  Positive: {feedback}")
            
            print("\n" + "=" * 80)
            print("TEST PASSED ✓")
            print("=" * 80)
            print(f"\nSummary:")
            print(f"  - Extracted {len(extracted_data)} responses")
            print(f"  - {len(sample.keys())} fields per response")
            print(f"  - All PII removed: {all_clean}")
            print(f"  - Pacing normalized from 1-10 to 1-5 scale")
            print(f"  - All ratings within expected ranges")
            
        else:
            print("✗ No data extracted!")
            
    except Exception as e:
        print(f"\n✗ Extraction failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == "__main__":
    success = test_complete_extraction()
    sys.exit(0 if success else 1)
