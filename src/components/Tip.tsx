'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { c } from '@/lib/colors';

// Dismissible contextual tip. Each tip is keyed by a stable `id` and shown once
// per browser (localStorage) — non-blocking, progressive-disclosure onboarding.
const STORAGE_KEY = 'optimage_tips_dismissed';

function readDismissed(): string[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

interface TipProps {
    id: string;
    icon?: React.ReactNode;
    title?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export default function Tip({ id, icon, title, children, style }: TipProps): React.JSX.Element | null {
    // Render nothing until mounted so SSR + first client paint match (no hydration
    // flash), then reveal only if this tip hasn't been dismissed.
    const [mounted, setMounted] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        setDismissed(readDismissed().includes(id));
        setMounted(true);
    }, [id]);

    const dismiss = () => {
        setDismissed(true);
        try {
            const next = Array.from(new Set([...readDismissed(), id]));
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch { /* storage unavailable — dismiss for this session only */ }
    };

    if (!mounted || dismissed) return null;

    return (
        <div role="note" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: `${c.accent}0c`, border: `1px solid ${c.accent}33`, borderRadius: '12px', padding: '12px 14px', ...style }}>
            {icon && <div style={{ color: c.accent, flexShrink: 0, marginTop: '1px', display: 'flex' }}>{icon}</div>}
            <div style={{ minWidth: 0, flex: 1 }}>
                {title && <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 600, color: c.text }}>{title}</p>}
                <div style={{ fontSize: '0.8rem', color: c.textSecondary, lineHeight: 1.55 }}>{children}</div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss tip" style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, flexShrink: 0, padding: '2px', lineHeight: 1 }}>
                <X size={15} />
            </button>
        </div>
    );
}
