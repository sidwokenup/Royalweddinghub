import io
from PIL import Image
import pytest

from src.utils.text import (
    generate_slug,
    parse_price,
    parse_pax_range,
    parse_capacity_number,
    parse_room_count,
    parse_address_components,
    normalize_url,
    clean_whitespace,
)
from src.utils.filesystem import resolve_unique_slug, calculate_sha256
from src.scraper.downloader import ImageDownloader


def test_slug_generation():
    assert generate_slug("Magnolia Garden | Marriage Lawn") == "magnolia-garden-marriage-lawn"
    assert generate_slug("HOTEL KINGS PARADISE") == "hotel-kings-paradise"
    assert generate_slug("  V-Square (Banquet & Lawn)!  ") == "v-square-banquet-lawn"
    assert generate_slug("") == "unnamed-venue"


def test_unique_slug_resolution():
    existing = {"vsquare", "vsquare-abc123"}
    unique = resolve_unique_slug("vsquare", existing, "abc123")
    assert unique == "vsquare-abc123-1"
    assert resolve_unique_slug("new-venue", existing, "xyz") == "new-venue"


def test_price_parsing():
    assert parse_price("₹900") == 900
    assert parse_price("Rs. 1,500 per plate") == 1500
    assert parse_price("Price on request") is None
    assert parse_price("₹0") is None
    assert parse_price("") is None


def test_pax_range_parsing():
    assert parse_pax_range("50 - 200 pax") == (50, 200)
    assert parse_pax_range("50min:200max") == (50, 200)
    assert parse_pax_range("150 pax") == (150, 150)
    assert parse_pax_range(None) == (None, None)


def test_capacity_and_rooms_parsing():
    assert parse_capacity_number("150 Capacity") == 150
    assert parse_capacity_number("200 Guests") == 200
    assert parse_room_count("10 Rooms") == 10
    assert parse_room_count("Rooms: 25") == 25
    assert parse_room_count("15") == 15


def test_address_components():
    raw = "near Ramabai Ambedkar Raili Sthal Road, Lucknow, Uttar Pradesh 226025"
    addr, city, state = parse_address_components(raw)
    assert city == "Lucknow"
    assert state == "Uttar Pradesh"
    assert "Lucknow" in addr


def test_url_normalization():
    assert normalize_url("/venue/vsquare", "https://www.blinkwed.com") == "https://www.blinkwed.com/venue/vsquare"
    assert normalize_url("https://www.blinkwed.com/venue/vsquare#photos") == "https://www.blinkwed.com/venue/vsquare"


def test_image_validation_valid():
    downloader = ImageDownloader(dry_run=True)
    
    # Create valid synthetic image in memory
    img = Image.new("RGB", (200, 100), color="blue")
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    valid_bytes = buffer.getvalue()

    is_valid, fmt, w, h, err = downloader.validate_image_bytes(valid_bytes)
    assert is_valid is True
    assert fmt == "JPEG"
    assert w == 200
    assert h == 100
    assert err is None


def test_image_validation_invalid_html():
    downloader = ImageDownloader(dry_run=True)
    html_bytes = b"<!DOCTYPE html><html><body>Error 404</body></html>"
    is_valid, fmt, w, h, err = downloader.validate_image_bytes(html_bytes)
    assert is_valid is False
    assert "HTML" in err


def test_image_validation_corrupted():
    downloader = ImageDownloader(dry_run=True)
    corrupted_bytes = b"bad-bytes-not-an-image" * 20
    is_valid, fmt, w, h, err = downloader.validate_image_bytes(corrupted_bytes)
    assert is_valid is False
    assert "Corrupted" in err


def test_sha256_duplicate_detection():
    data1 = b"image-content-abc"
    data2 = b"image-content-abc"
    data3 = b"image-content-xyz"
    assert calculate_sha256(data1) == calculate_sha256(data2)
    assert calculate_sha256(data1) != calculate_sha256(data3)
