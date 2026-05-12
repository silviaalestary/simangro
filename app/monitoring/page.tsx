'use client';
import { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend,
    type ChartOptions,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import LaporanKKE from '@/components/LaporanKKE';
import { useAuth } from '@/components/AuthContext';
import LoginModal from '@/components/LoginModal';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend,
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface MonData {
    id: number;
    kabupaten: string;
    provinsi: string | null;
    luasTarget: number | null;
    luasTanam: number | null;
    tahun: number | null;
}

interface ExtendedAgg {
    totals: { totalBibit: number; totalTK: number; totalHOK: number; totalLuas: number };
    byYear: Record<string, { bibit: number; tk: number; hok: number; luas: number }>;
    byProvinsi: Record<string, { bibit: number; tk: number; hok: number; luas: number }>;
    byPolaTanam: Record<string, { bibit: number; luas: number; count: number }>;
    rows?: any[]; // tambahan baris 
}

interface LapanganRec {
    id: number;
    lokasi: string;
    kabupaten: string | null;
    provinsi: string | null;
    tahun: number | null;
    survivalRate: number | null;
    kerapatan: number | null;
    tinggiTanaman: number | null;
    fotoUrl: string | null;
    status: string | null;
    catatan: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TABS = ['Dashboard', 'Laporan Analisis KKE', 'Monitoring Lapangan'] as const;
type Tab = typeof TABS[number];

const PIE_COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#3b82f6'];

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
    return (
        <div className="hover-lift" style={{
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '24px 20px', textAlign: 'center',
            boxShadow: 'var(--shadow)', border: `2px solid ${color}22`,
            cursor: 'default',
        }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, marginBottom: 4, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{sub}</div>}
        </div>
    );
}

function SectionCard({ title, children, style }: { title?: string; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div className="hover-lift" style={{
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '28px 24px', marginBottom: 24,
            boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
            ...style,
        }}>
            {title && (
                <h3 style={{
                    fontSize: '1.15rem', fontWeight: 800, marginBottom: 20,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{title}</h3>
            )}
            {children}
        </div>
    );
}

function StatusBadge({ status }: { status: string | null }) {
    const cfg: Record<string, { bg: string; color: string; icon: string }> = {
        'Berhasil': { bg: 'rgba(22,163,74,0.12)', color: '#16a34a', icon: '✅' },
        'Perlu Rehabilitasi': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', icon: '⚠️' },
        'Dalam Pemantauan': { bg: 'rgba(245,158,11,0.12)', color: '#d97706', icon: '🔍' },
    };
    const s = status ?? 'Dalam Pemantauan';
    const c = cfg[s] ?? cfg['Dalam Pemantauan'];
    return (
        <span style={{
            background: c.bg, color: c.color, padding: '4px 10px',
            borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap',
        }}>
            {c.icon} {s}
        </span>
    );
}

function SurvivalBar({ value }: { value: number | null }) {
    const v = value ?? 0;
    const color = v >= 80 ? '#16a34a' : v >= 60 ? '#f59e0b' : '#dc2626';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color, minWidth: 36 }}>{v}%</span>
        </div>
    );
}

// ─── Form modal ──────────────────────────────────────────────────────────────


