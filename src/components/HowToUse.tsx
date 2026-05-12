'use client';

import React from 'react';
import { Image as ImageIcon, Video, Download } from 'lucide-react';

export default function HowToUse(): React.JSX.Element {
    return (
        <section className="how-to-use" style={{ margin: '40px 0', padding: '32px', background: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.8rem', color: '#111827' }}>How Optimage Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#db5a42' }}>
                        <ImageIcon size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>1. Upload Media</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5' }}>Drag and drop up to 50 images, or a single large Video/Audio file into the dropzone.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#db5a42' }}>
                        <Video size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>2. Configure</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5' }}>Toggle the settings. Choose WebP for the smallest file sizes. <span style={{ color: '#db5a42', fontWeight: 600 }}>(Video AI Coming Soon)</span></p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <img src="/logo.png" alt="Process" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>3. Process</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5' }}>Our servers rapidly compress your images or utilize OpenAI to process your media.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#16a34a' }}>
                        <Download size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>4. Download</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5' }}>Get your high-quality optimizations instantly as individual files or a bulk ZIP.</p>
                </div>
            </div>
        </section>
    );
}
