import sys
import os
import pprint

# Add the project root to the python path so imports work
sys.path.append(os.getcwd())

from backend.processing.feedback_service import extract_feedback_data

def test_new_csv_processing():
    csv_path = r"c:\Users\Peace\Documents\BSCS 2 1st Sem\Web Dev II\Feedback Form Analyzer\test_data\feedback_forms_updated.csv"
    
    print(f"Testing processing of: {csv_path}")
    
    try:
        data = extract_feedback_data(csv_path)
        print(f"Successfully processed {len(data)} records.")
        print("First record sample:")
        pprint.pprint(data[0])
        
        # Check if critical fields are present
        required_fields = ['satisfaction', 'pacing', 'positive_feedback', 'improvement_feedback']
        missing = [f for f in required_fields if f not in data[0]]
        
        if missing:
            print(f"WARNING: Missing fields in output: {missing}")
        else:
            print("All required fields are present.")
            
    except Exception as e:
        print(f"Processing failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_new_csv_processing()
