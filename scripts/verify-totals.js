const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);

async function verify() {
    const rows = await sql`SELECT tahun, ROUND(SUM(luas_tanam)::numeric, 2) as total_ha, COUNT(*) as n_rows FROM monitoring_extended GROUP BY tahun ORDER BY tahun`;
    console.log('=== Verifikasi Total Luas per Tahun ===');
    rows.forEach(r => console.log(`Tahun ${r.tahun}: ${r.total_ha} Ha (${r.n_rows} baris)`));
    const grandTotal = rows.reduce((s, r) => s + parseFloat(r.total_ha), 0);
    console.log(`\nGrand Total: ${grandTotal.toFixed(2)} Ha`);
    console.log('\nTarget dari Excel (sheet Jmlh Luasan Penanaman):');
    console.log('2020: 448.70 Ha | 2021: 1411.79 Ha | 2022: 207.95 Ha | 2023: 155.95 Ha | 2024: 224.64 Ha');
}
verify().catch(e => console.error('Error:', e.message));
