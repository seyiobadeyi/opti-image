'use client';
import { useState } from 'react';
import { CheckCircle2, MailX } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function UnsubscribeClient({ email: initialEmail }: { email: string }) {
    const [email, setEmail] = useState(initialEmail);
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    const handleUnsubscribe = async () => {
        if (!email.trim()) return;
        setStatus('loading');
        try {
            const res = await fetch(`${API_BASE}/api/newsletter/unsubscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!res.ok) throw new Error('Failed');
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '24px',
            background: 'var(--bg-primary)',
        }}>
            <div style={{
                maxWidth: '440px', width: '100%',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '40px 36px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                textAlign: 'center',
            }}>
                {status === 'done' ? (
                    <>
                        <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
                            You&apos;re unsubscribed
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                            No more emails to <strong>{email}</strong>. No hard feelings.
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Changed your mind?{' '}
                            <button
                                onClick={() => setStatus('idle')}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, textDecoration: 'underline' }}
                            >
                                Re-subscribe
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <MailX size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
                            Unsubscribe
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px', fontSize: '0.95rem' }}>
                            We&apos;ll remove this address from all Optimage marketing emails immediately.
                        </p>

                        {!initialEmail && (
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '11px 14px',
                                    borderRadius: '10px', border: '1px solid var(--border)',
                                    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                    fontSize: '0.9rem', marginBottom: '16px',
                                    boxSizing: 'border-box', outline: 'none',
                                }}
                            />
                        )}

                        {initialEmail && (
                            <div style={{
                                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                                borderRadius: '10px', padding: '12px 16px',
                                marginBottom: '20px', fontSize: '0.9rem',
                                color: 'var(--text-primary)', fontWeight: 500,
                            }}>
                                {email}
                            </div>
                        )}

                        {status === 'error' && (
                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>
                                Something went wrong. Please try again or email us directly.
                            </p>
                        )}

                        <button
                            onClick={() => void handleUnsubscribe()}
                            disabled={status === 'loading' || !email.trim()}
                            style={{
                                width: '100%', padding: '12px',
                                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                                borderRadius: '10px', color: 'var(--text-primary)',
                                fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                        >
                            {status === 'loading' ? 'Unsubscribing\u2026' : 'Confirm unsubscribe'}
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Transactional emails (password resets, purchase receipts) are not affected.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
