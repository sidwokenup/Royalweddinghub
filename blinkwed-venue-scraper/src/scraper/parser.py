import re
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from src.utils.text import (
    clean_whitespace,
    generate_slug,
    parse_price,
    parse_pax_range,
    parse_capacity_number,
    parse_room_count,
    parse_address_components,
    normalize_url,
)


def parse_listing_card(card_soup: BeautifulSoup, source_url: str) -> Optional[Dict[str, Any]]:
    """Parse an individual venue card from the listing page."""
    link_el = card_soup.select_one("a[href*='/venue/']")
    if not link_el:
        return None

    detail_url = normalize_url(link_el.get("href"), source_url)
    if not detail_url:
        return None

    # Slug from URL
    slug_match = re.search(r"/venue/([^/?#]+)", detail_url)
    url_slug = slug_match.group(1) if slug_match else ""

    # Name: either link text or vendor-detail class or title in card
    name_el = card_soup.select_one("a.vendor-detail, h3, h2, a[href*='/venue/']")
    raw_name = clean_whitespace(name_el.get_text(strip=True)) if name_el else None
    name = raw_name or url_slug.replace("-", " ").title()

    slug = generate_slug(name) or url_slug

    # All text tokens inside card
    tokens = [s.strip() for s in card_soup.stripped_strings if s.strip()]

    # Rating and reviews
    rating: Optional[float] = None
    review_count: Optional[int] = None
    for token in tokens:
        # Rating like '4.9' or '5.0'
        if rating is None and re.match(r"^[1-5]\.\d$", token):
            try:
                rating = float(token)
            except ValueError:
                pass
        # Reviews like '(7 reviews)' or '7 reviews'
        if review_count is None and "review" in token.lower():
            m = re.search(r"\b(\d+)\s*reviews?\b", token, re.I)
            if m:
                review_count = int(m.group(1))

    # Address / Category / Capacity / Pax / Rooms
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    veg_allowed = True
    non_veg_allowed = True
    veg_price = None
    non_veg_price = None
    min_pax = None
    max_pax = None
    capacity = None
    rooms = None
    capacity_raw = None

    known_categories = {"banquet hall", "lawn", "resort", "farmhouse", "hotel"}

    for token in tokens:
        token_lower = token.lower()

        # Category
        if not category and token_lower in known_categories:
            category = token.title()

        # Pax range e.g. '50 - 200 pax'
        if "pax" in token_lower:
            capacity_raw = token
            p_min, p_max = parse_pax_range(token)
            if p_min is not None:
                min_pax, max_pax = p_min, p_max

        # Rooms e.g. '10 Rooms'
        if "rooms" in token_lower and rooms is None:
            rooms = parse_room_count(token)

        # Capacity e.g. '150 Capacity'
        if "capacity" in token_lower and capacity is None:
            capacity = parse_capacity_number(token)

        # Veg / Non-veg
        if "veg" in token_lower:
            if "pure veg" in token_lower or "only veg" in token_lower:
                veg_allowed = True
                non_veg_allowed = False
            elif "non veg" in token_lower:
                veg_allowed = True
                non_veg_allowed = True

        # Price e.g. '₹900' or 'Rs 1,200'
        if ("₹" in token or re.search(r"\b(?:rs\.?|inr)\b", token_lower)) and "per plate" not in token_lower:
            p = parse_price(token)
            if p:
                veg_price = p

        # Address detection (contains city or street keywords, length > 20)
        if len(token) > 20 and any(k in token_lower for k in ["road", "nagar", "lucknow", "pradesh", "university", "sector"]):
            addr, c, s = parse_address_components(token)
            address = addr
            city = c
            state = s

    # Thumbnail image
    thumbnail_url = None
    for img in card_soup.select("img"):
        src = img.get("src")
        if src and "storage" in src and not any(ext in src for ext in [".svg", "logo"]):
            thumbnail_url = normalize_url(src, source_url)
            break

    return {
        "id": url_slug,
        "name": name,
        "slug": slug,
        "detail_url": detail_url,
        "category": category,
        "address": address,
        "city": city or "Lucknow",
        "state": state or "Uttar Pradesh",
        "rating": rating,
        "review_count": review_count,
        "food": {
            "vegetarian": veg_allowed,
            "non_vegetarian": non_veg_allowed,
            "vegetarian_price": veg_price,
            "non_vegetarian_price": non_veg_price,
            "price_unit": "per_plate",
        },
        "capacity": {
            "min_pax": min_pax,
            "max_pax": max_pax,
            "capacity": capacity,
            "rooms": rooms,
            "capacity_raw": capacity_raw,
        },
        "thumbnail_url": thumbnail_url,
    }


