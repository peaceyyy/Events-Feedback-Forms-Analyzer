import pandas as pd
from typing import Dict, Any, List
import os
import pprint
import json
from datetime import datetime

# --- HELPER & VALIDATION FUNCTIONS ---
def get_default_csv_path() -> str:
    """
    Constructs the path to the default CSV file by navigating up from this script's location.
    Goes up 2 directories from /backend/processing/ to reach project root.
    """
    script_dir = os.path.dirname(__file__)
    project_root = os.path.dirname(os.path.dirname(script_dir))
    return os.path.join(project_root, 'ai_studio_code.csv')

def validate_csv_file(file_path: str) -> Dict[str, Any]:
    """
    Checks if a CSV file exists and can be read before attempting full processing.
    Returns a dictionary with validation status and error message if invalid.
    """
    if not file_path: return {"valid": False, "message": "No file path provided"}
    if not os.path.exists(file_path): return {"valid": False, "message": f"File not found: {file_path}"}
    if not file_path.lower().endswith('.csv'): return {"valid": False, "message": "File must be a CSV file"}
    try:
        # Test readability by attempting to read just the header row
        pd.read_csv(file_path, nrows=1)
        return {"valid": True, "message": "File is valid"}
    except Exception as e:
        return {"valid": False, "message": f"Cannot read or parse CSV file: {str(e)}"}

# --- CORE DATA PROCESSING ---
def extract_feedback_data(file_path: str) -> List[Dict[str, Any]]:
    """
    Main processing function: reads CSV, renames columns to shorter names,
    validates required columns exist, and cleans the data.
    Returns a list of dictionaries (one per survey response).
    """
    df = pd.read_csv(file_path)

    # Convert long survey question columns to short, code-friendly names
    rename_map = {
        'Overall Satisfaction': 'satisfaction',
        'How likely are you to recommend our events to a friend or colleague?': 'recommendation_score',
        'Which sessions did you attend?': 'sessions_attended',
        'Please rate the following aspects of the event [Venue]': 'venue_rating',
        'Please rate the following aspects of the event [Speakers]': 'speaker_rating',
        'Please rate the following aspects of the event [Content Relevance]': 'content_rating',
        'What did you like most about the event?': 'positive_feedback',
        'What could be improved?': 'improvement_feedback',
        'Any additional comments?': 'additional_comments',
        'Preferred Time Slot': 'preferred_time',
        'Preferred Venue': 'preferred_venue',
        'Pacing': 'pacing',
        'Event Discovery Channel': 'event_discovery',
        'One-Word Description': 'one_word_desc'
    }
    df.rename(columns=rename_map, inplace=True)

    # Check that all expected columns exist in the CSV after renaming
    required_columns = set(rename_map.values())
    missing_columns = required_columns - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns in the CSV: {sorted(list(missing_columns))}")

    extracted_df = df[list(required_columns)].copy()

    # --- Data Cleaning & Transformation ---
    
    # Extract numbers from recommendation score text (e.g., "8 out of 10" becomes 8)
    if 'recommendation_score' in extracted_df.columns:
        extracted_df['recommendation_score'] = pd.to_numeric(
            extracted_df['recommendation_score'].astype(str).str.extract(r'(\d+)', expand=False),
            errors='coerce'
        ).fillna(0)


    # Convert comma-separated session names into a list of individual sessions
    if "sessions_attended" in extracted_df.columns:
        extracted_df["sessions_attended"] = (
            extracted_df["sessions_attended"].fillna("").astype(str)
            .apply(lambda s: [item.strip() for item in s.split(',')] if s else [])
        )

    # Replace empty/null text responses with a placeholder
    text_columns_to_clean = ['positive_feedback', 'improvement_feedback', 'additional_comments']
    for col in text_columns_to_clean:
        if col in extracted_df.columns:
            extracted_df[col] = extracted_df[col].fillna('No comment')

    # Convert DataFrame to list of dictionaries (one dict per row)
    return list([dict(row) for row in extracted_df.to_dict(orient='records')])


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


# --- USER INTERFACE ---
def main():
    """
    Interactive command-line interface that guides users through CSV processing.
    Handles user input, file validation, and error display.
    """
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