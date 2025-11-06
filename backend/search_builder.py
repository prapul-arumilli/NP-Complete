from typing import List, Dict
from datetime import datetime


def build_es_query_from_survey(answers: List[Dict]) -> Dict:
    """Translate survey answers into an Elasticsearch query.
    
    Survey Structure:
    Q1 (index 0): Cause type - Maps to NTEE codes
    Q2 (index 1): Location (city/state) - Maps to city or state field
    Q3 (index 2): Organization size - Maps to asset_amt field
    Q4 (index 3): Organization age - Maps to ruling date field
    Q5 (index 4): Work environment - Used for keyword boosting
    Q6 (index 5): Email - Not used in search
    """
    # Extract answers
    cause_answer = answers[0].get("answer") if len(answers) > 0 else None
    location_answer = answers[1].get("answer") if len(answers) > 1 else None
    org_size_answer = answers[2].get("answer") if len(answers) > 2 else None
    org_age_answer = answers[3].get("answer") if len(answers) > 3 else None
    environment_answer = answers[4].get("answer") if len(answers) > 4 else None
    # email_answer = answers[5].get("answer") if len(answers) > 5 else None  # Not used

    # Q1: Map cause to NTEE code prefixes
    cause_to_ntee_prefixes: Dict[str, List[str]] = {
        "Education & Youth Development": ["B", "O"],  # Education, Youth Dev
        "Environmental Conservation": ["C"],  # Environment
        "Health & Medical": ["E", "H"],  # Health, Hospitals
        "Poverty & Homelessness": ["K", "L", "P"],  # Food/Clothing, Housing, Human Services
        "Arts & Culture": ["A"],  # Arts
        "Animal Welfare": ["D"],  # Animal-Related
        "Community Development": ["S"],  # Community Improvement
    }

    # Q3: Map organization size to asset amount ranges
    # Note: asset_amt field would need to be added to ES index
    org_size_to_asset_range: Dict[str, Dict] = {
        "Small (Less than $100K)": {"lt": 100000},
        "Medium ($100K–$1M)": {"gte": 100000, "lt": 1000000},
        "Large (More than $1M)": {"gte": 1000000},
    }

    # Q5: Map work environment to NTEE keywords for boosting
    environment_keywords: Dict[str, List[str]] = {
        "Office/Indoor setting": ["foundation", "association", "center"],
        "Outdoor activities": ["park", "conservation", "environmental", "recreation"],
        "Community centers": ["community", "neighborhood", "center"],
        "Virtual/Online work": ["education", "research", "online"],
    }

    # Build query filters
    filters = []
    should_clauses = []
    
    # Q1: Add NTEE prefix filter for cause
    ntee_prefixes = cause_to_ntee_prefixes.get(str(cause_answer or ""), [])
    if ntee_prefixes:
        ntee_should = [{"prefix": {"ntee": prefix}} for prefix in ntee_prefixes]
        filters.append({"bool": {"should": ntee_should, "minimum_should_match": 1}})

    # Q2: Add location filter (search in both city and state)
    if location_answer and location_answer.strip():
        location_clean = location_answer.strip()
        # Try to match as state (2-letter code) or search in city/state fields
        if len(location_clean) == 2:
            # Likely a state code - exact match required
            filters.append({"term": {"state": location_clean.upper()}})
        else:
            # Search in city field - boost matching cities but don't require them
            # This way Columbus orgs rank higher, but other cities still show if needed
            should_clauses.append({"match": {"city": {"query": location_clean, "boost": 2.0}}})

    # Q3: Add organization size filter based on assets
    # NOTE: This requires asset_amt field in ES index (from ASSET_AMT column in CSV)
    if org_size_answer:
        asset_range = org_size_to_asset_range.get(org_size_answer)
        if asset_range:
            filters.append({"range": {"asset_amt": asset_range}})
    
    # Q4: Add organization age filter based on ruling date
    # NOTE: This requires ruling field in ES index (from RULING column in CSV, format: YYYYMM)
    if org_age_answer:
        current_year = datetime.now().year
        if "under 5" in org_age_answer.lower() or "newer" in org_age_answer.lower():
            # Organizations established in the last 5 years
            cutoff_year = current_year - 5
            filters.append({"range": {"ruling": {"gte": cutoff_year * 100}}})
        elif "10+" in org_age_answer.lower() or "established" in org_age_answer.lower():
            # Organizations established 10+ years ago
            cutoff_year = current_year - 10
            filters.append({"range": {"ruling": {"lt": cutoff_year * 100}}})
    
    # Q5: Add name keyword boosting for work environment
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


