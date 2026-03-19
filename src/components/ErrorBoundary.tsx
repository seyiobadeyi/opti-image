'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        if (process.env.NODE_ENV === 'development') {
            console.error('[ErrorBoundary] Caught error:', error, info);
        }
    }

    resetErrorBoundary = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return <ErrorCard onReset={this.resetErrorBoundary} />;
        }
        return this.props.children;
    }
}

function ErrorCard({ onReset }: { onReset?: () => void }): React.JSX.Element {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d1a',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
            {/* Decorative blobs */}
            <div style={{
                position: 'absolute', top: '-150px', left: '-150px',
                width: '400px', height: '400px',
                background: 'rgba(108, 92, 231, 0.15)',
                filter: 'blur(100px)', borderRadius: '50%',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-150px', right: '-150px',
                width: '350px', height: '350px',
                background: 'rgba(108, 92, 231, 0.1)',
                filter: 'blur(80px)', borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            <div style={{
                background: '#161625',
                border: '1px solid rgba(108, 92, 231, 0.2)',
                borderRadius: '24px',
                padding: '48px 40px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="/logo.png"
                        alt="Optimage"
                        style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>

                {/* Error icon */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(225, 112, 85, 0.1)',
                    border: '1px solid rgba(225, 112, 85, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e17055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </div>

                <h1 style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#f0f0f5',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                }}>
                    Something went wrong
                </h1>

                <p style={{
                    color: '#a0a0b5',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    marginBottom: '32px',
                }}>
                    An unexpected error occurred. You can try reloading the page or return to the home screen.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={onReset ?? (() => window.location.reload())}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                            color: 'white',
                            border: 'none',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)',
                        }}
                    >
                        Reload page
                    </button>

                    <Link
                        href="/"
                        style={{
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#f0f0f5',
                            border: '1px solid rgba(108, 92, 231, 0.2)',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export { ErrorCard };
export default ErrorBoundary;
