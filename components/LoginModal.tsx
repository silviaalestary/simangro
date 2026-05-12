'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
    onClose: () => void;
    featureName?: string;
}

export default function LoginModal({ onClose, featureName = 'fitur ini' }: Props) {
    const router = useRouter();

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 9000,
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(6px)',
                    animation: 'fadeIn 0.2s ease',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9001,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
                animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 24,
                    padding: '40px 36px',
                    maxWidth: 420,
                    width: '100%',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 32px rgba(16,185,129,0.12)',
                    border: '1.5px solid rgba(16,185,129,0.15)',
                    textAlign: 'center',
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                    }}>
                        <span style={{ fontSize: '2rem' }}>🔒</span>
                    </div>

                    <h2 style={{
                        fontSize: '1.3rem', fontWeight: 800,
                        color: '#0f172a', marginBottom: 10,
                    }}>
                        Akses Terbatas
                    </h2>
                    <p style={{
                        color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6,
                        marginBottom: 28,
                    }}>
                        Silakan <strong>login</strong> terlebih dahulu untuk mengakses{' '}
                        <strong style={{ color: '#10b981' }}>{featureName}</strong>.
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '12px 20px',
                                border: '2px solid #e2e8f0', borderRadius: 12,
                                background: 'transparent', color: '#64748b',
                                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                transition: 'all 0.2s', fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            style={{
                                flex: 1, padding: '12px 20px',
                                border: 'none', borderRadius: 12,
                                background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
                                color: 'white',
                                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.5)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.4)'; }}
                        >
                            🔑 Login Sekarang
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95) } to { opacity: 1; transform: none } }
            `}</style>
        </>
    );
}
