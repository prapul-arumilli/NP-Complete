# backend

from os import getenv

from dotenv import load_dotenv
from es_manager import ElasticManager
from flask import Flask, jsonify, request
from flask_cors import CORS
from search_builder import build_es_query_from_survey

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


@app.route("/api/search", methods=["POST"])
@app.route("/api/search", methods=["POST"])
def search_organizations():
    # Accepts a body with { query: { ... }, from, size }
    body = request.get_json(silent=True) or {}
    query_wrapper = body.get("query", {})
    from_ = body.get("from", 0)
    size = body.get("size", 10)

    # Extract inner ES query correctly
    es_query = query_wrapper.get("query", {"match_all": {}})

    # Attach pagination at top-level
    final_query = {"query": es_query, "from": from_, "size": size}

    results = es_manager.search(final_query, INDEX_NAME)
    return jsonify(results)


@app.route("/api/survey", methods=["POST"])
def survey_to_search():
    """Accept survey answers and return ES results based on derived query."""
    answers = request.get_json(silent=True) or []
    es_query = build_es_query_from_survey(answers)
    results = es_manager.search(es_query, INDEX_NAME)
    return jsonify({"query": es_query, "results": results})


@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Backend is running."})


if __name__ == "__main__":
    app.run(debug=True)
