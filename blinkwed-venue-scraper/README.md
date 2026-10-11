# BlinkWed Venue Data & Image Scraper

A production-grade, standalone Python scraper for extracting publicly accessible wedding venue data and authorized media from [BlinkWed](https://www.blinkwed.com/allvenues).

This project is completely isolated from the main wedding website application. It maintains its own Python virtual environment, dependencies, schema models, and data directory.

---

## Features

- **Automated Discovery**: Dynamically discovers categories (`Banquet Hall`, `Lawn`, `Resort`, `Farmhouse`, `Hotel`) and crawls both base and category-specific listings.
- **Deep Data Extraction**: Extracts venue names, categories, addresses, city, state, ratings, review counts, pax ranges, guest capacities, room counts, food policies, pricing, amenities, and contact information.
- **Image Rights & Safety**: Distinguishes first-party venue media from third-party hosted assets (e.g., external CDN SVGs/icons). Third-party images with unverified rights are logged with `downloaded: false` and justification reasons for future review.
- **Image Validation & Deduplication**:
  - Pillow verification ensures images are uncorrupted, non-HTML, and meet size/dimension thresholds.
  - SHA-256 content hashing prevents redundant downloads across pages.
  - Safe slugification preserves human-readable venue folder structures.
- **Fault-Tolerant & Resumable**: Single venue failures do not abort the crawl. Execution can resume seamlessly from `venues.json`.
- **Structured JSON & Reports**: Outputs strict Pydantic-validated JSON (`venues.json`) and run metrics (`scrape_report.json`).

---

## Technology Stack

- **Python**: 3.11+
- **Playwright**: Headless Chromium for JavaScript-rendered listing and detail pages
- **httpx**: High-performance HTTP client for authorized asset downloads
- **BeautifulSoup4**: HTML parsing and selector queries
- **Pydantic v2**: Data validation and serialization
- **Pillow**: Image integrity and format verification
- **tenacity**: Exponential backoff retry policies
- **loguru**: Structured file and console logging
- **pytest**: Test suite with isolated mock fixtures

---

## Project Structure

```
blinkwed-venue-scraper/
├── .venv/                      # Isolated virtual environment
├── src/
│   ├── scraper/
│   │   ├── __init__.py
│   │   ├── browser.py          # Playwright browser lifecycle manager
│   │   ├── venue_listing.py    # Dynamic category & card discovery
│   │   ├── venue_detail.py     # Detail page spec & image extraction
│   │   ├── image_extractor.py  # Image candidate detection & domain safety
│   │   ├── downloader.py       # Pillow validation & SHA-256 deduplication
│   │   └── parser.py           # HTML parsing logic
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── venue.py            # Pydantic schemas (Venue, Images, Reports)
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logging.py          # Loguru configuration (data/logs/scraper.log)
│   │   ├── filesystem.py       # Safe path & slug helpers
│   │   └── text.py             # Number, price, pax & currency parser
│   │
│   └── main.py                 # CLI entrypoint
│
├── data/
│   ├── json/                   # venues.json output
│   ├── images/                 # Organized venue asset folders (<slug>/)
│   ├── logs/                   # scraper.log
│   └── reports/                # scrape_report.json
│
├── tests/
│   ├── conftest.py
│   ├── test_parser.py          # Unit tests with HTML fixtures
│   └── test_utils.py           # Unit tests for text & image validation
│
├── .env.example
├── .gitignore
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## Installation & Setup

### 1. Prerequisites
- Python 3.11 or higher installed on your system.
- PowerShell or Terminal.

### 2. Create Virtual Environment
```bash
cd blinkwed-venue-scraper
python -m venv .venv
```

Activate the environment:
- **Windows (PowerShell)**:
  ```powershell
  .\.venv\Scripts\Activate.ps1
  ```
- **macOS / Linux**:
  ```bash
  source .venv/bin/activate
  ```

### 3. Install Dependencies & Playwright Browsers
```bash
pip install -r requirements.txt
playwright install chromium
```

### 4. Configuration (.env)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration in `.env`:
```ini
BASE_URL=https://www.blinkwed.com
VENUE_URL=https://www.blinkwed.com/allvenues

REQUEST_DELAY=1.0
MAX_CONCURRENCY=2
REQUEST_TIMEOUT=30000
```

---

## Usage & CLI Commands

All commands are executed from the `blinkwed-venue-scraper` directory:

### 1. Dry Run (No Image Downloads)
Discovers venues and extracts details without saving binary media to disk:
```bash
python -m src.main --dry-run
```

### 2. Sample Crawl (Recommended First Step)
Process a small sample of venues (e.g., 5 venues):
```bash
python -m src.main --limit 5
```

### 3. Full Crawl
Crawl all accessible wedding venues across all categories:
```bash
python -m src.main
```

### 4. Category-Specific Crawl
Target a specific venue category:
```bash
python -m src.main --category "Banquet Hall"
python -m src.main --category "Resort"
python -m src.main --category "Lawn"
```

### 5. Resume Crawl
Resume an interrupted run without re-scraping already processed venues:
```bash
python -m src.main --resume
```

### 6. Data-Only Crawl
Collect metadata and image URLs without downloading media:
```bash
python -m src.main --data-only
```

### 7. Images-Only Crawl
Download authorized media for venues already present in `venues.json`:
```bash
python -m src.main --images-only
```

---

## Output Structure

### 1. Structured JSON: `data/json/venues.json`
Matches the exact specification required:

```json
{
  "source": "BlinkWed",
  "source_url": "https://www.blinkwed.com/",
  "scraped_at": "2026-10-06T20:04:54.238469+00:00",
  "venues": [
    {
      "id": "vsquare",
      "name": "Vsquare",
      "slug": "vsquare",
      "detail_url": "https://www.blinkwed.com/venue/vsquare",
      "category": "Banquet Hall",
      "address": "adjacent Babasaheb Bhim Rao Ambedkar University, Lucknow, Uttar Pradesh",
      "city": "Lucknow",
      "state": "Uttar Pradesh",
      "rating": 4.9,
      "review_count": 7,
      "food": {
        "vegetarian": true,
        "non_vegetarian": true,
        "vegetarian_price": null,
        "non_vegetarian_price": null,
        "price_unit": "per_plate"
      },
      "capacity": {
        "min_pax": 50,
        "max_pax": 200,
        "capacity": 150,
        "rooms": 10,
        "capacity_raw": "50 - 200 pax"
      },
      "description": null,
      "amenities": ["WiFi", "Parking", "Valet Parking", "Air Conditioning"],
      "thumbnail": {
        "source_url": "https://www.blinkwed.com/storage/app/public/venues/main/XTOjWOgNK07XmyQWS4gyNr6iTpG4RRF6kkA17huf.jpg",
        "local_path": "data/images/vsquare/thumbnail.jpg",
        "downloaded": true,
        "reason": null,
        "image_host": "www.blinkwed.com",
        "page_source_url": "https://www.blinkwed.com/venue/vsquare",
        "sha256": "ee9fe04edbbe9eb15896008ac1f4b6bbc6bf9b9cf10922a0abcbb52f1b48c886",
        "file_size": 218135,
        "width": 1280,
        "height": 720
      },
      "gallery": [
        {
          "source_url": "https://blinkwed.com/public/storage/venues/gallery/hCE46p1VawVKRXLkNfQXt17tvYbNoyAeorLMD8G0.jpg",
          "local_path": "data/images/vsquare/gallery_001.jpg",
          "downloaded": true,
          "reason": null,
          "image_host": "blinkwed.com",
          "page_source_url": "https://www.blinkwed.com/venue/vsquare",
          "sha256": "dd9223965196ee42570de71961c52965c13069c11b6b5adc52344699de778769",
          "file_size": 115001,
          "width": 1280,
          "height": 721
        }
      ],
      "source": {
        "website": "BlinkWed",
        "url": "https://www.blinkwed.com/venue/vsquare",
        "scraped_at": "2026-10-06T20:03:16.405264+00:00"
      }
    }
  ]
}
```

### 2. Media Directory: `data/images/`
Organized with one folder per venue slug:
```
data/images/
├── vsquare/
│   ├── thumbnail.jpg
│   ├── gallery_001.jpg
│   ├── gallery_002.jpg
│   └── ...
├── veridian-inn/
│   ├── thumbnail.jpg
│   └── gallery_001.jpg
└── magnolia-garden-marriage-lawn/
    ├── thumbnail.jpg
    ├── gallery_001.jpg
    └── gallery_002.jpg
```

### 3. Run Metrics: `data/reports/scrape_report.json`
```json
{
  "started_at": "2026-10-06T20:04:16.436043+00:00",
  "completed_at": "2026-10-06T20:04:54.350541+00:00",
  "venues_discovered": 5,
  "venues_successfully_parsed": 5,
  "venues_failed": 0,
  "images_discovered": 32,
  "images_downloaded": 32,
  "images_skipped": 0,
  "duplicates": 2,
  "errors": []
}
```

---

## Testing

Run unit tests without live internet access:
```bash
pytest -v
```

All 15 test cases validate:
- Venue card HTML extraction
- Detail page HTML extraction
- Slug generation and collisions
- Price and currency parsing
- Pax range and capacity normalization
- Address & city extraction
- Pillow image integrity checks (rejection of corrupted files or HTML payloads)
- SHA-256 duplicate detection
- Pydantic schema serialization

---

## Rights & Safety Management

1. **Third-Party Domain Isolation**: BlinkWed references SVG UI icons from third-party CDNs (e.g., `images.wedmegood.com`). These are flagged as third-party assets and not downloaded automatically.
2. **Polite Crawling**: Default delay of 1.0s between requests and a concurrency limit of 2 to avoid overwhelming target servers.
3. **No Circumvention**: The crawler respects standard HTTP responses and robots guidelines.
