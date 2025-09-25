import pandas as pd
from typing import Dict, Any
import os
import pprint

def extract_feedback_data(file_path: str) -> Dict[str, Any]:
    """
    Reads a CSV feedback form, validates, cleans, and transforms key columns.
    """
    try:
        # Step 1: Data Import. Load the raw data into a DataFrame.
        df = pd.read_csv(file_path)

        # Step 2: Column Renaming. Create shorter, code-friendly aliases for columns.
        # This makes the rest of the code cleaner and easier to read.
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

        # Step 3: Input Validation (Fail-Fast).
        # Check for required columns IMMEDIATELY after renaming. If a column is
        # missing, we stop now before wasting time on processing.
        selected_columns = list(rename_map.values())
        
        missing_columns = set(selected_columns) - set(df.columns)
        if missing_columns:
            # Return an error specifying which columns are missing.
            return {"error": f"Missing required columns in the CSV: {sorted(list(missing_columns))}"}

        # Step 4: Data Selection and Copying.
        # Select only the columns we need. Using .copy() is crucial. It creates
        # an independent copy of the data, preventing a common "SettingWithCopyWarning"
        # in pandas when we modify it in the next steps.
        extracted_df = df[selected_columns].copy()

        # Step 5: Data Transformation and Cleaning.
        # Now we can safely modify our 'extracted_df'.
        
        # Transform comma-separated strings into lists of strings for 'sessions_attended'.
        # This makes the data much more useful for analysis later.
        if "sessions_attended" in extracted_df.columns:
            extracted_df["sessions_attended"] = (
                extracted_df["sessions_attended"]
                .fillna("") # First, handle any potential empty cells (NaNs)
                .astype(str)
                .apply(lambda s: [item.strip() for item in s.split(',')] if s else [])
            )

        # Clean text columns by replacing empty values (NaNs) with a placeholder.
        # This prevents errors in later analysis that might not expect empty values.
        # We assign the result back to the column to avoid the SettingWithCopyWarning.
        # This is the recommended, unambiguous way to modify a DataFrame column.
        text_columns_to_clean = ['positive_feedback', 'improvement_feedback', 'additional_comments']
        for col in text_columns_to_clean:
            if col in extracted_df.columns:
                extracted_df[col] = extracted_df[col].fillna('No comment')

        # Step 6: Final Data Formatting.
        # Convert the clean DataFrame into a list of dictionaries.
        # This 'records' format is ideal for converting to JSON for the API.
        data_as_dict = extracted_df.to_dict(orient='records')

        return {
            "message": "Data extracted successfully",
            "data": data_as_dict
        }

    except FileNotFoundError:
        return {"error": "File not found. Please check the path."}
    except Exception as e:
        # A general catch-all for any other unexpected errors during processing.
        return {"error": f"An unexpected error occurred: {str(e)}"}


# This block allows you to test this file directly without running the full API.
# It's an excellent practice for debugging and development.
if __name__ == '__main__':
    try:
   
        script_dir = os.path.dirname(__file__)
        project_root = os.path.dirname(os.path.dirname(script_dir))
        csv_file_path = os.path.join(project_root, 'ai_studio_code.csv')

        print(f"--- Running test extraction on: {csv_file_path} ---")
        extracted_data = extract_feedback_data(csv_file_path)
        pprint.pprint(extracted_data)

    except Exception as e:
        print(f"An error occurred during the test run: {e}")