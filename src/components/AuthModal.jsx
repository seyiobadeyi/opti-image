'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup, resetPassword } from '@/app/auth/actions';
import { X, Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';

export default function AuthModal({ isOpen, onClose }) {
    const router = useRouter();
    const [view, setView] = useState('login'); // login, signup, forgot
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    if (!isOpen) return null;

    const handleSyncGuestHistory = async () => {
        try {
            const guestHistory = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            if (guestHistory.length > 0) {
                await apiClient.syncGuestHistory(guestHistory);
                localStorage.removeItem('guest_processing_history');
            }
        } catch (e) {
            console.error('Failed to sync guest history', e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const formData = new FormData();
        formData.append('email', email);
        if (view !== 'forgot') formData.append('password', password);

        try {
            if (view === 'signup') {
                const res = await signup(formData);
                if (res.error) throw new Error(res.error);
                setMessage(res.message);
                await handleSyncGuestHistory();
            } else if (view === 'login') {
                const res = await login(formData);
                if (res.error) throw new Error(res.error);
                await handleSyncGuestHistory();
                onClose();
                router.refresh(); // Soft refresh to update Server Components without losing client state
            } else if (view === 'forgot') {
                const res = await resetPassword(formData);
                if (res.error) throw new Error(res.error);
                setMessage(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchView = (newView) => {
        setView(newView);
        setError(null);
        setMessage(null);
        setPassword('');
    };

    const titles = {
        login: { h: 'Welcome Back', p: 'Sign in to access your workspace and download history.' },
        signup: { h: 'Create Account', p: 'Join thousands of creators optimizing their media.' },
        forgot: { h: 'Reset Password', p: 'We\'ll send a password reset link to your email.' },
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
            <div onClick={(e) => e.stopPropagation()} style={{
                display: 'flex', maxWidth: '900px', width: '100%', maxHeight: '90vh',
                borderRadius: '24px', overflow: 'hidden',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(108,92,231,0.1)',
            }}>
                {/* Left: Visual Side (hidden on mobile) */}
                <div className="auth-modal-visual" style={{
                    flex: '0 0 380px', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0a0a1a, #1a1040)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                    <Image unoptimized src="/image-5.png" alt="Creative workspace" fill style={{ objectFit: 'cover', opacity: 0.35 }} />
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.4) 50%, transparent 100%)' }} />

                    <div style={{ position: 'relative', zIndex: 2, padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--gradient-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <Zap fill="currentColor" size={22} />
                            </div>
                            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>Optimage</span>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '12px' }}>
                            Optimize without limits
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                            Free image compression, format conversion, and video optimization — all in one workspace.
                        </p>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '300px' }}>
                    {/* Close Button */}
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'var(--bg-tertiary)', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        padding: '8px', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 10,
                    }}>
                        <X size={18} />
                    </button>

                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                            {titles[view].h}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {titles[view].p}
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px',
                            color: '#ef4444', fontSize: '0.9rem', marginBottom: '20px',
                        }}>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div style={{
                            padding: '12px 16px', background: 'rgba(46,213,115,0.1)',
                            border: '1px solid rgba(46,213,115,0.2)', borderRadius: '12px',
                            color: '#2ed573', fontSize: '0.9rem', marginBottom: '20px',
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" style={{
                                    width: '100%', padding: '13px 14px 13px 42px',
                                    borderRadius: '12px', border: '1px solid var(--border)',
                                    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                    outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s',
                                }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        {view !== 'forgot' && (
                            <div>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>
                                    Password
                                    {view === 'login' && (
                                        <button type="button" onClick={() => switchView('forgot')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>
                                            Forgot?
                                        </button>
                                    )}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', padding: '13px 48px 13px 42px',
                                            borderRadius: '12px', border: '1px solid var(--border)',
                                            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                            outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
                                    }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{
                            width: '100%', marginTop: '8px', padding: '14px',
                            borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}>
                            {loading ? 'Processing...'
                                : view === 'login' ? <><span>Log In</span><ArrowRight size={16} /></>
                                    : view === 'signup' ? <><span>Create Account</span><ArrowRight size={16} /></>
                                        : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {view === 'login' ? (
                            <p>Don't have an account? <button onClick={() => switchView('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}>Sign up free</button></p>
                        ) : view === 'signup' ? (
                            <p>Already have an account? <button onClick={() => switchView('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}>Log in</button></p>
                        ) : (
                            <p>Remember your password? <button onClick={() => switchView('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}>Back to login</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
