import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

const LIVE_DOMAIN = 'https://www.royalweddinghub.com';
const NON_WWW_DOMAIN = 'https://royalweddinghub.com';

async function fetchUrl(targetUrl, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(targetUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'GET',
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ...headers,
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${targetUrl}`));
    });

    req.end();
  });
}

async function runVerification() {
  console.log('='.repeat(70));
  console.log('ROYAL WEDDING HUB - SEO, CRAWLER & AD READINESS AUDIT SUITE');
  console.log('='.repeat(70));

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  }

  // 1. Verify Local Build Artifacts
  console.log('\n[1] LOCAL BUILD ARTIFACTS VERIFICATION');
  const robotsPath = path.resolve('.next/server/app/robots.txt.body');
  if (fs.existsSync(robotsPath)) {
    const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
    console.log('--- Generated robots.txt Content ---');
    console.log(robotsTxt.trim());
    console.log('------------------------------------');

    assert(/User-Agent:\s*OAI-SearchBot/i.test(robotsTxt), 'robots.txt includes User-agent: OAI-SearchBot');
    assert(/User-Agent:\s*OAI-AdsBot/i.test(robotsTxt), 'robots.txt includes User-agent: OAI-AdsBot');
    assert(/User-Agent:\s*GPTBot/i.test(robotsTxt), 'robots.txt includes User-agent: GPTBot');
    assert(/User-Agent:\s*ClaudeBot/i.test(robotsTxt), 'robots.txt includes User-agent: ClaudeBot');
    assert(/User-Agent:\s*PerplexityBot/i.test(robotsTxt), 'robots.txt includes User-agent: PerplexityBot');
    assert(robotsTxt.includes('Sitemap: https://www.royalweddinghub.com/sitemap.xml'), 'robots.txt includes canonical Sitemap URL');
    assert(robotsTxt.includes('Allow: /'), 'robots.txt includes Allow: /');
    assert(robotsTxt.includes('Disallow: /admin/'), 'robots.txt protects /admin/');
  } else {
    assert(false, '.next/server/app/robots.txt.body exists');
  }

  const sitemapPath = path.resolve('.next/server/app/sitemap.xml.body');
  if (fs.existsSync(sitemapPath)) {
    const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
    assert(!sitemapXml.includes('http://localhost'), 'sitemap.xml does not contain localhost URLs');
    assert(!sitemapXml.includes('<loc>https://royalweddinghub.com'), 'sitemap.xml does not contain non-www URLs');
    assert(sitemapXml.includes('<loc>https://www.royalweddinghub.com</loc>'), 'sitemap.xml contains canonical root');
    assert(sitemapXml.includes('<loc>https://www.royalweddinghub.com/venues</loc>'), 'sitemap.xml contains /venues');
    assert(sitemapXml.includes('<loc>https://www.royalweddinghub.com/services</loc>'), 'sitemap.xml contains /services');
  } else {
    assert(false, '.next/server/app/sitemap.xml.body exists');
  }

  // 1b. Verify Microsoft Clarity & Analytics in Prerendered HTML
  const indexPath = path.resolve('.next/server/app/index.html');
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    assert(indexHtml.includes('zbj9wujpy6'), 'Prerendered HTML includes Microsoft Clarity ID (zbj9wujpy6)');
    assert(indexHtml.includes('https://www.clarity.ms/tag/'), 'Prerendered HTML loads Microsoft Clarity script tag');
    assert(indexHtml.includes('https://www.clarity.ms'), 'Prerendered HTML includes Clarity preconnect/dns-prefetch');
  } else {
    assert(false, '.next/server/app/index.html exists');
  }

  // 2. Canonical Domain & Redirect Verification
  console.log('\n[2] CANONICAL REDIRECTS & STATUS CODES');
  try {
    const nonWwwRes = await fetchUrl(NON_WWW_DOMAIN);
    console.log(`  Non-WWW (${NON_WWW_DOMAIN}) -> HTTP ${nonWwwRes.statusCode}, Location: ${nonWwwRes.headers.location}`);
    assert(nonWwwRes.statusCode === 308 || nonWwwRes.statusCode === 301, 'Non-WWW redirects permanently');
    assert(
      nonWwwRes.headers.location === 'https://www.royalweddinghub.com/' ||
      nonWwwRes.headers.location === 'https://www.royalweddinghub.com',
      'Non-WWW redirects directly to canonical https://www.royalweddinghub.com/'
    );

    const httpRes = await fetchUrl('http://www.royalweddinghub.com');
    console.log(`  HTTP (http://www.royalweddinghub.com) -> HTTP ${httpRes.statusCode}, Location: ${httpRes.headers.location}`);
    assert(httpRes.statusCode === 308 || httpRes.statusCode === 301, 'HTTP redirects to HTTPS');
  } catch (err) {
    console.error('Redirect check error:', err.message);
  }

  // 3. Crawler Access for OpenAI & Major Ad Crawlers
  console.log('\n[3] CRAWLER & USER-AGENT VERIFICATION (LIVE CDN/WAF)');
  const testAgents = [
    { name: 'OAI-SearchBot', header: 'OAI-SearchBot' },
    { name: 'OAI-AdsBot', header: 'OAI-AdsBot' },
    { name: 'AdsBot-Google', header: 'AdsBot-Google (+http://www.google.com/adsbot.html)' },
    { name: 'Googlebot', header: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    { name: 'Facebook AdBot / Meta', header: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
  ];

  for (const bot of testAgents) {
    try {
      const res = await fetchUrl(LIVE_DOMAIN, { 'User-Agent': bot.header });
      const server = res.headers['server'] || 'Unknown';
      const vercelCache = res.headers['x-vercel-cache'] || 'N/A';
      console.log(`  Bot [${bot.name}] -> HTTP ${res.statusCode} | Server: ${server} | Cache: ${vercelCache}`);
      assert(res.statusCode === 200, `Crawler ${bot.name} receives HTTP 200 OK`);
      assert(res.statusCode !== 403 && res.statusCode !== 429, `Crawler ${bot.name} is NOT blocked by WAF/CDN`);
    } catch (err) {
      assert(false, `Crawler ${bot.name} request failed: ${err.message}`);
    }
  }

  // 4. Key Landing Pages HTTP 200 Check
  console.log('\n[4] AD LANDING PAGES HTTP 200 VERIFICATION');
  const landingPages = [
    '/',
    '/venues',
    '/venues/santorini-resort-lucknow',
    '/venues/charans-club-and-resort',
    '/services',
    '/services/planning-and-decor',
    '/services/photography-and-films',
    '/about',
    '/contact',
  ];

  for (const page of landingPages) {
    try {
      const pageUrl = `${LIVE_DOMAIN}${page}`;
      const res = await fetchUrl(pageUrl);
      console.log(`  Page ${page.padEnd(35)} -> HTTP ${res.statusCode} (${res.headers['content-type']?.split(';')[0]})`);
      assert(res.statusCode === 200, `Page ${page} returns HTTP 200`);
    } catch (err) {
      assert(false, `Page ${page} failed: ${err.message}`);
    }
  }

  // 5. CDN / WAF Security Headers & Edge Caching
  console.log('\n[5] CDN & WAF HEADERS INSPECTION');
  try {
    const liveRes = await fetchUrl(`${LIVE_DOMAIN}/`);
    assert(liveRes.headers['server']?.toLowerCase().includes('vercel'), 'CDN Edge server identified (Vercel)');
    assert(!!liveRes.headers['strict-transport-security'], 'HSTS (Strict-Transport-Security) is active');
    console.log('  HSTS Header:', liveRes.headers['strict-transport-security']);
    console.log('  Edge Request ID:', liveRes.headers['x-vercel-id']);
  } catch (err) {
    assert(false, `CDN header check failed: ${err.message}`);
  }

  // 6. Google Ads, Tracking & AI Agent Readiness Verification
  console.log('\n[6] GOOGLE ADS, TRACKING & AI AGENT READINESS VERIFICATION');
  const layoutPath = path.resolve('src/app/layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layoutCode = fs.readFileSync(layoutPath, 'utf8');
    assert(layoutCode.includes('googletagmanager.com/gtag/js?id=AW-18508119901'), 'Google Ads tag loader script included (AW-18508119901)');
    assert(layoutCode.includes("gtag('config', 'AW-18508119901'"), 'Google Ads tag config initialized in layout');
    assert(layoutCode.includes("gtag('config', 'G-4SJ7J5VBRS'"), 'Google Analytics tag config initialized in layout');
    assert(layoutCode.includes("domains: ['www.royalweddinghub.com', 'royalweddinghub.com']"), 'Google Ads tag is strictly domain-locked to royalweddinghub.com');
    assert(layoutCode.includes('<JsonLd />') || layoutCode.includes('<JsonLd/>'), 'Schema.org JSON-LD structured data included in root layout');
  } else {
    assert(false, 'src/app/layout.tsx exists');
  }

  const llmsPath = path.resolve('public/llms.txt');
  assert(fs.existsSync(llmsPath), 'AI agent documentation file public/llms.txt exists');
  const wellKnownLlmsPath = path.resolve('public/.well-known/llms.txt');
  assert(fs.existsSync(wellKnownLlmsPath), 'public/.well-known/llms.txt standard endpoint exists');
  const fullLlmsPath = path.resolve('public/llms-full.txt');
  assert(fs.existsSync(fullLlmsPath), 'public/llms-full.txt full agent context exists');
  const wellKnownFullLlmsPath = path.resolve('public/.well-known/llms-full.txt');
  assert(fs.existsSync(wellKnownFullLlmsPath), 'public/.well-known/llms-full.txt standard endpoint exists');

  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  assert(/^#\s+[^\n]+/.test(llmsContent), 'llms.txt has standard H1 title at top');
  assert(/\n>\s+[^\n]+/.test(llmsContent), 'llms.txt has standard blockquote summary');
  assert(llmsContent.includes('## Venues'), 'llms.txt has H2 Venues catalog section');
  assert(llmsContent.includes('## Services'), 'llms.txt has H2 Services directory section');
  assert(llmsContent.includes('## Core Pages'), 'llms.txt has H2 Core Pages section');
  assert(llmsContent.includes('## Optional'), 'llms.txt has standard H2 Optional section');

  // Verify that every line starting with '-' is a strictly compliant markdown link: - [Title](URL): Description
  const listItems = llmsContent.split('\n').filter(line => line.trim().startsWith('-'));
  const allValidLinks = listItems.every(line => /^-\s*\[.+\]\(https?:\/\/[^\s)]+\)/.test(line.trim()));
  assert(allValidLinks && listItems.length > 10, 'Every listed item in llms.txt follows strict llmstxt.org markdown link standard');

  // Verify brand assets & tab icon
  assert(fs.existsSync(path.resolve('public/logo.png')), 'public/logo.png brand asset exists');
  assert(fs.existsSync(path.resolve('public/logo.webp')), 'public/logo.webp optimized brand asset exists');
  assert(fs.existsSync(path.resolve('public/favicon.ico')), 'public/favicon.ico tab icon exists');
  assert(fs.existsSync(path.resolve('src/app/icon.png')), 'src/app/icon.png tab icon exists');
  assert(fs.existsSync(path.resolve('public/og-image.jpg')), 'public/og-image.jpg OpenGraph image exists');
  assert(fs.existsSync(path.resolve('src/app/opengraph-image.jpg')), 'src/app/opengraph-image.jpg OpenGraph image exists');

  console.log('\n' + '='.repeat(70));
  console.log(`AUDIT RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('='.repeat(70));
}

runVerification().catch(console.error);

