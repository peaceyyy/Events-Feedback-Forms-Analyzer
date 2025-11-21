import pandas as pd
from typing import Dict, Any, List
import os
import pprint
import json
from datetime import datetime

# --- HELPER & VALIDATION FUNCTIONS ---

def validate_csv_file(file_path: str) -> Dict[str, Any]:
    """
    Checks if a CSV file exists and can be read before attempting full processing.
    Returns a dictionary with validation status and error message if invalid.
    """
    if not file_path: return {"valid": False, "message": "No file path provided"}
    if not os.path.exists(file_path): return {"valid": False, "message": f"File not found: {file_path}"}
    if not file_path.lower().endswith('.csv'): return {"valid": False, "message": "File must be a CSV file"}
    try:
        pd.read_csv(file_path, nrows=1)
        return {"valid": True, "message": "File is valid"}
    except Exception as e:
        return {"valid": False, "message": f"Cannot read or parse CSV file: {str(e)}"}

# --- CORE DATA PROCESSING ---
def extract_feedback_data(file_path_or_buffer) -> List[Dict[str, Any]]:
    """
    Main processing function: reads CSV, renames columns to shorter names,
    validates required columns exist, and cleans the data.
    
    Supports unified GDG schema (1-5 scales) with optional backward compatibility.
    Returns a list of dictionaries (one per survey response).
    """
    df = pd.read_csv(file_path_or_buffer)

    # Convert long survey question columns to short, code-friendly names
    # Supports both old format and new unified GDG schema
    rename_map = {
        # Core feedback fields
        'Overall Satisfaction': 'satisfaction',
        'Overall, how satisfied were you with this event?': 'satisfaction',  # Unified GDG template format
        'How well did the content of the event meet your expectations?': 'satisfaction',  # GDG export format (PRIMARY satisfaction metric)
        'How likely are you to recommend our events to a friend or colleague?': 'recommendation_score',
        'How likely are you to recommend our events to a friend or colleague? (1 - Strongly Discourage, 5 - Absolutely Must Go)': 'recommendation_score',  # Unified template (1-5)
        'Which sessions did you attend?': 'sessions_attended',  # Optional (old format)
        'Please rate the following aspects of the event [Venue]': 'venue_rating',  # Old format
        'Venue Rating': 'venue_rating',  # New unified format
        'How would you rate the venue/platform overall (e.g., Visual/Audio Quality, Reception, Moderation & Engagement)?': 'venue_rating',  # GDG export format
        'Please rate the following aspects of the event [Speakers]': 'speaker_rating',  # Old format
        'Speaker Rating': 'speaker_rating',  # New unified format
        'How would you rate the speakers overall (e.g., Depth of Knowledge, Clarity & Coherence, Presentation)?': 'speaker_rating',  # GDG export format
        'Please rate the following aspects of the event [Content Relevance]': 'content_rating',  # Old format
        'Content Relevance': 'content_rating',  # New unified format
        'What did you like most about the event?': 'positive_feedback',
        'What could be improved?': 'improvement_feedback',
        'Any additional comments?': 'additional_comments',
        'Preferred Time Slot': 'preferred_time',
        'Preferred Venue': 'preferred_venue',  # Optional (old format)
        'Pacing': 'pacing',  # New unified format (1-5)
        'From a scale of 1 - 10, how was the pacing of the event (1 being too slow and 10 being too fast)?': 'pacing',  # GDG export format (1-10, will be normalized)
        'From a scale of 1 - 5 ?': 'pacing',  # Alternative pacing format (1-5)
        'From a scale of 1 - 5, how was the pacing of the event?': 'pacing',  # Test data pacing (1-5)
        'How was the pacing of the event?': 'pacing',  # Simplified pacing question (1-5)
        'Event Discovery Channel': 'event_discovery',
        'One-Word Description': 'one_word_desc',
        'How did you hear about this event?': 'event_discovery',  # GDG export format
        'Please describe the event in one word :D (Also, this is a reminder to drink water!). Thank you for your time!': 'one_word_desc',  # GDG export format
        'Any other concerns or suggestions? Comments about the event? Workshop or community activity suggestions? What should we cover next? Anything will do! We take our time reading these ^ _ ^': 'improvement_feedback',  # GDG export format
        'What did you find most useful from the topics presented?': 'positive_feedback',  # GDG export format
        'For online events like these (workshops, webinars, etc.), which of the following time ranges would be most convenient for you?': 'preferred_time',  # GDG export format
        'Course & Year Level (e.g., BSCS2)': 'course_year',
        'Would you join another event organized by this community based on your experience?': 'would_join',
        'Did the event help you gain new insights? Did the event give you applicable knowledge for your professional careers?': 'gained_insights',
        'Do you plan to implement what you learned in the near future?': 'plan_to_implement',
        'I felt included at this event': 'felt_included',
        'How familiar are you with Google Developer Tools after this event?': 'familiarity_level',  # GDG-specific optional field
        
        # GDG metadata fields (useful for display/filtering)
        'Event': 'event_name',
        'Event Date': 'event_date',
        'Event Type': 'event_type',
        'Chapter': 'chapter',
        'Chapter Country': 'chapter_country',
        'City': 'city',
    }
    
    # PII and internal tracking fields to DROP (not included in extraction)
    pii_fields_to_drop = [
        'First Name', 'Last Name', 'Email', 'Responded',
        'User ID', 'Attendee ID', 'Attendee Registration Date', 
        'Attendee Check-in Date', 'Chapter Region', 'Chapter State',
        'Event ID', 'Chapter ID', 'Order Number', 'Ticket Number'
    ]
    
    df.rename(columns=rename_map, inplace=True)
    
    # Drop PII and tracking columns if present
    columns_to_drop = [col for col in pii_fields_to_drop if col in df.columns]
    if columns_to_drop:
        df.drop(columns=columns_to_drop, inplace=True)

    # Define required vs optional columns
    # Required: core metrics that must be present
    required_columns = {
        'satisfaction',
        'positive_feedback',
        'improvement_feedback',
        'pacing',
    }
    
    # Optional: columns that enhance analysis but aren't critical
    optional_columns = {
        'recommendation_score',  # Optional (GDG export doesn't have it, but new forms do)
        'venue_rating',
        'speaker_rating',
        'content_rating',
        'sessions_attended',
        'additional_comments',
        'preferred_time',
        'preferred_venue',
        'event_discovery',
        'one_word_desc',
        'course_year',
        'would_join',
        'gained_insights',
        'plan_to_implement',
        'felt_included',
        'familiarity_level',
        # GDG metadata (useful for display/filtering)
        'event_name',
        'event_date',
        'event_type',
        'chapter',
        'chapter_country',
        'city'
    }
    
    # Check that all required columns exist
    missing_required = required_columns - set(df.columns)
    if missing_required:
        raise ValueError(f"Missing required columns in the CSV: {sorted(list(missing_required))}")
    
    # Include optional columns that are present
    available_columns = required_columns | (optional_columns & set(df.columns))
    extracted_df = df[list(available_columns)].copy()

    # --- Data Cleaning & Transformation ---
    
    # Extract numbers from recommendation score (handles both numeric and text formats)
    # Supports: plain numbers (9), text with numbers ("4 - Highly Recommended"), 1-5 or 0-10 scales
    if 'recommendation_score' in extracted_df.columns:
        extracted_df['recommendation_score'] = pd.to_numeric(
            extracted_df['recommendation_score'].astype(str).str.extract(r'(\d+)', expand=False),
            errors='coerce'
        ).fillna(0)

    # Ensure all rating columns are numeric (1-5 scale)
    rating_columns = ['satisfaction', 'venue_rating', 'speaker_rating', 'content_rating', 'recommendation_score']
    for col in rating_columns:
        if col in extracted_df.columns:
            # Extract numbers from text like "3 - Meets Expectations" or plain "3"
            extracted_df[col] = pd.to_numeric(
                extracted_df[col].astype(str).str.extract(r'(\d+)', expand=False),
                errors='coerce'
            ).fillna(0)
    
    # Normalize pacing: GDG export uses 1-10, unified schema uses 1-5
    # Convert 1-10 scale to 1-5: divide by 2 and round
    if 'pacing' in extracted_df.columns:
        extracted_df['pacing'] = pd.to_numeric(extracted_df['pacing'], errors='coerce').fillna(0)
        # Normalize: values > 5 are from 1-10 scale, need conversion
        mask = extracted_df['pacing'] > 5
        extracted_df.loc[mask, 'pacing'] = (extracted_df.loc[mask, 'pacing'] / 2).round().astype(int)
        # Ensure values stay within 1-5 range
        extracted_df['pacing'] = extracted_df['pacing'].clip(1, 5)

    # Convert comma-separated session names into a list (optional column)
    if "sessions_attended" in extracted_df.columns:
        extracted_df["sessions_attended"] = (
            extracted_df["sessions_attended"].fillna("").astype(str)
            .apply(lambda s: [item.strip() for item in s.split(',')] if s else [])
        )

    # Replace empty/null text responses with a placeholder
    text_columns_to_clean = ['positive_feedback', 'improvement_feedback']
    if 'additional_comments' in extracted_df.columns:
        text_columns_to_clean.append('additional_comments')
    
    for col in text_columns_to_clean:
        if col in extracted_df.columns:
            extracted_df[col] = extracted_df[col].fillna('No comment')

    # Convert DataFrame to list of dictionaries (one dict per row)
    return [
        {str(k): v for k, v in row.items()}
        for row in extracted_df.to_dict(orient='records')
    ]


