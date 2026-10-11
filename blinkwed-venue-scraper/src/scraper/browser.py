import os
import asyncio
from typing import Optional, Dict
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from loguru import logger


class PlaywrightSession:
    """Manages Playwright browser instance, context, and realistic browser configuration."""

    def __init__(
        self,
        headless: bool = True,
        user_agent: Optional[str] = None,
        timeout_ms: int = 30000,
        request_delay: float = 1.0,
    ):
        self.headless = headless
        self.user_agent = user_agent or (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        )
        self.timeout_ms = timeout_ms
        self.request_delay = request_delay
        self._playwright = None
        self._browser: Optional[Browser] = None
        self._context: Optional[BrowserContext] = None

    async def start(self) -> None:
        """Launch Chromium browser and configure browser context."""
        logger.info("Initializing Playwright Chromium session...")
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=self.headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ]
        )
        self._context = await self._browser.new_context(
            user_agent=self.user_agent,
            viewport={"width": 1280, "height": 800},
            locale="en-US",
        )
        logger.info("Playwright session ready.")

    async def get_page(self) -> Page:
        """Create a new page in the current context."""
        if not self._context:
            raise RuntimeError("Browser session not started. Call await session.start() first.")
        return await self._context.new_page()

    async def fetch_page_content(self, url: str) -> Optional[str]:
        """Navigate to URL, respect delay, and return rendered HTML content."""
        if not self._context:
            raise RuntimeError("Browser session not started.")

        page = await self.get_page()
        try:
            logger.info(f"Navigating to {url}")
            response = await page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=self.timeout_ms
            )

            # Polite request delay
            if self.request_delay > 0:
                await asyncio.sleep(self.request_delay)

            # Wait briefly for dynamic elements to settle
            await page.wait_for_timeout(1000)

            if response and response.status >= 400:
                logger.warning(f"Got HTTP {response.status} from {url}")

            content = await page.content()
            return content

        except Exception as e:
            logger.error(f"Failed to fetch {url}: {e}")
            return None
        finally:
            await page.close()

    async def get_cookies(self) -> Dict[str, str]:
        """Retrieve cookies from current context."""
        if not self._context:
            return {}
        cookies = await self._context.cookies()
        return {c["name"]: c["value"] for c in cookies}

    async def close(self) -> None:
        """Close browser context and playwright instance."""
        if self._context:
            await self._context.close()
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
        logger.info("Playwright session closed.")
