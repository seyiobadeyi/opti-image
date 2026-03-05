'use client';

import { useState } from 'react';
import { Key, Shield, Plus, Trash2, Clock } from 'lucide-react';
import { generateBypassCode, deactivateBypassCode } from './actions';

export default function AdminClient({ bypassCodes }) {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const res = await generateBypassCode();
        if (!res.success) {
            alert('Error generating code: ' + res.error);
        }
        setLoading(false);
    };

    const handleDeactivate = async (id) => {
        const res = await deactivateBypassCode(id);
        if (!res.success) {
            alert('Error deactivating code: ' + res.error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const isExpired = (expiresAt) => {
        return new Date(expiresAt) < new Date();
    };

    return (
        <div className="admin-wrapper">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={32} color="var(--accent-primary)" /> Admin Panel
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Generate bypass codes for temporary 1-hour access.</p>

            <div className="panel" style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
                        <Key size={24} /> Bypass Codes
                    </h2>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={16} /> {loading ? 'Generating...' : 'Generate New Code'}
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>Code</th>
                                <th style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>Expires At</th>
                                <th style={{ padding: '16px 8px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bypassCodes?.map((code) => {
                                const expired = isExpired(code.expires_at);
                                const active = code.is_active && !expired;

                                return (
                                    <tr key={code.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '16px 8px', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                            {code.code}
                                        </td>
                                        <td style={{ padding: '16px 8px' }}>
                                            {active ? (
                                                <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, padding: '4px 8px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '4px' }}>ACTIVE</span>
                                            ) : expired ? (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>EXPIRED</span>
                                            ) : (
                                                <span style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: 600, padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>INACTIVE</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 8px', color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={14} /> {formatDate(code.expires_at)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                            {code.is_active && (
                                                <button
                                                    onClick={() => handleDeactivate(code.id)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <Trash2 size={14} /> Deactivate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {!bypassCodes?.length && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                        No bypass codes generated yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
