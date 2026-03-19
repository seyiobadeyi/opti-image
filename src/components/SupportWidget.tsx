'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = [
  'Bug Report',
  'Payment Issue',
  'Account Issue',
  'Feature Request',
  'Other',
] as const;

type Category = (typeof CATEGORIES)[number];

interface FormState {
  name: string;
  email: string;
  category: Category;
  message: string;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#fff',
  padding: '12px 14px',
  width: '100%',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#9ca3af',
  marginBottom: 6,
};

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    category: 'Bug Report',
    message: '',
  });
  const [emailReadonly, setEmailReadonly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setForm((prev) => ({
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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleOpen = () => {
    setSubmitted(false);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.message.length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/support/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          category: form.category,
          message: form.message,
          page: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === field ? '#a855f7' : 'rgba(255,255,255,0.1)',
  });

  return (
    <>
      {/* Floating help button */}
      <button
        onClick={handleOpen}
        aria-label="Open support"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 40,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          transform: open ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = open ? 'scale(0.95)' : 'scale(1)';
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          {/* Modal */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#161625',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 28px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Contact Support
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close support modal"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#9ca3af',
                  cursor: 'pointer',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
                }}
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {submitted ? (
                /* Success state */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '20px 0',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      margin: '0 0 10px',
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    style={{
                      margin: '0 0 28px',
                      fontSize: 15,
                      color: '#9ca3af',
                      lineHeight: 1.6,
                    }}
                  >
                    We will get back to you within 24 hours. Check your inbox for a confirmation
                    email.
                  </p>
                  <button
                    onClick={handleClose}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      border: 'none',
                      borderRadius: 100,
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 15,
                      fontWeight: 700,
                      padding: '12px 32px',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle} htmlFor="support-name">
                      Name
                    </label>
                    <input
                      id="support-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      maxLength={100}
                      placeholder="Your name"
                      style={getInputStyle('name')}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle} htmlFor="support-email">
                      Email
                    </label>
                    <input
                      id="support-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      readOnly={emailReadonly}
                      placeholder="you@example.com"
                      style={{
                        ...getInputStyle('email'),
                        ...(emailReadonly
                          ? { opacity: 0.6, cursor: 'default' }
                          : {}),
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle} htmlFor="support-category">
                      Category
                    </label>
                    <select
                      id="support-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('category')}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...getInputStyle('category'),
                        appearance: 'none',
                        backgroundImage:
                          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%239ca3af\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: 40,
                        cursor: 'pointer',
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} style={{ background: '#1a1d24' }}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 6 }}>
                    <label style={labelStyle} htmlFor="support-message">
                      Message
                    </label>
                    <textarea
                      id="support-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      minLength={10}
                      maxLength={2000}
                      placeholder="Describe your issue or request in detail..."
                      style={{
                        ...getInputStyle('message'),
                        resize: 'vertical',
                        minHeight: 100,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: 12,
                      color: form.message.length > 1800 ? '#f87171' : '#6b7280',
                      marginBottom: 20,
                    }}
                  >
                    {form.message.length} / 2000
                  </div>

                  {error && (
                    <div
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 8,
                        padding: '12px 14px',
                        marginBottom: 18,
                        fontSize: 14,
                        color: '#f87171',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading
                        ? 'rgba(99,102,241,0.5)'
                        : 'linear-gradient(135deg, #6366f1, #a855f7)',
                      border: 'none',
                      borderRadius: 100,
                      color: '#fff',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: 15,
                      fontWeight: 700,
                      padding: '14px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          style={{
                            animation: 'spin 0.8s linear infinite',
                          }}
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
