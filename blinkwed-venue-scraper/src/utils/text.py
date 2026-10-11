import re
from typing import Optional, Tuple
from urllib.parse import urljoin, urlparse

def clean_whitespace(text: Optional[str]) -> Optional[str]:
    """Normalize multiple spaces, tabs, and newlines into a single space."""
    if not text:
        return None
    cleaned = re.sub(r"\s+", " ", text).strip()
    return cleaned if cleaned else None

def generate_slug(text: str) -> str:
    """
    Convert string into a filesystem-safe slug.
    Example: 'Magnolia Garden | Marriage Lawn' -> 'magnolia-garden-marriage-lawn'
    Rules:
    - lowercase
    - spaces & separators -> hyphen
    - remove unsafe filesystem characters
    - collapse duplicate hyphens
    - trim hyphens from ends
    """
    if not text:
        return "unnamed-venue"
    # Replace separators like |, /, &, +, commas with hyphen
    s = re.sub(r"[|/&+,:]+", "-", text.lower())
    # Remove all characters except alphanumeric, hyphen, and underscore
    s = re.sub(r"[^\w\s-]", "", s)
    # Replace spaces with hyphens
    s = re.sub(r"[\s_]+", "-", s)
    # Collapse consecutive hyphens
    s = re.sub(r"-+", "-", s)
    s = s.strip("-")
    return s or "unnamed-venue"

def parse_price(text: Optional[str]) -> Optional[int]:
    """
    Extract numeric price from text like '₹900', 'Rs 1,500', 'INR 1,200'.
    Returns None if text contains 'request', 'n/a', '0', or no valid price digits.
    """
    if not text:
        return None
    lower = text.lower()
    if "request" in lower or "call" in lower:
        return None
    # Require currency symbol or prefix
    match = re.search(r"(?:₹|rs\.?|inr)\s*(\d[\d,]*)", text, re.IGNORECASE)
    if match:
        digits_str = match.group(1).replace(",", "")
        try:
            val = int(digits_str)
            return val if val > 0 else None
        except ValueError:
            return None
    return None

def parse_pax_range(text: Optional[str]) -> Tuple[Optional[int], Optional[int]]:
    """
    Extract min and max pax from strings like:
    '50 - 200 pax' -> (50, 200)
    '50min:200max' -> (50, 200)
    '150 pax' -> (150, 150)
    """
    if not text:
        return None, None
    clean = text.lower().replace("pax", "").replace("min", " ").replace("max", " ").replace(":", " ")
    numbers = [int(n) for n in re.findall(r"\b\d+\b", clean)]
    if len(numbers) >= 2:
        return min(numbers[0], numbers[1]), max(numbers[0], numbers[1])
    elif len(numbers) == 1:
        return numbers[0], numbers[0]
    return None, None

def parse_capacity_number(text: Optional[str]) -> Optional[int]:
    """
    Extract capacity number from '150 Capacity' or '150 Guests'.
    """
    if not text:
        return None
    match = re.search(r"\b(\d+)\s*(?:capacity|guests)?\b", text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None

def parse_room_count(text: Optional[str]) -> Optional[int]:
    """
    Extract room count from '10 Rooms' or 'Rooms: 10'.
    """
    if not text:
        return None
    match = re.search(r"\b(\d+)\s*rooms?\b", text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    # Or 'Rooms 10'
    match2 = re.search(r"\brooms?\s*[:\-]?\s*(\d+)\b", text, re.IGNORECASE)
    if match2:
        return int(match2.group(1))
    # If it's just a number in a 'Rooms' section
    if text.strip().isdigit():
        return int(text.strip())
    return None

def parse_address_components(address_raw: Optional[str]) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Extract full address, city, and state.
    Blinkwed venues are primarily located in Lucknow, Uttar Pradesh.
    """
    if not address_raw:
        return None, None, None
    address = clean_whitespace(address_raw)
    city = None
    state = None

    if "lucknow" in address.lower():
        city = "Lucknow"
    elif "kanpur" in address.lower():
        city = "Kanpur"

    if "uttar pradesh" in address.lower() or "up" in address.lower():
        state = "Uttar Pradesh"

    return address, city, state

def normalize_url(url: Optional[str], base_url: str = "https://www.blinkwed.com") -> Optional[str]:
    """Normalize relative and absolute URLs, removing trailing fragments."""
    if not url:
        return None
    url = url.strip()
    if url.startswith("//"):
        url = "https:" + url
    elif url.startswith("/"):
        url = urljoin(base_url, url)
    elif not url.startswith("http://") and not url.startswith("https://"):
        url = urljoin(base_url, url)
    # Remove fragment
    parsed = urlparse(url)
    clean = parsed._replace(fragment="").geturl()
    return clean
