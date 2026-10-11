import pytest
from bs4 import BeautifulSoup
from src.scraper.parser import parse_listing_card, parse_listing_page, parse_detail_page
from src.scraper.image_extractor import extract_detail_images
from src.models.venue import Venue, VenuesContainer, FoodPricing, CapacityInfo, ImageItem, SourceMeta


MOCK_CARD_HTML = """
<div class="group bg-white rounded-lg overflow-hidden shadow-md">
    <a href="https://www.blinkwed.com/venue/vsquare" class="vendor-detail">
        vsquare
    </a>
    <span>4.9</span>
    <span>(7 reviews)</span>
    <p>near Ramabai Ambedkar Raili Sthal Road, Lucknow, Uttar Pradesh 226025</p>
    <span>Banquet Hall</span>
    <span>Veg / Non veg</span>
    <span>₹1,200</span>
    <span>per plate</span>
    <span>50 - 200 pax</span>
    <span>10 Rooms</span>
    <span>150 Capacity</span>
    <img src="https://www.blinkwed.com/storage/app/public/venues/main/sample_thumb.jpg" />
</div>
"""

MOCK_DETAIL_HTML = """
<html>
<body>
    <div class="section-card">
        <h2>About</h2>
        <p>A magnificent banquet destination in Lucknow offering top-tier hospitality and event management for weddings.</p>
    </div>
    <div class="grid">
        <h3>Location</h3>
        <p class="text-gray-600">Lucknow</p>
        <h3>Capacity</h3>
        <p class="text-gray-600">150 Guests</p>
        <h3>Pax</h3>
        <p class="text-gray-600">50min:200max</p>
        <h3>Rooms</h3>
        <p class="text-gray-600">10</p>
    </div>
    <div class="services">
        <h3>Services & Amenities</h3>
        <div>
            <span>WiFi</span>
            <span>Parking</span>
            <span>Air Conditioning</span>
            <span>Valet Parking</span>
        </div>
    </div>
    <div class="gallery">
        <h2>Gallery</h2>
        <img class="gallery-image" src="https://blinkwed.com/public/storage/venues/gallery/img1.jpg" />
        <img class="gallery-image" src="https://blinkwed.com/public/storage/venues/gallery/img2.jpg" />
        <!-- Third-party icon that must NOT be authorized for auto-download -->
        <img src="https://images.wedmegood.com/react-frontend-v4/static/media/location.svg" />
    </div>
</body>
</html>
"""


def test_parse_listing_card():
    soup = BeautifulSoup(MOCK_CARD_HTML, "html.parser")
    card = soup.select_one("div.group")
    parsed = parse_listing_card(card, "https://www.blinkwed.com/allvenues")

    assert parsed is not None
    assert parsed["name"] == "vsquare"
    assert parsed["slug"] == "vsquare"
    assert parsed["detail_url"] == "https://www.blinkwed.com/venue/vsquare"
    assert parsed["rating"] == 4.9
    assert parsed["review_count"] == 7
    assert parsed["category"] == "Banquet Hall"
    assert parsed["food"]["vegetarian"] is True
    assert parsed["food"]["vegetarian_price"] == 1200
    assert parsed["capacity"]["min_pax"] == 50
    assert parsed["capacity"]["max_pax"] == 200
    assert parsed["capacity"]["rooms"] == 10
    assert parsed["capacity"]["capacity"] == 150
    assert "sample_thumb.jpg" in parsed["thumbnail_url"]


def test_parse_detail_page():
    parsed = parse_detail_page(MOCK_DETAIL_HTML, "https://www.blinkwed.com/venue/vsquare")

    assert "magnificent banquet destination" in parsed["description"]
    assert "WiFi" in parsed["amenities"]
    assert "Parking" in parsed["amenities"]
    assert "Air Conditioning" in parsed["amenities"]
    assert parsed["capacity"] == 150
    assert parsed["min_pax"] == 50
    assert parsed["max_pax"] == 200
    assert parsed["rooms"] == 10


def test_extract_detail_images_and_rights_safety():
    thumb, gallery = extract_detail_images(
        MOCK_DETAIL_HTML,
        "https://www.blinkwed.com/venue/vsquare",
        listing_thumbnail="https://www.blinkwed.com/storage/app/public/venues/main/sample_thumb.jpg"
    )

    # Thumbnail should be authorized first party
    assert thumb is not None
    assert thumb.is_first_party is True
    assert thumb.is_authorized_download is True

    # Gallery images
    assert len(gallery) == 2  # img1 and img2; wedmegood svg is filtered out by is_valid_venue_photo
    for g in gallery:
        assert g.is_first_party is True
        assert g.is_authorized_download is True


def test_venues_container_json_serialization():
    venue = Venue(
        id="vsquare",
        name="V-Square Banquet",
        slug="v-square-banquet",
        detail_url="https://www.blinkwed.com/venue/vsquare",
        category="Banquet Hall",
        address="Lucknow, UP",
        city="Lucknow",
        state="Uttar Pradesh",
        rating=4.9,
        review_count=7,
        food=FoodPricing(vegetarian=True, non_vegetarian=True, vegetarian_price=1200, non_vegetarian_price=None),
        capacity=CapacityInfo(min_pax=50, max_pax=200, capacity=150, rooms=10),
        description="Luxury venue",
        amenities=["WiFi", "Parking"],
        thumbnail=ImageItem(source_url="https://www.blinkwed.com/storage/thumb.jpg", downloaded=True, local_path="data/images/vsquare/thumbnail.jpg"),
        gallery=[ImageItem(source_url="https://www.blinkwed.com/storage/gal1.jpg", downloaded=True, local_path="data/images/vsquare/gallery_001.jpg")],
        source=SourceMeta(website="BlinkWed", url="https://www.blinkwed.com/venue/vsquare", scraped_at="2026-10-07T00:00:00Z"),
    )

    container = VenuesContainer(
        source="BlinkWed",
        source_url="https://www.blinkwed.com/",
        scraped_at="2026-10-07T00:00:00Z",
        venues=[venue]
    )

    dumped = container.model_dump()
    assert dumped["source"] == "BlinkWed"
    assert len(dumped["venues"]) == 1
    assert dumped["venues"][0]["name"] == "V-Square Banquet"
    assert dumped["venues"][0]["capacity"]["rooms"] == 10
