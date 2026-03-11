'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/app/auth/actions';
import { X, Mail, ArrowRight, Key } from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';

export default function AuthModal({ isOpen, onClose }) {
    const router = useRouter();
    const [step, setStep] = useState('email'); // 'email', 'otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);
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

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5 && otpRefs.current[index + 1]) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const formData = new FormData();
        formData.append('email', email);

        try {
            const res = await sendOtp(formData);
            if (res.error) throw new Error(res.error);
            setStep('otp');
            setMessage('A 6-digit code has been sent to your email.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const token = otp.join('');
        if (token.length !== 6) {
            setError('Please enter all 6 digits.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('token', token);

        try {
            const res = await verifyOtp(formData);
            if (res.error) throw new Error(res.error);
            await handleSyncGuestHistory();
            onClose();
            router.refresh();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStep('email');
        setOtp(['', '', '', '', '', '']);
        setError(null);
        setMessage(null);
    };

    return (
        <div className="modal-overlay auth-modal-container overlay-entrance" onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
            <div className="auth-modal-card modal-entrance" onClick={(e) => e.stopPropagation()} style={{
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="Optimage Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
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
                <div className="auth-modal-form" style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '300px' }}>
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
                            {step === 'email' ? 'Welcome to Optimage' : 'Enter Secure Code'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {step === 'email'
                                ? 'Sign in or create an account to securely access your workspace.'
                                : `We sent a 6-digit code to ${email}.`}
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

                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{
                                width: '100%', marginTop: '8px', padding: '14px',
                                borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                {loading ? 'Sending Code...' : <><span>Continue with Email</span><ArrowRight size={16} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, marginBottom: '12px', color: 'var(--text-primary)' }}>
                                    <Key size={14} /> Security Code
                                </label>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => otpRefs.current[index] = el}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            style={{
                                                width: '45px', height: '55px', textAlign: 'center',
                                                borderRadius: '12px', border: '1px solid var(--border)',
                                                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                                outline: 'none', fontSize: '1.2rem', fontWeight: 600, transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading || otp.join('').length < 6} style={{
                                width: '100%', padding: '14px',
                                borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                {loading ? 'Verifying...' : <><span>Verify Secure Code</span><ArrowRight size={16} /></>}
                            </button>

                            <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                <p>Entered the wrong email? <button type="button" onClick={resetFlow} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}>Go back</button></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
