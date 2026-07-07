'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, Share2, Check, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { c } from '@/lib/colors';
import { apiClient } from '@/lib/api';

interface GalleryMessage {
    id: string;
    guest_name: string;
    message: string;
    created_at: string;
}

interface Props {
    galleryId: string;
    photos: string[];          // gallery display_urls, for photo backgrounds
    galleryTitle: string;
    onClose: () => void;
}

type Template = 'single' | 'wall';
type Format = 'story' | 'square';
type Bg = 'brand' | 'photo';

const ACCENT = '#db5a42';
const PAGE_SIZE = 40;
const WALL_MAX: Record<Format, number> = { story: 5, square: 3 };
const DIMENSIONS: Record<Format, { w: number; h: number }> = {
    story: { w: 1080, h: 1920 },
    square: { w: 1080, h: 1080 },
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
        else line = test;
    }
    if (line) lines.push(line);
    return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
}

export default function MessageCardStudio({ galleryId, photos, galleryTitle, onClose }: Props): React.JSX.Element {
    // Server-backed message list (paginated + searchable — scales past 200).
    const [list, setList] = useState<GalleryMessage[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Selection is kept as full objects so picks survive search + pagination.
    const [selected, setSelected] = useState<GalleryMessage[]>([]);
    const [edits, setEdits] = useState<Record<string, { text?: string; name?: string }>>({});

    const [template, setTemplate] = useState<Template>('single');
    const [format, setFormat] = useState<Format>('story');
    const [bg, setBg] = useState<Bg>('brand');
    const [photoUrl, setPhotoUrl] = useState<string | null>(photos[0] ?? null);
    const [sharing, setSharing] = useState(false);
    const [feedback, setFeedback] = useState<'idle' | 'saved' | 'copied'>('idle');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const didInit = useRef(false);

    const resolveText = (m: GalleryMessage) => (edits[m.id]?.text ?? m.message);
    const resolveName = (m: GalleryMessage) => (edits[m.id]?.name ?? m.guest_name);
    const isSelected = (id: string) => selected.some(m => m.id === id);
    const first = selected[0];

    // ── Fetch (debounced on search) ──
    const fetchPage = useCallback(async (pageNum: number, q: string, append: boolean) => {
        setLoading(true);
        try {
            const res = await apiClient.getGalleryMessages(galleryId, { page: pageNum, limit: PAGE_SIZE, search: q });
            setList(prev => append ? [...prev, ...res.messages] : res.messages);
            setTotal(res.total);
            setHasMore(res.hasMore);
            setPage(pageNum);
            // Auto-select the newest message on first load so there's a live preview.
            if (!didInit.current && !q && res.messages[0]) { setSelected([res.messages[0]]); didInit.current = true; }
        } catch { /* leave list as-is */ }
        finally { setLoading(false); }
    }, [galleryId]);

    useEffect(() => {
        const t = setTimeout(() => { void fetchPage(1, search, false); }, search ? 300 : 0);
        return () => clearTimeout(t);
    }, [search, fetchPage]);

    const toggle = (m: GalleryMessage) => {
        if (template === 'single') { setSelected([m]); return; }
        setSelected(prev => prev.some(x => x.id === m.id) ? prev.filter(x => x.id !== m.id) : [...prev, m]);
    };
    const move = (id: string, dir: -1 | 1) => setSelected(prev => {
        const i = prev.findIndex(m => m.id === id);
        const j = i + dir;
        const a = prev[i], b = prev[j];
        if (i < 0 || j < 0 || j >= prev.length || !a || !b) return prev;
        const next = [...prev];
        next[i] = b; next[j] = a;
        return next;
    });
    const editField = (id: string, field: 'text' | 'name', value: string) =>
        setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

    // Keep single selection to one when switching template.
    useEffect(() => { if (template === 'single') setSelected(prev => prev.slice(0, 1)); }, [template]);

    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { w, h } = DIMENSIONS[format];
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pad = Math.round(w * 0.085);

        if (bg === 'photo' && photoUrl) {
            try {
                const img = await new Promise<HTMLImageElement>((res, rej) => {
                    const i = new Image();
                    i.crossOrigin = 'anonymous';
                    i.onload = () => res(i); i.onerror = rej; i.src = photoUrl;
                });
                const scale = Math.max(w / img.width, h / img.height);
                const dw = img.width * scale, dh = img.height * scale;
                ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
                ctx.fillStyle = 'rgba(18,18,22,0.58)'; ctx.fillRect(0, 0, w, h);
            } catch { ctx.fillStyle = '#1c1c22'; ctx.fillRect(0, 0, w, h); }
        } else {
            ctx.fillStyle = template === 'wall' ? '#faece7' : ACCENT;
            ctx.fillRect(0, 0, w, h);
        }

        const onLight = bg === 'brand' && template === 'wall';
        const textColor = onLight ? '#2c2c2a' : '#ffffff';
        const mutedColor = onLight ? '#993c1d' : 'rgba(255,255,255,0.75)';

        if (template === 'single') {
            const m = selected[0];
            const text = m ? resolveText(m).trim() : '';
            const name = m ? resolveName(m).trim() : '';
            ctx.textBaseline = 'top';
            ctx.fillStyle = mutedColor;
            ctx.font = `500 ${Math.round(w * 0.026)}px system-ui, sans-serif`;
            ctx.fillText('FROM THE GUESTBOOK', pad, pad + Math.round(h * 0.02));

            // Fit the quote to the available space: shrink the font until it fits,
            // then (at the minimum size) ellipsize so it never overflows the card.
            const topY = pad + Math.round(h * 0.16);
            const availH = h - topY - Math.round(h * 0.16); // reserve for attribution + watermark
            const minSize = Math.round(w * 0.032);
            let msgSize = Math.round(w * (format === 'story' ? 0.062 : 0.056));
            let lines: string[] = [];
            let lineH = 0;
            for (;;) {
                ctx.font = `italic ${msgSize}px Georgia, serif`;
                lineH = Math.round(msgSize * 1.34);
                lines = text ? wrapLines(ctx, `“${text}”`, w - pad * 2) : ['Pick a message'];
                if (lines.length * lineH <= availH || msgSize <= minSize) break;
                msgSize -= 4;
            }
            if (lines.length * lineH > availH) {
                const maxLines = Math.max(1, Math.floor(availH / lineH));
                lines = lines.slice(0, maxLines);
                const last = lines.length - 1;
                const lastLine = lines[last];
                if (lastLine !== undefined) lines[last] = lastLine.replace(/[.,;:”"'\s]*$/, '') + '…”';
            }
            ctx.fillStyle = textColor;
            let y = topY + Math.max(0, (availH - lines.length * lineH) / 2);
            for (const ln of lines) { ctx.fillText(ln, pad, y); y += lineH; }
            if (name) {
                ctx.font = `500 ${Math.round(w * 0.036)}px system-ui, sans-serif`;
                ctx.fillStyle = mutedColor;
                ctx.fillText(`— ${name}`, pad, y + Math.round(h * 0.015));
            }
        } else {
            ctx.textBaseline = 'top';
            ctx.fillStyle = onLight ? '#712b13' : '#ffffff';
            ctx.font = `500 ${Math.round(w * 0.036)}px system-ui, sans-serif`;
            ctx.fillText(`Messages · ${galleryTitle}`.slice(0, 40), pad, pad);
            const items = selected.slice(0, WALL_MAX[format]);
            let y = pad + Math.round(h * 0.075);
            const cardW = w - pad * 2;
            const bs = Math.round(w * 0.03);
            const bottomLimit = h - Math.round(h * 0.085); // keep clear of the watermark
            for (const m of items) {
                const text = resolveText(m);
                ctx.font = `italic ${bs}px Georgia, serif`;
                const lines = wrapLines(ctx, `“${text}”`, cardW - Math.round(w * 0.08)).slice(0, 3);
                const lineH = Math.round(bs * 1.3);
                const cardH = lines.length * lineH + Math.round(w * 0.11);
                if (y + cardH > bottomLimit) break; // never overflow the card
                ctx.fillStyle = onLight ? '#ffffff' : 'rgba(255,255,255,0.10)';
                roundRect(ctx, pad, y, cardW, cardH, 22);
                let ty = y + Math.round(w * 0.035);
                ctx.fillStyle = onLight ? '#2c2c2a' : '#ffffff';
                ctx.font = `italic ${bs}px Georgia, serif`;
                for (const ln of lines) { ctx.fillText(ln, pad + Math.round(w * 0.04), ty); ty += lineH; }
                ctx.fillStyle = onLight ? '#993c1d' : 'rgba(255,255,255,0.7)';
                ctx.font = `500 ${Math.round(w * 0.024)}px system-ui, sans-serif`;
                ctx.fillText(`— ${resolveName(m)}`, pad + Math.round(w * 0.04), ty + Math.round(w * 0.005));
                y += cardH + Math.round(h * 0.018);
            }
        }

        const wmY = h - pad - Math.round(w * 0.03);
        const chipSize = Math.round(w * 0.03);
        ctx.fillStyle = ACCENT;
        roundRect(ctx, pad, wmY, chipSize, chipSize, 6);
        ctx.fillStyle = onLight ? '#993c1d' : 'rgba(255,255,255,0.85)';
        ctx.font = `500 ${Math.round(w * 0.024)}px system-ui, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText('made with Optimage', pad + chipSize + 14, wmY + chipSize / 2);
    }, [template, format, bg, photoUrl, galleryTitle, selected, edits]);

    useEffect(() => { void render(); }, [render]);

    const toBlob = (): Promise<Blob | null> =>
        new Promise(res => { const cv = canvasRef.current; if (!cv) return res(null); cv.toBlob(b => res(b), 'image/png'); });

    const flash = (state: 'saved' | 'copied') => { setFeedback(state); setTimeout(() => setFeedback('idle'), 1800); };

    const download = async () => {
        const blob = await toBlob();
        if (!blob) { alert('Couldn’t generate the image. If you used a gallery photo background, try Brand colour instead.'); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `optimage-messages-${format}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        flash('saved');
    };

    const share = async () => {
        const blob = await toBlob();
        if (!blob) { alert('Couldn’t generate the image. If you used a gallery photo background, try Brand colour instead.'); return; }
        const file = new File([blob], 'optimage-messages.png', { type: 'image/png' });
        const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
        // Mobile / supported browsers: native share sheet (WhatsApp status, IG story…).
        if (nav.canShare && nav.canShare({ files: [file] })) {
            setSharing(true);
            try { await navigator.share({ files: [file], title: 'A message from my gallery' }); } catch { /* user cancelled */ }
            setSharing(false);
            return;
        }
        // Desktop: copy the PNG to the clipboard so it can be pasted straight into
        // WhatsApp Web, Instagram, an email, etc. Falls back to a download.
        try {
            if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                flash('copied');
                return;
            }
        } catch { /* clipboard blocked — fall through */ }
        await download();
    };

    const CHIP = (active: boolean): React.CSSProperties => ({
        padding: '7px 14px', borderRadius: '9px', fontSize: '0.82rem', cursor: 'pointer',
        border: `1px solid ${active ? c.accent : c.border}`,
        background: active ? `${c.accent}12` : c.white,
        color: active ? c.accent : c.textSecondary, fontWeight: active ? 600 : 400,
    });
    const INPUT: React.CSSProperties = { width: '100%', padding: '8px 11px', borderRadius: '9px', border: `1px solid ${c.border}`, fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

    const canExport = selected.length > 0;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: c.white, borderRadius: '18px', width: '100%', maxWidth: '880px', maxHeight: '92vh', overflowY: 'auto', overflowX: 'hidden', padding: '22px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Share messages</h3>
                        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: c.textMuted }}>Turn your guestbook into a shareable card.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted }}><X size={20} /></button>
                </div>

                <div className="mcs-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,280px)', gap: '20px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Layout</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button style={CHIP(template === 'single')} onClick={() => setTemplate('single')}>Single message</button>
                                <button style={CHIP(template === 'wall')} onClick={() => setTemplate('wall')}>Message wall</button>
                            </div>
                            <p style={{ fontSize: '0.72rem', color: c.textMuted, margin: '6px 0 0' }}>
                                {template === 'single' ? 'One quote per image. Switch to Message wall to combine several messages into one image.' : 'Tick several messages below — they’ll stack into one image.'}
                            </p>
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

                        {/* Pick messages */}
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>
                                {template === 'single' ? 'Pick a message' : `Pick messages (${selected.length} selected)`}{total > 0 && <span style={{ fontWeight: 400, color: c.textMuted }}> · {total} total</span>}
                            </label>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages or names…" style={{ ...INPUT, marginBottom: '8px' }} />
                            <div style={{ maxHeight: '176px', overflowY: 'auto', border: `1px solid ${c.border}`, borderRadius: '10px' }}>
                                {loading && list.length === 0 && <p style={{ padding: '14px', margin: 0, fontSize: '0.82rem', color: c.textMuted, display: 'flex', alignItems: 'center', gap: '8px' }}><Loader2 size={14} className="mcs-spin" /> Loading…</p>}
                                {!loading && list.length === 0 && <p style={{ padding: '14px', margin: 0, fontSize: '0.82rem', color: c.textMuted }}>{search ? `No messages match “${search}”.` : 'No messages yet — they’ll appear once guests sign your gallery.'}</p>}
                                {list.map(m => {
                                    const on = isSelected(m.id);
                                    return (
                                        <button key={m.id} onClick={() => toggle(m)}
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
                                {hasMore && (
                                    <button onClick={() => void fetchPage(page + 1, search, true)} disabled={loading}
                                        style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: c.accent, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                        {loading ? 'Loading…' : 'Load more'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit selected — single: one; wall: each, with reorder */}
                        {template === 'single' && first && (
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Card text <span style={{ fontWeight: 400, color: c.textMuted }}>(trim or tidy — only affects the card)</span></label>
                                <textarea value={resolveText(first)} onChange={e => editField(first.id, 'text', e.target.value)} rows={3} style={{ ...INPUT, fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical' }} />
                                <input value={resolveName(first)} onChange={e => editField(first.id, 'name', e.target.value)} placeholder="Attribution" style={{ ...INPUT, marginTop: '6px' }} />
                            </div>
                        )}
                        {template === 'wall' && selected.length > 0 && (
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>On the card <span style={{ fontWeight: 400, color: c.textMuted }}>(first {WALL_MAX[format]} shown · edit, reorder, remove)</span></label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selected.map((m, i) => (
                                        <div key={m.id} style={{ border: `1px solid ${i < WALL_MAX[format] ? c.border : '#f0d9d0'}`, borderRadius: '10px', padding: '8px', opacity: i < WALL_MAX[format] ? 1 : 0.55 }}>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '5px' }}>
                                                <input value={resolveName(m)} onChange={e => editField(m.id, 'name', e.target.value)} style={{ ...INPUT, padding: '5px 9px', fontSize: '0.78rem', fontWeight: 600 }} />
                                                <button onClick={() => move(m.id, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '2px' }}><ArrowUp size={14} /></button>
                                                <button onClick={() => move(m.id, 1)} disabled={i === selected.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '2px' }}><ArrowDown size={14} /></button>
                                                <button onClick={() => setSelected(prev => prev.filter(x => x.id !== m.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, padding: '2px' }}><X size={14} /></button>
                                            </div>
                                            <textarea value={resolveText(m)} onChange={e => editField(m.id, 'text', e.target.value)} rows={2} style={{ ...INPUT, fontSize: '0.8rem', lineHeight: 1.4, resize: 'vertical' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div className="mcs-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'sticky', top: 0 }}>
                        <div style={{ background: c.bgMuted, borderRadius: '14px', padding: '12px', display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <canvas ref={canvasRef} style={{ width: format === 'story' ? '190px' : '260px', maxWidth: '100%', height: 'auto', borderRadius: '10px', display: 'block' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <button onClick={() => void share()} disabled={!canExport || sharing}
                                style={{ flex: 1, padding: '11px', borderRadius: '11px', border: 'none', background: c.accent, color: '#fff', fontWeight: 600, fontSize: '0.88rem', cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', opacity: canExport ? 1 : 0.5 }}>
                                {feedback === 'copied' ? <><Check size={15} /> Copied!</> : <><Share2 size={15} /> {sharing ? 'Sharing…' : 'Share'}</>}
                            </button>
                            <button onClick={() => void download()} disabled={!canExport}
                                style={{ padding: '11px 14px', borderRadius: '11px', border: `1px solid ${c.border}`, background: c.white, color: c.text, fontWeight: 600, fontSize: '0.88rem', cursor: canExport ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '7px', opacity: canExport ? 1 : 0.5 }}>
                                {feedback === 'saved' ? <><Check size={15} /> Saved!</> : <><Download size={15} /> Save</>}
                            </button>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: c.textMuted, textAlign: 'center', margin: 0 }}>On your phone, Share opens WhatsApp status, Instagram and more. On desktop it copies the image so you can paste it anywhere; Save downloads the PNG.</p>
                    </div>
                </div>
                <style>{`.mcs-spin{animation:mcsspin 1s linear infinite}@keyframes mcsspin{to{transform:rotate(360deg)}}@media (max-width:720px){.mcs-grid{grid-template-columns:1fr !important}.mcs-preview{position:static !important;order:-1}}`}</style>
            </div>
        </div>
    );
}
