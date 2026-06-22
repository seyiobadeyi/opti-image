'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, Heart, Camera, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { AppNotification } from '@/types';
import { c } from '@/lib/colors';

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return d < 7 ? `${d}d ago` : new Date(iso).toLocaleDateString();
}

function iconFor(type: string): React.JSX.Element {
    if (type === 'message') return <MessageSquare size={15} color={c.accent} />;
    if (type === 'favorite') return <Heart size={15} color="#ec4899" />;
    if (type === 'submission') return <Camera size={15} color={c.accent} />;
    return <Bell size={15} color={c.gray500} />;
}

export default function NotificationBell(): React.JSX.Element {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<AppNotification[]>([]);
    const [unread, setUnread] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);

    const load = useCallback(async (): Promise<void> => {
        try {
            const { notifications, unreadCount } = await apiClient.getNotifications();
            setItems(notifications);
            setUnread(unreadCount);
        } catch {
            // non-critical — silently ignore
        }
    }, []);

    useEffect(() => {
        void load();
        const t = setInterval(() => void load(), 60_000); // light polling
        return () => clearInterval(t);
    }, [load]);

    useEffect(() => {
        const onDoc = (e: MouseEvent): void => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const toggle = (): void => {
        const next = !open;
        setOpen(next);
        // Opening clears the unread badge
        if (next && unread > 0) {
            void apiClient.markNotificationsRead().then(() => {
                setUnread(0);
                setItems(prev => prev.map(n => ({ ...n, read: true })));
            });
        }
    };

    const onClickItem = (n: AppNotification): void => {
        setOpen(false);
        if (n.link) router.push(n.link);
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <button
                onClick={toggle}
                aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: c.gray700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px' }}
            >
                <Bell size={19} />
                {unread > 0 && (
                    <span style={{ position: 'absolute', top: '0px', right: '0px', minWidth: '16px', height: '16px', padding: '0 4px', borderRadius: '999px', background: c.accent, color: '#fff', fontSize: '0.62rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '340px', maxWidth: '90vw', background: '#fff', border: `1px solid ${c.border}`, borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.16)', overflow: 'hidden', zIndex: 300 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${c.border}` }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: c.text }}>Notifications</span>
                        {items.some(n => !n.read) && (
                            <button
                                onClick={() => void apiClient.markNotificationsRead().then(() => { setUnread(0); setItems(prev => prev.map(n => ({ ...n, read: true }))); })}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.accent, fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Check size={13} /> Mark all read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                        {items.length === 0 ? (
                            <div style={{ padding: '32px 16px', textAlign: 'center', color: c.textMuted, fontSize: '0.85rem' }}>
                                <Bell size={26} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                <p style={{ margin: 0 }}>No notifications yet.</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem' }}>Messages, likes and photo submissions will appear here.</p>
                            </div>
                        ) : (
                            items.map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => onClickItem(n)}
                                    style={{ width: '100%', textAlign: 'left', display: 'flex', gap: '10px', padding: '12px 16px', border: 'none', borderBottom: `1px solid ${c.gray100}`, background: n.read ? '#fff' : c.accentLight, cursor: 'pointer' }}
                                >
                                    <span style={{ flexShrink: 0, marginTop: '2px' }}>{iconFor(n.type)}</span>
                                    <span style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: c.text }}>{n.title}</span>
                                        {n.body && <span style={{ display: 'block', fontSize: '0.78rem', color: c.textSecondary, lineHeight: 1.4, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</span>}
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: c.textMuted, marginTop: '3px' }}>{timeAgo(n.created_at)}</span>
                                    </span>
                                    {!n.read && <span style={{ flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%', background: c.accent, marginTop: '5px' }} />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
