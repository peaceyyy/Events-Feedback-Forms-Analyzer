"""Test column mapping"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd

# Read CSV
df = pd.read_csv("test_data/gdg_complete_test_data.csv")
print(f"Original columns ({len(df.columns)}):")
for i, col in enumerate(df.columns, 1):
    print(f"{i:2d}. {col}")

# Apply rename map from extractor
rename_map = {
    'Overall Satisfaction': 'satisfaction',
    'Overall, how satisfied were you with this event?': 'satisfaction',
    'How well did the content of the event meet your expectations?': 'satisfaction',
    'How likely are you to recommend our events to a friend or colleague?': 'recommendation_score',
    'How likely are you to recommend our events to a friend or colleague? (1 - Strongly Discourage, 5 - Absolutely Must Go)': 'recommendation_score',
    'What did you find most useful from the topics presented?': 'positive_feedback',
    'Any other concerns or suggestions? Comments about the event? Workshop or community activity suggestions? What should we cover next? Anything will do! We take our time reading these ^ _ ^': 'improvement_feedback',
    'From a scale of 1 - 5, how was the pacing of the event?': 'pacing',
}

df.rename(columns=rename_map, inplace=True)

print(f"\n\nAfter rename ({len(df.columns)}):")
for i, col in enumerate(df.columns, 1):
    print(f"{i:2d}. {col}")

print("\n\nRequired columns check:")
required = {'satisfaction', 'positive_feedback', 'improvement_feedback', 'pacing'}
missing = required - set(df.columns)
if missing:
    print(f"❌ MISSING: {missing}")
else:
    print(f"✅ All required columns present")