def save_extracted_data(data: List[Dict[str, Any]], original_file_path: str):
    """
    Saves the cleaned data as a JSON file in the same directory as the original CSV.
    Adds timestamp to filename to avoid overwriting previous extractions.
    """
    base_name = os.path.splitext(os.path.basename(original_file_path))[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{base_name}_extracted_{timestamp}.json"
    output_path = os.path.join(os.path.dirname(original_file_path), output_filename)
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved successfully to: {output_path}")
    except Exception as e:
        print(f"Failed to save data: {str(e)}")


# --- CLI ver. for testing ---
def main():
    
    print("=== Feedback Data Extractor ===")
    
    default_csv_path = get_default_csv_path()
    print(f"Default file found: {default_csv_path}")
    choice = input("Press 1 to use default file, or 2 to enter a custom path: ").strip()

    if choice == '1':
        file_path = default_csv_path
    elif choice == '2':
        file_path = input("Enter the full path to your CSV file: ").strip().strip('"\'')
    else:
        print("Invalid choice. Exiting.")
        return

    # Validate the file before attempting to process it
    validation = validate_csv_file(file_path)
    if not validation["valid"]:
        print(f"Validation Error: {validation['message']}")
        return
    
    print(f"\n--- Processing: {file_path} ---")

    # Attempt data extraction with error handling
    try:
        extracted_data = extract_feedback_data(file_path)
        
        print(f"Data extracted successfully!")
        print(f"Processed {len(extracted_data)} records.")

        # Offer to show sample of extracted data
        if input("\nShow extracted data? (y/n): ").lower() == 'y':
            pprint.pprint(extracted_data[:5])
            if len(extracted_data) > 5: print("...")

        # Offer to save data to JSON file
        if input("\nSave extracted data to JSON? (y/n): ").lower() == 'y':
            save_extracted_data(extracted_data, file_path)

    # Handle expected errors (missing columns, data format issues)
    except (ValueError, KeyError) as e:
        print(f"Data Processing Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during processing: {e}")


if __name__ == '__main__':
    main()