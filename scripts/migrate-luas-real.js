const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
    console.log('Migrating columns to real...');
    await sql`ALTER TABLE monitoring_extended ALTER COLUMN luas_tanam TYPE real`;
    await sql`ALTER TABLE monitoring_data ALTER COLUMN luas_tanam TYPE real`;
    await sql`ALTER TABLE monitoring_data ALTER COLUMN luas_target TYPE real`;
    console.log('✅ Done! Kolom luas_tanam & luas_target sudah berubah ke real.');
}

migrate().catch(e => console.error('Error:', e.message));
