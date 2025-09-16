# backend

from os import getenv

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.es_manager import ElasticManager

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests

load_dotenv()


# Initialize Elastic Manager
elastic_user = getenv("ELASTIC_USERNAME", "elastic")
elastic_password = getenv("ELASTIC_PASSWORD", "password")
elastic_host = getenv("ELASTIC_HOST", "http://localhost:9200")
es_manager = ElasticManager(
    host=elastic_host, credentials=(elastic_user, elastic_password)
)
INDEX_NAME = "nonprofits"


@app.route("/indices/<index_name>", methods=["POST"])
def create_index(index_name):
    mappings = request.json.get("mappings", None)
    es_manager.create_index(index_name, mappings)
    return jsonify({"message": f"Index {index_name} created."})


@app.route("/indices/<index_name>", methods=["DELETE"])
def delete_index(index_name):
    es_manager.delete_index(index_name)
    return jsonify({"message": f"Index {index_name} deleted."})


@app.route("/organizations", methods=["POST"])
def add_organization():
    data = request.json
    doc_id = data.get("id")  # optional
    org_data = {k: v for k, v in data.items() if k != "id"}
    es_manager.add_document(
        doc_id, org_data, INDEX_NAME
    ) if doc_id else es_manager.bulk_add([org_data], INDEX_NAME)
    return jsonify({"message": "Organization added/updated."})


@app.route("/organizations/<org_id>", methods=["PUT"])
def update_organization(org_id):
    data = request.json
    es_manager.add_document(org_id, data, INDEX_NAME)
    return jsonify({"message": f"Organization {org_id} updated."})


@app.route("/organizations/<org_id>", methods=["DELETE"])
def delete_organization(org_id):
    es_manager.delete_document(org_id, INDEX_NAME)
    return jsonify({"message": f"Organization {org_id} deleted."})


@app.route("/organizations/bulk", methods=["POST"])
def bulk_add_organizations():
    documents = request.json.get("organizations", [])
    es_manager.bulk_add(documents, INDEX_NAME)
    return jsonify({"message": f"{len(documents)} organizations added."})


@app.route("/organizations/search", methods=["POST"])
def search_organizations():
    query = request.json.get("query", {"match_all": {}})
    results = es_manager.search(query, INDEX_NAME)
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
