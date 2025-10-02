import os

def get_default_csv_path() -> str:
    """
    Constructs the path to the default CSV file by navigating up from this script's location.
    Goes up 2 directories from /backend/processing/ to reach project root.
    """
    script_dir = os.path.dirname(__file__)
    project_root = os.path.dirname(os.path.dirname(script_dir))
    return os.path.join(project_root, 'test_data/feedback_forms-1.csv')
