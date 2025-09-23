import csv
import json
import os

csv_path = "eo_oh_1k.csv"
output_dir = "json_output"
os.makedirs(output_dir, exist_ok=True)

fields = [
    "EIN","NAME","ICO","STREET","CITY","STATE","ZIP","GROUP","SUBSECTION","AFFILIATION",
    "CLASSIFICATION","RULING","DEDUCTIBILITY","FOUNDATION","ACTIVITY","ORGANIZATION","STATUS",
    "TAX_PERIOD","ASSET_CD","INCOME_CD","FILING_REQ_CD","PF_FILING_REQ_CD","ACCT_PD","ASSET_AMT",
    "INCOME_AMT","REVENUE_AMT","NTEE_CD","SORT_NAME"
]

with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Only include specified fields
        json_obj = {field: row.get(field, "") for field in fields}
        # Get the EIN value for this row (used as a unique identifier)
        ein = json_obj.get("EIN", "unknown")
        # Build the output file path, naming the JSON file after the EIN
        json_path = os.path.join(output_dir, f"{ein}.json")
        with open(json_path, "w", encoding="utf-8") as jsonfile:
            json.dump(json_obj, jsonfile, indent=2)
