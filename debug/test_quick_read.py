"""Quick diagnostic test"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd

print("Reading CSV...")
df = pd.read_csv("test_data/gdg_complete_test_data.csv")
print(f"Shape: {df.shape}")
print(f"\nColumns ({len(df.columns)}):")
for i, col in enumerate(df.columns, 1):
    print(f"{i:2d}. {col}")

print("\n\nFirst row sample:")
print(df.iloc[0].to_dict())
