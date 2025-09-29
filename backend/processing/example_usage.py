"""
Example usage of the data_extractor module.
This demonstrates how to import and use the data extraction functions.
"""

from data_extractor import extract_feedback_data, validate_csv_file, get_default_csv_path
import json

def example_basic_usage():
    """
    Example 1: Basic usage with default file
    """
    print("=== Example 1: Basic Usage ===")
    
    # Use the default CSV file
    csv_path = get_default_csv_path()
    print(f"Using default CSV: {csv_path}")
    
    # Extract data
    result = extract_feedback_data(csv_path)
    
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Success: {result['message']}")
        print(f"Records extracted: {len(result['data'])}")


def example_custom_file():
    """
    Example 2: Usage with custom file path
    """
    print("\n=== Example 2: Custom File Path ===")
    
    # You can specify any CSV file path
    custom_path = input("Enter path to your CSV file (or press Enter for default): ").strip()
    
    if not custom_path:
        custom_path = get_default_csv_path()
    
    # Validate the file first
    validation = validate_csv_file(custom_path)
    if not validation["valid"]:
        print(f"Validation failed: {validation['message']}")
        return
    
    # Extract data
    result = extract_feedback_data(custom_path)
    
    if "error" in result:
        print(f"Error: {result['error']}")
    else:
        print(f"Success: {result['message']}")
        return result['data']


def example_frontend_integration():
    """
    Example 3: How a frontend might use this module
    """
    print("\n=== Example 3: Frontend Integration ===")
    
    # This is how your frontend/API might use the extractor
    def process_uploaded_file(file_path: str) -> dict:
        """Simulate processing an uploaded file"""
        
        # Validate first
        validation = validate_csv_file(file_path)
        if not validation["valid"]:
            return {
                "success": False,
                "error": validation["message"]
            }
        
        # Extract data
        result = extract_feedback_data(file_path)
        
        if "error" in result:
            return {
                "success": False,
                "error": result["error"]
            }
        
        return {
            "success": True,
            "message": result["message"],
            "data": result["data"],
            "total_records": len(result["data"])
        }
    
    # Example usage
    file_path = get_default_csv_path()
    api_response = process_uploaded_file(file_path)
    
    print("API Response:")
    print(json.dumps(api_response, indent=2))


if __name__ == "__main__":
    print("Data Extractor Usage Examples\n")
    
    # Run examples
    example_basic_usage()
    example_custom_file()
    example_frontend_integration()