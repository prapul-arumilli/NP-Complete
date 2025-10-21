from typing import List, Dict


def build_es_query_from_survey(answers: List[Dict]) -> Dict:
    """Translate survey answers into an Elasticsearch query.

    Current logic maps the first question (cause preference) to NTEE prefixes.
    """
    # Extract the first answer (cause). Frontend sends an array of {question, answer}
    cause_answer = None
    if answers and isinstance(answers, list):
        first = answers[0] if len(answers) > 0 else None
        if isinstance(first, dict):
            cause_answer = first.get("answer")

    # Map human-readable cause to NTEE code prefixes
    cause_to_ntee_prefixes: Dict[str, List[str]] = {
        "Education & Youth Development": ["B", "O"],  # Education, Youth Dev
        "Environmental Conservation": ["C"],  # Environment
        "Health & Medical": ["E", "H"],  # Health, Hospitals
        "Poverty & Homelessness": ["K", "L", "P"],  # Food/Clothing, Housing, Human Services
    }

    ntee_prefixes = cause_to_ntee_prefixes.get(str(cause_answer or ""), [])

    # Build a bool filter on NTEE prefixes; fallback to match_all
    if ntee_prefixes:
        ntee_should = [{"prefix": {"ntee": prefix}} for prefix in ntee_prefixes]
        es_query = {
            "query": {
                "bool": {
                    "filter": [
                        {"bool": {"should": ntee_should, "minimum_should_match": 1}}
                    ]
                }
            },
            "size": 50,
        }
    else:
        es_query = {"query": {"match_all": {}}, "size": 50}

    return es_query


