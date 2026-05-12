'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

function LoginPageInner() {
    const { user, login, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/monitoring';

    const [tab, setTab] = useState<'login' | 'daftar'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (user) router.replace(redirect);
    }, [user, router, redirect]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!username || !password || (tab === 'daftar' && !email)) {
            setError('Semua field wajib diisi.'); return;
        }
        setLoading(true);
        const err = tab === 'login'
            ? await login(username, password)
            : await register(username, email, password);
        setLoading(false);
        if (err) { setError(err); return; }
        setSuccess(tab === 'login' ? 'Login berhasil! Mengalihkan...' : 'Akun berhasil dibuat! Mengalihkan...');
        setTimeout(() => router.push(redirect), 800);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
        border: '2px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit',
        outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc',
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg,#ecfdf5 0%,#eff6ff 50%,#f0fdf4 100%)',
            padding: '24px',
        }}>
            <div style={{
                width: '100%', maxWidth: 440,
                background: 'rgba(255,255,255,0.97)',
                borderRadius: 28, padding: '40px 36px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(16,185,129,0.1)',
                border: '1.5px solid rgba(16,185,129,0.15)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>🌿</span>
                    </div>
                    <div style={{
                        fontWeight: 800, fontSize: '1.5rem',
                        background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>SIMANGRO KKP</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>
                        Portal Internal Monitoring Mangrove
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', background: '#f1f5f9', borderRadius: 12,
                    padding: 4, marginBottom: 28,
                }}>
                    {(['login', 'daftar'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                            style={{
                                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.2s',
                                background: tab === t ? 'white' : 'transparent',
                                color: tab === t ? '#10b981' : '#64748b',
                                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            {t === 'login' ? '🔑 Masuk' : '📝 Daftar'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Username */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: 6 }}>
                            Username
                        </label>
                        <input
                            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username" style={inputStyle} required
                            onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                        />
                    </div>

                    {/* Email (only register) */}
                    {tab === 'daftar' && (
                        <div>
                            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: 6 }}>
                                Email
                            </label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email" style={inputStyle} required
                                onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#374151', marginBottom: 6 }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password" required
                                style={{ ...inputStyle, paddingRight: 48 }}
                                onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                            />
                            <button
                                type="button" onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                                }}
                            >{showPass ? '👀' : '😶‍🌫️'}</button>
                        </div>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600,
                        }}>⚠️ {error}</div>
                    )}
                    {success && (
                        <div style={{
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: 10, padding: '10px 14px', color: '#059669', fontSize: '0.85rem', fontWeight: 600,
                        }}>✅ {success}</div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit" disabled={loading}
                        style={{
                            padding: '14px', borderRadius: 12, border: 'none',
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg,#10b981,#0ea5e9)',
                            color: 'white', fontWeight: 800, fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 4px 16px rgba(16,185,129,0.4)',
                            transition: 'all 0.2s', fontFamily: 'inherit',
                        }}
                    >
                        {loading ? '⏳ Memproses...' : tab === 'login' ? '🔑 Masuk' : '📝 Buat Akun'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Link href="/" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginPageInner />
        </Suspense>
    );
}
