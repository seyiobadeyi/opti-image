'use client';

import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, Paperclip, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { c } from '@/lib/colors';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches server limit

const CATEGORIES = [
  'Bug Report',
  'Feature Request',
  'Account Issue',
  'General Question',
  'Other',
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_HINTS: Record<Category, string> = {
  'Bug Report': 'Describe what happened, what you expected, and your browser/device.',
  'Feature Request': "Tell us what you'd like to see and why it would help you.",
  'Account Issue': 'Include the email address on your account.',
  'General Question': 'Ask us anything about Optimage.',
  'Other': "Describe your query and we'll route it to the right person.",
};

interface FormState {
  name: string;
  email: string;
  category: Category;
  message: string;
  website: string; // honeypot — real users never see/fill this
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    category: 'Bug Report',
    message: '',
    website: '',
  });
  const [emailReadonly, setEmailReadonly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setForm(prev => ({
          ...prev,
          name: prev.name || user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || prev.email,
        }));
        if (user.email) setEmailReadonly(true);
      }
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleOpen = () => { setSubmitted(false); setError(null); setOpen(true); };
  const handleClose = () => { setOpen(false); setSubmitted(false); setError(null); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ── Formatting toolbar: insert markdown-style markers around the selection
  const applyFormat = (marker: string) => {
    const ta = messageRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    const selected = value.slice(selectionStart, selectionEnd);
    const next = value.slice(0, selectionStart) + marker + selected + marker + value.slice(selectionEnd);
    setForm(prev => ({ ...prev, message: next }));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selectionStart + marker.length, selectionStart + marker.length + selected.length);
    });
  };

  const applyBullet = () => {
    const ta = messageRef.current;
    if (!ta) return;
    const { selectionStart, value } = ta;
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const next = value.slice(0, lineStart) + '- ' + value.slice(lineStart);
    setForm(prev => ({ ...prev, message: next }));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(selectionStart + 2, selectionStart + 2); });
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imgs = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const oversized = imgs.find(f => f.size > MAX_FILE_SIZE);
    if (oversized) { setError(`${oversized.name} is over 10MB`); return; }
    setFiles(prev => [...prev, ...imgs].slice(0, MAX_FILES));
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.message.length < 10) { setError('Message must be at least 10 characters.'); return; }
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('category', form.category);
      formData.append('message', form.message);
      formData.append('website', form.website);
      formData.append('page', typeof window !== 'undefined' ? window.location.href : '');
      formData.append('userAgent', typeof navigator !== 'undefined' ? navigator.userAgent : '');
      files.forEach(f => formData.append('files', f));

      const res = await fetch(`${api}/api/support/ticket`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'Something went wrong. Please try again.');
      }
      setSubmitted(true);
      setFiles([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${c.border}`,
    background: '#fff',
    color: c.text,
    fontSize: '0.88rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  const getInput = (field: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focusedField === field ? c.accent : c.border,
  });

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        aria-label="Get help or contact support"
        title="Contact support"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 40,
          width: 48, height: 48, borderRadius: '50%',
          background: c.accent, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(219,90,66,0.35)',
          transform: open ? 'scale(0.93)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.07)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = open ? 'scale(0.93)' : 'scale(1)'; }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Backdrop + modal */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(17, 24, 39, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            ref={modalRef}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%', maxWidth: 480,
              maxHeight: '92vh', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(17,24,39,0.18)',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '22px 28px 18px',
              borderBottom: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: c.accentLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: c.text, lineHeight: 1.2 }}>
                    Contact Support
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: c.textMuted, marginTop: 2 }}>
                    We reply within 24 hours on business days
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                  background: c.bgMuted, border: 'none', borderRadius: '8px',
                  color: c.textMuted, cursor: 'pointer',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0, transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.border; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = c.bgMuted; }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: c.accentLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700, color: c.text }}>
                    Message received!
                  </h3>
                  <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: c.textSecondary, lineHeight: 1.6 }}>
                    We&apos;ll reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <p style={{ margin: '0 0 28px', fontSize: '0.82rem', color: c.textMuted }}>
                    Check your spam folder if you don&apos;t hear from us.
                  </p>
                  <button
                    onClick={handleClose}
                    style={{
                      background: c.accent, border: 'none', borderRadius: '100px',
                      color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                      padding: '11px 32px', transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — visually hidden, off the tab order; bots fill every field they can see */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
                  />

                  {/* Name */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: 6 }} htmlFor="sw-name">
                      Your name
                    </label>
                    <input
                      id="sw-name" name="name" type="text"
                      value={form.name} onChange={handleChange}
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                      required maxLength={100} placeholder="Jane Smith"
                      style={getInput('name')}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: 6 }} htmlFor="sw-email">
                      Email address
                      {emailReadonly && (
                        <span style={{ marginLeft: 8, fontSize: '0.72rem', color: c.textMuted, fontWeight: 400 }}>
                          (from your account)
                        </span>
                      )}
                    </label>
                    <input
                      id="sw-email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      required readOnly={emailReadonly} placeholder="you@example.com"
                      style={{ ...getInput('email'), ...(emailReadonly ? { opacity: 0.65, cursor: 'default' } : {}) }}
                    />
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: 6 }} htmlFor="sw-category">
                      What&apos;s this about?
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="sw-category" name="category"
                        value={form.category} onChange={handleChange}
                        onFocus={() => setFocusedField('category')} onBlur={() => setFocusedField(null)}
                        style={{
                          ...getInput('category'),
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 14px center',
                          paddingRight: 40,
                          cursor: 'pointer',
                        }}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: c.textMuted, lineHeight: 1.4 }}>
                      {CATEGORY_HINTS[form.category]}
                    </p>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 6 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, marginBottom: 6 }} htmlFor="sw-message">
                      Message
                    </label>

                    {/* Formatting toolbar */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {[
                        { icon: Bold, title: 'Bold', onClick: () => applyFormat('**') },
                        { icon: Italic, title: 'Italic', onClick: () => applyFormat('_') },
                        { icon: List, title: 'Bullet list', onClick: applyBullet },
                        { icon: Paperclip, title: 'Attach images', onClick: () => fileInputRef.current?.click() },
                      ].map(({ icon: Icon, title, onClick }) => (
                        <button key={title} type="button" title={title} onClick={onClick}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: `1px solid ${c.border}`, background: '#fff', color: c.textSecondary, cursor: 'pointer' }}>
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>

                    <textarea
                      ref={messageRef}
                      id="sw-message" name="message"
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                      required rows={5} minLength={10} maxLength={2000}
                      placeholder="Describe your issue or request in detail... (use **bold**, _italic_, or - for bullets)"
                      style={{ ...getInput('message'), resize: 'vertical', minHeight: 100 }}
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                    />

                    {files.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                        {files.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: c.bgMuted, border: `1px solid ${c.border}`, borderRadius: '8px', fontSize: '0.78rem', color: c.textSecondary }}>
                            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                            <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex' }}><X size={11} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: form.message.length > 1800 ? '#ef4444' : c.textMuted, marginBottom: 20 }}>
                    {form.message.length} / 2000
                  </div>

                  {error && (
                    <div style={{
                      background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 8, padding: '10px 14px', marginBottom: 16,
                      fontSize: '0.85rem', color: '#dc2626',
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit" disabled={loading}
                    style={{
                      width: '100%', border: 'none', borderRadius: '100px',
                      background: loading ? c.textMuted : c.accent,
                      color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.92rem', fontWeight: 600,
                      padding: '13px 24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                    onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'sw-spin 0.8s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Sending…
                      </>
                    ) : 'Send Message'}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: c.textMuted, marginTop: 14, marginBottom: 0 }}>
                    We typically respond within 24 hours on business days. Your message is private and never shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
