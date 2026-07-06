'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, Share2, Check } from 'lucide-react';
import { c } from '@/lib/colors';

interface GalleryMessage {
    id: string;
    guest_name: string;
    message: string;
    created_at: string;
}

interface Props {
    messages: GalleryMessage[];
    photos: string[];          // gallery display_urls, for photo backgrounds
    galleryTitle: string;
    onClose: () => void;
}

type Template = 'single' | 'wall';
type Format = 'story' | 'square';
type Bg = 'brand' | 'photo';

const ACCENT = '#db5a42';
const DIMENSIONS: Record<Format, { w: number; h: number }> = {
    story: { w: 1080, h: 1920 },
    square: { w: 1080, h: 1080 },
};

/** Draw text wrapped to maxWidth; returns the array of lines. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
}

export default function MessageCardStudio({ messages, photos, galleryTitle, onClose }: Props): React.JSX.Element {
    const [selected, setSelected] = useState<Set<string>>(() => new Set(messages.slice(0, 1).map(m => m.id)));
    const [template, setTemplate] = useState<Template>('single');
    const [format, setFormat] = useState<Format>('story');
    const [bg, setBg] = useState<Bg>('brand');
    const [photoUrl, setPhotoUrl] = useState<string | null>(photos[0] ?? null);
    const [sharing, setSharing] = useState(false);
    const [search, setSearch] = useState('');
    const [cardText, setCardText] = useState<string>(messages[0]?.message ?? '');
    const [cardName, setCardName] = useState<string>(messages[0]?.guest_name ?? '');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const selectedMessages = messages.filter(m => selected.has(m.id));
    const q = search.trim().toLowerCase();
    const filtered = q ? messages.filter(m => m.message.toLowerCase().includes(q) || m.guest_name.toLowerCase().includes(q)) : messages;

    // Keep the editable card text in sync with the single message selected.
    const singleId = template === 'single' ? [...selected][0] : undefined;
    useEffect(() => {
        if (template !== 'single' || !singleId) return;
        const m = messages.find(x => x.id === singleId);
        if (m) { setCardText(m.message); setCardName(m.guest_name); }
    }, [singleId, template, messages]);

    const toggle = (id: string) => setSelected(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });

    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const sel = messages.filter(m => selected.has(m.id));
        const { w, h } = DIMENSIONS[format];
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pad = Math.round(w * 0.085);

        // ── Background ──
        if (bg === 'photo' && photoUrl) {
            try {
                const img = await new Promise<HTMLImageElement>((res, rej) => {
                    const i = new Image();
                    i.crossOrigin = 'anonymous';
                    i.onload = () => res(i);
                    i.onerror = rej;
                    i.src = photoUrl;
                });
                const scale = Math.max(w / img.width, h / img.height);
                const dw = img.width * scale, dh = img.height * scale;
                ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
                ctx.fillStyle = 'rgba(18,18,22,0.58)';
                ctx.fillRect(0, 0, w, h);
            } catch {
                ctx.fillStyle = '#1c1c22'; ctx.fillRect(0, 0, w, h);
            }
        } else if (bg === 'brand') {
            ctx.fillStyle = template === 'wall' ? '#faece7' : ACCENT;
            ctx.fillRect(0, 0, w, h);
        }

        const onLight = bg === 'brand' && template === 'wall';
        const textColor = onLight ? '#2c2c2a' : '#ffffff';
        const mutedColor = onLight ? '#993c1d' : 'rgba(255,255,255,0.75)';

        // ── Content ──
        if (template === 'single') {
            const text = cardText.trim();
            const name = cardName.trim();
            ctx.textBaseline = 'top';
            // eyebrow
            ctx.fillStyle = mutedColor;
            ctx.font = `500 ${Math.round(w * 0.026)}px system-ui, sans-serif`;
            ctx.fillText('FROM THE GUESTBOOK', pad, pad + Math.round(h * 0.02));
            // message (serif, centered block)
            const msgSize = Math.round(w * (format === 'story' ? 0.062 : 0.056));
            ctx.font = `italic ${msgSize}px Georgia, serif`;
            ctx.fillStyle = textColor;
            const lineH = Math.round(msgSize * 1.34);
            const lines = text ? wrapLines(ctx, `“${text}”`, w - pad * 2) : ['Pick a message'];
            const blockH = lines.length * lineH;
            let y = Math.max(pad + h * 0.14, (h - blockH) / 2 - h * 0.05);
            for (const ln of lines) { ctx.fillText(ln, pad, y); y += lineH; }
            // name
            if (name) {
                ctx.font = `500 ${Math.round(w * 0.036)}px system-ui, sans-serif`;
                ctx.fillStyle = mutedColor;
                ctx.fillText(`— ${name}`, pad, y + Math.round(h * 0.015));
            }
        } else {
            // wall
            ctx.textBaseline = 'top';
            ctx.fillStyle = onLight ? '#712b13' : '#ffffff';
            ctx.font = `500 ${Math.round(w * 0.036)}px system-ui, sans-serif`;
            ctx.fillText(`Messages · ${galleryTitle}`.slice(0, 40), pad, pad);
            const items = sel.slice(0, format === 'story' ? 5 : 3);
            let y = pad + Math.round(h * 0.075);
            const cardW = w - pad * 2;
            const bodySize = Math.round(w * 0.03);
            for (const m of items) {
                ctx.font = `italic ${bodySize}px Georgia, serif`;
                const lines = wrapLines(ctx, `“${m.message}”`, cardW - Math.round(w * 0.08)).slice(0, 3);
                const lineH = Math.round(bodySize * 1.3);
                const cardH = lines.length * lineH + Math.round(w * 0.11);
                ctx.fillStyle = onLight ? '#ffffff' : 'rgba(255,255,255,0.10)';
                roundRect(ctx, pad, y, cardW, cardH, 22);
                let ty = y + Math.round(w * 0.035);
                ctx.fillStyle = onLight ? '#2c2c2a' : '#ffffff';
                ctx.font = `italic ${bodySize}px Georgia, serif`;
                for (const ln of lines) { ctx.fillText(ln, pad + Math.round(w * 0.04), ty); ty += lineH; }
                ctx.fillStyle = onLight ? '#993c1d' : 'rgba(255,255,255,0.7)';
                ctx.font = `500 ${Math.round(w * 0.024)}px system-ui, sans-serif`;
                ctx.fillText(`— ${m.guest_name}`, pad + Math.round(w * 0.04), ty + Math.round(w * 0.005));
                y += cardH + Math.round(h * 0.018);
            }
        }

        // ── Watermark ──
        const wmY = h - pad - Math.round(w * 0.03);
        const chipSize = Math.round(w * 0.03);
        ctx.fillStyle = ACCENT;
        roundRect(ctx, pad, wmY, chipSize, chipSize, 6);
        ctx.fillStyle = onLight ? '#993c1d' : 'rgba(255,255,255,0.85)';
        ctx.font = `500 ${Math.round(w * 0.024)}px system-ui, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText('made with Optimage', pad + chipSize + 14, wmY + chipSize / 2);
    }, [template, format, bg, photoUrl, galleryTitle, messages, selected, cardText, cardName]);

    useEffect(() => { void render(); }, [render]);

    const toBlob = (): Promise<Blob | null> =>
        new Promise(res => canvasRef.current?.toBlob(res, 'image/png') ?? res(null));

    const download = async () => {
        const blob = await toBlob();
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `optimage-messages-${format}.png`; a.click();
        URL.revokeObjectURL(url);
    };

    const share = async () => {
        const blob = await toBlob();
        if (!blob) return;
        const file = new File([blob], 'optimage-messages.png', { type: 'image/png' });
        const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
        if (nav.canShare && nav.canShare({ files: [file] })) {
            setSharing(true);
            try { await navigator.share({ files: [file], title: 'A message from my gallery' }); } catch { /* cancelled */ }
            setSharing(false);
        } else {
            await download(); // desktop fallback
        }
    };

    const CHIP = (active: boolean): React.CSSProperties => ({
        padding: '7px 14px', borderRadius: '9px', fontSize: '0.82rem', cursor: 'pointer',
        border: `1px solid ${active ? c.accent : c.border}`,
        background: active ? `${c.accent}12` : c.white,
        color: active ? c.accent : c.textSecondary, fontWeight: active ? 600 : 400,
    });

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: c.white, borderRadius: '18px', width: '100%', maxWidth: '860px', maxHeight: '92vh', overflow: 'auto', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Share messages</h3>
                        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: c.textMuted }}>Turn your guestbook into a shareable card.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted }}><X size={20} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '20px', alignItems: 'start' }} className="mcs-grid">
                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Layout</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button style={CHIP(template === 'single')} onClick={() => setTemplate('single')}>Single message</button>
                                <button style={CHIP(template === 'wall')} onClick={() => setTemplate('wall')}>Message wall</button>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Format</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={CHIP(format === 'story')} onClick={() => setFormat('story')}>Story 9:16</button>
                                <button style={CHIP(format === 'square')} onClick={() => setFormat('square')}>Square 1:1</button>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Background</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button style={CHIP(bg === 'brand')} onClick={() => setBg('brand')}>Brand colour</button>
                                <button style={CHIP(bg === 'photo')} onClick={() => setBg('photo')} disabled={photos.length === 0}>Gallery photo</button>
                            </div>
                            {bg === 'photo' && photos.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {photos.slice(0, 12).map(p => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img key={p} src={p} alt="" onClick={() => setPhotoUrl(p)}
                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, border: `2px solid ${photoUrl === p ? c.accent : 'transparent'}` }} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>
                                {template === 'single' ? 'Pick a message' : `Pick messages (${selectedMessages.length} selected)`}
                            </label>
                            {messages.length > 6 && (
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages or names…"
                                    style={{ width: '100%', padding: '8px 11px', borderRadius: '9px', border: `1px solid ${c.border}`, fontSize: '0.82rem', marginBottom: '8px', outline: 'none', boxSizing: 'border-box' }} />
                            )}
                            <div style={{ maxHeight: '190px', overflowY: 'auto', border: `1px solid ${c.border}`, borderRadius: '10px' }}>
                                {messages.length === 0 && <p style={{ padding: '14px', margin: 0, fontSize: '0.82rem', color: c.textMuted }}>No messages yet — they’ll appear here once guests sign your gallery.</p>}
                                {messages.length > 0 && filtered.length === 0 && <p style={{ padding: '14px', margin: 0, fontSize: '0.82rem', color: c.textMuted }}>No messages match “{search}”.</p>}
                                {filtered.map(m => {
                                    const on = selected.has(m.id);
                                    return (
                                        <button key={m.id} onClick={() => template === 'single' ? setSelected(new Set([m.id])) : toggle(m.id)}
                                            style={{ display: 'flex', gap: '10px', width: '100%', textAlign: 'left', padding: '10px 12px', background: on ? `${c.accent}0a` : 'none', border: 'none', borderBottom: `1px solid ${c.border}`, cursor: 'pointer' }}>
                                            <span style={{ flexShrink: 0, width: '18px', height: '18px', borderRadius: '5px', border: `1px solid ${on ? c.accent : c.border}`, background: on ? c.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
                                                {on && <Check size={12} color="#fff" />}
                                            </span>
                                            <span style={{ minWidth: 0 }}>
                                                <span style={{ fontSize: '0.82rem', color: c.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</span>
                                                <span style={{ fontSize: '0.72rem', color: c.textMuted }}>— {m.guest_name}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {template === 'single' && selectedMessages.length > 0 && (
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Card text <span style={{ fontWeight: 400, color: c.textMuted }}>(trim or tidy — only affects the card)</span></label>
                                <textarea value={cardText} onChange={e => setCardText(e.target.value)} rows={3}
                                    style={{ width: '100%', padding: '9px 11px', borderRadius: '9px', border: `1px solid ${c.border}`, fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Attribution (e.g. Aunty Bisi)"
                                    style={{ width: '100%', padding: '8px 11px', borderRadius: '9px', border: `1px solid ${c.border}`, fontSize: '0.82rem', marginTop: '6px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                        <div style={{ background: c.bgMuted, borderRadius: '14px', padding: '12px', display: 'flex', justifyContent: 'center' }}>
                            <canvas ref={canvasRef} style={{ width: format === 'story' ? '190px' : '260px', height: 'auto', borderRadius: '10px', display: 'block' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <button onClick={() => void share()} disabled={selectedMessages.length === 0 || sharing}
                                style={{ flex: 1, padding: '11px', borderRadius: '11px', border: 'none', background: c.accent, color: '#fff', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: selectedMessages.length === 0 ? 0.5 : 1 }}>
                                <Share2 size={15} /> Share
                            </button>
                            <button onClick={() => void download()} disabled={selectedMessages.length === 0}
                                style={{ padding: '11px 14px', borderRadius: '11px', border: `1px solid ${c.border}`, background: c.white, color: c.text, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', opacity: selectedMessages.length === 0 ? 0.5 : 1 }}>
                                <Download size={15} /> Save
                            </button>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: c.textMuted, textAlign: 'center', margin: 0 }}>Share drops it straight into WhatsApp status, Instagram, and more on your phone.</p>
                    </div>
                </div>
                <style>{`@media (max-width: 640px){ .mcs-grid { grid-template-columns: 1fr !important; } }`}</style>
            </div>
        </div>
    );
}
