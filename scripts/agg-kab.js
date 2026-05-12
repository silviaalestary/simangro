const xlsx = require('xlsx');
const wb = xlsx.readFile('C:/Users/istit/OneDrive/Documents/SEMESTER 6/simangro/Penanaman_KKP_2020-2024_Mgng.xlsx');
const s = wb.Sheets['Penanaman_KKP_2020-2024'];
const data = xlsx.utils.sheet_to_json(s, { defval: null });

// Aggregate total per kabupaten across all years
const agg = {};
for (const r of data) {
    if (!r['Tahun']) continue;
    const kab = (r[' Kabupaten '] || '').trim();
    const prov = (r[' Provinsi '] || '').trim();
    const luas = parseFloat(r[' Luas ']) || 0;
    const key = kab;
    if (!agg[key]) agg[key] = { kab, prov, luas: 0 };
    agg[key].luas += luas;
}

const sorted = Object.values(agg).sort((a, b) => b.luas - a.luas);
const total = sorted.reduce((s, v) => s + v.luas, 0);

console.log(`Total: ${total.toFixed(2)} Ha, ${sorted.length} kabupaten/kota`);
console.log('\n// chartRawData - sorted by luas desc:');
sorted.forEach(v => {
    console.log(`    { name: 'Kab. ${v.kab.replace('Kab. ', '')}', value: ${Math.round(v.luas * 100) / 100}, prov: '${v.prov}' },`);
});
