import re
from typing import List, Optional, Tuple, Set
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from src.utils.text import normalize_url

# Known Blinkwed image domains
FIRST_PARTY_DOMAINS = {"blinkwed.com", "www.blinkwed.com"}

# Patterns to filter out (logos, icons, placeholders, UI SVGs)
EXCLUDE_PATTERNS = [
    re.compile(r"logo", re.I),
    re.compile(r"\.svg(\?|$)", re.I),
    re.compile(r"icon", re.I),
    re.compile(r"favicon", re.I),
    re.compile(r"avatar", re.I),
    re.compile(r"placeholder", re.I),
    re.compile(r"wedmegood", re.I),
    re.compile(r"data:image", re.I),
]


class ExtractedImageInfo:
    def __init__(self, url: str, is_thumbnail: bool = False, source_page: str = ""):
        self.url = url
        self.is_thumbnail = is_thumbnail
        self.source_page = source_page
        parsed = urlparse(url)
        self.host = parsed.netloc.lower()
        self.is_first_party = any(self.host == d or self.host.endswith("." + d) for d in FIRST_PARTY_DOMAINS)
        self.is_authorized_download = self.is_first_party
        self.reason = None if self.is_authorized_download else "third-party image; reuse permission not established"


def is_valid_venue_photo(url: str) -> bool:
    """Filter out UI icons, logos, SVGs, and tracking pixels."""
    if not url:
        return False
    lower = url.lower()
    for pattern in EXCLUDE_PATTERNS:
        if pattern.search(lower):
            return False
    # Check for valid image extensions or storage path
    if any(ext in lower for ext in [".jpg", ".jpeg", ".png", ".webp", "storage/"]):
        return True
    return False


def extract_css_background_images(html: str, base_url: str = "https://www.blinkwed.com") -> List[str]:
    """Find background-image URLs in inline CSS style attributes."""
    urls = []
    # Match url('...') or url("...") or url(...)
    bg_pattern = re.compile(r"background(?:-image)?\s*:\s*[^;]*url\(\s*['\"]?([^'\"\)\s]+)['\"]?\s*\)", re.I)
    matches = bg_pattern.findall(html)
    for m in matches:
        clean = normalize_url(m, base_url)
        if clean and is_valid_venue_photo(clean):
            urls.append(clean)
    return urls


def extract_detail_images(
    html: str,
    page_url: str,
    listing_thumbnail: Optional[str] = None
) -> Tuple[Optional[ExtractedImageInfo], List[ExtractedImageInfo]]:
    """
    Extract main thumbnail and gallery photos from detail page HTML.
    Returns (thumbnail, gallery_images).
    """
    soup = BeautifulSoup(html, "html.parser")
    seen_urls: Set[str] = set()
    gallery_images: List[ExtractedImageInfo] = []

    # 1. Look for gallery images in specific containers (.gallery-image, [class*='gallery'])
    candidate_elements = soup.select(".gallery-image, [class*='gallery'] img, .swiper-slide img, .carousel img")
    for el in candidate_elements:
        src = el.get("src") or el.get("data-src") or el.get("data-lazy-src")
        if src:
            norm = normalize_url(src, page_url)
            if norm and is_valid_venue_photo(norm) and norm not in seen_urls:
                seen_urls.add(norm)
                gallery_images.append(ExtractedImageInfo(norm, is_thumbnail=False, source_page=page_url))

    # 2. Look for any storage venue images on page
    all_imgs = soup.find_all("img")
    for img in all_imgs:
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if src:
            norm = normalize_url(src, page_url)
            if norm and is_valid_venue_photo(norm) and norm not in seen_urls:
                # Filter out similar venues section if possible
                parent_similar = img.find_parent(lambda tag: tag.has_attr("class") and any("similar" in c.lower() for c in tag.get("class", [])))
                if not parent_similar:
                    seen_urls.add(norm)
                    gallery_images.append(ExtractedImageInfo(norm, is_thumbnail=False, source_page=page_url))

    # 3. Check inline CSS background images
    bg_urls = extract_css_background_images(html, page_url)
    for bg_url in bg_urls:
        if bg_url not in seen_urls:
            seen_urls.add(bg_url)
            gallery_images.append(ExtractedImageInfo(bg_url, is_thumbnail=False, source_page=page_url))

    # Determine thumbnail
    thumbnail_info: Optional[ExtractedImageInfo] = None
    if listing_thumbnail and is_valid_venue_photo(listing_thumbnail):
        norm_thumb = normalize_url(listing_thumbnail, page_url)
        if norm_thumb:
            thumbnail_info = ExtractedImageInfo(norm_thumb, is_thumbnail=True, source_page=page_url)
            # Remove from gallery if present to avoid duplication
            gallery_images = [img for img in gallery_images if img.url != norm_thumb]
    elif gallery_images:
        # If no listing thumbnail was passed, take the first gallery image
        first = gallery_images.pop(0)
        first.is_thumbnail = True
        thumbnail_info = first

    return thumbnail_info, gallery_images
