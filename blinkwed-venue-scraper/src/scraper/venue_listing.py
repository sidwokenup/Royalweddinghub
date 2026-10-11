import re
from typing import List, Dict, Any, Optional, Set
from bs4 import BeautifulSoup
from loguru import logger

from src.scraper.browser import PlaywrightSession
from src.scraper.parser import parse_listing_page
from src.utils.text import generate_slug, normalize_url


# Default categories known on Blinkwed as fallbacks
DEFAULT_CATEGORIES = [
    {"name": "Banquet Hall", "slug": "banquet-hall"},
    {"name": "Lawn", "slug": "lawn"},
    {"name": "Resort", "slug": "resort"},
    {"name": "Farmhouse", "slug": "farmhouse"},
    {"name": "Hotel", "slug": "hotel"},
]


async def discover_categories(session: PlaywrightSession, base_url: str = "https://www.blinkwed.com/allvenues") -> List[Dict[str, str]]:
    """
    Dynamically discover all venue categories from navigation, dropdowns, and category filter links.
    """
    logger.info("Discovering venue categories from Blinkwed...")
    html = await session.fetch_page_content(base_url)
    if not html:
        logger.warning("Could not fetch base listing page for category discovery. Using defaults.")
        return DEFAULT_CATEGORIES

    soup = BeautifulSoup(html, "html.parser")
    discovered: Dict[str, str] = {}  # slug -> name

    # 1. Search for links with type=
    for a in soup.select("a[href*='type=']"):
        href = a.get("href", "")
        # Filter out vendors
        if "vendor" in href.lower():
            continue
        m = re.search(r"type=([^&]+)", href)
        if m:
            slug = m.group(1).lower().strip()
            # If slug is numeric, map or ignore
            if slug.isdigit():
                continue
            name = a.get_text(strip=True) or slug.replace("-", " ").title()
            if slug not in discovered and len(slug) > 2:
                discovered[slug] = name
                logger.info(f"Discovered category: '{name}' (type={slug})")

    # 2. Add defaults if not already present
    for default in DEFAULT_CATEGORIES:
        if default["slug"] not in discovered:
            discovered[default["slug"]] = default["name"]

    category_list = [{"name": name, "slug": slug} for slug, name in discovered.items()]
    logger.info(f"Total categories ready for crawling: {len(category_list)}")
    return category_list


async def crawl_listing_pages(
    session: PlaywrightSession,
    base_url: str = "https://www.blinkwed.com/allvenues",
    target_category: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Discover all venue listings across /allvenues and category URLs.
    """
    categories = await discover_categories(session, base_url)
    
    if target_category:
        target_slug = generate_slug(target_category)
        categories = [c for c in categories if c["slug"] == target_slug or target_slug in c["slug"] or target_category.lower() in c["name"].lower()]
        if not categories:
            logger.warning(f"Category '{target_category}' not matched. Creating custom category filter.")
            categories = [{"name": target_category, "slug": target_slug}]

    discovered_venues: List[Dict[str, Any]] = []
    seen_urls: Set[str] = set()

    # URLs to crawl: main allvenues page first (if no specific category filtered)
    urls_to_crawl = []
    if not target_category:
        urls_to_crawl.append((base_url, "All Venues"))

    for cat in categories:
        cat_url = f"https://www.blinkwed.com/allvenues?type={cat['slug']}&city="
        urls_to_crawl.append((cat_url, cat["name"]))

    for url, cat_name in urls_to_crawl:
        logger.info(f"Crawling listing page [{cat_name}]: {url}")
        html = await session.fetch_page_content(url)
        if not html:
            logger.warning(f"Failed to fetch {url}")
            continue

        cards = parse_listing_page(html, url)
        logger.info(f"Found {len(cards)} venue cards on {url}")

        for card in cards:
            if not card.get("category"):
                card["category"] = cat_name

            detail_url = card["detail_url"]
            if detail_url not in seen_urls:
                seen_urls.add(detail_url)
                discovered_venues.append(card)
                logger.info(f"Discovered venue [{len(discovered_venues)}]: {card['name']} -> {detail_url}")

                if limit and len(discovered_venues) >= limit:
                    logger.info(f"Reached discovery limit of {limit} venues.")
                    return discovered_venues

    logger.info(f"Total unique venues discovered across listings: {len(discovered_venues)}")
    return discovered_venues
