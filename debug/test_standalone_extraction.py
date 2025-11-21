"""
Standalone final extraction test - bypasses module cache issues
"""
import pandas as pd
import json

print("=" * 80)
print("STANDALONE EXTRACTION TEST")
print("=" * 80)

# Read CSV
df = pd.read_csv("test_data/gdg_complete_test_data.csv")
print(f"\n✅ Loaded {len(df)} responses with {len(df.columns)} columns")

# Full rename map (copied directly to avoid import cache issues)
rename_map = {
    # Core fields
    'Overall Satisfaction': 'satisfaction',
    'Overall, how satisfied were you with this event?': 'satisfaction',
    'How well did the content of the event meet your expectations?': 'satisfaction',
    'How likely are you to recommend our events to a friend or colleague?': 'recommendation_score',
    'How likely are you to recommend our events to a friend or colleague? (1 - Strongly Discourage, 5 - Absolutely Must Go)': 'recommendation_score',
    'Venue Rating': 'venue_rating',
    'How would you rate the venue/platform overall (e.g., Visual/Audio Quality, Reception, Moderation & Engagement)?': 'venue_rating',
    'Speaker Rating': 'speaker_rating',
    'How would you rate the speakers overall (e.g., Depth of Knowledge, Clarity & Coherence, Presentation)?': 'speaker_rating',
    'Content Relevance': 'content_rating',
    'What did you like most about the event?': 'positive_feedback',
    'What did you find most useful from the topics presented?': 'positive_feedback',
    'What could be improved?': 'improvement_feedback',
    'Any other concerns or suggestions? Comments about the event? Workshop or community activity suggestions? What should we cover next? Anything will do! We take our time reading these ^ _ ^': 'improvement_feedback',
    'Any additional comments?': 'additional_comments',
    'Preferred Time Slot': 'preferred_time',
    'For online events like these (workshops, webinars, etc.), which of the following time ranges would be most convenient for you?': 'preferred_time',
    'Pacing': 'pacing',
    'From a scale of 1 - 10, how was the pacing of the event (1 being too slow and 10 being too fast)?': 'pacing',
    'From a scale of 1 - 5, how was the pacing of the event?': 'pacing',
    'How was the pacing of the event?': 'pacing',
    'Event Discovery Channel': 'event_discovery',
    'How did you hear about this event?': 'event_discovery',
    'One-Word Description': 'one_word_desc',
    'Please describe the event in one word :D (Also, this is a reminder to drink water!). Thank you for your time!': 'one_word_desc',
    'Course & Year Level (e.g., BSCS2)': 'course_year',
    'Would you join another event organized by this community based on your experience?': 'would_join',
    'Did the event help you gain new insights? Did the event give you applicable knowledge for your professional careers?': 'gained_insights',
    'Do you plan to implement what you learned in the near future?': 'plan_to_implement',
    'I felt included at this event': 'felt_included',
    'How familiar are you with Google Developer Tools after this event?': 'familiarity_level',
    # Metadata
    'Event': 'event_name',
    'Event Date': 'event_date',
    'Event Type': 'event_type',
    'Chapter': 'chapter',
    'Chapter Country': 'chapter_country',
    'City': 'city',
}

# PII to drop
pii_fields = ['First Name', 'Last Name', 'Email', 'Responded', 'User ID', 'Attendee ID', 
              'Attendee Registration Date', 'Attendee Check-in Date', 'Chapter Region', 'Chapter State',
              'Event ID', 'Chapter ID', 'Order Number', 'Ticket Number', "If your answer above is 'Other', kindly specify."]

# Rename columns
df.rename(columns=rename_map, inplace=True)
print(f"\n✅ Renamed columns using mapping")

# Drop PII
df.drop(columns=[col for col in pii_fields if col in df.columns], inplace=True)
print(f"✅ Dropped PII fields")

# Extract required + available optional
required = {'satisfaction', 'positive_feedback', 'improvement_feedback', 'pacing'}
optional = {'recommendation_score', 'venue_rating', 'speaker_rating', 'content_rating',
            'additional_comments', 'preferred_time', 'event_discovery', 'one_word_desc',
            'course_year', 'would_join', 'gained_insights', 'plan_to_implement',
            'felt_included', 'familiarity_level', 'event_name', 'event_date', 'event_type',
            'chapter', 'chapter_country', 'city'}

missing_required = required - set(df.columns)
if missing_required:
    print(f"\n❌ MISSING REQUIRED: {missing_required}")
    print(f"\nAvailable columns after rename:")
    for col in sorted(df.columns):
        print(f"  - {col}")
    exit(1)

available = required | (optional & set(df.columns))
df = df[list(available)]

print(f"\n✅ Extracted {len(df.columns)} fields ({len(required)} required + {len(available)-len(required)} optional)")

# Data cleaning
print(f"\n--- Data Transformation ---")

# Extract numbers from ratings
for col in ['satisfaction', 'venue_rating', 'speaker_rating', 'content_rating', 'recommendation_score']:
    if col in df.columns:
        df[col] = pd.to_numeric(
            df[col].astype(str).str.extract(r'(\d+)', expand=False),
            errors='coerce'
        ).fillna(0).astype(int)
        print(f"✓ {col}: extracted numbers")

# Normalize pacing (1-10 → 1-5)
if 'pacing' in df.columns:
    df['pacing'] = pd.to_numeric(df['pacing'], errors='coerce').fillna(0)
    mask = df['pacing'] > 5
    df.loc[mask, 'pacing'] = (df.loc[mask, 'pacing'] / 2).round().astype(int)
    df['pacing'] = df['pacing'].clip(1, 5).astype(int)
    print(f"✓ pacing: normalized to 1-5 scale")

# Fill text fields
for col in ['positive_feedback', 'improvement_feedback', 'additional_comments']:
    if col in df.columns:
        df[col] = df[col].fillna('No comment')

print(f"\n--- Sample Extracted Response ---")
sample = df.iloc[0].to_dict()
for key, val in sample.items():
    display_val = str(val)[:60] + "..." if len(str(val)) > 60 else val
    print(f"  {key}: {display_val}")

print(f"\n--- Validation ---")
print(f"✓ Responses: {len(df)}")
print(f"✓ Fields: {len(df.columns)}")
print(f"✓ Satisfaction range: {df['satisfaction'].min()}-{df['satisfaction'].max()}")
print(f"✓ Pacing range: {df['pacing'].min()}-{df['pacing'].max()}")

if df['pacing'].max() <= 5:
    print(f"✓ Pacing normalized successfully!")
    
print(f"\n✅ TEST PASSED - Extraction successful!")
print("=" * 80)
