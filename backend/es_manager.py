from os import getenv
from typing import Any

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()


class ElasticManager:
    def __init__(
        self,
        host: str = "http://localhost:9200",
        credentials: tuple[str, str] = ("elastic", "elastic"),
    ):
        self.es = Elasticsearch(host, basic_auth=credentials)
        if not self.es.ping():
            raise ValueError(f"Elasticsearch is not running at {host}")

    def get_info(self):
        """Gets the settings for the cluster connected"""
        return self.es.info()

    def create_index(self, index_name: str, mappings: list[dict[str, Any]] = None):
        """Create index with optional mappings"""
        if not self.es.indices.exists(index=index_name):
            body = {"mappings": mappings} if mappings else {}
            self.es.indices.create(index=index_name, body=body)
            print(f"Index '{index_name}' created.")
        else:
            print(f"Index '{index_name}' already exists.")

    def add_document(self, doc_id: str, document: dict[str, Any], index_name: str):
        """Add or update a document by id"""
        self.es.index(index=index_name, id=doc_id, document=document)
        print(f"Document {doc_id} added/updated.")

    def bulk_add(self, documents: list[dict[str, Any]], index_name: str):
        """Add a list of documents (auto assigns IDs)"""
        for doc in documents:
            self.es.index(index=index_name, document=doc)
        print(f"{len(documents)} documents added.")

    def search(self, query: dict[str, Any], index_name: str):
        """Run a search query"""
        response = self.es.search(index=index_name, body=query)
        return response["hits"]["hits"]

    def delete_document(self, doc_id: str, index_name: str):
        """Delete a document by ID"""
        self.es.delete(index=index_name, id=doc_id, ignore=[404])
        print(f"Document {doc_id} deleted (if existed).")

    def delete_index(self, index_name: str):
        """Delete the entire index"""
        self.es.indices.delete(index=index_name, ignore=[400, 404])
        print(f"Index '{index_name}' deleted (if existed).")


# Example Usage
if __name__ == "__main__":
    elastic_user = getenv("ELASTIC_USERNAME", "elastic")
    elastic_password = getenv("ELASTIC_PASSWORD", "password")
    elastic_host = getenv("ELASTIC_HOST", "http://localhost:9200")

    ESManager = ElasticManager(
        host=elastic_host, credentials=(elastic_user, elastic_password)
    )
    es_info = ESManager.get_info()
    print(es_info)
