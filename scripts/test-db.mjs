import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envContent = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [k, ...v] = trimmed.split('=');
    env[k.trim()] = v.join('=').replace(/^['"]|['"]$/g, '').trim();
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase URL:', url ? url.substring(0, 30) + '...' : 'Missing');
if (url && key && !url.includes('placeholder')) {
  const supabase = createClient(url, key);
  try {
    const { count, error } = await supabase.from('venues').select('*', { count: 'exact', head: true });
    if (error) {
      console.log('Venues query error:', error.message);
    } else {
      console.log('Venues count in DB:', count);
    }

    const { count: sCount, error: sError } = await supabase.from('services').select('*', { count: 'exact', head: true });
    if (sError) {
      console.log('Services query error:', sError.message);
    } else {
      console.log('Services count in DB:', sCount);
    }
  } catch (e) {
    console.log('Exception:', e.message);
  }
} else {
  console.log('Credentials missing or placeholder.');
}
