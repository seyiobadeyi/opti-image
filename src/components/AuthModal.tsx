'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, ArrowRight, Key } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type { AuthModalProps, AuthStep, GuestHistoryItem } from '@/types';

// Light-theme token shortcuts
const T = {
    bg:        '#ffffff',
    bgSub:     '#f9fafb',
    border:    '#e5e7eb',
    text:      '#111827',
    textSub:   '#6b7280',
    textMuted: '#9ca3af',
    accent:    '#2563eb',
    accentHov: '#1d4ed8',
};

export default function AuthModal({ isOpen, onClose, initialStep, redirectAfterAuth }: AuthModalProps): React.JSX.Element | null {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    // All hooks must be declared before any conditional return
    const [step, setStep] = useState<AuthStep>(initialStep ?? 'email');
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [resendCooldownMs, setResendCooldownMs] = useState<number>(0);
    const [displayName, setDisplayName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [phoneCode, setPhoneCode] = useState<string>('+1');
    const [dobDay, setDobDay] = useState<string>('');
    const [dobMonth, setDobMonth] = useState<string>('');
    const [dobYear, setDobYear] = useState<string>('');

    useEffect(() => {
        window.dispatchEvent(new CustomEvent(isOpen ? 'optimage:overlay:open' : 'optimage:overlay:close'));
    }, [isOpen]);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) setStep(initialStep ?? 'email');
    }, [isOpen, initialStep]);

    useEffect(() => {
        if (step !== 'otp') return;
        if (resendCooldownMs <= 0) return;
        const t = window.setInterval(() => {
            setResendCooldownMs((ms) => Math.max(0, ms - 1000));
        }, 1000);
        return () => window.clearInterval(t);
    }, [step, resendCooldownMs]);

    if (!isOpen) return null;

    const handleGoogleSignIn = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        const dest = redirectAfterAuth
            ?? (window.location.pathname !== '/' ? window.location.pathname : '/dashboard');
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(dest)}`;
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
        if (oauthError) {
            setError(oauthError.message);
            setLoading(false);
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
        if (pasted.length === 0) return;
        const digits = pasted.split('');
        const newOtp = [...otp];
        digits.forEach((d, i) => { newOtp[i] = d; });
        setOtp(newOtp);
        otpRefs.current[Math.min(digits.length, 7)]?.focus();
    };

    const handleSyncGuestHistory = async (): Promise<void> => {
        try {
            const guestHistory: GuestHistoryItem[] = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            if (guestHistory.length > 0) {
                await apiClient.syncGuestHistory(guestHistory);
                localStorage.removeItem('guest_processing_history');
            }
        } catch (err: unknown) {
            console.error('Failed to sync guest history', err instanceof Error ? err.message : 'unknown');
        }
    };

    const handleOtpChange = (index: number, value: string): void => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 7) otpRefs.current[index + 1]?.focus();
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
        const match = msg.match(/after\s+(\d+)\s+seconds?/i);
        if (!match) return null;
        const secs = Number(match[1]);
        return Number.isFinite(secs) && secs > 0 ? secs : null;
    };

    const handleResendCode = async (): Promise<void> => {
        if (!email || resendCooldownMs > 0) return;
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
            setMessage('New code sent.');
            setResendCooldownMs(60_000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to resend code';
            const retryAfter = parseRetryAfterSeconds(msg);
            if (retryAfter) setResendCooldownMs(retryAfter * 1000);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const token = otp.join('');
        if (token.length !== 8) { setError('Please enter all 8 digits.'); return; }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
            if (verifyError) throw new Error(verifyError.message);
            await handleSyncGuestHistory();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', session.user.id)
                    .single();
                if (!profile?.display_name) {
                    setStep('onboarding');
                    setLoading(false);
                    return;
                }
            }
            onClose();
            if (redirectAfterAuth) {
                router.push(redirectAfterAuth);
            } else if (typeof window !== 'undefined' && window.location.pathname === '/') {
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOnboardingSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!displayName.trim()) return;
        setLoading(true);
        const dobString = dobYear && dobMonth && dobDay
            ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
            : undefined;
        const fullPhone = phone.trim() ? `${phoneCode}${phone.trim().replace(/^0+/, '')}` : undefined;
        try {
            await apiClient.updateProfile({ display_name: displayName.trim(), phone_number: fullPhone, date_of_birth: dobString });
        } catch { /* non-blocking */ } finally { setLoading(false); }
        onClose();
        if (redirectAfterAuth) {
            router.push(redirectAfterAuth);
        } else if (typeof window !== 'undefined' && window.location.pathname === '/') {
            router.push('/dashboard');
        }
    };

    const resetFlow = (): void => {
        setStep('email');
        setOtp(['', '', '', '', '', '', '', '']);
        setError(null);
        setMessage(null);
        setResendCooldownMs(0);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '13px 14px',
        borderRadius: '10px', border: `1px solid ${T.border}`,
        background: T.bgSub, color: T.text,
        outline: 'none', fontSize: '0.95rem',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    };

    const btnPrimary: React.CSSProperties = {
        flex: 2, padding: '14px', borderRadius: '10px',
        fontSize: '1rem', fontWeight: 600,
        background: T.accent, color: '#fff', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '8px', transition: 'background 0.2s',
    };

    const btnSecondary: React.CSSProperties = {
        flex: 1, padding: '14px', borderRadius: '10px',
        fontSize: '1rem', fontWeight: 600,
        background: T.bg, color: T.text,
        border: `1px solid ${T.border}`,
        cursor: 'pointer', transition: 'background 0.2s',
    };

    const selectStyle: React.CSSProperties = {
        padding: '13px 10px', borderRadius: '10px',
        border: `1px solid ${T.border}`, background: T.bgSub,
        color: T.text, outline: 'none', fontSize: '0.9rem', cursor: 'pointer',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            }}
        >
            <motion.div
                initial={{ scale: 0.97, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 12 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                style={{
                    display: 'flex', maxWidth: '860px', width: '100%', maxHeight: '92vh',
                    borderRadius: '20px', overflow: 'hidden',
                    background: T.bg, border: `1px solid ${T.border}`,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                }}
            >
                {/* Left: Visual Side — dark background with image */}
                <div style={{
                    flex: '0 0 360px', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0a0a1a, #1a1040)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }} className="auth-modal-visual">
                    <Image unoptimized src="/image-5.png" alt="Creative workspace" fill style={{ objectFit: 'cover', opacity: 0.35 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.4) 50%, transparent 100%)' }} />
                    <div style={{ position: 'relative', zIndex: 2, padding: '36px' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="/logo.png" alt="Optimage" style={{ height: '2.2rem', width: 'auto', objectFit: 'contain' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Optimage</span>
                                <a href="https://dreamintrepid.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6em', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>by Dream Intrepid Ltd</a>
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '10px' }}>Free Image Tools</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Compress, convert, resize and deliver your images — all in one place, right in your browser.
                        </p>
                    </div>
                </div>

                {/* Right: Form Side — white */}
                <div style={{
                    flex: 1, padding: '40px', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    minWidth: '300px', background: T.bg, position: 'relative',
                }}>
                    {/* Close button */}
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: T.bgSub, border: `1px solid ${T.border}`,
                        color: T.textMuted, cursor: 'pointer',
                        padding: '7px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        lineHeight: 0,
                    }}>
                        <X size={16} />
                    </button>

                    <div style={{ marginBottom: '28px' }}>
                        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '8px', color: T.text, letterSpacing: '-0.01em' }}>
                            {step === 'email' ? 'Sign in to Optimage' : step === 'otp' ? 'Check your email' : 'Almost done'}
                        </h2>
                        <p style={{ color: T.textSub, fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {step === 'email'
                                ? 'Enter your email to sign in or create a free account.'
                                : step === 'otp'
                                    ? `We sent an 8-digit code to ${email}. Enter it below to sign in.`
                                    : 'Tell us your name so we can personalise your experience.'}
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '11px 14px', background: '#fef2f2',
                            border: '1px solid #fecaca', borderRadius: '10px',
                            color: '#dc2626', fontSize: '0.88rem', marginBottom: '18px',
                        }}>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div style={{
                            padding: '11px 14px', background: '#f0fdf4',
                            border: '1px solid #bbf7d0', borderRadius: '10px',
                            color: '#16a34a', fontSize: '0.88rem', marginBottom: '18px',
                        }}>
                            {message}
                        </div>
                    )}

                    {step === 'onboarding' ? (
                        <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                    What should we call you?
                                </label>
                                <input
                                    type="text" value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name" maxLength={80} required autoFocus
                                    style={inputStyle}
                                    onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                    Phone number <span style={{ color: T.textMuted, fontWeight: 400 }}>(optional)</span>
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} style={selectStyle}>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+234">🇳🇬 +234</option>
                                        <option value="+27">🇿🇦 +27</option>
                                        <option value="+233">🇬🇭 +233</option>
                                        <option value="+254">🇰🇪 +254</option>
                                        <option value="+49">🇩🇪 +49</option>
                                        <option value="+33">🇫🇷 +33</option>
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+55">🇧🇷 +55</option>
                                        <option value="+52">🇲🇽 +52</option>
                                        <option value="+1-CA">🇨🇦 +1</option>
                                        <option value="+971">🇦🇪 +971</option>
                                        <option value="+65">🇸🇬 +65</option>
                                    </select>
                                    <input
                                        type="tel" value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^\d\s\-().]/g, ''))}
                                        placeholder="800 000 0000" maxLength={15}
                                        style={{ ...inputStyle, flex: 1, padding: '13px 14px' }}
                                        onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                        onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                    Date of birth <span style={{ color: T.textMuted, fontWeight: 400 }}>(optional)</span>
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                    {[
                                        { value: dobDay, setter: setDobDay, placeholder: 'Day', options: Array.from({ length: 31 }, (_, i) => ({ v: String(i+1), l: String(i+1) })) },
                                        { value: dobMonth, setter: setDobMonth, placeholder: 'Month', options: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i) => ({ v: String(i+1), l: m })) },
                                        { value: dobYear, setter: setDobYear, placeholder: 'Year', options: Array.from({ length: 80 }, (_, i) => { const y = new Date().getFullYear() - 18 - i; return { v: String(y), l: String(y) }; }) },
                                    ].map(({ value, setter, placeholder, options }) => (
                                        <select key={placeholder} value={value}
                                            onChange={(e) => setter(e.target.value)}
                                            style={{ ...selectStyle, color: value ? T.text : T.textMuted }}>
                                            <option value="">{placeholder}</option>
                                            {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                        </select>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                                <button type="submit" disabled={loading || !displayName.trim()} style={{ ...btnPrimary, opacity: loading || !displayName.trim() ? 0.6 : 1 }}>
                                    {loading ? 'Saving...' : <><span>Get Started</span><ArrowRight size={16} /></>}
                                </button>
                            </div>
                            <button type="button"
                                onClick={() => { onClose(); if (redirectAfterAuth) { router.push(redirectAfterAuth); } else if (window.location.pathname === '/') { router.push('/dashboard'); } }}
                                style={{ background: 'none', border: 'none', color: T.textMuted, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center' }}>
                                Skip for now
                            </button>
                        </form>
                    ) : step === 'email' ? (
                        <>
                            {/* Google OAuth */}
                            <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={{
                                width: '100%', padding: '13px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                background: T.bg, border: `1px solid ${T.border}`,
                                borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: 500,
                                color: T.text, marginBottom: '18px', transition: 'box-shadow 0.2s, border-color 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(37,99,235,0.1)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = T.border; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', color: T.textMuted, fontSize: '13px' }}>
                                <div style={{ flex: 1, height: '1px', background: T.border }} />
                                or continue with email
                                <div style={{ flex: 1, height: '1px', background: T.border }} />
                            </div>

                            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                        Email address
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
                                        <input type="email" value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required placeholder="you@example.com"
                                            style={{ ...inputStyle, paddingLeft: '42px' }}
                                            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                    <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                                    <button type="submit" disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                                        {loading ? 'Sending...' : <><span>Continue</span><ArrowRight size={16} /></>}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* OTP step */
                        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', color: T.text }}>
                                    <Key size={14} /> 8-digit security code
                                </label>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { if (el) otpRefs.current[index] = el; }}
                                            type="text" inputMode="numeric" maxLength={1} value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            {...(index === 0 ? { onPaste: handleOtpPaste } : {})}
                                            style={{
                                                width: '38px', height: '50px', textAlign: 'center',
                                                borderRadius: '10px', border: `1px solid ${T.border}`,
                                                background: T.bgSub, color: T.text,
                                                outline: 'none', fontSize: '1.1rem', fontWeight: 600,
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
                                <button type="submit" disabled={loading || otp.join('').length < 8}
                                    style={{ ...btnPrimary, opacity: loading || otp.join('').length < 8 ? 0.6 : 1 }}>
                                    {loading ? 'Verifying...' : <><span>Verify Code</span><ArrowRight size={16} /></>}
                                </button>
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '0.88rem', color: T.textSub }}>
                                <p style={{ marginBottom: '8px' }}>
                                    Didn&apos;t get a code?{' '}
                                    <button type="button" onClick={handleResendCode}
                                        disabled={loading || resendCooldownMs > 0}
                                        style={{
                                            background: 'none', border: 'none', padding: 0,
                                            color: resendCooldownMs > 0 ? T.textMuted : T.accent,
                                            cursor: resendCooldownMs > 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: 700, fontSize: 'inherit',
                                        }}>
                                        {resendCooldownMs > 0 ? `Resend in ${Math.ceil(resendCooldownMs / 1000)}s` : 'Resend code'}
                                    </button>
                                </p>
                                <p>
                                    Wrong email?{' '}
                                    <button type="button" onClick={resetFlow}
                                        style={{ background: 'none', border: 'none', color: T.accent, cursor: 'pointer', fontWeight: 600, fontSize: 'inherit', padding: 0 }}>
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
