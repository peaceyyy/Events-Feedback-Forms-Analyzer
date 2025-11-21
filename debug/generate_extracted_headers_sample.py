import csv
from backend.processing.feedback_service import extract_feedback_data
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / 'test_data' / 'gdg_complete_test_data.csv'
OUTPUT = ROOT / 'test_data' / 'extracted_headers_sample.csv'


def main():
    print(f"Reading: {INPUT}")
    extracted = extract_feedback_data(str(INPUT))
    if not extracted:
        print("No extracted records found.")
        return
    # Use first record as sample
    sample = extracted[0]
    # Ensure deterministic order: sort keys
    keys = sorted(sample.keys())

    with open(OUTPUT, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['header', 'sample_value'])
        for k in keys:
            v = sample[k]
            # Convert lists to semicolon-separated string for readability
            if isinstance(v, list):
                v = ';'.join(map(str, v))
            writer.writerow([k, v])

    print(f"Wrote sample headers to: {OUTPUT}")


if __name__ == '__main__':
    main()
