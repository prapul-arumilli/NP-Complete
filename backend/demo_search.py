from os import getenv
from dotenv import load_dotenv
from es_manager import ElasticManager
from typing import Optional

try:
    # Reuse the existing loader to seed the index when needed
    from load_nonprofits_from_csv import main as load_csv_main
except Exception:  # pragma: no cover
    load_csv_main = None  # type: ignore


def print_hits(label: str, hits: list[dict], limit: int = 5) -> None:
    print(f"\n=== {label} (showing up to {limit}) ===")
    for hit in hits[:limit]:
        source = hit.get("_source", {})
        name = source.get("name") or source.get("NAME") or "(no name)"
        city = source.get("city") or source.get("CITY")
        state = source.get("state") or source.get("STATE")
        ein = source.get("ein") or source.get("EIN")
        ntee = source.get("ntee") or source.get("NTEE_CD")

        parts: list[str] = [name]
        if city or state:
            loc = f"{city or ''}{', ' if city and state else ''}{state or ''}"
            parts.append(f"({loc})")
        if ntee:
            parts.append(f"NTEE {ntee}")
        if ein:
            parts.append(f"EIN {ein}")
        print(" — ".join(parts))


def ensure_index_with_sample(
    es: ElasticManager,
    index_name: str,
    *,
    csv_path: Optional[str] = "/home/bputm/projects/NP-Complete/data/eo_oh_1k.csv",
    limit: int = 100,
) -> None:
    """Ensure the index exists and has docs; if not, load a small sample.

    This uses the project loader to ingest a small CSV slice so demo queries work
    out of the box.
    """
    try:
        # Check existence
        exists = es.es.indices.exists(index=index_name)  # type: ignore[attr-defined]
        if not exists:
            _maybe_load(csv_path, limit)
            return

        # Check document count
        count = es.es.count(index=index_name)["count"]  # type: ignore[attr-defined]
        if int(count) == 0:
            _maybe_load(csv_path, limit)
    except Exception:
        _maybe_load(csv_path, limit)


def _maybe_load(csv_path: Optional[str], limit: int) -> None:
    if load_csv_main is None:
        print("Index missing/empty, but loader not importable. Skipping auto-load.")
        return
    if not csv_path:
        print("Index missing/empty and no CSV path provided. Skipping auto-load.")
        return
    print(f"Seeding index from CSV: {csv_path} (limit {limit})...")
    try:
        load_csv_main(csv_path, limit)
    except Exception as exc:  # pragma: no cover
        print(f"Auto-load failed: {exc}")


def main() -> None:
    load_dotenv()
    es = ElasticManager(
        host=getenv("ELASTIC_HOST", "http://localhost:9200"),
        credentials=(
            getenv("ELASTIC_USERNAME", "elastic"),
            getenv("ELASTIC_PASSWORD", "password"),
        ),
    )
    index = "nonprofits"

    ensure_index_with_sample(es, index)

    queries: list[tuple[str, dict]] = [
        (
            "Match name: church",
            {"query": {"match": {"name": "church"}}},
        ),
        (
            "Match name: foundation",
            {"query": {"match": {"name": "foundation"}}},
        ),
        (
            "Match city: Columbus",
            {"query": {"match": {"city": "Columbus"}}},
        ),
        (
            "Prefix name: amer*",
            {"query": {"prefix": {"name": "amer"}}},
        ),
        (
            "Exact EIN: 010590897",
            {"query": {"term": {"ein": "010590897"}}},
        ),
        (
            "Exact NTEE: B82",
            {"query": {"term": {"ntee": "B82"}}},
        ),
        (
            "State OH + name contains 'band'",
            {
                "query": {
                    "bool": {
                        "must": [{"match": {"name": "band"}}],
                        "filter": [{"term": {"state": "OH"}}],
                    }
                }
            },
        ),
        (
            "Filter subsection 03 (501c3)",
            {"query": {"term": {"subsection": "03"}}},
        ),
    ]

    for label, q in queries:
        try:
            hits = es.search(q, index)
            print_hits(label, hits)
        except Exception as exc:
            print(f"{label} -> error: {exc}")


if __name__ == "__main__":
    main()
