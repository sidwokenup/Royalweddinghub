import io
import asyncio
from pathlib import Path
from typing import Optional, Dict, Tuple, Set
import httpx
from PIL import Image
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from loguru import logger

from src.models.venue import ImageItem
from src.scraper.image_extractor import ExtractedImageInfo
from src.utils.filesystem import get_venue_image_dir, calculate_sha256


# Mapping of Pillow image formats to file extensions
FORMAT_EXTENSIONS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
    "GIF": ".gif",
}


class ImageDownloader:
    """
    Downloads, validates, deduplicates, and manages venue media assets with strict rights safety.
    """

    def __init__(
        self,
        base_images_dir: Path | str = "data/images",
        max_concurrency: int = 2,
        request_delay: float = 1.0,
        user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        cookies: Optional[Dict[str, str]] = None,
        dry_run: bool = False,
    ):
        self.base_images_dir = Path(base_images_dir)
        self.semaphore = asyncio.Semaphore(max_concurrency)
        self.request_delay = request_delay
        self.user_agent = user_agent
        self.cookies = cookies or {}
        self.dry_run = dry_run

        # Deduplication registries
        self.downloaded_hashes: Dict[str, Path] = {}  # sha256 -> local_path
        self.url_cache: Dict[str, ImageItem] = {}     # url -> ImageItem

    def validate_image_bytes(self, data: bytes) -> Tuple[bool, Optional[str], Optional[int], Optional[int], Optional[str]]:
        """
        Validate image data with Pillow.
        Returns (is_valid, format, width, height, error_message).
        """
        if not data or len(data) < 10:
            return False, None, None, None, "File too small or empty"

        # Check for HTML payload
        lower_header = data[:250].strip().lower()
        if lower_header.startswith(b"<!doctype") or b"<html" in lower_header:
            return False, None, None, None, "Response is HTML, not an image"

        if len(data) < 100:
            return False, None, None, None, "File too small or empty"

        try:
            with Image.open(io.BytesIO(data)) as img:
                img.verify()
                img_format = img.format
                width, height = img.size
                return True, img_format, width, height, None
        except Exception as e:
            return False, None, None, None, f"Corrupted or invalid image: {e}"

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type((httpx.RequestError, httpx.TimeoutException)),
        reraise=True,
    )
    async def _fetch_bytes(self, client: httpx.AsyncClient, url: str) -> httpx.Response:
        """Fetch raw image bytes with retry on network error."""
        return await client.get(url, timeout=30.0)

    async def process_image(
        self,
        image_info: ExtractedImageInfo,
        venue_slug: str,
        filename_prefix: str,  # 'thumbnail' or 'gallery_001'
        client: httpx.AsyncClient,
    ) -> ImageItem:
        """
        Evaluate image rights, download if authorized, validate integrity, and save to filesystem.
        """
        url = image_info.url

        # Check URL cache
        if url in self.url_cache:
            logger.info(f"Image already processed in this run: {url}")
            return self.url_cache[url]

        item = ImageItem(
            source_url=url,
            image_host=image_info.host,
            page_source_url=image_info.source_page,
            downloaded=False,
        )

        # 1. Rights Safety Check
        if not image_info.is_authorized_download:
            item.reason = image_info.reason
            logger.warning(f"Skipping download (Third-party domain '{image_info.host}'): {url}")
            self.url_cache[url] = item
            return item

        # 2. Dry-run Check
        if self.dry_run:
            item.reason = "dry-run mode enabled; download skipped"
            logger.info(f"[DRY RUN] Would download: {url} -> {venue_slug}/{filename_prefix}")
            self.url_cache[url] = item
            return item

        # 3. Download and Concurrency control
        async with self.semaphore:
            if self.request_delay > 0:
                await asyncio.sleep(self.request_delay)

            try:
                logger.info(f"Downloading image: {url}")
                response = await self._fetch_bytes(client, url)

                if response.status_code != 200:
                    item.reason = f"HTTP status {response.status_code}"
                    logger.warning(f"Failed image download ({response.status_code}): {url}")
                    self.url_cache[url] = item
                    return item

                raw_bytes = response.content
                item.file_size = len(raw_bytes)

                # Validate with Pillow
                is_valid, img_fmt, width, height, err_msg = self.validate_image_bytes(raw_bytes)
                if not is_valid:
                    item.reason = err_msg
                    logger.error(f"Image validation failed ({err_msg}): {url}")
                    self.url_cache[url] = item
                    return item

                item.width = width
                item.height = height

                # Check duplicate by SHA-256
                sha256 = calculate_sha256(raw_bytes)
                item.sha256 = sha256

                venue_dir = get_venue_image_dir(self.base_images_dir, venue_slug)
                ext = FORMAT_EXTENSIONS.get(img_fmt or "JPEG", ".jpg")
                dest_path = venue_dir / f"{filename_prefix}{ext}"

                if sha256 in self.downloaded_hashes:
                    existing_path = self.downloaded_hashes[sha256]
                    item.downloaded = True
                    item.local_path = str(existing_path)
                    item.reason = f"Duplicate asset; matches {existing_path.name}"
                    logger.info(f"Duplicate image detected ({sha256[:8]}...), linking to {existing_path}")
                    self.url_cache[url] = item
                    return item

                # Save to disk
                with open(dest_path, "wb") as f:
                    f.write(raw_bytes)

                self.downloaded_hashes[sha256] = dest_path
                item.downloaded = True
                item.local_path = str(dest_path)
                logger.info(f"Successfully saved image: {dest_path}")
                self.url_cache[url] = item
                return item

            except Exception as e:
                item.reason = f"Download exception: {str(e)}"
                logger.error(f"Error downloading {url}: {e}")
                self.url_cache[url] = item
                return item
