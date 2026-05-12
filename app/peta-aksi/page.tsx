'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// ─── Data Penanaman Mangrove per Kabupaten/Kota (Sumber: Penanaman_KKP_2020-2024_Mgng.xlsx) ──
const chartRawData: { name: string; value: number; prov: string }[] = [
    { name: 'Kab. Indramayu', value: 274.31, prov: 'Jawa Barat' },
    { name: 'Kab. Probolinggo', value: 209.03, prov: 'Jawa Timur' },
    { name: 'Kab. Sumenep', value: 168.9, prov: 'Jawa Timur' },
    { name: 'Kab. Brebes', value: 143.15, prov: 'Jawa Tengah' },
    { name: 'Kab. Serang', value: 113.14, prov: 'Banten' },
    { name: 'Kab. Karawang', value: 90.9, prov: 'Jawa Barat' },
    { name: 'Kab. Situbondo', value: 82.69, prov: 'Jawa Timur' },
    { name: 'Kab. Gresik', value: 79.87, prov: 'Jawa Timur' },
    { name: 'Kab. Sampang', value: 73.14, prov: 'Jawa Timur' },
    { name: 'Kab. Lampung Timur', value: 70.89, prov: 'Lampung' },
    { name: 'Kab. Mempawah', value: 67.12, prov: 'Kalimantan Barat' },
    { name: 'Kab. Banyuwangi', value: 63, prov: 'Jawa Timur' },
    { name: 'Kab. Aceh Jaya', value: 49.5, prov: 'Aceh' },
    { name: 'Kab. Gorontalo Utara', value: 42.88, prov: 'Gorontalo' },
    { name: 'Kab. Sidoarjo', value: 40.95, prov: 'Jawa Timur' },
    { name: 'Kab. Pamekasan', value: 34.08, prov: 'Jawa Timur' },
    { name: 'Kab. Pemalang', value: 33.7, prov: 'Jawa Tengah' },
    { name: 'Kab. Dompu', value: 32.6, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Muna Barat', value: 30.7, prov: 'Sulawesi Tenggara' },
    { name: 'Kab. Kota Surabaya', value: 30.51, prov: 'Jawa Timur' },
    { name: 'Kab. Cirebon', value: 30.14, prov: 'Jawa Barat' },
    { name: 'Kab. Pasuruan', value: 24.33, prov: 'Jawa Timur' },
    { name: 'Kab. Kota Baru', value: 22, prov: 'Kalimantan Selatan' },
    { name: 'Kab. Singkawang', value: 20.01, prov: 'Kalimantan Barat' },
    { name: 'Kab. Pulang Pisau', value: 20, prov: 'Kalimantan Tengah' },
    { name: 'Kab. Tanah Laut', value: 20, prov: 'Kalimantan Selatan' },
    { name: 'Kab. Bima', value: 19.6, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Lamongan', value: 18.34, prov: 'Jawa Timur' },
    { name: 'Kab. Kota Pasuruan', value: 16.1, prov: 'Jawa Timur' },
    { name: 'Kab. Banggai', value: 16, prov: 'Sulawesi Tengah' },
    { name: 'Kab. Rote Ndao', value: 14, prov: 'Nusa Tenggara Timur' },
    { name: 'Kab. Penajam Pasir Utara', value: 13.64, prov: 'Kalimantan Timur' },
    { name: 'Kab. Sumbawa Besar', value: 13.4, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Bombana', value: 13.1, prov: 'Sulawesi Tenggara' },
    { name: 'Kab. Pesawaran', value: 13, prov: 'Lampung' },
    { name: 'Kab. Rembang', value: 12.12, prov: 'Jawa Tengah' },
    { name: 'Kab. Minahasa Tenggara', value: 11.8, prov: 'Sulawesi Utara' },
    { name: 'Kab. Pohuwato', value: 11.61, prov: 'Gorontalo' },
    { name: 'Kab. Aceh Besar', value: 10.46, prov: 'Aceh' },
    { name: 'Kab. Demak', value: 10, prov: 'Jawa Tengah' },
    { name: 'Kab. Kolaka', value: 10, prov: 'Sulawesi Tenggara' },
    { name: 'Kab. Lombok Barat', value: 10, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Pangandaran', value: 10, prov: 'Jawa Barat' },
    { name: 'Kab. Parigi Moutong', value: 10, prov: 'Sulawesi Tengah' },
    { name: 'Kab. Pati', value: 10, prov: 'Jawa Tengah' },
    { name: 'Kab. Sambas', value: 10, prov: 'Kalimantan Barat' },
    { name: 'Kab. Tanjung Jabung Barat', value: 10, prov: 'Jambi' },
    { name: 'Kab. Kota Langsa', value: 7.89, prov: 'Aceh' },
    { name: 'Kab. Pesisir Selatan', value: 7, prov: 'Sumatera Barat' },
    { name: 'Kab. Pasang Kayu', value: 6.15, prov: 'Sulawesi Barat' },
    { name: 'Kab. Sumbawa Barat', value: 6, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Kebumen', value: 5.84, prov: 'Jawa Tengah' },
    { name: 'Kab. Aceh Utara', value: 4.02, prov: 'Aceh' },
    { name: 'Kab. Aceh Selatan', value: 3.18, prov: 'Aceh' },
    { name: 'Kab. Kota Probolinggo', value: 3.1, prov: 'Jawa Timur' },
    { name: 'Kab. Kota Bima', value: 2, prov: 'Nusa Tenggara Barat' },
    { name: 'Kab. Pandeglang', value: 2, prov: 'Banten' },
];

const CHART_DATA = chartRawData;

// Generate palette of distinct colors
function generateColors(count: number) {
    const palette = [
        '#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#3b82f6',
        '#22c55e', '#06b6d4', '#a78bfa', '#fbbf24', '#10b981', '#e11d48', '#60a5fa', '#84cc16',
        '#38bdf8', '#c084fc', '#fb7185', '#4ade80', '#34d399', '#facc15', '#818cf8', '#2dd4bf',
        '#fb923c', '#a3e635', '#f472b6', '#67e8f9', '#d946ef', '#fde68a', '#bbf7d0', '#bfdbfe',
        '#fca5a5', '#fed7aa', '#d9f99d', '#e9d5ff', '#fce7f3', '#ccfbf1', '#cffafe', '#ddd6fe',
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}

function buildChartData(): ChartData<'pie'> {
    const colors = generateColors(CHART_DATA.length);
    return {
        labels: CHART_DATA.map(d => d.name),
        datasets: [{
            data: CHART_DATA.map(d => d.value),
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 2,
            hoverOffset: 12,
        }],
    };
}

const PIE_DATA = buildChartData();
const TOTAL_HA = CHART_DATA.reduce((s, d) => s + d.value, 0);

export default function PetaAksiPage() {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<import('leaflet').Map | null>(null);
    const [filterProv, setFilterProv] = useState('');
    const [filterKab, setFilterKab] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [provinces, setProvinces] = useState<string[]>([]);
    const [kabupatens, setKabupatens] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [mapReady, setMapReady] = useState(false);
    const [tableSearch, setTableSearch] = useState('');

    const layersRef = useRef<{
        allFeatures: { props: Record<string, unknown>; layer: import('leaflet').Layer }[];
    }>({ allFeatures: [] });

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || leafletMapRef.current) return;
        let isMounted = true;

        import('leaflet').then(async (L) => {
            if (!isMounted || !mapRef.current) return;

            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const map = L.map(mapRef.current!, { center: [-2.5, 118], zoom: 5, zoomControl: true });
            leafletMapRef.current = map;

            const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 });
            const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles © Esri', maxZoom: 19 });
            osm.addTo(map);
            L.control.layers({ "OpenStreetMap": osm, "Esri Satellite": esri }).addTo(map);

            const provSet = new Set<string>();
            const kabSet = new Set<string>();
            const yearSet = new Set<string>();
            const allFeatures: { props: Record<string, unknown>; layer: import('leaflet').Layer }[] = [];

            function row(label: string, value: unknown) {
                if (!value) return '';
                return `<tr><td style="padding:4px 8px;color:#64748b;font-weight:600;white-space:nowrap;">${label}</td><td style="padding:4px 8px;color:#0f172a;">${value}</td></tr>`;
            }

            function makePrpepPopup(props: Record<string, unknown>) {
                return `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:220px;">
                    <div style="background:linear-gradient(135deg,#16a34a,#22c55e);color:white;padding:10px 14px;border-radius:8px 8px 0 0;font-weight:700;font-size:1rem;margin:-12px -12px 10px;">📍 Lokasi PRPEP</div>
                    <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                        ${row('Provinsi', props.Provinsi)}${row('Kabupaten', props.Kabupaten)}${row('Kecamatan', props.Kecamatan)}${row('Desa', props.Desa)}${row('Penerima Bantuan', props.Penerima_Bantuan)}${row('Bentuk Bantuan', props.Bantuan)}${row('Tahun', props.Tahun)}
                    </table></div>`;
            }

            function makePenanamanPopup(props: Record<string, unknown>) {
                return `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:220px;">
                    <div style="background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:white;padding:10px 14px;border-radius:8px 8px 0 0;font-weight:700;font-size:1rem;margin:-12px -12px 10px;">🌿 Penanaman Mangrove</div>
                    <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                        ${row('Provinsi', props.Provinsi)}${row('Kabupaten', props.Kabupaten || props.Kabupaten_K)}${row('Kecamatan', props.Kecamatan)}${row('Desa', props.Desa)}${row('Luas (Ha)', props.Luas_Ha || props.LUAS_HA)}${row('Tahun', props.Tahun || props.TAHUN)}${row('Jenis Bibit', props.Jns_Bibit || props.JNS_BIBIT || '-')}${row('Jumlah Bibit', props.Jml_Bibit || props.JML_BIBIT ? `${Number(props.Jml_Bibit || props.JML_BIBIT).toLocaleString('id-ID')} batang` : '-')}
                    </table></div>`;
            }

            const PRPEP_ICON = L.divIcon({
                className: '',
                html: `<div style="width:10px;height:10px;border-radius:50%;background:#16a34a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
                iconSize: [10, 10], iconAnchor: [5, 5],
            });
            const PEN_ICON = L.divIcon({
                className: '',
                html: `<div style="width:10px;height:10px;border-radius:50%;background:#0ea5e9;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
                iconSize: [10, 10], iconAnchor: [5, 5],
            });

            try {
                const [penRes, prpepRes] = await Promise.all([
                    fetch('https://simangro.vercel.app/shp/Penanaman_Mangrove_KKP_2020_2024.geojson'),
                    fetch('https://simangro.vercel.app/shp/Lokasi_PRPEP_2015_2024.json')
                ]);

                const penData = await penRes.json();
                penData.features.forEach((f: any) => {
                    if (f.geometry && f.geometry.type !== 'Point') {
                        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                        const traverse = (coords: any[]) => {
                            if (typeof coords[0] === 'number') {
                                const [x, y] = coords;
                                if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y;
                            } else coords.forEach(traverse);
                        };
                        traverse(f.geometry.coordinates);
                        if (minX !== Infinity) f.geometry = { type: 'Point', coordinates: [(minX + maxX) / 2, (minY + maxY) / 2] };
                    }
                });

                L.geoJSON(penData, {
                    pointToLayer: (_f, latlng) => L.marker(latlng, { icon: PEN_ICON }),
                    onEachFeature: (feature, layer) => {
                        const p = feature.properties as Record<string, unknown>;
                        layer.bindPopup(makePenanamanPopup(p));
                        const prov = String(p.Provinsi || '').trim();
                        const kab = String(p.Kabupaten || p.Kabupaten_K || '').trim();
                        const yr = String(p.Tahun || p.TAHUN || '').trim();
                        if (prov) provSet.add(prov);
                        if (kab) kabSet.add(kab);
                        if (yr) yearSet.add(yr);
                        allFeatures.push({ props: p, layer });
                    },
                }).addTo(map);

                const prpepData = await prpepRes.json();
                L.geoJSON(prpepData, {
                    pointToLayer: (_f, latlng) => L.marker(latlng, { icon: PRPEP_ICON }),
                    onEachFeature: (feature, layer) => {
                        const p = feature.properties as Record<string, unknown>;
                        layer.bindPopup(makePrpepPopup(p));
                        const prov = String(p.Provinsi || '').trim();
                        const kab = String(p.Kabupaten || '').trim();
                        const yr = String(p.Tahun || '').trim();
                        if (prov) provSet.add(prov);
                        if (kab) kabSet.add(kab);
                        if (yr) yearSet.add(yr);
                        allFeatures.push({ props: p, layer });
                    },
                }).addTo(map);

                const legend = (L.control as any)({ position: 'bottomright' });
                legend.onAdd = () => {
                    const div = L.DomUtil.create('div');
                    div.innerHTML = `<div style="position:relative;font-family:sans-serif">
                        <div id="legend-btn" style="width:40px;height:40px;background:white;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.2);font-size:18px;">🗺️</div>
                        <div id="legend-panel" style="position:absolute;bottom:50px;right:0;background:white;padding:14px 16px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.2);width:190px;display:none;">
                            <b style="font-size:14px">Legenda</b>
                            <div style="margin-top:10px;display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:50%;background:#0ea5e9;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div><span style="font-size:13px">Penanaman Mangrove</span></div>
                            <div style="margin-top:8px;display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:50%;background:#16a34a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div><span style="font-size:13px">Lokasi PRPEP</span></div>
                        </div></div>`;
                    setTimeout(() => {
                        const btn = document.getElementById('legend-btn');
                        const panel = document.getElementById('legend-panel');
                        if (btn && panel) btn.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
                    }, 100);
                    return div;
                };
                legend.addTo(map);
            } catch (err) { console.error('Failed to load map data:', err); }

            layersRef.current.allFeatures = allFeatures;
            if (isMounted) {
                setProvinces([...provSet].sort());
                setKabupatens([...kabSet].sort());
                setYears([...yearSet].sort((a, b) => Number(a) - Number(b)));
                setMapReady(true);
            }
        });

        return () => {
            isMounted = false;
            if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; }
        };
    }, []);

    useEffect(() => {
        if (!mapReady || !leafletMapRef.current) return;
        const map = leafletMapRef.current;
        const { allFeatures } = layersRef.current;
        const matchedBounds: any[] = [];

        allFeatures.forEach(({ props, layer }) => {
            const prov = String(props.Provinsi || '').toLowerCase();
            const kab = String(props.Kabupaten || props.Kabupaten_K || '').toLowerCase();
            const yr = String(props.Tahun || props.TAHUN || '').toLowerCase();
            const matchProv = !filterProv || prov === filterProv.toLowerCase();
            const matchKab = !filterKab || kab === filterKab.toLowerCase();
            const matchYr = !filterYear || yr === filterYear.toLowerCase();
            const matchSearch = !searchQuery || Object.values(props).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));

            if (matchProv && matchKab && matchYr && matchSearch) {
                // @ts-ignore
                layer.setStyle?.({ opacity: 1, fillOpacity: 0.7 });
                // @ts-ignore
                layer.setOpacity?.(1);
                // @ts-ignore
                const latlng = layer.getLatLng?.();
                if (latlng) import('leaflet').then(L => matchedBounds.push(L.latLngBounds([latlng, latlng])));
            } else {
                // @ts-ignore
                layer.setStyle?.({ opacity: 0.1, fillOpacity: 0.05 });
                // @ts-ignore
                layer.setOpacity?.(0.1);
            }
        });

        if (matchedBounds.length > 0) {
            import('leaflet').then(L => {
                const combined = matchedBounds.reduce((acc, b) => acc.extend(b));
                if (filterProv || filterKab || filterYear || searchQuery) map.fitBounds(combined, { padding: [40, 40] });
            });
        }
    }, [filterProv, filterKab, filterYear, searchQuery, mapReady]);

    const handleClear = () => {
        setFilterProv(''); setFilterKab(''); setFilterYear(''); setSearchQuery('');
        leafletMapRef.current?.setView([-2.5, 118], 5);
    };

    const filteredTable = CHART_DATA.filter(d =>
        d.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        d.prov.toLowerCase().includes(tableSearch.toLowerCase())
    );

    const statCards = [
        { label: 'Total Luasan', value: `${TOTAL_HA.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ha`, icon: '🌿', color: '#16a34a' },
        { label: 'Kabupaten/Kota', value: `${CHART_DATA.length}`, icon: '📍', color: '#0ea5e9' },
        { label: 'Tahun Program', value: '2020–2024', icon: '📅', color: '#8b5cf6' },
        { label: 'Kementerian', value: 'KKP RI', icon: '🏛️', color: '#f59e0b' },
    ];

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
            <style>{`
                .leaflet-container { font-family: 'Plus Jakarta Sans', sans-serif !important; }
                .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; }
                
                .stat-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px 20px;
                    text-align: center;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .stat-card:hover { transform: translateY(-8px); box-shadow: 0 16px 32px rgba(0,0,0,0.1); }

                .table-row { 
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); 
                    cursor: default; 
                    border-bottom: 1px solid #f1f5f9; 
                }
                .table-row:hover {
                    background: white !important;
                    transform: scale(1.01) translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    z-index: 10;
                    position: relative;
                    border-radius: 8px;
                }

                .section-card {
                    background: white;
                    border-radius: 28px;
                    padding: 32px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.03);
                    border: 1px solid rgba(16, 185, 129, 0.12);
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    overflow: hidden;
                }
                .section-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.1), 0 10px 20px rgba(16, 185, 129, 0.05);
                }

                @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .animate-in { animation: fadeSlideUp 0.5s ease both; }
            `}</style>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

            {/* Header */}
            <section style={{ backgroundColor: '#e8fbf0', padding: '48px 24px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '32px', padding: '60px 40px', textAlign: 'center', maxWidth: '1100px', margin: '0 auto', boxShadow: '0 8px 32px rgba(16,185,129,0.08)' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981', marginBottom: '20px' }}>Peta Aksi Mangrove</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
                        Upaya pelestarian mangrove oleh Kementerian Kelautan dan Perikanan. Eksplorasi data penanaman dan pusat restorasi di seluruh Indonesia.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section style={{ background: 'white', padding: '20px 24px', position: 'sticky', top: 64, zIndex: 50, borderBottom: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                    <input type="text" placeholder="🔍 Cari lokasi..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        style={{ flex: '1 1 240px', padding: '12px 20px', borderRadius: 50, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} />
                    <select value={filterProv} onChange={e => { setFilterProv(e.target.value); setFilterKab(''); }} style={selectStyle}>
                        <option value="">Semua Provinsi</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={filterKab} onChange={e => setFilterKab(e.target.value)} style={selectStyle}>
                        <option value="">Semua Kabupaten</option>
                        {kabupatens.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={selectStyle}>
                        <option value="">Semua Tahun</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button onClick={handleClear} style={{ padding: '12px 28px', borderRadius: 50, background: '#10b981', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Reset</button>
                </div>
            </section>

            {/* Map */}
            <section style={{ padding: '32px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                        <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
                    </div>
                </div>
            </section>

            {/* Stat Cards */}
            <section style={{ padding: '0 24px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                    {statCards.map((s, i) => (
                        <div key={s.label} className="stat-card animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Distribution Summary */}
            <section style={{ padding: '0 24px 48px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* Charts */}
                    <div className="section-card animate-in" style={{ animationDelay: '400ms' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginBottom: '8px', textAlign: 'center' }}>Distribusi Luasan Penanaman</h2>
                        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '40px' }}>Analisis proporsi luasan per kabupaten di seluruh Indonesia</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 60, justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ width: '380px' }}><Pie data={PIE_DATA} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
                            <div style={{ flex: '1 1 300px', maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {CHART_DATA.slice(0, 20).map((d, i) => (
                                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: (PIE_DATA.datasets[0].backgroundColor as any)[i] }} />
                                            <span style={{ fontSize: '0.85rem', color: '#475569' }}>{d.name.replace('Kab. ', '')}</span>
                                        </div>
                                    ))}
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>...dan {CHART_DATA.length - 20} lainnya</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="section-card animate-in" style={{ animationDelay: '500ms' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>Detail Luasan per Kabupaten</h2>
                            <input type="text" placeholder="🔍 Cari tabel..." value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                                style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', width: '260px' }} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: '16px', color: '#64748b', fontWeight: 700 }}>Kabupaten / Kota</th>
                                        <th style={{ padding: '16px', color: '#64748b', fontWeight: 700 }}>Provinsi</th>
                                        <th style={{ padding: '16px', color: '#64748b', fontWeight: 700, textAlign: 'right' }}>Luas (Ha)</th>
                                        <th style={{ padding: '16px', color: '#64748b', fontWeight: 700, textAlign: 'right' }}>Porsi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTable.map((d) => (
                                        <tr key={d.name} className="table-row">
                                            <td style={{ padding: '16px', fontWeight: 700, color: '#1e293b' }}>{d.name}</td>
                                            <td style={{ padding: '16px', color: '#64748b' }}>{d.prov}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{d.value.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                                            <td style={{ padding: '16px', textAlign: 'right', color: '#94a3b8', fontSize: '0.85rem' }}>{((d.value / TOTAL_HA) * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const selectStyle: React.CSSProperties = {
    padding: '12px 20px', borderRadius: 50, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', cursor: 'pointer', outline: 'none'
};