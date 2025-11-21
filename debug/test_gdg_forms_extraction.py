"""
Test script for GDG Forms CSV extraction and column mapping analysis.

This script:
1. Loads the actual GDG forms CSV from test_data
2. Compares its structure against the expected columns in backend/processing/feedback_service.py
3. Identifies which columns can be mapped (with transformations)
4. Identifies which columns need new extraction logic
5. Proposes a mapping strategy for integration
"""

import pandas as pd
import os
import sys
from pprint import pprint

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)


# Expected columns from the current system (from feedback_service.py)
CURRENT_SYSTEM_COLUMNS = {
    'satisfaction': 'Overall Satisfaction',
    'recommendation_score': 'How likely are you to recommend our events to a friend or colleague?',
    'sessions_attended': 'Which sessions did you attend?',
    'venue_rating': 'Please rate the following aspects of the event [Venue]',
    'speaker_rating': 'Please rate the following aspects of the event [Speakers]',
    'content_rating': 'Please rate the following aspects of the event [Content Relevance]',
    'positive_feedback': 'What did you like most about the event?',
    'improvement_feedback': 'What could be improved?',
    'additional_comments': 'Any additional comments?',
    'preferred_time': 'Preferred Time Slot',
    'preferred_venue': 'Preferred Venue',
    'pacing': 'Pacing',
    'event_discovery': 'Event Discovery Channel',
    'one_word_desc': 'One-Word Description'
}


def load_gdg_forms_csv():
    """Load the actual GDG forms CSV from test_data."""
    csv_path = os.path.join(
        project_root, 
        'test_data', 
        'google-gdg-on-campus-university-of-san-carlos-cebu-philippines-presents-orbiting-the-web-foundations-of-web-development_post_event_survey_stats.csv'
    )
    
    if not os.path.exists(csv_path):
        print(f"❌ GDG forms CSV not found at: {csv_path}")
        return None
    
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded GDG forms CSV: {len(df)} rows, {len(df.columns)} columns")
    return df


def load_test_csv():
    """Load the existing test CSV for comparison."""
    csv_path = os.path.join(project_root, 'test_data', 'gdg_complete_test_data.csv')
    
    if not os.path.exists(csv_path):
        print(f"❌ Test CSV not found at: {csv_path}")
        return None
    
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded test CSV: {len(df)} rows, {len(df.columns)} columns")
    return df


