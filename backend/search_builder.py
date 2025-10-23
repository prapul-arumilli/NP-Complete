from typing import List, Dict


def build_es_query_from_survey(answers: List[Dict]) -> Dict:
    """Translate survey answers into an Elasticsearch query.
    
    Uses Q1 (cause), Q2 (contribution type), and Q5 (work environment).
    """
    # Extract answers
    cause_answer = answers[0].get("answer") if len(answers) > 0 else None
    contribution_answer = answers[1].get("answer") if len(answers) > 1 else None
    environment_answer = answers[4].get("answer") if len(answers) > 4 else None

    # Q1: Map cause to NTEE code prefixes
    cause_to_ntee_prefixes: Dict[str, List[str]] = {
        "Education & Youth Development": ["B", "O"],  # Education, Youth Dev
        "Environmental Conservation": ["C"],  # Environment
        "Health & Medical": ["E", "H"],  # Health, Hospitals
        "Poverty & Homelessness": ["K", "L", "P"],  # Food/Clothing, Housing, Human Services
    }

    # Q2: Map contribution type to NTEE keywords (simple text matching)
    contribution_keywords: Dict[str, List[str]] = {
        "Direct hands-on work with people": ["community", "services", "support", "care"],
        "Behind-the-scenes administrative tasks": ["foundation", "fund", "association"],
        "Fundraising and event planning": ["foundation", "fund", "development"],
        "Online/remote volunteer work": ["education", "research", "information"],
    }

    # Q5: Map work environment to NTEE keywords
    environment_keywords: Dict[str, List[str]] = {
        "Office/Indoor setting": ["foundation", "association", "center"],
        "Outdoor activities": ["park", "conservation", "environmental", "recreation"],
        "Community centers": ["community", "neighborhood", "center"],
        "Virtual/Online work": ["education", "research", "online"],
    }

    # Build query filters
    filters = []
    
    # Add NTEE prefix filter from Q1
    ntee_prefixes = cause_to_ntee_prefixes.get(str(cause_answer or ""), [])
    if ntee_prefixes:
        ntee_should = [{"prefix": {"ntee": prefix}} for prefix in ntee_prefixes]
        filters.append({"bool": {"should": ntee_should, "minimum_should_match": 1}})

    # Add name keyword boosting from Q2 and Q5 (optional matches, boost scores)
    should_clauses = []
    
    if contribution_answer:
        keywords = contribution_keywords.get(contribution_answer, [])
        for keyword in keywords:
            should_clauses.append({"match": {"name": {"query": keyword, "boost": 1.5}}})
    
    if environment_answer:
        keywords = environment_keywords.get(environment_answer, [])
        for keyword in keywords:
            should_clauses.append({"match": {"name": {"query": keyword, "boost": 1.5}}})

    # Build final query
    if filters or should_clauses:
        es_query = {
            "query": {
                "bool": {
                    "filter": filters if filters else [],
                    "should": should_clauses if should_clauses else []
                }
            },
            "size": 50,
        }
    else:
        es_query = {"query": {"match_all": {}}, "size": 50}

    return es_query


