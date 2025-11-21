import os

def get_default_csv_path() -> str:
    """Return path to the canonical GDG unified sample dataset.

    We now default all quick tests to `gdg_complete_test_data_enhanced.csv` which contains
    the unified form columns (overall satisfaction, venue/speaker ratings, recommendation).
    Fallbacks: original GDG export, then legacy files.
    """
    script_dir = os.path.dirname(__file__)
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    # Priority order: enhanced GDG > original GDG > legacy
    candidates = [
        'gdg_complete_test_data_enhanced.csv',  # NEW: With unified form columns
        'gdg_complete_test_data.csv',           # Original GDG export
        'feedback_forms-3.csv',                 # Legacy
        'feedback_forms-1.csv'                  # Legacy
    ]
    
    for filename in candidates:
        path = os.path.join(project_root, 'test_data', filename)
        if os.path.exists(path):
            return path
    
    # Return first candidate even if missing; caller handles not found
    return os.path.join(project_root, 'test_data', candidates[0])