def analyze_column_mapping(gdg_df):
    """
    Analyze which GDG columns can map to existing expected columns.
    Returns mapping dict and lists of unmapped columns.
    """
    print("\n" + "="*80)
    print("COLUMN MAPPING ANALYSIS")
    print("="*80)
    
    gdg_columns = gdg_df.columns.tolist()
    
    # Manual mapping based on inspection
    # Format: 'expected_key': ('GDG Column Name', 'transformation_needed')
    proposed_mapping = {
        'recommendation_score': (
            'Would you join another event organized by this community based on your experience?',
            'Binary Yes/No → convert to 0-10 scale (Yes=10, No=0)'
        ),
        'satisfaction': (
            'How well did the content of the event meet your expectations?',
            'Scale text (e.g., "3 - Meets Expectations") → extract number (1-5)'
        ),
        'positive_feedback': (
            'What did you find most useful from the topics presented?',
            'Direct text mapping'
        ),
        'improvement_feedback': (
            'Any other concerns or suggestions? Comments about the event? Workshop or community activity suggestions? What should we cover next? Anything will do! We take our time reading these ^ _ ^',
            'Direct text mapping (long question text)'
        ),
        'additional_comments': (
            'Did the event help you gain new insights? Did the event give you applicable knowledge for your professional careers?',
            'Direct text mapping'
        ),
        'preferred_time': (
            'For online events like these (workshops, webinars, etc.), which of the following time ranges would be most convenient for you?',
            'Direct mapping (already in time slot format)'
        ),
        'pacing': (
            'From a scale of 1 - 10, how was the pacing of the event (1 being too slow and 10 being too fast)?',
            'Extract number 1-10'
        ),
        'event_discovery': (
            'How did you hear about this event?',
            'Direct mapping (may have multiple values comma-separated)'
        ),
        'one_word_desc': (
            'Please describe the event in one word :D (Also, this is a reminder to drink water!). Thank you for your time!',
            'Direct text mapping'
        ),
    }
    
    # Columns that exist in GDG but don't map to current system
    gdg_specific_columns = [
        'First Name',
        'Last Name', 
        'Email',
        'Responded',
        'User ID',
        'Attendee ID',
        'Attendee Registration Date',
        'Attendee Check-in Date',
        'Event',
        'Event Date',
        'Event Type',
        'Chapter',
        'Chapter Region',
        'Chapter Country',
        'Chapter State',
        'City',
        'Event ID',
        'Chapter ID',
        'Order Number',
        'Ticket Number',
        'How familiar are you with Google Developer Tools after this event?',
        'Do you plan to implement what you learned in the near future?',
        'I felt included at this event',
        'Course & Year Level (e.g., BSCS2)',
        'If your answer above is \'Other\', kindly specify.',
    ]
    
    # Columns expected by current system but NOT in GDG
    missing_in_gdg = [
        'sessions_attended',  # No session breakdown in GDG forms
        'venue_rating',       # No individual aspect ratings
        'speaker_rating',     # No individual aspect ratings
        'content_rating',     # No individual aspect ratings
        'preferred_venue',    # No venue preference question
    ]
    
    print("\n📋 COLUMNS THAT CAN BE MAPPED:")
    print("-" * 80)
    for key, (gdg_col, transformation) in proposed_mapping.items():
        current_name = CURRENT_SYSTEM_COLUMNS.get(key, 'N/A')
        print(f"\n  {key}:")
        print(f"    Current system expects: {current_name}")
        print(f"    GDG column: {gdg_col}")
        print(f"    Transformation: {transformation}")
    
    print("\n\n❌ COLUMNS MISSING IN GDG FORMS (will cause errors):")
    print("-" * 80)
    for col in missing_in_gdg:
        print(f"  - {col}: {CURRENT_SYSTEM_COLUMNS[col]}")
    
    print("\n\n🆕 GDG-SPECIFIC COLUMNS (new data available):")
    print("-" * 80)
    print("  Metadata columns (useful for filtering/grouping):")
    metadata_cols = [c for c in gdg_specific_columns if c in [
        'First Name', 'Last Name', 'Email', 'Event', 'Event Date', 
        'Chapter', 'City', 'Course & Year Level (e.g., BSCS2)'
    ]]
    for col in metadata_cols:
        print(f"    - {col}")
    
    print("\n  Engagement/Learning columns (new insights):")
    insight_cols = [c for c in gdg_specific_columns if 'familiar' in c.lower() 
                    or 'implement' in c.lower() or 'included' in c.lower()]
    for col in insight_cols:
        print(f"    - {col}")
    
    return proposed_mapping, missing_in_gdg, gdg_specific_columns


def test_data_extraction(gdg_df, proposed_mapping):
    """
    Test extracting and transforming data from GDG forms using proposed mapping.
    """
    print("\n\n" + "="*80)
    print("DATA EXTRACTION TEST")
    print("="*80)
    
    # Sample first 3 rows
    sample_size = min(3, len(gdg_df))
    
    for idx in range(sample_size):
        print(f"\n--- Sample Row {idx + 1} ---")
        row = gdg_df.iloc[idx]
        
        for key, (gdg_col, transformation) in proposed_mapping.items():
            raw_value = row.get(gdg_col, 'N/A')
            
            # Apply transformation
            transformed_value = transform_value(key, raw_value, transformation)
            
            print(f"  {key}:")
            print(f"    Raw: {raw_value}")
            print(f"    Transformed: {transformed_value}")


def transform_value(key, raw_value, transformation_desc):
    """
    Apply transformation logic based on the mapping description.
    This is a proof-of-concept for the actual extraction logic.
    """
    if pd.isna(raw_value) or raw_value == '':
        return None
    
    # Recommendation score: Yes/No → 0-10
    if key == 'recommendation_score':
        if str(raw_value).strip().lower() == 'yes':
            return 10
        elif str(raw_value).strip().lower() == 'no':
            return 0
        return None
    
    # Satisfaction: "3 - Meets Expectations" → 3
    if key == 'satisfaction':
        try:
            # Extract number before the dash
            return int(str(raw_value).split('-')[0].strip())
        except:
            return None
    
    # Pacing: already a number
    if key == 'pacing':
        try:
            return int(raw_value)
        except:
            return None
    
    # Text fields: direct mapping
    if key in ['positive_feedback', 'improvement_feedback', 'additional_comments', 
               'preferred_time', 'event_discovery', 'one_word_desc']:
        return str(raw_value).strip()
    
    return raw_value


