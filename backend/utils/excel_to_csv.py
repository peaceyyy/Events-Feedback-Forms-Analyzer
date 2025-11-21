"""
Utility helpers to convert Excel files (bytes) to CSV bytes.

This uses `pandas.read_excel` which requires an Excel engine such as
`openpyxl` for `.xlsx` files. For legacy `.xls` support, install `xlrd`.

The function returns CSV as UTF-8 encoded bytes ready to be passed
into existing CSV processing functions in this project.
"""
import io
from typing import Optional
import pandas as pd


def excel_bytes_to_csv_bytes(
    file_content: bytes,
    sheet_name: Optional[int | str] = 0,
    header: int = 0,
    index: bool = False,
    encoding: str = 'utf-8'
) -> bytes:
    """
    Convert Excel file bytes to CSV bytes.

    - `sheet_name`: 0 (first sheet) or sheet name / index. Use None to read all sheets
      (returns the first sheet in that case as CSV bytes).
    - `header`: row number to use as header (0-indexed).
    - `index`: whether to include the DataFrame index in the CSV output.
    - `encoding`: encoding for the produced CSV bytes.

    This function prefers `openpyxl` for `.xlsx`; ensure it's in requirements.
    """
    buffer = io.BytesIO(file_content)

    # Read Excel into DataFrame (pandas will select an engine if available)
    # If multiple sheets are requested, read_excel will return a dict; pick the first.
    df_or_dict = pd.read_excel(buffer, sheet_name=sheet_name, header=header)

    if isinstance(df_or_dict, dict):
        # When sheet_name=None or list, pandas returns dict of DataFrames.
        # Pick the first available sheet as a reasonable default.
        first_key = next(iter(df_or_dict.keys()))
        df = df_or_dict[first_key]
    else:
        df = df_or_dict

    # Convert dataframe to CSV string, then to bytes
    csv_str = df.to_csv(index=index)
    return csv_str.encode(encoding)


def detect_header_row_preview(file_content: bytes, sheet_name: Optional[int | str] = 0, preview_rows: int = 5):
    """
    Return a small preview (list of rows) to help users pick the correct header row.
    This is useful when different Excel exports include extra top rows or metadata.
    """
    buffer = io.BytesIO(file_content)
    df = pd.read_excel(buffer, sheet_name=sheet_name, header=None)
    # Return first `preview_rows` rows as list of lists
    return df.head(preview_rows).astype(str).values.tolist()
