import os
import sys
import argparse
import asyncio
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional, Set
import httpx
from dotenv import load_dotenv

# Ensure the root directory of the scraper is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from src.utils.logging import setup_logger
from src.utils.filesystem import (
    ensure_directory,
    save_json,
    load_json,
    resolve_unique_slug,
    get_venue_image_dir,
)
from src.models.venue import (
    Venue,
    VenuesContainer,
    FoodPricing,
    CapacityInfo,
    ImageItem,
    SourceMeta,
    ScrapeReport,
)
from src.scraper.browser import PlaywrightSession
from src.scraper.venue_listing import crawl_listing_pages
from src.scraper.venue_detail import enrich_venue_details
from src.scraper.downloader import ImageDownloader


async def run_scraper(
    category: Optional[str] = None,
    limit: Optional[int] = None,
    images_only: bool = False,
    data_only: bool = False,
    resume: bool = False,
    dry_run: bool = False,
) -> None:
    # Load environment variables
    env_path = BASE_DIR / ".env"
    load_dotenv(dotenv_path=env_path)

    base_url = os.getenv("BASE_URL", "https://www.blinkwed.com")
    venue_url = os.getenv("VENUE_URL", "https://www.blinkwed.com/allvenues")
    request_delay = float(os.getenv("REQUEST_DELAY", "1.0"))
    max_concurrency = int(os.getenv("MAX_CONCURRENCY", "2"))
    timeout_ms = int(os.getenv("REQUEST_TIMEOUT", "30000"))

    # Setup directories
    json_dir = ensure_directory(BASE_DIR / "data" / "json")
    images_dir = ensure_directory(BASE_DIR / "data" / "images")
    logs_dir = ensure_directory(BASE_DIR / "data" / "logs")
    reports_dir = ensure_directory(BASE_DIR / "data" / "reports")

    logger = setup_logger(str(logs_dir / "scraper.log"))
    logger.info("==================================================")
    logger.info("Starting BlinkWed Venue Data & Image Scraper")
    logger.info(f"Config: delay={request_delay}s, concurrency={max_concurrency}, dry_run={dry_run}")
    logger.info("==================================================")

    venues_file = json_dir / "venues.json"
    report_file = reports_dir / "scrape_report.json"

    started_at = datetime.now(timezone.utc).isoformat()
    venues_discovered = 0
    venues_successfully_parsed = 0
    venues_failed = 0
    images_discovered = 0
    images_downloaded = 0
    images_skipped = 0
    duplicates = 0
    errors: List[Dict[str, Any]] = []

    # Resume loading
    existing_venues: Dict[str, Venue] = {}  # detail_url -> Venue
    existing_slugs: Set[str] = set()
    if (resume or images_only) and venues_file.exists():
        loaded_data = load_json(venues_file)
        if loaded_data and "venues" in loaded_data:
            logger.info(f"Loading existing data for resume: {len(loaded_data['venues'])} venues found.")
            for v_dict in loaded_data["venues"]:
                try:
                    v_model = Venue(**v_dict)
                    existing_venues[v_model.detail_url] = v_model
                    existing_slugs.add(v_model.slug)
                except Exception as e:
                    logger.warning(f"Failed to parse existing venue item: {e}")

    # Initialize Playwright session
    session = PlaywrightSession(
        headless=True,
        timeout_ms=timeout_ms,
        request_delay=request_delay,
    )
    await session.start()

    cookies = await session.get_cookies()

    downloader = ImageDownloader(
        base_images_dir=images_dir,
        max_concurrency=max_concurrency,
        request_delay=request_delay,
        cookies=cookies,
        dry_run=dry_run,
    )

    final_venues_list: List[Venue] = list(existing_venues.values())

    async with httpx.AsyncClient(
        headers={"User-Agent": session.user_agent, "Referer": "https://www.blinkwed.com/"},
        cookies=cookies,
        follow_redirects=True,
    ) as http_client:

        # Step 1: Listing Discovery (unless images_only is chosen with existing venues)
        candidate_cards = []
        if not (images_only and existing_venues):
            logger.info("Step 1: Discovering venues from listing pages...")
            candidate_cards = await crawl_listing_pages(
                session=session,
                base_url=venue_url,
                target_category=category,
                limit=limit,
            )
            venues_discovered = len(candidate_cards)
            logger.info(f"Discovered {venues_discovered} venues.")

        # Step 2: Processing and enrichment
        venues_to_process = candidate_cards if candidate_cards else [
            {"detail_url": v.detail_url, "name": v.name, "slug": v.slug}
            for v in existing_venues.values()
        ]

        if limit and len(venues_to_process) > limit:
            venues_to_process = venues_to_process[:limit]

        for idx, card in enumerate(venues_to_process, 1):
            detail_url = card["detail_url"]
            venue_name = card.get("name", "Unknown Venue")
            logger.info(f"--- Processing Venue ({idx}/{len(venues_to_process)}): {venue_name} ---")

            if resume and detail_url in existing_venues and not images_only:
                logger.info(f"Skipping already processed venue (resume mode): {venue_name}")
                venues_successfully_parsed += 1
                continue

            try:
                # If images-only and venue already in existing_venues, reuse its details
                if images_only and detail_url in existing_venues:
                    enriched_card = existing_venues[detail_url].model_dump()
                    thumb_candidate = None
                    gallery_candidates = []
                    # Check existing images
                    if enriched_card.get("thumbnail") and enriched_card["thumbnail"].get("source_url"):
                        from src.scraper.image_extractor import ExtractedImageInfo
                        thumb_candidate = ExtractedImageInfo(
                            enriched_card["thumbnail"]["source_url"],
                            is_thumbnail=True,
                            source_page=detail_url
                        )
                    for g in enriched_card.get("gallery", []):
                        if g.get("source_url"):
                            from src.scraper.image_extractor import ExtractedImageInfo
                            gallery_candidates.append(
                                ExtractedImageInfo(g["source_url"], is_thumbnail=False, source_page=detail_url)
                            )
                else:
                    # Enrich from detail page
                    enriched_card, thumb_candidate, gallery_candidates = await enrich_venue_details(
                        session=session,
                        venue_data=card,
                    )

                # Ensure slug uniqueness
                base_slug = enriched_card.get("slug") or "venue"
                unique_slug = resolve_unique_slug(base_slug, existing_slugs, enriched_card.get("id", base_slug))
                existing_slugs.add(unique_slug)
                enriched_card["slug"] = unique_slug

                # Process images if not in data_only mode
                processed_thumb: Optional[ImageItem] = None
                processed_gallery: List[ImageItem] = []

                if not data_only:
                    if thumb_candidate:
                        images_discovered += 1
                        processed_thumb = await downloader.process_image(
                            thumb_candidate,
                            unique_slug,
                            filename_prefix="thumbnail",
                            client=http_client,
                        )
                        if processed_thumb.downloaded:
                            images_downloaded += 1
                            if "Duplicate" in (processed_thumb.reason or ""):
                                duplicates += 1
                        else:
                            images_skipped += 1

                    for g_idx, g_candidate in enumerate(gallery_candidates, 1):
                        images_discovered += 1
                        prefix = f"gallery_{g_idx:03d}"
                        g_item = await downloader.process_image(
                            g_candidate,
                            unique_slug,
                            filename_prefix=prefix,
                            client=http_client,
                        )
                        processed_gallery.append(g_item)
                        if g_item.downloaded:
                            images_downloaded += 1
                            if "Duplicate" in (g_item.reason or ""):
                                duplicates += 1
                        else:
                            images_skipped += 1
                else:
                    # In data-only mode, record source URLs without downloading
                    if thumb_candidate:
                        images_discovered += 1
                        processed_thumb = ImageItem(
                            source_url=thumb_candidate.url,
                            image_host=thumb_candidate.host,
                            page_source_url=thumb_candidate.source_page,
                            downloaded=False,
                            reason="data-only mode enabled",
                        )
                    for g_candidate in gallery_candidates:
                        images_discovered += 1
                        processed_gallery.append(
                            ImageItem(
                                source_url=g_candidate.url,
                                image_host=g_candidate.host,
                                page_source_url=g_candidate.source_page,
                                downloaded=False,
                                reason="data-only mode enabled",
                            )
                        )

                # Construct Pydantic Venue model
                current_time = datetime.now(timezone.utc).isoformat()
                venue_model = Venue(
                    id=enriched_card.get("id") or unique_slug,
                    name=enriched_card.get("name", venue_name),
                    slug=unique_slug,
                    detail_url=detail_url,
                    category=enriched_card.get("category"),
                    address=enriched_card.get("address"),
                    city=enriched_card.get("city", "Lucknow"),
                    state=enriched_card.get("state", "Uttar Pradesh"),
                    rating=enriched_card.get("rating"),
                    review_count=enriched_card.get("review_count"),
                    food=FoodPricing(**enriched_card.get("food", {})),
                    capacity=CapacityInfo(**enriched_card.get("capacity", {})),
                    description=enriched_card.get("description"),
                    amenities=enriched_card.get("amenities", []),
                    contact_phone=enriched_card.get("contact_phone"),
                    website_url=enriched_card.get("website_url"),
                    thumbnail=processed_thumb or ImageItem(),
                    gallery=processed_gallery,
                    source=SourceMeta(
                        website="BlinkWed",
                        url=detail_url,
                        scraped_at=current_time,
                    ),
                )

                # Update collections
                existing_venues[detail_url] = venue_model
                venues_successfully_parsed += 1

                # Incremental write to prevent data loss on interrupted crawls
                container = VenuesContainer(
                    source="BlinkWed",
                    source_url="https://www.blinkwed.com/",
                    scraped_at=current_time,
                    venues=list(existing_venues.values()),
                )
                save_json(container.model_dump(), venues_file)

            except Exception as e:
                venues_failed += 1
                error_entry = {
                    "venue": venue_name,
                    "url": detail_url,
                    "error": str(e),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
                errors.append(error_entry)
                logger.error(f"Failed processing venue '{venue_name}' ({detail_url}): {e}")

    # Close browser session
    await session.close()

    # Generate and save final scrape report
    completed_at = datetime.now(timezone.utc).isoformat()
    report = ScrapeReport(
        started_at=started_at,
        completed_at=completed_at,
        venues_discovered=venues_discovered or len(existing_venues),
        venues_successfully_parsed=venues_successfully_parsed,
        venues_failed=venues_failed,
        images_discovered=images_discovered,
        images_downloaded=images_downloaded,
        images_skipped=images_skipped,
        duplicates=duplicates,
        errors=errors,
    )
    save_json(report.model_dump(), report_file)

    logger.info("==================================================")
    logger.info("Scraping Completed Successfully!")
    logger.info(f"Venues Discovered: {report.venues_discovered}")
    logger.info(f"Venues Parsed: {report.venues_successfully_parsed}")
    logger.info(f"Venues Failed: {report.venues_failed}")
    logger.info(f"Images Discovered: {report.images_discovered}")
    logger.info(f"Images Downloaded: {report.images_downloaded}")
    logger.info(f"Images Skipped: {report.images_skipped}")
    logger.info(f"Duplicates: {report.duplicates}")
    logger.info(f"Output JSON: {venues_file}")
    logger.info(f"Report JSON: {report_file}")
    logger.info("==================================================")


def main():
    parser = argparse.ArgumentParser(description="BlinkWed Wedding Venue Data + Image Scraper")
    parser.add_argument("--category", type=str, help="Filter crawl to a specific venue category (e.g. 'Banquet Hall')")
    parser.add_argument("--limit", type=int, help="Limit number of venues to discover and parse (e.g. 5)")
    parser.add_argument("--images-only", action="store_true", help="Download images for existing venue data only")
    parser.add_argument("--data-only", action="store_true", help="Extract venue data only without downloading media")
    parser.add_argument("--resume", action="store_true", help="Resume from previously saved venues.json")
    parser.add_argument("--dry-run", action="store_true", help="Discover and parse venues without downloading files")

    args = parser.parse_args()

    asyncio.run(
        run_scraper(
            category=args.category,
            limit=args.limit,
            images_only=args.images_only,
            data_only=args.data_only,
            resume=args.resume,
            dry_run=args.dry_run,
        )
    )


if __name__ == "__main__":
    main()
