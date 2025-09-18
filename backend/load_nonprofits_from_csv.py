import csv
from os import getenv
from typing import Optional

from dotenv import load_dotenv

from es_manager import ElasticManager


INDEX_NAME = "nonprofits"


def create_index_if_needed(es: ElasticManager) -> None:
    mappings = {
        "properties": {
            "ein": {"type": "keyword"},
            "name": {"type": "text", "fields": {"raw": {"type": "keyword"}}},
            "city": {"type": "text"},
            "state": {"type": "keyword"},
            "ntee": {"type": "keyword"},
            "subsection": {"type": "keyword"},
            "deductibility": {"type": "keyword"},
        }
    }
    es.create_index(INDEX_NAME, mappings)


def row_to_doc(row: dict) -> tuple[dict, Optional[str]]:
    ein = (row.get("EIN") or "").strip()
    name = (row.get("NAME") or "").strip()
    city = (row.get("CITY") or "").strip()
    state = (row.get("STATE") or "").strip().upper()
    ntee = (row.get("NTEE_CD") or "").strip().upper()
    subsection = (row.get("SUBSECTION") or "").strip()
    deductibility = (row.get("DEDUCTIBILITY") or "").strip()
    return (
        {
            "ein": ein,
            "name": name,
            "city": city,
            "state": state,
            "ntee": ntee,
            "subsection": subsection,
            "deductibility": deductibility,
            "raw": row,
        },
        ein if ein else None,
    )


def main(path: str, limit: int = 100, only_501c3: bool = True) -> None:
    load_dotenv()
    es = ElasticManager(
        host=getenv("ELASTIC_HOST", "http://localhost:9200"),
        credentials=(
            getenv("ELASTIC_USERNAME", "elastic"),
            getenv("ELASTIC_PASSWORD", "password"),
        ),
    )

    create_index_if_needed(es)

    added = 0
    with open(path, newline="", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if only_501c3 and (row.get("SUBSECTION") != "03"):
                continue
            doc, doc_id = row_to_doc(row)
            if doc_id:
                es.add_document(doc_id, doc, INDEX_NAME)
            else:
                es.bulk_add([doc], INDEX_NAME)
            added += 1
            if added >= limit:
                break
    print(f"Inserted {added} documents into index '{INDEX_NAME}' from {path}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Load nonprofits CSV into Elasticsearch")
    parser.add_argument(
        "--file",
        default="/home/bputm/projects/NP-Complete/data/eo_oh_1k.csv",
        help="Path to CSV (default: data/eo_oh_1k.csv)",
    )
    parser.add_argument("--limit", type=int, default=100, help="Max rows to index")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Index all subsections (default indexes only 501(c)(3))",
    )
    args = parser.parse_args()
    main(args.file, args.limit, only_501c3=not args.all)


