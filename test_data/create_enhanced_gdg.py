"""
Script to create enhanced GDG test data with unified form columns
Adds missing columns from the unified form format to match expected schema
"""
import pandas as pd
import numpy as np

# Read original GDG export
df = pd.read_csv('gdg_complete_test_data.csv')

print(f"Original shape: {df.shape}")
print(f"Original columns: {len(df.columns)}")

# Extract content satisfaction ratings to use as base
content_satisfaction = df['How well did the content of the event meet your expectations?']

# Function to convert text ratings to numeric (1-5)
def extract_rating(text):
    if pd.isna(text):
        return 3  # Default neutral
    text_str = str(text)
    if '5' in text_str or 'Greatly' in text_str or 'Exceeds' in text_str:
        return 5
    elif '4' in text_str or 'Exceeds' in text_str:
        return 4
    elif '3' in text_str or 'Meets' in text_str:
        return 3
    elif '2' in text_str or 'Below' in text_str:
        return 2
    elif '1' in text_str or 'Poor' in text_str:
        return 1
    return 3

# Convert existing content ratings to numeric
base_ratings = content_satisfaction.apply(extract_rating)

# Add slight variance for overall satisfaction (±0 to 1 point from content rating)
np.random.seed(42)  # For reproducibility
overall_variance = np.random.choice([-1, 0, 0, 1], size=len(df))  # Bias toward same/+1
overall_satisfaction = np.clip(base_ratings + overall_variance, 1, 5)

# Generate aspect ratings with realistic variance
# Venue: typically rated well for online events
venue_ratings = np.clip(base_ratings + np.random.choice([-1, 0, 0, 1], size=len(df)), 1, 5)

# Speaker: usually rated high for GDG events
speaker_ratings = np.clip(base_ratings + np.random.choice([0, 0, 1, 1], size=len(df)), 1, 5)

# Content: use the base with slight variance
content_ratings = np.clip(base_ratings + np.random.choice([-1, 0, 0], size=len(df)), 1, 5)

# Recommendation score: correlates strongly with satisfaction
recommendation_scores = np.clip(overall_satisfaction + np.random.choice([-1, 0, 1], size=len(df)), 1, 5)

# Create formatted strings for the new columns (matching unified form format)
def format_rating(rating):
    mapping = {
        1: "1 - Strongly Disagree",
        2: "2 - Disagree",
        3: "3 - Neutral",
        4: "4 - Agree",
        5: "5 - Strongly Agree"
    }
    return mapping.get(int(rating), "3 - Neutral")

def format_recommendation(rating):
    mapping = {
        1: "1 - Strongly Discourage",
        2: "2 - Discourage",
        3: "3 - Neutral",
        4: "4 - Recommend",
        5: "5 - Absolutely Must Go"
    }
    return mapping.get(int(rating), "3 - Neutral")

# Insert new columns after the PII fields and before existing questions
insert_position = df.columns.get_loc('Would you join another event organized by this community based on your experience?')

# Create new column data
new_columns = {
    'Overall, how satisfied were you with this event?': [format_rating(r) for r in overall_satisfaction],
    'How would you rate the venue/platform overall (e.g., Visual/Audio Quality, Reception, Moderation & Engagement)?': [format_rating(r) for r in venue_ratings],
    'How would you rate the speakers overall (e.g., Depth of Knowledge, Clarity & Coherence, Presentation)?': [format_rating(r) for r in speaker_ratings],
    'How likely are you to recommend our events to a friend or colleague? (1 - Strongly Discourage, 5 - Absolutely Must Go)': [format_recommendation(r) for r in recommendation_scores]
}

# Insert columns one by one at the correct position
for i, (col_name, col_data) in enumerate(new_columns.items()):
    df.insert(insert_position + i, col_name, col_data)

# Keep the original "How well did the content..." column for content_rating mapping
# It now serves dual purpose: content rating in the backend mapping

print(f"\nEnhanced shape: {df.shape}")
print(f"Enhanced columns: {len(df.columns)}")
print(f"\nNew columns added:")
for col in new_columns.keys():
    print(f"  - {col}")

# Save enhanced version
output_file = 'gdg_complete_test_data_enhanced.csv'
df.to_csv(output_file, index=False)
print(f"\n✅ Saved enhanced CSV to: {output_file}")

# Show sample data
print("\nSample data (first 3 rows, new columns only):")
print(df[list(new_columns.keys())].head(3))

# Show statistics
print("\nRating distributions:")
for col_name in new_columns.keys():
    print(f"\n{col_name}:")
    print(df[col_name].value_counts().sort_index())
