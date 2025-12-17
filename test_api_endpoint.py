import requests
import json

try:
    response = requests.get('http://localhost:5000/api/test')
    print(f"Status Code: {response.status_code}")
    
    data = response.json()
    print(f"Success: {data.get('success')}")
    print(f"Keys: {list(data.keys())}")
    
    if 'summary' in data:
        print("Summary found.")
    else:
        print("Summary NOT found.")
        
except Exception as e:
    print(f"Error: {e}")
