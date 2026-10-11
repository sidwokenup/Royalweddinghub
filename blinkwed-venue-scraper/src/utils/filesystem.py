import os
import json
import hashlib
from pathlib import Path
from typing import Optional, Dict, Any, List

def ensure_directory(path: Path | str) -> Path:
    """Ensure directory exists and return Path object."""
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p

def get_venue_image_dir(base_images_dir: Path | str, venue_slug: str) -> Path:
    """Get the destination directory for a venue's media assets."""
    venue_dir = Path(base_images_dir) / venue_slug
    return ensure_directory(venue_dir)

def calculate_sha256(data: bytes) -> str:
    """Compute SHA-256 hash of byte buffer."""
    return hashlib.sha256(data).hexdigest()

def save_json(data: Dict[str, Any], filepath: Path | str, indent: int = 2) -> None:
    """Save dictionary/model data to JSON file with UTF-8 encoding."""
    p = Path(filepath)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)

def load_json(filepath: Path | str) -> Optional[Dict[str, Any]]:
    """Load JSON file if it exists, otherwise return None."""
    p = Path(filepath)
    if not p.is_file():
        return None
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

def resolve_unique_slug(base_slug: str, existing_slugs: set[str], venue_id: str) -> str:
    """
    Ensure the slug is unique among discovered venues.
    If conflict occurs, append a short stable identifier.
    """
    if base_slug not in existing_slugs:
        return base_slug
    short_id = venue_id[:6]
    candidate = f"{base_slug}-{short_id}"
    counter = 1
    while candidate in existing_slugs:
        candidate = f"{base_slug}-{short_id}-{counter}"
        counter += 1
    return candidate