// Konfigurasi Bar Chart TK & HOK (Ditaruh di luar komponen utama)
// ==========================================
const tkHokOptions: ChartOptions<'bar'> = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: { position: 'top' },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.raw as number).toLocaleString('id-ID')}`
            }
        }
    },
    scales: {
        y: {
            type: 'linear', display: true, position: 'left',
            title: { display: true, text: 'Jumlah Pekerja (Orang)' }
        },
        y1: {
            type: 'linear', display: true, position: 'right',
            grid: { drawOnChartArea: false }, // Biar garis tidak berantakan
            title: { display: true, text: 'Hari Orang Kerja (HOK)' }
        },
    },
};

export default function MonitoringPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [modalFeatureName, setModalFeatureName] = useState('');



    // ── Extended aggregate ───────────────────────────────────────────
    const [ext, setExt] = useState<ExtendedAgg | null>(null);
    const [extLoading, setExtLoading] = useState(true);

    // ── Lapangan ─────────────────────────────────────────────────────
    const [lapangan, setLapangan] = useState<LapanganRec[]>([]);
    const [lapLoading, setLapLoading] = useState(true);
    const [lapFilter, setLapFilter] = useState<'Semua' | 'Berhasil' | 'Perlu Rehabilitasi' | 'Dalam Pemantauan'>('Semua');

    // ── Laporan PDF ──────────────────────────────────────────────────
    const [laporanPdfs, setLaporanPdfs] = useState<any[]>([]);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [judulPdf, setJudulPdf] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadPdfs = () => {
        fetch('/api/laporan').then(r => r.json()).then(d => {
            if (Array.isArray(d)) setLaporanPdfs(d);
        });
    };

    useEffect(() => {
        loadPdfs();

        fetch('/api/monitoring/extended')
            .then(r => r.json())
            .then(d => { setExt(d); setExtLoading(false); });
        fetch('/api/monitoring/lapangan')
            .then(r => r.json())
            .then(d => { setLapangan(d); setLapLoading(false); });
    }, []);

    const reloadLapangan = () => {
        setLapLoading(true);
        fetch('/api/monitoring/lapangan')
            .then(r => r.json())
            .then(d => { setLapangan(d); setLapLoading(false); });
    };

    const handleUploadPdf = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!judulPdf || !fileInputRef.current?.files?.[0]) return alert('Judul dan file wajib diisi');
        setUploadingPdf(true);
        const formData = new FormData();
        formData.append('judulLaporan', judulPdf);
        formData.append('file', fileInputRef.current.files[0]);

        try {
            const res = await fetch('/api/laporan', { method: 'POST', body: formData });
            if (res.ok) {
                alert('File berhasil diupload!');
                setJudulPdf('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                loadPdfs();
            } else {
                const data = await res.json();
                alert(data.error || 'Gagal upload file');
            }
        } catch (err) {
            alert('Terjadi kesalahan server');
        }
        setUploadingPdf(false);
    };

    const handleDeletePdf = async (id: number) => {
        if (!confirm('Yakin ingin menghapus dokumen ini?')) return;
        const res = await fetch(`/api/laporan/${id}`, { method: 'DELETE' });
        if (res.ok) loadPdfs();
        else alert('Gagal menghapus file');
    };

    const handleDeleteLapangan = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data monitoring ini? Tindakan ini tidak dapat dibatalkan.')) return;
        try {
            const res = await fetch(`/api/monitoring/lapangan/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Data berhasil dihapus');
                reloadLapangan();
            } else {
                alert('Gagal menghapus data');
            }
        } catch (err) {
            alert('Terjadi kesalahan server');
        }
    };

    // ── Charts: trend tahunan ────────────────────────────────────────
    // ── Charts: trend tahunan (Sesuai Data Excel Jmlh Luasan) ─────────────
    const years = ext ? Object.keys(ext.byYear).sort() : [];
    const trendBarData = {
        labels: years,
        datasets: [
            {
                label: 'Luasan Penanaman (Ha)',
                data: years.map(y => ext?.byYear[y]?.luas ?? 0),
                backgroundColor: 'rgba(22,163,74,0.7)',
                borderColor: '#16a34a',
                borderWidth: 2,
                borderRadius: 6
            },
        ],
    };
    const trendBarOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${(ctx.raw as number).toLocaleString()} Ha` } }
        },
        scales: {
            y: { beginAtZero: true, ticks: { callback: v => `${v} Ha` }, grid: { color: 'rgba(22,163,74,0.08)' } },
            x: { grid: { display: false } },
        },
    };

    // ── Charts: per provinsi ─────────────────────────────────────────
    const provEntries = ext
        ? Object.entries(ext.byProvinsi).sort(([, a], [, b]) => b.luas - a.luas).slice(0, 12)
        : [];
    const hBarData = {
        labels: provEntries.map(([p]) => p),
        datasets: [{ label: 'Luas Tanam (Ha)', data: provEntries.map(([, v]) => v.luas), backgroundColor: provEntries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length] + 'bb'), borderColor: provEntries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]), borderWidth: 2, borderRadius: 6 }],
    };
    const hBarOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { callback: v => `${v} Ha` } }, y: { grid: { display: false } } },
    };

    // ── Charts: pola tanam ───────────────────────────────────────────
    const polaTanamEntries = ext ? Object.entries(ext.byPolaTanam) : [];
    const donutData = {
        labels: polaTanamEntries.map(([pt]) => pt),
        datasets: [{
            data: polaTanamEntries.map(([, v]) => v.bibit),
            backgroundColor: PIE_COLORS.slice(0, polaTanamEntries.length).map(c => c + 'cc'),
            borderColor: PIE_COLORS.slice(0, polaTanamEntries.length),
            borderWidth: 2, hoverOffset: 10,
        }],
    };
    const donutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            tooltip: { callbacks: { label: (ctx: { label: string; raw: unknown }) => ` ${ctx.label}: ${(ctx.raw as number).toLocaleString()} bibit` } },
        },
        cutout: '55%',
    };

    // ── Hitung Otomatis Data Tenaga Kerja & HOK Semua Kabupaten ─────────────
    let laborRawData: { name: string; pekerja: number; hok: number }[] = [];

    if (ext && ext.rows) {
        const aggregated: Record<string, { name: string; pekerja: number; hok: number }> = {};

        ext.rows.forEach(r => {
            const kab = r.kabupaten || 'Lainnya';
            if (!aggregated[kab]) aggregated[kab] = { name: kab, pekerja: 0, hok: 0 };

            aggregated[kab].pekerja += r.tenagaKerja ?? 0;
            aggregated[kab].hok += r.hok ?? 0;
        });

        laborRawData = Object.values(aggregated).sort((a, b) => b.hok - a.hok);
    }

    const dynamicTkHokData = {
        labels: laborRawData.map(d => d.name),
        datasets: [
            {
                label: 'Tenaga Kerja (Orang)',
                data: laborRawData.map(d => d.pekerja),
                backgroundColor: '#0ea5e9',
                borderRadius: 4,
                yAxisID: 'y',
            },
            {
                label: 'Total HOK',
                data: laborRawData.map(d => d.hok),
                backgroundColor: '#16a34a',
                borderRadius: 4,
                yAxisID: 'y1',
            }
        ]
    };

    // ── Filtered lapangan ────────────────────────────────────────────
    const filteredLap = lapangan.filter(r => lapFilter === 'Semua' || r.status === lapFilter);

    // ── Stats lapangan ───────────────────────────────────────────────
    const avgSR = lapangan.length ? Math.round(lapangan.reduce((s, r) => s + (r.survivalRate ?? 0), 0) / lapangan.length) : 0;
    const berhasil = lapangan.filter(r => r.status === 'Berhasil').length;
    const rehab = lapangan.filter(r => r.status === 'Perlu Rehabilitasi').length;

    // ── Section header style ─────────────────────────────────────────
    const secH1: React.CSSProperties = {
        fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 12,
        background: 'var(--gradient-text)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    };

    return (
        <div style={{ minHeight: '80vh', background: 'var(--gradient-bg)', backgroundAttachment: 'fixed' }}>
            <style>{`
                .hover-lift {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
                }
                .hover-lift:hover {
                    z-index: 10;
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(22, 163, 74, 0.15) !important;
                }
                .table-row-hover {
                    transition: all 0.2s ease;
                }
                .table-row-hover:hover {
                    background: rgba(22,163,74,0.08) !important;
                    transform: scale(1.02) translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border-radius: 6px;
                    z-index: 5;
                    position: relative;
                }
                .monitoring-card-lift {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
                }
                .monitoring-card-lift:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(14, 165, 233, 0.15) !important;
                }
                .modern-filter-btn {
                    padding: 8px 18px;
                    border-radius: 50px;
                    border: none;
                    background: rgba(16, 185, 129, 0.08);
                    color: #059669;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .modern-filter-btn:hover {
                    background: rgba(16, 185, 129, 0.15);
                    transform: translateY(-2px);
                }
                .modern-filter-btn.active {
                    background: #10b981;
                    color: white;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                .modern-filter-btn.active:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
                }
            `}</style>

            {/* ── Page Hero ────────────────────────────────────────────── */}
            <section style={{
                // Background luar kartu (hijau sangat muda menyesuaikan tema Simangro)
                backgroundColor: '#e8fbf0',
                padding: '40px 24px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    // Tampilan Kartu Putih
                    backgroundColor: '#ffffff',
                    borderRadius: '24px', // Membuat sudutnya melengkung
                    padding: '56px 32px',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '1000px', // Lebar maksimal kartu
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' // Bayangan super halus agar kartu lebih pop-up
                }}>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                        fontWeight: 800,
                        color: '#10b981', // Warna hijau kebiruan (emerald) seperti teks "Jenis Mangrove"
                        marginBottom: '16px'
                    }}>
                        Monitoring &amp; Evaluasi
                    </h1>
                    <p style={{
                        color: '#6b7280', // Warna abu-abu untuk deskripsi agar mirip dengan gambar
                        fontSize: '1rem',
                        maxWidth: '640px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Data capaian rehabilitasi mangrove program KKP: luasan tanam, bibit, tenaga kerja, serta kondisi lapangan per lokasi.
                    </p>
                </div>
            </section>
            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div style={{
                position: 'sticky', top: 64, zIndex: 40,
                padding: '16px 24px', pointerEvents: 'none',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16
            }}>
                <div style={{
                    display: 'inline-flex', gap: 24, padding: '4px 28px', pointerEvents: 'auto',
                    background: '#ffffff', borderRadius: 50,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    {TABS.map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => {
                                    if (tab !== 'Dashboard' && !user) {
                                        setModalFeatureName(tab);
                                        setShowLoginModal(true);
                                    } else {
                                        setActiveTab(tab);
                                    }
                                }}
                                style={{
                                    padding: '10px 4px', border: 'none', cursor: 'pointer',
                                    background: 'transparent',
                                    fontFamily: 'inherit', fontWeight: isActive ? 800 : 700, fontSize: '0.95rem',
                                    color: isActive ? '#10b981' : '#6b7280',
                                    borderBottom: isActive ? '3px solid #10b981' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                {tab === 'Dashboard' ? '📊 Dashboard' : tab === 'Monitoring Lapangan' ? '🌿 Monitoring Lapangan' : '📄 Laporan Analisis'} {!user && tab !== 'Dashboard' && '🔒'}
                            </button>
                        );
                    })}
                </div>
                {user && (
                    <button onClick={() => {
                        fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.reload());
                    }} style={{
                        pointerEvents: 'auto', padding: '10px 20px', borderRadius: 50, border: 'none',
                        background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239,68,68,0.3)', fontFamily: 'inherit'
                    }}>
                        🚪 Logout
                    </button>
                )}
            </div>

            <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

                {/* ══════════════ TAB: DASHBOARD ══════════════*/}
                {activeTab === 'Dashboard' && (
                    <>
                        {/* Stat cards: extended only */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                            {!extLoading && ext && <>
                                <StatCard label="Total Bibit" value={(ext.totals.totalBibit / 1000).toFixed(0) + 'K'} sub={ext.totals.totalBibit.toLocaleString() + ' batang'} color="#8b5cf6" />
                                <StatCard label="Tenaga Kerja" value={ext.totals.totalTK.toLocaleString()} sub="Total personil" color="#f59e0b" />
                                <StatCard label="Total HOK" value={ext.totals.totalHOK.toLocaleString()} sub="Hari Orang Kerja" color="#ec4899" />
                                <StatCard label="Kab / Kota" value={`${new Set(ext?.rows?.map((r: any) => r.kabupaten) || []).size}`} sub="Lokasi rehabilitasi" color="#14b8a6" />
                            </>}
                        </div>

                        {/* Tren Tahunan - Full Width */}
                        <SectionCard title="📈 Tren Tahunan – Luasan Penanaman">
                            {extLoading ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>⏳ Memuat...</div>
                                : <div style={{ height: 300 }}><Bar data={trendBarData} options={{ ...trendBarOptions, maintainAspectRatio: false }} /></div>}
                        </SectionCard>

                        {/* Provinsi dan Pola Tanam - Berdampingan Kiri Kanan */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
                            {/* Per Provinsi */}
                            <div style={{ flex: '3 1 500px' }}>
                                <SectionCard title="🗺️ Luas Tanam per Provinsi (Top 12)" style={{ height: '100%', marginBottom: 0 }}>
                                    {extLoading ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>⏳ Memuat...</div>
                                        : <div style={{ height: 350 }}><Bar data={hBarData} options={{ ...hBarOptions, maintainAspectRatio: false }} /></div>}
                                </SectionCard>
                            </div>

                            {/* Pola Tanam */}
                            {!extLoading && ext && (
                                <div style={{ flex: '2 1 340px' }}>
                                    <SectionCard title="🌱 Distribusi Pola Tanam" style={{ height: '100%', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ maxWidth: 260, margin: '0 auto' }}>
                                            <Doughnut data={donutData} options={donutOptions} />
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginTop: 14 }}>
                                            <thead>
                                                <tr style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                                                    <th style={{ padding: '6px 10px', textAlign: 'left', borderRadius: '6px 0 0 6px' }}>Pola Tanam</th>
                                                    <th style={{ padding: '6px 10px', textAlign: 'right' }}>Bibit</th>
                                                    <th style={{ padding: '6px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Luas (Ha)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {polaTanamEntries.map(([pt, v], i) => (
                                                    <tr key={pt} className="table-row-hover" style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(22,163,74,0.03)' }}>
                                                        <td style={{ padding: '6px 10px', color: 'var(--dark)', fontWeight: 600 }}>
                                                            <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], marginRight: 6 }} />
                                                            {pt}
                                                        </td>
                                                        <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--muted)' }}>{v.bibit.toLocaleString()}</td>
                                                        <td style={{ padding: '6px 10px', textAlign: 'right', color: 'var(--muted)' }}>{v.luas.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </SectionCard>
                                </div>
                            )}
                        </div>

                        {/* Penyerapan Tenaga Kerja & HOK - Full Width Memanjang */}
                        {!extLoading && ext && (
                            <SectionCard title="👷‍♂️ Penyerapan Tenaga Kerja & HOK (Semua Wilayah)">
                                {extLoading ? (
                                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>⏳ Memuat data...</div>
                                ) : (
                                    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
                                        <div style={{ minWidth: `${Math.max(800, laborRawData.length * 35)}px`, height: '400px' }}>
                                            <Bar
                                                data={dynamicTkHokData}
                                                options={{
                                                    ...tkHokOptions,
                                                    maintainAspectRatio: false
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </SectionCard>
                        )}


                    </>
                )}

                {/* ══════════════ TAB: MONITORING LAPANGAN ══════════════*/}
                {activeTab === 'Monitoring Lapangan' && user && (
                    <>
                        {/* Stats summary */}
                        <div style={{ marginBottom: 36 }}>
                            <h2 style={{ ...secH1, fontSize: '1.6rem', marginBottom: 20 }}>📈 Dashboard Statistik Laporan</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                                <StatCard label="Rata-rata Survival Rate" value={`${avgSR}%`} color={avgSR >= 75 ? '#16a34a' : '#f59e0b'} />
                                <StatCard label="Lokasi Berhasil" value={`${berhasil}`} sub="Status berhasil" color="#16a34a" />
                                <StatCard label="Perlu Rehabilitasi" value={`${rehab}`} sub="Butuh tindakan" color="#dc2626" />
                                <StatCard label="Total Lokasi" value={`${lapangan.length}`} sub="Titik monitoring" color="#0ea5e9" />
                            </div>
                        </div>

                        {/* Detail Lokasi */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 24 }}>
                                <h2 style={{ ...secH1, fontSize: '1.6rem', marginBottom: 16, textAlign: 'center' }}>📍 Detail Data Lokasi</h2>
                                
                                {/* Toolbar */}
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {(['Semua', 'Berhasil', 'Perlu Rehabilitasi', 'Dalam Pemantauan'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setLapFilter(f)}
                                            className={`modern-filter-btn ${lapFilter === f ? 'active' : ''}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Lapangan cards */}
                            {lapLoading ? (
                                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>⏳ Memuat data lapangan...</div>
                            ) : filteredLap.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Tidak ada data untuk filter ini.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                                    {filteredLap.map(rec => {
                                        const linkedPdf = laporanPdfs.find(pdf => pdf.judulLaporan === `Laporan KKE - ${rec.lokasi}`);
                                        return (
                                        <div key={rec.id} className="monitoring-card-lift" style={{
                                            background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 24,
                                            boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                                            display: 'flex', flexDirection: 'column'
                                        }}>
                                            {/* Header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--dark)', marginBottom: 2 }}>{rec.lokasi}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{rec.kabupaten}{rec.provinsi ? `, ${rec.provinsi}` : ''} {rec.tahun ? `– ${rec.tahun}` : ''}</div>
                                                </div>
                                                <StatusBadge status={rec.status} />
                                            </div>

                                            {/* Survival Rate */}
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase' }}>Survival Rate</div>
                                                <SurvivalBar value={rec.survivalRate} />
                                            </div>

                                            {/* Metrics */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                                                {[
                                                    { label: 'Kerapatan', value: rec.kerapatan ? `${rec.kerapatan.toLocaleString()} pohon/Ha` : '–' },
                                                    { label: 'Tinggi Tanaman', value: rec.tinggiTanaman ? `${rec.tinggiTanaman} cm` : '–' },
                                                ].map(m => (
                                                    <div key={m.label} style={{ background: 'rgba(22,163,74,0.05)', borderRadius: 10, padding: '10px 14px' }}>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
                                                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--dark)' }}>{m.value}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Foto placeholder */}
                                            {rec.fotoUrl ? (
                                                <a href={rec.fotoUrl} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={rec.fotoUrl} 
                                                        alt="Dokumentasi lokasi" 
                                                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} 
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div style={{ display: 'none', background: 'rgba(14,165,233,0.1)', height: 80, borderRadius: 10, alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', fontSize: '0.85rem', marginBottom: 10, fontWeight: 600, border: '1px solid rgba(14,165,233,0.2)' }}>
                                                        🔗 Buka Tautan Dokumentasi
                                                    </div>
                                                </a>
                                            ) : (
                                                <div style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.08),rgba(14,165,233,0.06))', height: 80, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 10 }}>
                                                    📷 Belum ada dokumentasi foto
                                                </div>
                                            )}

                                            {/* Catatan */}
                                            {rec.catatan && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5, paddingTop: 8, borderTop: '1px solid rgba(22,163,74,0.1)', flexGrow: 1 }}>
                                                    💬 {rec.catatan}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div style={{ marginTop: 'auto', paddingTop: 14, display: 'flex', gap: '8px' }}>
                                                {linkedPdf && (
                                                    <a href={linkedPdf.pathFile} target="_blank" rel="noreferrer" style={{
                                                        flex: 1, textAlign: 'center', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)',
                                                        color: '#10b981', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
                                                        border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = '#10b981';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                                                        e.currentTarget.style.color = '#10b981';
                                                    }}>
                                                        📄 Laporan KKE
                                                    </a>
                                                )}
                                                <button onClick={() => handleDeleteLapangan(rec.id)} style={{
                                                    flex: 1, padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer',
                                                    fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = '#ef4444';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                    e.currentTarget.style.color = '#ef4444';
                                                }}>
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>



            {/* ══════════════ TAB: LAPORAN ANALISIS KKE ══════════════*/}
            {activeTab === 'Laporan Analisis KKE' && user && (
                <LaporanKKE onSaveSuccess={() => {
                    reloadLapangan();
                    setActiveTab('Monitoring Lapangan');
                }} />
            )}

            {showLoginModal && (
                <LoginModal featureName={modalFeatureName} onClose={() => setShowLoginModal(false)} />
            )}
        </div>
    );
}

