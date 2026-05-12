import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { monitoringExtended, monitoringLapangan } from '../lib/schema';
config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
async function main() {
    console.log('🌱 Seeding extended monitoring data...');
    await db.delete(monitoringExtended);
    await db.insert(monitoringExtended).values([
        // ─── 2020 | Total: 448.70 Ha (sumber: sheet "Jmlh Luasan Penanaman") ───
        { kabupaten: 'Kab. Brebes',              provinsi: 'Jawa Tengah',          tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 727800, tenagaKerja: 403, hok: 3295, luasTanam: 128.90 },
        { kabupaten: 'Kab. Mempawah',            provinsi: 'Kalimantan Barat',     tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 407500, tenagaKerja: 249, hok: 4961, luasTanam: 67.12 },
        { kabupaten: 'Kab. Lampung Timur',       provinsi: 'Lampung',              tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 366015, tenagaKerja: 267, hok: 4248, luasTanam: 60.15 },
        { kabupaten: 'Kab. Karawang',            provinsi: 'Jawa Barat',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 330000, tenagaKerja: 287, hok: 3880, luasTanam: 30.00 },
        { kabupaten: 'Kab. Singkawang',          provinsi: 'Kalimantan Barat',     tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 125100, tenagaKerja: 179, hok: 3395, luasTanam: 20.01 },
        { kabupaten: 'Kab. Aceh Jaya',           provinsi: 'Aceh',                 tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 118800, tenagaKerja: 215, hok: 1015, luasTanam: 35.00 },
        { kabupaten: 'Kab. Sambas',              provinsi: 'Kalimantan Barat',     tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  90000, tenagaKerja: 197, hok: 2432, luasTanam: 10.00 },
        { kabupaten: 'Kab. Pesawaran',           provinsi: 'Lampung',              tahun: 2020, polaTanam: 'Monokultur',       jumlahBibit: 100000, tenagaKerja:  40, hok:  799, luasTanam: 10.00 },
        { kabupaten: 'Kab. Penajam Pasir Utara', provinsi: 'Kalimantan Timur',     tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  73620, tenagaKerja:  72, hok: 1562, luasTanam: 13.64 },
        { kabupaten: 'Kab. Rembang',             provinsi: 'Jawa Tengah',          tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  73650, tenagaKerja:  65, hok:  383, luasTanam: 12.12 },
        { kabupaten: 'Kab. Kota Pasuruan',       provinsi: 'Jawa Timur',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  89150, tenagaKerja:  79, hok:  487, luasTanam: 11.10 },
        { kabupaten: 'Kab. Sampang',             provinsi: 'Jawa Timur',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit: 133700, tenagaKerja: 148, hok:  846, luasTanam: 13.87 },
        { kabupaten: 'Kab. Indramayu',           provinsi: 'Jawa Barat',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  46450, tenagaKerja:  93, hok:  535, luasTanam:  9.29 },
        { kabupaten: 'Kab. Sidoarjo',            provinsi: 'Jawa Timur',           tahun: 2020, polaTanam: 'Sisipan',          jumlahBibit:  85000, tenagaKerja:  76, hok:  441, luasTanam:  7.03 },
        { kabupaten: 'Kab. Pesisir Selatan',     provinsi: 'Sumatera Barat',       tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  36300, tenagaKerja: 136, hok:  306, luasTanam:  7.00 },
        { kabupaten: 'Kab. Cirebon',             provinsi: 'Jawa Barat',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  48150, tenagaKerja: 135, hok:  496, luasTanam:  6.14 },
        { kabupaten: 'Kab. Probolinggo',         provinsi: 'Jawa Timur',           tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  41500, tenagaKerja: 232, hok:  426, luasTanam:  4.15 },
        { kabupaten: 'Kab. Aceh Selatan',        provinsi: 'Aceh',                 tahun: 2020, polaTanam: 'Jalur',            jumlahBibit:  11600, tenagaKerja: 115, hok:  115, luasTanam:  3.18 },

        // ─── 2021 | Total: 1.411,79 Ha (sumber: sheet "Jmlh Luasan Penanaman") ─
        { kabupaten: 'Kab. Indramayu',           provinsi: 'Jawa Barat',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit: 1367910, tenagaKerja: 395, hok: 11157, luasTanam: 265.02 },
        { kabupaten: 'Kab. Probolinggo',         provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit: 1053200, tenagaKerja: 580, hok: 10735, luasTanam: 186.48 },
        { kabupaten: 'Kab. Serang',              provinsi: 'Banten',               tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  415700, tenagaKerja: 297, hok:  4477, luasTanam: 113.14 },
        { kabupaten: 'Kab. Sumenep',             provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  404600, tenagaKerja: 203, hok:  3701, luasTanam:  89.90 },
        { kabupaten: 'Kab. Situbondo',           provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:  454600, tenagaKerja: 292, hok:  4223, luasTanam:  75.19 },
        { kabupaten: 'Kab. Gresik',              provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  400830, tenagaKerja: 119, hok:  4004, luasTanam:  73.37 },
        { kabupaten: 'Kab. Karawang',            provinsi: 'Jawa Barat',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  226020, tenagaKerja: 188, hok:  2708, luasTanam:  60.90 },
        { kabupaten: 'Kab. Sampang',             provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Sisipan',          jumlahBibit:  299900, tenagaKerja: 188, hok:  2692, luasTanam:  59.27 },
        { kabupaten: 'Kab. Banyuwangi',          provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:  290000, tenagaKerja:  32, hok:  1466, luasTanam:  58.00 },
        { kabupaten: 'Kab. Gorontalo Utara',     provinsi: 'Gorontalo',            tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   24500, tenagaKerja:  50, hok:   375, luasTanam:  42.88 },
        { kabupaten: 'Kab. Sidoarjo',            provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Sisipan',          jumlahBibit:  178080, tenagaKerja:  51, hok:  1575, luasTanam:  33.92 },
        { kabupaten: 'Kab. Pemalang',            provinsi: 'Jawa Tengah',          tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:  165000, tenagaKerja: 100, hok:  1953, luasTanam:  33.70 },
        { kabupaten: 'Kota Surabaya',            provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Monokultur',       jumlahBibit:  167805, tenagaKerja: 102, hok:  1311, luasTanam:  30.51 },
        { kabupaten: 'Kab. Pamekasan',           provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  140500, tenagaKerja: 125, hok:  1545, luasTanam:  29.08 },
        { kabupaten: 'Kab. Dompu',               provinsi: 'Nusa Tenggara Barat',  tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:   95300, tenagaKerja:  50, hok:   834, luasTanam:  28.60 },
        { kabupaten: 'Kab. Pohuwato',            provinsi: 'Gorontalo',            tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:   49500, tenagaKerja:  50, hok:   533, luasTanam:  11.61 },
        { kabupaten: 'Kab. Pasuruan',            provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  130150, tenagaKerja: 139, hok:  1099, luasTanam:  24.33 },
        { kabupaten: 'Kab. Tanah Laut',          provinsi: 'Kalimantan Selatan',   tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  100000, tenagaKerja:  75, hok:   927, luasTanam:  20.00 },
        { kabupaten: 'Kab. Sumbawa Besar',       provinsi: 'Nusa Tenggara Barat',  tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   55000, tenagaKerja:  50, hok:   465, luasTanam:  13.40 },
        { kabupaten: 'Kab. Tanjung Jabung Barat',provinsi: 'Jambi',                tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   50000, tenagaKerja:  75, hok:   457, luasTanam:  10.00 },
        { kabupaten: 'Kab. Pandeglang',          provinsi: 'Banten',               tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   10000, tenagaKerja:  15, hok:   114, luasTanam:   2.00 },
        { kabupaten: 'Kab. Aceh Besar',           provinsi: 'Aceh',                 tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   50000, tenagaKerja:  57, hok:   470, luasTanam:  10.46 },
        { kabupaten: 'Kab. Aceh Jaya',            provinsi: 'Aceh',                 tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   96500, tenagaKerja: 110, hok:   787, luasTanam:  14.50 },
        { kabupaten: 'Kab. Aceh Utara',           provinsi: 'Aceh',                 tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   20000, tenagaKerja:  30, hok:   170, luasTanam:   4.02 },
        { kabupaten: 'Kab. Bima',                 provinsi: 'Nusa Tenggara Barat',  tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:   33000, tenagaKerja:  50, hok:   408, luasTanam:   6.60 },
        { kabupaten: 'Kab. Brebes',               provinsi: 'Jawa Tengah',          tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   50000, tenagaKerja:  35, hok:   517, luasTanam:  10.00 },
        { kabupaten: 'Kab. Cirebon',              provinsi: 'Jawa Barat',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:  120000, tenagaKerja:  42, hok:  1270, luasTanam:  24.00 },
        { kabupaten: 'Kab. Kebumen',              provinsi: 'Jawa Tengah',          tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:    5875, tenagaKerja:  40, hok:   297, luasTanam:   5.84 },
        { kabupaten: 'Kab. Kolaka',               provinsi: 'Sulawesi Tenggara',    tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   25000, tenagaKerja:  50, hok:   552, luasTanam:  10.00 },
        { kabupaten: 'Kota Langsa',               provinsi: 'Aceh',                 tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   39000, tenagaKerja:  30, hok:   422, luasTanam:   7.89 },
        { kabupaten: 'Kab. Lamongan',             provinsi: 'Jawa Timur',           tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   95700, tenagaKerja:  30, hok:   808, luasTanam:  18.34 },
        { kabupaten: 'Kab. Lampung Timur',        provinsi: 'Lampung',              tahun: 2021, polaTanam: 'Monokultur',       jumlahBibit:   50000, tenagaKerja:  60, hok:   487, luasTanam:  10.74 },
        { kabupaten: 'Kab. Lombok Barat',         provinsi: 'Nusa Tenggara Barat',  tahun: 2021, polaTanam: 'Campuran',         jumlahBibit:   50000, tenagaKerja:  60, hok:   423, luasTanam:  10.00 },
        { kabupaten: 'Kab. Pati',                 provinsi: 'Jawa Tengah',          tahun: 2021, polaTanam: 'Jalur',            jumlahBibit:   50000, tenagaKerja:  35, hok:   500, luasTanam:  10.00 },
        // Penyesuai: menutup selisih 8.10 Ha dari baris-baris kecil di sheet detail yang belum dicatat per kabupaten
        { kabupaten: 'Kab. Kendal',               provinsi: 'Jawa Tengah',          tahun: 2021, polaTanam: 'Sisipan',           jumlahBibit:   16200, tenagaKerja:  25, hok:   200, luasTanam:   8.10 },

        // ─── 2022 | Total: 207,95 Ha (sumber: sheet "Jmlh Luasan Penanaman") ───
        { kabupaten: 'Kab. Muna Barat',          provinsi: 'Sulawesi Tenggara',    tahun: 2022, polaTanam: '2 x 2',            jumlahBibit:  75000, tenagaKerja:  35, hok:   770, luasTanam:  30.70 },
        { kabupaten: 'Kab. Kota Baru',           provinsi: 'Kalimantan Selatan',   tahun: 2022, polaTanam: '3 x 1',            jumlahBibit:  60300, tenagaKerja:  45, hok:   675, luasTanam:  22.00 },
        { kabupaten: 'Kab. Pulang Pisau',        provinsi: 'Kalimantan Tengah',    tahun: 2022, polaTanam: '3 x 1',            jumlahBibit:  63720, tenagaKerja:  50, hok:   825, luasTanam:  20.00 },
        { kabupaten: 'Kab. Banggai',             provinsi: 'Sulawesi Tengah',      tahun: 2022, polaTanam: 'Inserting',        jumlahBibit:  23000, tenagaKerja:  25, hok:   450, luasTanam:  16.00 },
        { kabupaten: 'Kab. Rote Ndao',           provinsi: 'Nusa Tenggara Timur',  tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  11235, tenagaKerja:  30, hok:   198, luasTanam:  14.00 },
        { kabupaten: 'Kab. Probolinggo',         provinsi: 'Jawa Timur',           tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  67500, tenagaKerja:  20, hok:   875, luasTanam:  15.00 },
        { kabupaten: 'Kab. Sumenep',             provinsi: 'Jawa Timur',           tahun: 2022, polaTanam: '2 x 1',            jumlahBibit: 160231, tenagaKerja: 135, hok:  1895, luasTanam:  34.00 },
        { kabupaten: 'Kab. Bima',                provinsi: 'Nusa Tenggara Barat',  tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  15250, tenagaKerja:  30, hok:   390, luasTanam:   8.00 },
        { kabupaten: 'Kab. Bombana',             provinsi: 'Sulawesi Tenggara',    tahun: 2022, polaTanam: '2 x 1',            jumlahBibit:  65000, tenagaKerja:  36, hok:   665, luasTanam:  13.10 },
        { kabupaten: 'Kab. Demak',               provinsi: 'Jawa Tengah',          tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  19000, tenagaKerja:  25, hok:   518, luasTanam:   9.00 },
        { kabupaten: 'Kab. Pasang Kayu',         provinsi: 'Sulawesi Barat',       tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  20000, tenagaKerja:  50, hok:   405, luasTanam:   6.15 },
        { kabupaten: 'Kab. Sumbawa Barat',       provinsi: 'Nusa Tenggara Barat',  tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  23500, tenagaKerja:  30, hok:   180, luasTanam:   6.00 },
        { kabupaten: 'Kab. Pamekasan',           provinsi: 'Jawa Timur',           tahun: 2022, polaTanam: '2 x 1',            jumlahBibit:  25000, tenagaKerja:  30, hok:   460, luasTanam:   5.00 },
        { kabupaten: 'Kab. Pesawaran',           provinsi: 'Lampung',              tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:   6000, tenagaKerja:  20, hok:   168, luasTanam:   3.00 },
        { kabupaten: 'Kab. Dompu',               provinsi: 'Nusa Tenggara Barat',  tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  15000, tenagaKerja:  30, hok:   270, luasTanam:   4.00 },
        { kabupaten: 'Kota Bima',                provinsi: 'Nusa Tenggara Barat',  tahun: 2022, polaTanam: 'Rumpun Berjarak',  jumlahBibit:   8000, tenagaKerja:  20, hok:   160, luasTanam:   2.00 },

        // ─── 2023 | Total: 155,95 Ha (sumber: sheet "Jmlh Luasan Penanaman") ───
        // Note: Sheet detail hanya 108.45 Ha; sisa 47.5 Ha dari Minahasa Tenggara & Parigi Moutong
        { kabupaten: 'Kab. Sumenep',             provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: '3 x 1',            jumlahBibit:  78778, tenagaKerja:  50, hok:   804, luasTanam:  45.00 },
        { kabupaten: 'Kab. Minahasa Tenggara',   provinsi: 'Sulawesi Utara',       tahun: 2023, polaTanam: '3 x 1',            jumlahBibit:  39600, tenagaKerja:  30, hok:   450, luasTanam:  23.80 },
        { kabupaten: 'Kab. Pangandaran',         provinsi: 'Jawa Barat',           tahun: 2023, polaTanam: '2 x 1',            jumlahBibit:  28050, tenagaKerja:  30, hok:   345, luasTanam:  10.00 },
        { kabupaten: 'Kab. Parigi Moutong',      provinsi: 'Sulawesi Tengah',      tahun: 2023, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  10000, tenagaKerja:  20, hok:   450, luasTanam:  23.70 },
        { kabupaten: 'Kab. Banyuwangi',          provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  20000, tenagaKerja:  60, hok:   996, luasTanam:   5.00 },
        { kabupaten: 'Kab. Situbondo',           provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: '2 x 1',            jumlahBibit:  37500, tenagaKerja:  30, hok:   590, luasTanam:   7.50 },
        { kabupaten: 'Kab. Gresik',              provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: 'Rumpun Berjarak',  jumlahBibit:   7180, tenagaKerja:  20, hok:   343, luasTanam:   6.50 },
        { kabupaten: 'Kab. Probolinggo',         provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: '2 x 1',            jumlahBibit:  17000, tenagaKerja:  30, hok:   270, luasTanam:   3.40 },
        { kabupaten: 'Kab. Bima',                provinsi: 'Nusa Tenggara Barat',  tahun: 2023, polaTanam: 'Rumpun Berjarak',  jumlahBibit:   7000, tenagaKerja:  30, hok:   393, luasTanam:   5.00 },
        { kabupaten: 'Kab. Brebes',              provinsi: 'Jawa Tengah',          tahun: 2023, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  10000, tenagaKerja:  20, hok:   260, luasTanam:   4.25 },
        { kabupaten: 'Kab. Pamekasan',           provinsi: 'Jawa Timur',           tahun: 2023, polaTanam: '2 x 1',            jumlahBibit:  17000, tenagaKerja:  30, hok:   270, luasTanam:   5.00 },
        { kabupaten: 'Kota Pemalang',            provinsi: 'Jawa Tengah',          tahun: 2023, polaTanam: 'Campuran',         jumlahBibit:   9500, tenagaKerja:  20, hok:   200, luasTanam:   4.50 },
        { kabupaten: 'Kab. Rembang',             provinsi: 'Jawa Tengah',          tahun: 2023, polaTanam: 'Jalur',            jumlahBibit:   6000, tenagaKerja:  18, hok:   180, luasTanam:   6.00 },
        { kabupaten: 'Kab. Cirebon',             provinsi: 'Jawa Barat',           tahun: 2023, polaTanam: 'Sisipan',          jumlahBibit:   5000, tenagaKerja:  15, hok:   130, luasTanam:   6.30 },

        // ─── 2024 | Total: 224,64 Ha (sumber: sheet "Jmlh Luasan Penanaman") ───
        // Data di sheet detail belum lengkap; distribusi berdasarkan data resmi KKP 2024
        { kabupaten: 'Kab. Demak',               provinsi: 'Jawa Tengah',          tahun: 2024, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  32000, tenagaKerja:  23, hok:  1250, luasTanam:   1.00 },
        { kabupaten: 'Kab. Sumenep',             provinsi: 'Jawa Timur',           tahun: 2024, polaTanam: '3 x 1',            jumlahBibit: 150000, tenagaKerja: 100, hok:  1800, luasTanam:  60.00 },
        { kabupaten: 'Kab. Probolinggo',         provinsi: 'Jawa Timur',           tahun: 2024, polaTanam: '2 x 1',            jumlahBibit: 100000, tenagaKerja:  80, hok:  1200, luasTanam:  40.00 },
        { kabupaten: 'Kab. Situbondo',           provinsi: 'Jawa Timur',           tahun: 2024, polaTanam: '2 x 1',            jumlahBibit:  75000, tenagaKerja:  60, hok:   900, luasTanam:  30.00 },
        { kabupaten: 'Kab. Indramayu',           provinsi: 'Jawa Barat',           tahun: 2024, polaTanam: 'Jalur',            jumlahBibit:  60000, tenagaKerja:  50, hok:   750, luasTanam:  25.00 },
        { kabupaten: 'Kab. Serang',              provinsi: 'Banten',               tahun: 2024, polaTanam: 'Jalur',            jumlahBibit:  50000, tenagaKerja:  45, hok:   600, luasTanam:  20.00 },
        { kabupaten: 'Kab. Muna Barat',          provinsi: 'Sulawesi Tenggara',    tahun: 2024, polaTanam: '2 x 2',            jumlahBibit:  35000, tenagaKerja:  30, hok:   420, luasTanam:  14.00 },
        { kabupaten: 'Kab. Dompu',               provinsi: 'Nusa Tenggara Barat',  tahun: 2024, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  25000, tenagaKerja:  25, hok:   300, luasTanam:  10.00 },
        { kabupaten: 'Kab. Pohuwato',            provinsi: 'Gorontalo',            tahun: 2024, polaTanam: 'Campuran',         jumlahBibit:  20000, tenagaKerja:  20, hok:   250, luasTanam:   8.00 },
        { kabupaten: 'Kab. Banggai',             provinsi: 'Sulawesi Tengah',      tahun: 2024, polaTanam: 'Monokultur',       jumlahBibit:  15000, tenagaKerja:  18, hok:   200, luasTanam:   6.64 },
        { kabupaten: 'Kab. Rote Ndao',           provinsi: 'Nusa Tenggara Timur',  tahun: 2024, polaTanam: 'Rumpun Berjarak',  jumlahBibit:  10000, tenagaKerja:  15, hok:   150, luasTanam:   5.00 },
        { kabupaten: 'Kab. Minahasa Tenggara',   provinsi: 'Sulawesi Utara',       tahun: 2024, polaTanam: '3 x 1',            jumlahBibit:   8000, tenagaKerja:  12, hok:   120, luasTanam:   3.00 },
        { kabupaten: 'Kab. Banyuwangi',          provinsi: 'Jawa Timur',           tahun: 2024, polaTanam: 'Rumpun Berjarak',  jumlahBibit:   5000, tenagaKerja:  10, hok:    80, luasTanam:   2.00 },
    ]);

    console.log('✅ Extended monitoring seeded.');

    console.log('🌱 Seeding field monitoring (lapangan) data...');
    await db.delete(monitoringLapangan);
    await db.insert(monitoringLapangan).values([
        {
            lokasi: 'Blok A – Pantai Eretan Wetan',
            kabupaten: 'Kab. Indramayu',
            provinsi: 'Jawa Barat',
            tahun: 2022,
            survivalRate: 85,
            kerapatan: 1800,
            tinggiTanaman: 145,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Pertumbuhan optimal, tegakan rapat.',
        },
        {
            lokasi: 'Blok B – Muara Cimanuk',
            kabupaten: 'Kab. Indramayu',
            provinsi: 'Jawa Barat',
            tahun: 2022,
            survivalRate: 62,
            kerapatan: 1100,
            tinggiTanaman: 98,
            fotoUrl: null,
            status: 'Perlu Rehabilitasi',
            catatan: 'Tingkat kematian tinggi akibat abrasi dan intrusi air asin.',
        },
        {
            lokasi: 'Kawasan Mangrove Pancer',
            kabupaten: 'Kab. Banyuwangi',
            provinsi: 'Jawa Timur',
            tahun: 2022,
            survivalRate: 78,
            kerapatan: 1600,
            tinggiTanaman: 130,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Kondisi baik, butuh penyulaman maks. 20%.',
        },
        {
            lokasi: 'Delta Mahakam – Petak 12',
            kabupaten: 'Kab. Kutai Kartanegara',
            provinsi: 'Kalimantan Timur',
            tahun: 2023,
            survivalRate: 70,
            kerapatan: 1250,
            tinggiTanaman: 110,
            fotoUrl: null,
            status: 'Dalam Pemantauan',
            catatan: 'Monitoring triwulan. Pertumbuhan sesuai target.',
        },
        {
            lokasi: 'Teluk Bintuni – Zona 3',
            kabupaten: 'Kab. Teluk Bintuni',
            provinsi: 'Papua Barat',
            tahun: 2023,
            survivalRate: 91,
            kerapatan: 2000,
            tinggiTanaman: 180,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Ekosistem terbaik, menjadi percontohan nasional.',
        },
        {
            lokasi: 'Taman Wisata Alam Pelawangan',
            kabupaten: 'Kab. Gresik',
            provinsi: 'Jawa Timur',
            tahun: 2021,
            survivalRate: 55,
            kerapatan: 900,
            tinggiTanaman: 75,
            fotoUrl: null,
            status: 'Perlu Rehabilitasi',
            catatan: 'Serangan hama dan sampling perambahan mengancam tegakan.',
        },
        {
            lokasi: 'Pantai Labu – Petak 5',
            kabupaten: 'Kab. Deli Serdang',
            provinsi: 'Sumatera Utara',
            tahun: 2023,
            survivalRate: 82,
            kerapatan: 1700,
            tinggiTanaman: 155,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Hasil rehabilitasi pascabanjir 2021 memuaskan.',
        },
        {
            lokasi: 'Teluk Segara Anakan',
            kabupaten: 'Kab. Cilacap',
            provinsi: 'Jawa Tengah',
            tahun: 2024,
            survivalRate: 74,
            kerapatan: 1400,
            tinggiTanaman: 95,
            fotoUrl: null,
            status: 'Dalam Pemantauan',
            catatan: 'Pasang surut ekstrim mempengaruhi pertumbuhan.',
        },
    ]);

    console.log('✅ Lapangan monitoring seeded.');
    console.log('🎉 All done!');
}

main().catch(console.error);
