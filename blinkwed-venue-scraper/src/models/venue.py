from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class FoodPricing(BaseModel):
    vegetarian: Optional[bool] = None
    non_vegetarian: Optional[bool] = None
    vegetarian_price: Optional[int] = None
    non_vegetarian_price: Optional[int] = None
    price_unit: str = "per_plate"


class CapacityInfo(BaseModel):
    min_pax: Optional[int] = None
    max_pax: Optional[int] = None
    capacity: Optional[int] = None
    rooms: Optional[int] = None
    capacity_raw: Optional[str] = None


class ImageItem(BaseModel):
    source_url: Optional[str] = None
    local_path: Optional[str] = None
    downloaded: bool = False
    reason: Optional[str] = None
    image_host: Optional[str] = None
    page_source_url: Optional[str] = None
    sha256: Optional[str] = None
    file_size: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None


class SourceMeta(BaseModel):
    website: str = "BlinkWed"
    url: str
    scraped_at: str


class Venue(BaseModel):
    id: str
    name: str
    slug: str
    detail_url: str
    category: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    food: FoodPricing = Field(default_factory=FoodPricing)
    capacity: CapacityInfo = Field(default_factory=CapacityInfo)
    description: Optional[str] = None
    amenities: List[str] = Field(default_factory=list)
    contact_phone: Optional[str] = None
    website_url: Optional[str] = None
    thumbnail: ImageItem = Field(default_factory=ImageItem)
    gallery: List[ImageItem] = Field(default_factory=list)
    source: SourceMeta


class VenuesContainer(BaseModel):
    source: str = "BlinkWed"
    source_url: str = "https://www.blinkwed.com/"
    scraped_at: str
    venues: List[Venue] = Field(default_factory=list)


class ScrapeReport(BaseModel):
    started_at: str
    completed_at: str
    venues_discovered: int = 0
    venues_successfully_parsed: int = 0
    venues_failed: int = 0
    images_discovered: int = 0
    images_downloaded: int = 0
    images_skipped: int = 0
    duplicates: int = 0
    errors: List[Dict[str, Any]] = Field(default_factory=list)
