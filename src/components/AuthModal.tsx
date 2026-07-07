'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, ArrowRight, Key, Camera, CalendarDays, Building2, Eye, MoreHorizontal } from 'lucide-react';
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
    accent:    '#db5a42',
    accentHov: '#c44d32',
};

export default function AuthModal({ isOpen, onClose, initialStep, redirectAfterAuth, leftTitle, leftSubtitle }: AuthModalProps & { leftTitle?: string; leftSubtitle?: string }): React.JSX.Element | null {
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
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [onboardingSubStep, setOnboardingSubStep] = useState<number>(0);
    const [focusAreas, setFocusAreas] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    const [referral, setReferral] = useState<string>('');

    useEffect(() => {
        window.dispatchEvent(new CustomEvent(isOpen ? 'optimage:overlay:open' : 'optimage:overlay:close'));
    }, [isOpen]);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) setStep(initialStep ?? 'email');
    }, [isOpen, initialStep]);

    // When entering onboarding: pre-fill name from session (Google metadata or existing profile)
    // so the name step is never shown to someone whose name we already know.
    useEffect(() => {
        if (step !== 'onboarding') return;
        setFocusAreas([]);
        setUserRole('');
        setReferral('');
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) { setOnboardingSubStep(0); return; }

            const meta = session.user.user_metadata ?? {};
            // Google provides given_name / family_name; email OTP users don't have metadata
            const gn = meta.given_name || (meta.name || meta.full_name || '').split(' ')[0] || '';
            const fn = meta.family_name || (meta.name || meta.full_name || '').split(' ').slice(1).join(' ') || '';

            if (gn) {
                setFirstName(gn);
                setLastName(fn);
                // Don't override sub-step if OTP flow already forced us to step 1
                setOnboardingSubStep(prev => prev >= 1 ? prev : 1);
            } else {
                // Check profile for an existing display_name (OTP user who already set their name)
                supabase.from('profiles').select('display_name').eq('id', session.user.id).single()
                    .then(({ data: profile }) => {
                        if (profile?.display_name) {
                            const parts = profile.display_name.split(' ');
                            setFirstName(parts[0] || '');
                            setLastName(parts.slice(1).join(' ') || '');
                            setOnboardingSubStep(prev => prev >= 1 ? prev : 1);
                        } else {
                            setOnboardingSubStep(prev => prev >= 1 ? prev : 0);
                        }
                    });
            }
        });
    }, [step, supabase]);

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

    const finishOnboarding = async (): Promise<void> => {
        const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
        if (!displayName) return;
        setLoading(true);
        const useCase = JSON.stringify({ role: userRole, focus: focusAreas, referral });
        try {
            await apiClient.updateProfile({ display_name: displayName, use_case: useCase });
        } catch { /* non-blocking */ } finally { setLoading(false); }
        onClose();
        if (redirectAfterAuth) {
            router.push(redirectAfterAuth);
        } else if (typeof window !== 'undefined' && window.location.pathname === '/') {
            router.push('/dashboard');
        }
    };

    const skipOnboarding = (): void => {
        onClose();
        if (redirectAfterAuth) router.push(redirectAfterAuth);
        else if (typeof window !== 'undefined' && window.location.pathname === '/') router.push('/dashboard');
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
                <style>{`@media (max-width:720px){.auth-modal-visual{display:none !important}.auth-modal-form{flex:1 1 100% !important;max-width:100% !important;padding:28px 20px !important}}`}</style>
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
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '10px' }}>{leftTitle ?? 'Free Image Tools'}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            {leftSubtitle ?? 'Compress, convert, resize and deliver your images. Free to sign up, no credit card needed.'}
                        </p>
                    </div>
                </div>

                {/* Right: Form Side — white */}
                <div className="auth-modal-form" style={{
                    flex: 1, padding: '40px', overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    minWidth: 0, background: T.bg, position: 'relative',
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
                            {step === 'email' ? 'Sign in to Optimage'
                                : step === 'otp' ? 'Check your email'
                                : onboardingSubStep === 0 ? 'What should we call you?'
                                : onboardingSubStep === 1 ? 'How are you using Optimage?'
                                : onboardingSubStep === 2 ? 'What\'s your primary focus?'
                                : 'One last thing…'}
                        </h2>
                        <p style={{ color: T.textSub, fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {step === 'email'
                                ? 'Enter your email to sign in or create a free account.'
                                : step === 'otp'
                                    ? `We sent an 8-digit code to ${email}. Enter it below to sign in.`
                                : onboardingSubStep === 0 ? 'This is how you\'ll appear to gallery owners and clients.'
                                : onboardingSubStep === 1 ? 'Helps us tailor your experience on the platform.'
                                : onboardingSubStep === 2 ? 'Select all that apply — we\'ll customise your gallery views accordingly.'
                                : 'How did you hear about Optimage?'}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Progress bar */}
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} style={{ height: '3px', flex: 1, borderRadius: '2px', background: i <= onboardingSubStep ? T.accent : T.border, transition: 'background 0.3s' }} />
                                ))}
                            </div>

                            {/* Step 0: First + Last name */}
                            {onboardingSubStep === 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                                First name
                                            </label>
                                            <input
                                                type="text" value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Sarah" maxLength={50} autoFocus
                                                style={inputStyle}
                                                onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                                onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && firstName.trim()) setOnboardingSubStep(1); }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: T.text }}>
                                                Last name
                                            </label>
                                            <input
                                                type="text" value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Johnson" maxLength={50}
                                                style={inputStyle}
                                                onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}22`; }}
                                                onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
                                                onKeyDown={(e) => { if (e.key === 'Enter' && firstName.trim()) setOnboardingSubStep(1); }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={skipOnboarding} style={btnSecondary}>Skip</button>
                                        <button type="button" disabled={!firstName.trim()} onClick={() => setOnboardingSubStep(1)}
                                            style={{ ...btnPrimary, opacity: !firstName.trim() ? 0.5 : 1 }}>
                                            <span>Continue</span><ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Role / intent */}
                            {onboardingSubStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {([
                                            { value: 'photographer', label: 'Photographer / Videographer', Icon: Camera },
                                            { value: 'event_planner', label: 'Event Planner', Icon: CalendarDays },
                                            { value: 'organisation', label: 'Organisation / Business', Icon: Building2 },
                                            { value: 'viewer', label: 'Viewing a gallery', Icon: Eye },
                                            { value: 'other', label: 'Other', Icon: MoreHorizontal },
                                        ] as { value: string; label: string; Icon: React.FC<{ size: number; color: string }> }[]).map(({ value, label, Icon }) => {
                                            const active = userRole === value;
                                            return (
                                                <button key={value} type="button" onClick={() => setUserRole(value)}
                                                    style={{
                                                        padding: '16px 12px', borderRadius: '12px', textAlign: 'center',
                                                        border: `1.5px solid ${active ? T.accent : T.border}`,
                                                        background: active ? `${T.accent}14` : T.bgSub,
                                                        color: active ? T.accent : T.text, cursor: 'pointer',
                                                        fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                                        lineHeight: 1.3,
                                                    }}>
                                                    <Icon size={22} color={active ? T.accent : T.textMuted} />
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={() => setOnboardingSubStep(0)} style={btnSecondary}>Back</button>
                                        <button type="button"
                                            onClick={() => {
                                                // Viewer / other roles skip focus areas — jump to referral
                                                if (!userRole || userRole === 'viewer' || userRole === 'other') {
                                                    setOnboardingSubStep(3);
                                                } else {
                                                    setOnboardingSubStep(2);
                                                }
                                            }}
                                            style={btnPrimary}>
                                            <span>{userRole ? 'Continue' : 'Skip'}</span><ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Focus areas — only for creators */}
                            {onboardingSubStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {['Weddings', 'Portraits', 'Family', 'Corporate', 'Events', 'Boudoir', 'Commercial', 'School', 'Travel & Nature', 'Sports', 'Food', 'Other'].map(area => {
                                            const active = focusAreas.includes(area);
                                            return (
                                                <button key={area} type="button"
                                                    onClick={() => setFocusAreas(prev => active ? prev.filter(a => a !== area) : [...prev, area])}
                                                    style={{
                                                        padding: '8px 16px', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer',
                                                        border: `1.5px solid ${active ? T.accent : T.border}`,
                                                        background: active ? `${T.accent}14` : T.bg,
                                                        color: active ? T.accent : T.textSub,
                                                        transition: 'all 0.15s',
                                                    }}>
                                                    {area}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={() => setOnboardingSubStep(1)} style={btnSecondary}>Back</button>
                                        <button type="button" onClick={() => setOnboardingSubStep(3)} style={btnPrimary}>
                                            <span>{focusAreas.length ? 'Continue' : 'Skip'}</span><ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Referral */}
                            {onboardingSubStep === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {['Instagram', 'Facebook', 'YouTube', 'Google Search', 'Referral from a friend', 'Conference or event', 'ChatGPT', 'TV', 'I don\'t remember', 'Other'].map(src => {
                                            const active = referral === src;
                                            return (
                                                <button key={src} type="button" onClick={() => setReferral(active ? '' : src)}
                                                    style={{
                                                        padding: '11px 16px', borderRadius: '10px', textAlign: 'left', width: '100%',
                                                        border: `1.5px solid ${active ? T.accent : T.border}`,
                                                        background: active ? `${T.accent}14` : T.bg,
                                                        color: active ? T.accent : T.text, cursor: 'pointer',
                                                        fontSize: '0.9rem', fontWeight: active ? 600 : 400, transition: 'all 0.15s',
                                                    }}>
                                                    {src}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button"
                                            onClick={() => {
                                                // Viewer / other skipped step 2 — go back to role step
                                                if (!userRole || userRole === 'viewer' || userRole === 'other') {
                                                    setOnboardingSubStep(1);
                                                } else {
                                                    setOnboardingSubStep(2);
                                                }
                                            }}
                                            style={btnSecondary}>Back</button>
                                        <button type="button" disabled={loading} onClick={finishOnboarding}
                                            style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}>
                                            {loading ? 'Saving…' : <><span>Get Started</span><ArrowRight size={16} /></>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                                                flex: '1 1 0', minWidth: 0, maxWidth: '46px', height: '50px', textAlign: 'center', padding: 0,
                                                borderRadius: '10px', border: `1px solid ${T.border}`,
                                                background: T.bgSub, color: T.text,
                                                outline: 'none', fontSize: '1.1rem', fontWeight: 600,
                                                transition: 'border-color 0.2s', boxSizing: 'border-box',
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
