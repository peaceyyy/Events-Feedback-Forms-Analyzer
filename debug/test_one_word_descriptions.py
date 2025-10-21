#!/usr/bin/env python3
"""
Debug script to test one-word descriptions processing
"""

import sys
import os
# Find the project root by looking for a known directory ('backend' in this case)
# This makes the script runnable from different locations within the project.
project_root = os.path.abspath(__file__)
while not os.path.isdir(os.path.join(project_root, 'backend')):
    project_root = os.path.dirname(project_root)
    if project_root == os.path.dirname(project_root): # Reached the filesystem root
        raise FileNotFoundError("Could not find the 'backend' directory. Is the script inside the project?")
sys.path.append(project_root)

from backend.processing.feedback_service import extract_feedback_data
from backend.analysis.insights import generate_one_word_descriptions

def test_one_word_descriptions():
    """Test the one-word descriptions processing pipeline"""
    
    # Test with sample CSV
    csv_path = "test_data/feedback_forms-1.csv"
    
    print("=== DEBUG: One-Word Descriptions Processing ===")
    
    # Step 1: Extract data from CSV
    print(f"\n1. Extracting data from: {csv_path}")
    try:
        data = extract_feedback_data(csv_path)
        print(f"   Extracted {len(data)} records")
        
        # Check if one_word_desc is in the data
        if len(data) > 0:
            first_record = data[0]
            print(f"   Sample record keys: {list(first_record.keys())}")
            
            if 'one_word_desc' in first_record:
                print(f"   'one_word_desc' field found!")
                print(f"   Sample values: {[record.get('one_word_desc', 'N/A') for record in data[:5]]}")
            else:
                print(f"   'one_word_desc' field NOT found in record")
                
    except Exception as e:
        print(f"   Error extracting data: {e}")
        return
    
    # Step 2: Generate one-word descriptions analysis
    print(f"\n2. Generating one-word descriptions analysis...")
    try:
        result = generate_one_word_descriptions(data)
        print(f"   Analysis result keys: {list(result.keys())}")
        
        if 'error' in result:
            print(f"   Error in analysis: {result['error']}")
        else:
            print(f"   Analysis successful!")
            if 'data' in result and 'word_cloud' in result['data']:
                word_cloud_data = result['data']['word_cloud']
                print(f"   Generated {len(word_cloud_data)} word cloud items")
                print(f"   Top 5 words: {word_cloud_data[:5]}")
                
                # Show stats
                if 'stats' in result['data']:
                    stats = result['data']['stats']
                    print(f"   Stats: {stats}")
            
    except Exception as e:
        print(f"   Error generating analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_one_word_descriptions()