def parse_listing_page(html: str, source_url: str) -> List[Dict[str, Any]]:
    """Parse all venue cards from a listing page."""
    soup = BeautifulSoup(html, "html.parser")
    # Cards have classes group bg-white rounded-lg
    cards = soup.select("div.group.bg-white.rounded-lg, div.card, div[class*='rounded-lg shadow']")
    results = []
    seen_urls = set()

    for card in cards:
        parsed = parse_listing_card(card, source_url)
        if parsed and parsed["detail_url"] not in seen_urls:
            seen_urls.add(parsed["detail_url"])
            results.append(parsed)

    return results


def parse_detail_page(html: str, page_url: str) -> Dict[str, Any]:
    """Parse venue detail page for full specs, description, amenities, and photos."""
    soup = BeautifulSoup(html, "html.parser")

    # Amenities
    amenities = []
    # Search for amenities under section
    amenities_heading = soup.find(lambda tag: tag.name in ["h2", "h3", "h4"] and "amenit" in tag.get_text(strip=True).lower())
    if amenities_heading:
        parent = amenities_heading.find_parent("div")
        if parent:
            for item in parent.find_all(["span", "li", "p"]):
                t = clean_whitespace(item.get_text(strip=True))
                if t and len(t) < 40 and not any(k in t.lower() for k in ["amenit", "services"]):
                    if t not in amenities:
                        amenities.append(t)

    # If not found via parent, search common amenities keywords
    if not amenities:
        common_amenities = [
            "WiFi", "Parking", "Valet Parking", "Dry Cleaning", "Air Conditioning",
            "Restaurant", "Bar", "Bridal Room", "DJ", "Pool", "Catering", "Decor"
        ]
        text_full = soup.get_text()
        for a in common_amenities:
            if re.search(r"\b" + re.escape(a) + r"\b", text_full, re.I):
                amenities.append(a)

    # Detailed capacity / pax / rooms
    detail_data: Dict[str, Any] = {
        "amenities": amenities,
        "description": None,
        "rooms": None,
        "capacity": None,
        "min_pax": None,
        "max_pax": None,
        "veg_price": None,
        "non_veg_price": None,
    }

    # Find stats grid
    for p in soup.select("p.text-gray-600, div.text-gray-600"):
        txt = clean_whitespace(p.get_text(strip=True))
        if not txt:
            continue
        # Guests / Capacity
        if "guests" in txt.lower():
            cap = parse_capacity_number(txt)
            if cap:
                detail_data["capacity"] = cap
        # Pax range like 50min:200max
        if "min" in txt.lower() and "max" in txt.lower():
            p_min, p_max = parse_pax_range(txt)
            if p_min is not None:
                detail_data["min_pax"] = p_min
                detail_data["max_pax"] = p_max
        # Rooms
        if txt.isdigit() and int(txt) < 500:
            # Check preceding label
            prev = p.find_previous_sibling() or (p.parent and p.parent.find_previous_sibling())
            if prev and "rooms" in prev.get_text(strip=True).lower():
                detail_data["rooms"] = int(txt)
        # Price
        if "₹" in txt:
            price_val = parse_price(txt)
            if price_val:
                detail_data["veg_price"] = price_val

    # Description / About text
    for p in soup.select("div.section-card p, [class*='about'] p"):
        t = clean_whitespace(p.get_text(strip=True))
        if t and len(t) > 60 and not t.startswith("✨ **Blink Wed") and not t.startswith("*taxes extra"):
            detail_data["description"] = t
            break

    # Public contact if displayed
    contact_phone = None
    tel_link = soup.select_one("a[href^='tel:']")
    if tel_link:
        contact_phone = tel_link.get("href").replace("tel:", "").strip()
    detail_data["contact_phone"] = contact_phone

    return detail_data
