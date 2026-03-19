'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, ArrowRight, Key } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type { AuthModalProps, AuthStep, GuestHistoryItem } from '@/types';

export default function AuthModal({ isOpen, onClose }: AuthModalProps): React.JSX.Element | null {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [resendCooldownMs, setResendCooldownMs] = useState<number>(0);

    // Notify the newsletter popup so it doesn't conflict with this modal
    useEffect(() => {
        window.dispatchEvent(new CustomEvent(isOpen ? 'optimage:overlay:open' : 'optimage:overlay:close'));
    }, [isOpen]);

    const handleGoogleSignIn = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const redirectTo = `${window.location.origin}/auth/callback`;
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
        if (oauthError) {
            setError(oauthError.message);
            setLoading(false);
        }
        // If no error, browser will redirect — loading stays true
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
        if (pasted.length === 0) return;
        const digits = pasted.split('');
        const newOtp = [...otp];
        digits.forEach((d, i) => { newOtp[i] = d; });
        setOtp(newOtp);
        const focusIdx = Math.min(digits.length, 7);
        otpRefs.current[focusIdx]?.focus();
    };

    const handleSyncGuestHistory = async (): Promise<void> => {
        try {
            const guestHistory: GuestHistoryItem[] = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            if (guestHistory.length > 0) {
                await apiClient.syncGuestHistory(guestHistory);
                localStorage.removeItem('guest_processing_history');
            }
        } catch (err: unknown) {
            console.error('Failed to sync guest history', err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    // Listen for cross-device authentication is now handled in Header.jsx


    const handleOtpChange = (index: number, value: string): void => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 7) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: true },
            });
            if (otpError) throw new Error(otpError.message);
            setStep('otp');
            setMessage('An 8-digit code has been sent to your email.');
            setResendCooldownMs(60_000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const parseRetryAfterSeconds = (msg: string): number | null => {
        // Supabase commonly returns: "For security purposes, you can only request this after 23 seconds."
        const match = msg.match(/after\s+(\d+)\s+seconds?/i);
        if (!match) return null;
        const secs = Number(match[1]);
        return Number.isFinite(secs) && secs > 0 ? secs : null;
    };

    const handleResendCode = async (): Promise<void> => {
        if (!email) return;
        if (resendCooldownMs > 0) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: true },
            });
            if (otpError) throw new Error(otpError.message);
            setOtp(['', '', '', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
            setMessage('New code sent. Enter it on this device to sign in here.');
            setResendCooldownMs(60_000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to resend code';
            const retryAfter = parseRetryAfterSeconds(msg);
            if (retryAfter) {
                setResendCooldownMs(retryAfter * 1000);
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (step !== 'otp') return;
        if (resendCooldownMs <= 0) return;
        const t = window.setInterval(() => {
            setResendCooldownMs((ms) => Math.max(0, ms - 1000));
        }, 1000);
        return () => window.clearInterval(t);
    }, [step, resendCooldownMs]);

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const token = otp.join('');
        if (token.length !== 8) {
            setError('Please enter all 8 digits.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });
            if (verifyError) throw new Error(verifyError.message);
            await handleSyncGuestHistory();
            onClose();
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = (): void => {
        setStep('email');
        setOtp(['', '', '', '', '', '', '', '']);
        setError(null);
        setMessage(null);
        setResendCooldownMs(0);
    };


    return (
        <motion.div
            className="modal-overlay auth-modal-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            }}
        >
            <motion.div
                className="auth-modal-card"
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                style={{
                    display: 'flex', maxWidth: '900px', width: '100%', maxHeight: '90vh',
                    borderRadius: '24px', overflow: 'hidden',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(108,92,231,0.1)',
                }}
            >
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
                        <div className="logo" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="/logo.png" alt="Optimage Logo" style={{ height: '2.4rem', width: 'auto', objectFit: 'contain' }} />
                            <div className="logo-text" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>Optimage</span>
                                <span style={{ fontSize: '0.6em', color: 'rgba(255,255,255,0.7)', fontWeight: 'normal' }}>by Dream Intrepid Ltd</span>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Professional Media Suite</h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Sign in to access high-performance image compression, format conversion, and video optimization tools.
                            </p>
                        </div>
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
                            {step === 'email' ? 'Sign in to Optimage' : 'Enter Secure Code'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {step === 'email'
                                ? 'Enter your email to sign in or create a new account.'
                                : `We sent an 8-digit code to ${email}. This code signs you in on the device where you enter it.`}
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
                        <>
                            {/* Google OAuth */}
                            <button
                                type="button"
                                className="google-btn"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    color: 'var(--text-primary)',
                                    marginBottom: '20px',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                                color: 'var(--text-muted)',
                                fontSize: '13px',
                            }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                or continue with email
                                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            </div>

                            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--text-primary)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required placeholder="you@company.com" style={{
                                        width: '100%', padding: '13px 14px 13px 42px',
                                        borderRadius: '12px', border: '1px solid var(--border)',
                                        background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                        outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s',
                                    }}
                                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--accent-primary)'}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--border)'}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{
                                width: '100%', marginTop: '8px', padding: '14px',
                                borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                {loading ? 'Sending Code...' : <><span>Continue to Sign In</span><ArrowRight size={16} /></>}
                            </button>
                            </form>
                        </>
                    ) : (
                        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, marginBottom: '12px', color: 'var(--text-primary)' }}>
                                    <Key size={14} /> Security Code
                                </label>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el: HTMLInputElement | null) => { if (el) otpRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOtpKeyDown(index, e)}
                                            {...(index === 0 ? { onPaste: handleOtpPaste } : {})}
                                            style={{
                                                width: '38px', height: '50px', textAlign: 'center',
                                                borderRadius: '10px', border: '1px solid var(--border)',
                                                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                                outline: 'none', fontSize: '1.1rem', fontWeight: 600, transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--accent-primary)'}
                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--border)'}
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading || otp.join('').length < 8} style={{
                                width: '100%', padding: '14px',
                                borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                {loading ? 'Verifying...' : <><span>Verify Secure Code</span><ArrowRight size={16} /></>}
                            </button>

                            <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                <p style={{ marginBottom: '10px' }}>
                                    Didn’t get a code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={loading || resendCooldownMs > 0}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: resendCooldownMs > 0 ? 'var(--text-muted)' : 'var(--accent-primary)',
                                            cursor: resendCooldownMs > 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: 700,
                                            fontSize: 'inherit',
                                            padding: 0,
                                        }}
                                    >
                                        {resendCooldownMs > 0 ? `Resend in ${Math.ceil(resendCooldownMs / 1000)}s` : 'Resend code'}
                                    </button>
                                </p>
                                <p>
                                    Entered the wrong email?{' '}
                                    <button type="button" onClick={resetFlow} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}>
                                        Go back
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
