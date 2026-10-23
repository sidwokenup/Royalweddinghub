import bcrypt from 'bcryptjs';

const email = process.argv[2] || 'admin@royalweddinghub.com';
const password = process.argv[3] || 'RoyalWedding@Lucknow2026';
const fullName = process.argv[4] || 'Royal Wedding Hub Owner';

console.log('==> Generating Admin User Credentials...');
console.log(`Email:     ${email}`);
console.log(`Full Name: ${fullName}`);
console.log(`Password:  ${password}`);

const hash = bcrypt.hashSync(password, 12);

console.log('\n==> Bcrypt Password Hash:');
console.log(hash);

console.log('\n==> SQL INSERT Statement for Supabase / PostgreSQL:');
console.log(`
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('${email.toLowerCase().trim()}', '${hash}', '${fullName}', 'super_admin')
ON CONFLICT (email) DO UPDATE
SET password_hash = '${hash}', full_name = '${fullName}', updated_at = NOW();
`);
