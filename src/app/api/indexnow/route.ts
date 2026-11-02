import { NextResponse } from 'next/server';
import { getAllVenues } from '@/lib/venues';
import { getServices } from '@/lib/services';

const INDEXNOW_KEY = 'royalweddinghub2026indexkey001';
const HOST = 'www.royalweddinghub.com';
const BASE_URL = `https://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

export async function GET() {
  return handleIndexNowSubmission();
}

export async function POST() {
  return handleIndexNowSubmission();
}

async function handleIndexNowSubmission() {
  try {
    const venues = getAllVenues();
    const services = getServices();

    const staticPages = [
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

    const urlList = [
      ...staticPages.map((p) => (p ? `${BASE_URL}/${p}` : BASE_URL)),
      ...venues.map((v) => `${BASE_URL}/venues/${v.slug}`),
      ...services.filter((s) => s.slug !== 'wedding-venues').map((s) => `${BASE_URL}/services/${s.slug}`),
    ];

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'RoyalWeddingHub-IndexNow/1.0',
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      statusCode: indexNowRes.status,
      statusText: indexNowRes.statusText,
      totalUrlsSubmitted: urlList.length,
      sampleUrls: urlList.slice(0, 5),
      keyLocation: KEY_LOCATION,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