def suggest_integration_strategy():
    """
    Print recommendations for integrating GDG forms without breaking existing system.
    """
    print("\n\n" + "="*80)
    print("INTEGRATION STRATEGY RECOMMENDATIONS")
    print("="*80)
    
    print("""
    
Option 1: TWO SEPARATE EXTRACTORS (Recommended for now)
---------------------------------------------------------
Create a new extractor: `extract_gdg_forms_data()` in feedback_service.py
- Keep existing `extract_feedback_data()` unchanged
- New function handles GDG-specific column mapping
- Frontend can detect form type or let user choose
- Avoids breaking existing test CSVs and charts

Pros: Zero risk of breaking existing functionality
Cons: Code duplication, need to maintain two extractors


Option 2: UNIFIED EXTRACTOR WITH AUTO-DETECTION
------------------------------------------------
Enhance `extract_feedback_data()` to auto-detect form type by checking column names
- If columns match test CSV → use current mapping
- If columns match GDG → use new mapping
- Fallback to fuzzy matching if uncertain

Pros: Single extraction function, cleaner architecture
Cons: More complex, needs thorough testing


Option 3: FLEXIBLE COLUMN MAPPER
---------------------------------
Create a `ColumnMapper` class that can handle different form schemas
- Define multiple schema presets (test_csv, gdg_forms, custom)
- User selects schema or system auto-detects
- Each schema has its own rename_map and transformations

Pros: Scalable for future form types, clean separation
Cons: Most engineering effort upfront


CHARTS THAT WILL BREAK WITH GDG FORMS:
----------------------------------------
Missing data means these charts won't have data:
  ❌ Venue Rating chart (no venue_rating)
  ❌ Speaker Rating chart (no speaker_rating) 
  ❌ Content Rating chart (no content_rating)
  ❌ Sessions Attended breakdown (no sessions_attended)
  ❌ Preferred Venue analysis (no preferred_venue)

Charts that WILL WORK with transformed data:
  ✅ Overall Satisfaction (mapped from content expectations)
  ✅ NPS / Recommendation Score (Yes/No → 10/0)
  ✅ Pacing Analysis (direct mapping)
  ✅ Event Discovery Channels (direct mapping)
  ✅ Text Analytics (positive/improvement feedback)
  ✅ Time Preference Analysis (direct mapping)

NEW CHARTS POSSIBLE with GDG data:
  🆕 Familiarity Level Distribution (new column)
  🆕 Implementation Intent (new column)
  🆕 Inclusion Sentiment (new column)
  🆕 Course/Year Demographics (new column)
  🆕 Geographic Distribution (Chapter, City columns)


RECOMMENDED IMMEDIATE ACTION:
------------------------------
1. Create `extract_gdg_forms_data()` separate function
2. Add a `/api/upload/gdg` endpoint or form-type parameter
3. Update frontend to conditionally render only compatible charts
4. Add a "form type" indicator in upload response
5. For future forms, add the missing questions to GDG template
   (venue/speaker/content ratings, sessions attended)
    """)


def main():
    print("=" * 80)
    print("GDG FORMS CSV EXTRACTION & MAPPING ANALYSIS")
    print("=" * 80)
    
    # Load both CSVs
    gdg_df = load_gdg_forms_csv()
    test_df = load_test_csv()
    
    if gdg_df is None:
        print("\n❌ Cannot proceed without GDG forms CSV")
        return
    
    print("\n📊 CURRENT TEST CSV COLUMNS:")
    print("-" * 80)
    if test_df is not None:
        for col in test_df.columns:
            print(f"  - {col}")
    
    print("\n📊 GDG FORMS CSV COLUMNS:")
    print("-" * 80)
    for col in gdg_df.columns:
        print(f"  - {col}")
    
    # Analyze mapping
    proposed_mapping, missing_cols, gdg_specific = analyze_column_mapping(gdg_df)
    
    # Test extraction
    test_data_extraction(gdg_df, proposed_mapping)
    
    # Provide integration suggestions
    suggest_integration_strategy()
    
    print("\n" + "=" * 80)
    print("ANALYSIS COMPLETE")
    print("=" * 80)


if __name__ == '__main__':
    main()
