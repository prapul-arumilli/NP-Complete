import json
import os
from os import getenv

from dotenv import load_dotenv
from es_manager import ElasticManager

load_dotenv()


def load_json_files(directory: str) -> list[dict]:
    """Load all JSON files from a directory into a list of dicts."""
    documents = []
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    documents.append(data)
                except json.JSONDecodeError as e:
                    print(f"⚠️ Skipping {filename}, invalid JSON: {e}")
    return documents


if __name__ == "__main__":
    # ElasticSearch connection config
    elastic_user = getenv("ELASTIC_USERNAME", "elastic")
    elastic_password = getenv("ELASTIC_PASSWORD", "password")
    elastic_host = getenv("ELASTIC_HOST", "http://localhost:9200")
    index_name = getenv("ELASTIC_INDEX", "nonprofits")

    # Initialize manager
    ESManager = ElasticManager(
        host=elastic_host,
        credentials=(elastic_user, elastic_password),
    )

    # Ensure index exists (won’t overwrite if already there)
    ESManager.create_index(index_name=index_name)

    # Load JSON docs
    directory = "./data"  # change this path to your JSON directory
    documents = load_json_files(directory)

    # Append docs into index
    if documents:
        ESManager.bulk_add(documents, index_name=index_name)
    else:
        print("No JSON files found to load.")

    # Verify that it worked
    docs = ESManager.get_all_documents(index_name)
    print(docs)
