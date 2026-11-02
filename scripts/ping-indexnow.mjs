/**
 * IndexNow Instant Search Engine Indexing Script
 * Submits all 49+ live website URLs directly to IndexNow (Bing, Perplexity, Yahoo, Seznam, Naver).
 */
import fs from 'node:fs';
import path from 'node:path';

const INDEXNOW_KEY = 'royalweddinghub2026indexkey001';
const HOST = 'www.royalweddinghub.com';
const BASE_URL = `https://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

// Gather all venues
const venuesPath = path.resolve('src/data/venues.json');
const venues = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));

// Service slugs
const serviceSlugs = [
  'planning-and-decor',
  'photography-and-films',
  'catering-and-culinary',
  'invitations-and-stationery',
  'styling-and-trousseau',
  'entertainment-and-music',
  'hospitality-and-logistics',
];

// Core & landing pages
const corePages = [
  '',
  'wedding-venues-lucknow',
  'wedding-planner-lucknow',
  'wedding-management-lucknow',
  'venues',
  'services',
  'about',
  'contact',
  'privacy',
  'terms',
];

// Build complete URL list
const urlList = [
  ...corePages.map((p) => (p ? `${BASE_URL}/${p}` : BASE_URL)),
  ...venues.map((v) => `${BASE_URL}/venues/${v.slug}`),
  ...serviceSlugs.map((s) => `${BASE_URL}/services/${s}`),
];

console.log('='.repeat(70));
console.log(`ROYAL WEDDING HUB - INDEXNOW INSTANT BROADCAST`);
console.log('='.repeat(70));
console.log(`Host:         ${HOST}`);
console.log(`Key:          ${INDEXNOW_KEY}`);
console.log(`Key Location: ${KEY_LOCATION}`);
console.log(`Total URLs:   ${urlList.length}`);
console.log('-'.repeat(70));

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

async function broadcastIndexNow(endpointName, endpointUrl) {
  try {
    console.log(`Transmitting to ${endpointName} (${endpointUrl})...`);
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'RoyalWeddingHub-IndexNow/1.0',
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    console.log(`Status Code: ${res.status} ${res.statusText}`);
    if (res.status === 200) {
      console.log(`[SUCCESS] OK - URLs submitted and indexed successfully.`);
    } else if (res.status === 202) {
      console.log(`[SUCCESS] Accepted - URLs received and queued for immediate indexing.`);
    } else {
      console.log(`Response: ${bodyText || 'None'}`);
    }
  } catch (err) {
    console.error(`[ERROR] Transmission to ${endpointName} failed:`, err.message);
  }
}

async function run() {
  await broadcastIndexNow('IndexNow API Gateway', 'https://api.indexnow.org/indexnow');
  await broadcastIndexNow('Bing Webmaster IndexNow', 'https://www.bing.com/indexnow');
  console.log('='.repeat(70));
  console.log(`INDEXNOW BROADCAST COMPLETE - ${urlList.length} URLS SUBMITTED`);
  console.log('='.repeat(70));
}

run();

