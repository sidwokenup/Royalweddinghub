from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List
from loguru import logger

from src.scraper.browser import PlaywrightSession
from src.scraper.parser import parse_detail_page
from src.scraper.image_extractor import extract_detail_images, ExtractedImageInfo


async def enrich_venue_details(
    session: PlaywrightSession,
    venue_data: Dict[str, Any],
) -> Tuple[Dict[str, Any], Optional[ExtractedImageInfo], List[ExtractedImageInfo]]:
    """
    Open detail page for a venue, extract granular data and media references.
    Returns (enriched_data, thumbnail_candidate, gallery_candidates).
    """
    url = venue_data["detail_url"]
    logger.info(f"Opening venue detail page: {url}")

    html = await session.fetch_page_content(url)
    if not html:
        logger.warning(f"Could not load detail page for {venue_data['name']}. Preserving listing data.")
        # Return listing thumbnail if any
        thumb = None
        if venue_data.get("thumbnail_url"):
            thumb = ExtractedImageInfo(venue_data["thumbnail_url"], is_thumbnail=True, source_page=url)
        return venue_data, thumb, []

    # Parse details
    parsed_details = parse_detail_page(html, url)

    # Merge fields if detail page has them, otherwise keep listing card values
    if parsed_details.get("amenities"):
        venue_data["amenities"] = parsed_details["amenities"]

    if parsed_details.get("description"):
        venue_data["description"] = parsed_details["description"]

    # Capacity
    cap = venue_data["capacity"]
    if parsed_details.get("capacity") and not cap.get("capacity"):
        cap["capacity"] = parsed_details["capacity"]
    if parsed_details.get("rooms") and not cap.get("rooms"):
        cap["rooms"] = parsed_details["rooms"]
    if parsed_details.get("min_pax") and not cap.get("min_pax"):
        cap["min_pax"] = parsed_details["min_pax"]
    if parsed_details.get("max_pax") and not cap.get("max_pax"):
        cap["max_pax"] = parsed_details["max_pax"]

    # Food pricing
    food = venue_data["food"]
    if parsed_details.get("veg_price") and not food.get("vegetarian_price"):
        food["vegetarian_price"] = parsed_details["veg_price"]
    if parsed_details.get("non_veg_price") and not food.get("non_veg_price"):
        food["non_veg_price"] = parsed_details["non_veg_price"]

    # Contact phone
    if parsed_details.get("contact_phone"):
        venue_data["contact_phone"] = parsed_details["contact_phone"]

    # Extract images
    listing_thumb = venue_data.get("thumbnail_url")
    thumbnail_candidate, gallery_candidates = extract_detail_images(html, url, listing_thumb)

    logger.info(
        f"Parsed detail for {venue_data['name']}: {len(gallery_candidates)} gallery photos found"
    )

    return venue_data, thumbnail_candidate, gallery_candidates
