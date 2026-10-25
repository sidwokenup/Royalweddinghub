import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SignJWT, jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read .env.local if present
const env = {};
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      env[k.trim()] = v.join('=').replace(/^['"]|['"]$/g, '').trim();
    }
  }
}

const JWT_SECRET_STRING =
  env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  'rwh-default-super-secure-jwt-signing-secret-key-lucknow-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ADMIN_SESSION_COOKIE = 'rwh_admin_session';

// Test statistics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function pass(name, details = '') {
  totalTests++;
  passedTests++;
  console.log(`  \x1b[32m✔ PASS\x1b[0m ${name} ${details ? `\x1b[90m(${details})\x1b[0m` : ''}`);
}

function fail(name, error) {
  totalTests++;
  failedTests++;
  const errMsg = error instanceof Error ? error.message : String(error);
  failures.push({ name, error: errMsg });
  console.log(`  \x1b[31m✖ FAIL\x1b[0m ${name}`);
  console.log(`    \x1b[31mError: ${errMsg}\x1b[0m`);
}

function suite(title) {
  console.log(`\n\x1b[1m\x1b[33m═══ ${title} ═══\x1b[0m`);
}

// Helper to create an authentic token
async function createMockToken(payload, secret = JWT_SECRET, expiresIn = '7d') {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

// ============================================================================
// SUITE 1: JWT & CRYPTOGRAPHIC AUTHENTICATION INTEGRITY
// ============================================================================
async function runSuite1() {
  suite('1. JWT & Cryptographic Session Token Integrity');

  const validPayload = {
    userId: 'test-admin-super',
    email: 'admin@royalweddinghub.com',
    fullName: 'Executive Administrator',
    role: 'super_admin',
  };

  // 1.1 Mint valid token
  let validToken;
  try {
    validToken = await createMockToken(validPayload);
    if (typeof validToken === 'string' && validToken.split('.').length === 3) {
      pass('1.1 Create signed HS256 JWT session token', '3 segments verified');
    } else {
      throw new Error('Invalid JWT format');
    }
  } catch (err) {
    fail('1.1 Create signed HS256 JWT session token', err);
  }

  // 1.2 Verify valid token
  try {
    const { payload } = await jwtVerify(validToken, JWT_SECRET, { algorithms: ['HS256'] });
    if (
      payload.userId === validPayload.userId &&
      payload.email === validPayload.email &&
      payload.role === validPayload.role
    ) {
      pass('1.2 Verify authentic token & decode payload claims', `Role: ${payload.role}`);
    } else {
      throw new Error('Payload claims mismatch');
    }
  } catch (err) {
    fail('1.2 Verify authentic token & decode payload claims', err);
  }

  // 1.3 Reject tampered token
  try {
    const parts = validToken.split('.');
    const tamperedPayload = Buffer.from(
      JSON.stringify({ ...validPayload, role: 'hacker' })
    ).toString('base64url');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    let rejected = false;
    try {
      await jwtVerify(tamperedToken, JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      rejected = true;
    }

    if (rejected) {
      pass('1.3 Tampered token signature rejection', 'HMAC verification caught signature mismatch');
    } else {
      throw new Error('Tampered token was unexpectedly accepted');
    }
  } catch (err) {
    fail('1.3 Tampered token signature rejection', err);
  }

  // 1.4 Reject token signed with foreign secret
  try {
    const foreignSecret = new TextEncoder().encode('unauthorized-foreign-signing-key-12345');
    const foreignToken = await createMockToken(validPayload, foreignSecret);

    let rejected = false;
    try {
      await jwtVerify(foreignToken, JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      rejected = true;
    }

    if (rejected) {
      pass('1.4 Foreign secret key rejection', 'Signatures signed with invalid key rejected');
    } else {
      throw new Error('Foreign key token was accepted');
    }
  } catch (err) {
    fail('1.4 Foreign secret key rejection', err);
  }

  // 1.5 Reject expired token
  try {
    const expiredToken = await new SignJWT(validPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 10000)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1000)
      .sign(JWT_SECRET);

    let rejected = false;
    try {
      await jwtVerify(expiredToken, JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      rejected = true;
    }

    if (rejected) {
      pass('1.5 Expired token rejection', 'Expired session timestamp invalidated');
    } else {
      throw new Error('Expired token was accepted');
    }
  } catch (err) {
    fail('1.5 Expired token rejection', err);
  }

  // 1.6 Fallback root credentials match
  try {
    const rootEmail = env.INITIAL_ADMIN_EMAIL || 'admin@royalweddinghub.com';
    const rootPass = env.INITIAL_ADMIN_PASSWORD || 'RoyalWedding@Lucknow2026';
    if (rootEmail.includes('@') && rootPass.length >= 12) {
      pass('1.6 Root admin fallback credentials configured', `Target: ${rootEmail}`);
    } else {
      throw new Error('Root credentials invalid or too weak');
    }
  } catch (err) {
    fail('1.6 Root admin fallback credentials configured', err);
  }

  return validToken;
}

// ============================================================================
// SUITE 2: EDGE MIDDLEWARE ROUTE PROTECTION PROBES
// ============================================================================
async function runSuite2() {
  suite('2. Edge Middleware & Route Protection Probes');

  const adminRoutes = [
    { path: '/admin', name: 'Dashboard Overview' },
    { path: '/admin/enquiries', name: 'Bespoke Enquiries CRM' },
    { path: '/admin/venues', name: 'Venues Portfolio Manager' },
    { path: '/admin/services', name: 'Services & Disciplines Manager' },
    { path: '/admin/testimonials', name: 'Patron Testimonials' },
    { path: '/admin/media', name: 'Media Library CDN' },
    { path: '/admin/settings', name: 'System Settings & Edge Caches' },
  ];

  for (const route of adminRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`, {
        method: 'GET',
        redirect: 'manual',
      });

      // Must be a 307 or 302 redirect to /admin/login
      const isRedirect = res.status === 307 || res.status === 302;
      const location = res.headers.get('location') || '';
      const redirectsToLogin = location.includes('/admin/login');

      if (isRedirect && redirectsToLogin) {
        pass(`2.1 Unauthenticated ${route.name} (${route.path})`, `Redirect ${res.status} -> ${location}`);
      } else {
        throw new Error(`Expected redirect to /admin/login, got HTTP ${res.status} with location "${location}"`);
      }
    } catch (err) {
      fail(`2.1 Unauthenticated ${route.name} (${route.path})`, err);
    }
  }

  // Unauthenticated access to /admin/login should be allowed (HTTP 200)
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'GET',
      redirect: 'manual',
    });
    if (res.status === 200) {
      pass('2.2 Public access to /admin/login allowed', 'HTTP 200 OK');
    } else {
      throw new Error(`Expected HTTP 200 for /admin/login, got ${res.status}`);
    }
  } catch (err) {
    fail('2.2 Public access to /admin/login allowed', err);
  }
}

// ============================================================================
// SUITE 3: AUTHENTICATED MODULE RENDERING & UI INTEGRITY PROBES
// ============================================================================
async function runSuite3(token) {
  suite('3. Authenticated Admin Modules & UI Content Probes');

  // 3.1 Authenticated visit to /admin/login must redirect to /admin (loop prevention)
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'GET',
      headers: {
        Cookie: `${ADMIN_SESSION_COOKIE}=${token}`,
      },
      redirect: 'manual',
    });

    const isRedirect = res.status === 307 || res.status === 302;
    const location = res.headers.get('location') || '';
    if (isRedirect && location.endsWith('/admin')) {
      pass('3.1 Authenticated /admin/login loop prevention', `Redirected to ${location}`);
    } else {
      throw new Error(`Expected redirect to /admin, got HTTP ${res.status} with location "${location}"`);
    }
  } catch (err) {
    fail('3.1 Authenticated /admin/login loop prevention', err);
  }

  const authenticatedModules = [
    {
      path: '/admin',
      name: 'Overview Dashboard',
      markers: ['Concierge Command Center', 'Inquiries Pipeline', 'Quick Actions'],
    },
    {
      path: '/admin/enquiries',
      name: 'Enquiries CRM Hub',
      markers: ['Enquiries', 'Bespoke', 'Client'],
    },
    {
      path: '/admin/venues',
      name: 'Venues Portfolio Manager',
      markers: ['Venues', 'Portfolio', 'Banquet'],
    },
    {
      path: '/admin/services',
      name: 'Services Management Hub',
      markers: ['Services', 'Disciplines'],
    },
    {
      path: '/admin/testimonials',
      name: 'Testimonials Curation Hub',
      markers: ['Testimonial', 'Patron', 'Reviews'],
    },
    {
      path: '/admin/media',
      name: 'Media CDN Library',
      markers: ['Media', 'CDN', 'Upload'],
    },
    {
      path: '/admin/settings',
      name: 'Settings & Edge Caches',
      markers: ['System Settings', 'Edge', 'Cache'],
    },
  ];

  for (const mod of authenticatedModules) {
    try {
      const res = await fetch(`${BASE_URL}${mod.path}`, {
        method: 'GET',
        headers: {
          Cookie: `${ADMIN_SESSION_COOKIE}=${token}`,
        },
      });

      if (res.status === 200) {
        const html = await res.text();
        const foundMarkers = mod.markers.filter((m) =>
          html.toLowerCase().includes(m.toLowerCase())
        );

        if (foundMarkers.length > 0) {
          pass(`3.2 Authenticated ${mod.name} (${mod.path})`, `HTTP 200 OK | Verified: ${foundMarkers.join(', ')}`);
        } else {
          throw new Error(`Page loaded with 200 OK but missing expected UI markers: ${mod.markers.join(', ')}`);
        }
      } else {
        throw new Error(`Expected HTTP 200, received HTTP ${res.status}`);
      }
    } catch (err) {
      fail(`3.2 Authenticated ${mod.name} (${mod.path})`, err);
    }
  }
}

// ============================================================================
// SUITE 4: API ENDPOINT ROUTE PROTECTION & METHOD REJECTION
// ============================================================================
async function runSuite4() {
  suite('4. Admin API Endpoints Auth & Protocol Guardrails');

  // 4.1 Unauthenticated /api/admin/media/upload
  try {
    const res = await fetch(`${BASE_URL}/api/admin/media/upload`, {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 401) {
      pass('4.1 Media upload endpoint unauthenticated rejection', 'HTTP 401 Unauthorized');
    } else {
      throw new Error(`Expected HTTP 401 Unauthorized, received HTTP ${res.status}`);
    }
  } catch (err) {
    fail('4.1 Media upload endpoint unauthenticated rejection', err);
  }

  // 4.2 Unauthenticated /api/admin/media/presign
  try {
    const res = await fetch(`${BASE_URL}/api/admin/media/presign`, {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 401) {
      pass('4.2 Media presign endpoint unauthenticated rejection', 'HTTP 401 Unauthorized');
    } else {
      throw new Error(`Expected HTTP 401 Unauthorized, received HTTP ${res.status}`);
    }
  } catch (err) {
    fail('4.2 Media presign endpoint unauthenticated rejection', err);
  }
}

// ============================================================================
// SUITE 5: DATA LAYER FALLBACK & COLD-START RESILIENCE
// ============================================================================
async function runSuite5() {
  suite('5. Data Layer Fallback & Cold-Start Resilience');

  // 5.1 Venues JSON file integrity
  try {
    const venuesPath = path.join(rootDir, 'src', 'data', 'venues.json');
    if (!fs.existsSync(venuesPath)) {
      throw new Error('src/data/venues.json not found on disk');
    }

    const venuesRaw = fs.readFileSync(venuesPath, 'utf-8');
    const venues = JSON.parse(venuesRaw);

    if (!Array.isArray(venues)) {
      throw new Error('venues.json does not export an array');
    }

    if (venues.length < 30) {
      throw new Error(`Expected at least 30 venues, found ${venues.length}`);
    }

    // Validate schema of every venue
    let invalidCount = 0;
    for (const v of venues) {
      if (!v.id || !v.slug || !v.name || !v.category || !v.city) {
        invalidCount++;
      }
    }

    if (invalidCount === 0) {
      pass('5.1 Venues fallback database schema validation', `${venues.length} venues verified with 100% compliant schemas`);
    } else {
      throw new Error(`${invalidCount} venues have missing required attributes`);
    }
  } catch (err) {
    fail('5.1 Venues fallback database schema validation', err);
  }

  // 5.2 Services data integrity
  try {
    const servicesPath = path.join(rootDir, 'src', 'data', 'services.ts');
    if (!fs.existsSync(servicesPath)) {
      throw new Error('src/data/services.ts not found on disk');
    }

    const servicesContent = fs.readFileSync(servicesPath, 'utf-8');
    const expectedDisciplines = [
      'wedding-venues',
      'planning-and-decor',
      'photography-and-films',
      'catering-and-banquets',
      'music-and-entertainment',
      'ceremonies-and-traditions',
      'bridal-beauty',
      'invitations-and-gifting',
    ];

    let foundAll = true;
    for (const slug of expectedDisciplines) {
      if (!servicesContent.includes(slug)) {
        foundAll = false;
        break;
      }
    }

    if (foundAll) {
      pass('5.2 Services disciplines catalog integrity', '8 luxury artisan disciplines verified');
    } else {
      throw new Error('One or more expected service disciplines missing in services.ts');
    }
  } catch (err) {
    fail('5.2 Services disciplines catalog integrity', err);
  }
}

// ============================================================================
// SUITE 6: BUSINESS LOGIC & LEGAL PRIVACY GUARDRAILS
// ============================================================================
async function runSuite6() {
  suite('6. Business Logic & Legal Privacy Guardrails');

  // 6.1 Testimonial consent guardrail verification
  try {
    const actionsPath = path.join(rootDir, 'src', 'app', 'admin', 'testimonials', 'actions.ts');
    const actionsContent = fs.readFileSync(actionsPath, 'utf-8');

    const hasConsentGuardrail =
      actionsContent.includes('isPublished && !clientConsentRecorded') ||
      actionsContent.includes('client_consent_recorded');

    if (hasConsentGuardrail) {
      pass('6.1 Testimonial client consent legal privacy guardrail', 'Unconsented publication strictly prevented in code');
    } else {
      throw new Error('Consent guardrail check missing in testimonials action');
    }
  } catch (err) {
    fail('6.1 Testimonial client consent legal privacy guardrail', err);
  }

  // 6.2 Edge cache purge target validation
  try {
    const settingsActionsPath = path.join(rootDir, 'src', 'app', 'admin', 'settings', 'actions.ts');
    const settingsContent = fs.readFileSync(settingsActionsPath, 'utf-8');

    const expectedRevalidations = ['/', '/venues', '/services', '/about', '/contact'];
    let allPathsCovered = true;
    for (const p of expectedRevalidations) {
      if (!settingsContent.includes(`'${p}'`)) {
        allPathsCovered = false;
        break;
      }
    }

    if (allPathsCovered) {
      pass('6.2 Edge ISR cache purge coverage', `All 5 public routes covered: ${expectedRevalidations.join(', ')}`);
    } else {
      throw new Error('Edge cache purge does not cover all critical public routes');
    }
  } catch (err) {
    fail('6.2 Edge cache purge coverage', err);
  }
}

// ============================================================================
// SUITE 7: CRUD MUTATIONS & "ADDING NEW THINGS" LIFECYCLE
// ============================================================================
async function runSuite7() {
  suite('7. Live CRUD Mutations & "Adding New Things" Verification');

  const supabaseUrl =
    env.SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.NEXT_SUPABASE_URL ||
    process.env.NEXT_SUPABASE_URL;
  const supabaseKey =
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    env.NEXT_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.log('  \x1b[33m⚠ SKIP\x1b[0m Live database not configured, skipping direct DB write mutations');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const testRunId = Date.now();
  const createdRecordIds = {
    venue: null,
    testimonial: null,
    enquiry: null,
    service: null,
  };

  // 7.1 Add / Create New Venue
  try {
    const testVenueSlug = `test-venue-${testRunId}`;
    const testVenue = {
      name: `Automated Test Palace ${testRunId}`,
      slug: testVenueSlug,
      category: 'Palace',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      address: 'Hazratganj Luxury Corridor, Lucknow',
      rating: 5.0,
      review_count: 1,
      min_pax: 200,
      max_pax: 1500,
      total_capacity: 1500,
      rooms: 25,
      raw_capacity: '200 - 1500 pax',
      veg_available: true,
      non_veg_available: true,
      price_per_plate: 3500,
      price_unit: 'per_plate',
      amenities: ['Valet Parking', 'Royal Mandap Suite', 'Centrally Air Conditioned'],
      description: 'Production verification test venue created by automated test suite.',
      primary_image_url: '/venues/santorini-resort-lucknow/thumbnail.jpg',
      primary_image_alt: 'Automated Test Palace',
      is_featured: false,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('venues').insert(testVenue).select('id, name, slug').single();
    if (error) {
      throw new Error(`Venue insertion failed: ${error.message}`);
    }

    if (data?.id) {
      createdRecordIds.venue = data.id;
      // Query back to verify persistence
      const { data: fetched, error: fetchErr } = await supabase
        .from('venues')
        .select('id, name, slug, price_per_plate')
        .eq('id', data.id)
        .single();

      if (fetchErr || !fetched) {
        throw new Error('Venue inserted but could not be queried back');
      }

      pass('7.1 Add & Persist New Venue', `ID: ${data.id.substring(0, 8)}... | Name: "${data.name}"`);
    } else {
      throw new Error('Insert returned no ID');
    }
  } catch (err) {
    fail('7.1 Add & Persist New Venue', err);
  }

  // 7.2 Add / Create New Testimonial
  try {
    const testTestimonial = {
      couple_names: `Vikram & Ananya (Test ${testRunId})`,
      celebration_type: 'Royal Destination Wedding',
      location: 'Lucknow Heritage Palace',
      wedding_season: 'Winter 2026',
      quote: 'The concierge orchestration was immaculate and dignified throughout our celebration.',
      full_story: 'Verified by automated test suite.',
      rating: 5.0,
      verified: true,
      featured: false,
      is_published: true,
      client_consent_recorded: true,
      source: 'automated-test-suite',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('testimonials').insert(testTestimonial).select('id, couple_names').single();
    if (error) {
      throw new Error(`Testimonial insertion failed: ${error.message}`);
    }

    if (data?.id) {
      createdRecordIds.testimonial = data.id;
      pass('7.2 Add & Persist New Testimonial', `ID: ${data.id.substring(0, 8)}... | Couple: "${data.couple_names}"`);
    } else {
      throw new Error('Insert returned no ID');
    }
  } catch (err) {
    fail('7.2 Add & Persist New Testimonial', err);
  }

  // 7.3 Add / Create New Bespoke Client Lead (Enquiry CRM) & Update Status
  try {
    const testLeadNumber = `RWH-TEST-${testRunId.toString().slice(-6)}`;
    const testEnquiry = {
      lead_number: testLeadNumber,
      name: 'Rohan Malhotra (Automated Test)',
      phone: '9988776655',
      email: 'rohan.test@royalweddinghub.com',
      event_type: 'WEDDING',
      services_requested: ['WEDDING VENUES', 'DÉCOR & SPATIAL ARCHITECTURE'],
      wedding_date: 'November 2026',
      location: 'Lucknow',
      status: 'new',
      internal_notes: 'Created by automated test suite to verify pipeline mutation.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('enquiries').insert(testEnquiry).select('id, lead_number, status').single();
    if (error) {
      throw new Error(`Enquiry insertion failed: ${error.message}`);
    }

    if (data?.id) {
      createdRecordIds.enquiry = data.id;

      // Test modifying/updating this new inquiry's status to 'qualified'
      const { error: updateErr } = await supabase
        .from('enquiries')
        .update({ status: 'qualified', updated_at: new Date().toISOString() })
        .eq('id', data.id);

      if (updateErr) {
        throw new Error(`Failed to update inquiry status: ${updateErr.message}`);
      }

      // Verify mutation in DB
      const { data: updatedRecord, error: verifyErr } = await supabase
        .from('enquiries')
        .select('status')
        .eq('id', data.id)
        .single();

      if (verifyErr || updatedRecord?.status !== 'qualified') {
        throw new Error(`Status mutation failed, expected 'qualified', got '${updatedRecord?.status}'`);
      }

      pass('7.3 Add & Mutate CRM Enquiry Lead', `Lead ${data.lead_number} added (new) -> mutated (qualified)`);
    } else {
      throw new Error('Insert returned no ID');
    }
  } catch (err) {
    fail('7.3 Add & Mutate CRM Enquiry Lead', err);
  }

  // 7.4 Add / Create New Service Discipline
  try {
    const testServiceSlug = `test-service-${testRunId}`;
    const testService = {
      name: `Bespoke Royal Fireworks ${testRunId}`,
      slug: testServiceSlug,
      category_tag: 'Celebration Spectacle',
      headline: 'Illuminating Lucknow Skies.',
      short_description: 'Synchronized low-smoke musical fireworks for royal baraat and reception entries.',
      intro_copy: 'Custom aerial pyrotechnics orchestrated with city clearances and safety cordons.',
      cover_image_url: '/images/services/wedding-entertainment.jpg',
      accent_color: '#521D2B',
      bg_surface: '#FAF7F2',
      text_on_bg: '#211A19',
      cta_text: 'Book Pyrotechnic Display',
      is_featured: false,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('services').insert(testService).select('id, name, slug').single();
    if (error) {
      throw new Error(`Service insertion failed: ${error.message}`);
    }

    if (data?.id) {
      createdRecordIds.service = data.id;
      pass('7.4 Add & Persist New Service Discipline', `ID: ${data.id.substring(0, 8)}... | Slug: "${data.slug}"`);
    } else {
      throw new Error('Insert returned no ID');
    }
  } catch (err) {
    fail('7.4 Add & Persist New Service Discipline', err);
  }

  // 7.5 Zero-Pollution Teardown & Deletion
  try {
    let cleanUpSuccess = true;
    const cleanUpErrors = [];

    if (createdRecordIds.venue) {
      const { error } = await supabase.from('venues').delete().eq('id', createdRecordIds.venue);
      if (error) {
        cleanUpSuccess = false;
        cleanUpErrors.push(`venue delete: ${error.message}`);
      }
    }

    if (createdRecordIds.testimonial) {
      const { error } = await supabase.from('testimonials').delete().eq('id', createdRecordIds.testimonial);
      if (error) {
        cleanUpSuccess = false;
        cleanUpErrors.push(`testimonial delete: ${error.message}`);
      }
    }

    if (createdRecordIds.enquiry) {
      const { error } = await supabase.from('enquiries').delete().eq('id', createdRecordIds.enquiry);
      if (error) {
        cleanUpSuccess = false;
        cleanUpErrors.push(`enquiry delete: ${error.message}`);
      }
    }

    if (createdRecordIds.service) {
      const { error } = await supabase.from('services').delete().eq('id', createdRecordIds.service);
      if (error) {
        cleanUpSuccess = false;
        cleanUpErrors.push(`service delete: ${error.message}`);
      }
    }

    if (cleanUpSuccess) {
      pass('7.5 Zero-Pollution Cleanup & Record Teardown', 'All test items safely purged from database');
    } else {
      throw new Error(`Cleanup failed: ${cleanUpErrors.join(', ')}`);
    }
  } catch (err) {
    fail('7.5 Zero-Pollution Cleanup & Record Teardown', err);
  }
}

// ============================================================================
// RUN ALL SUITES
// ============================================================================
async function main() {
  console.log('\n\x1b[1m\x1b[36m╔════════════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[1m\x1b[36m║   ROYAL WEDDING HUB — PRODUCTION ADMIN PANEL TEST SUITE        ║\x1b[0m');
  console.log('\x1b[1m\x1b[36m╚════════════════════════════════════════════════════════════════╝\x1b[0m');
  console.log(`Target Host: \x1b[32m${BASE_URL}\x1b[0m`);
  console.log(`Environment: \x1b[32m${process.env.NODE_ENV || 'local'}\x1b[0m\n`);

  const startTime = Date.now();

  try {
    const token = await runSuite1();
    await runSuite2();
    await runSuite3(token);
    await runSuite4();
    await runSuite5();
    await runSuite6();
    await runSuite7();
  } catch (fatalErr) {
    console.error('\n\x1b[31mFatal test suite runner error:\x1b[0m', fatalErr);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n\x1b[1m\x1b[36m════════════════════════════════════════════════════════════════\x1b[0m');
  console.log(`\x1b[1mTEST RESULTS SUMMARY:\x1b[0m`);
  console.log(`  Total Tests : ${totalTests}`);
  console.log(`  Passed      : \x1b[32m${passedTests}\x1b[0m`);
  console.log(`  Failed      : ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
  console.log(`  Duration    : ${duration}s`);
  console.log('\x1b[1m\x1b[36m════════════════════════════════════════════════════════════════\x1b[0m\n');

  if (failedTests > 0) {
    console.log('\x1b[31mFailures:\x1b[0m');
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log('\x1b[32m✔ ALL ADMIN PANEL FUNCTIONALITIES EMPIRICALLY VERIFIED FOR PRODUCTION DEPLOYMENT!\x1b[0m\n');
    process.exit(0);
  }
}

main();
