'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export default function PricingTiers(): React.JSX.Element {
    const tiers = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for casual users who just need basic image optimization.',
            features: [
                { text: '5 MB max per file', included: true },
                { text: '5 images per batch', included: true },
                { text: 'Image Format Conversion', included: true },
                { text: 'Basic Compression', included: true },
                { text: 'Audio Extraction', included: false },
                { text: 'AI Transcription', included: false },
            ],
            buttonText: 'Get Started Free',
            buttonClass: 'btn-secondary',
            popular: false
        },
        {
            name: 'Pro',
            price: '$9',
            period: '/mo',
            description: 'Ideal for web designers and shopify store owners.',
            features: [
                { text: '50 MB max per file', included: true },
                { text: '50 images per batch', included: true },
                { text: 'Image Format Conversion', included: true },
                { text: 'Advanced Compression', included: true },
                { text: 'Audio Extraction from Video', included: true },
                { text: '60 mins AI Transcription/mo', included: true },
            ],
            buttonText: 'Start Pro Trial',
            buttonClass: 'btn-primary',
            popular: true
        },
        {
            name: 'Ultra',
            price: '$29',
            period: '/mo',
            description: 'For video editors, podcasters, and high-volume agencies.',
            features: [
                { text: '200 MB max per file', included: true },
                { text: '100 images per batch', included: true },
                { text: 'Image Format Conversion', included: true },
                { text: 'Advanced Compression', included: true },
                { text: 'Audio Extraction from Video', included: true },
                { text: '500 mins AI Transcription/mo', included: true },
            ],
            buttonText: 'Go Ultra',
            buttonClass: 'btn-secondary',
            popular: false
        }
    ];

    return (
        <section id="pricing" className="pricing-section" style={{ margin: '80px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Choose the perfect plan for your media optimization needs. Upgrade, downgrade, or cancel anytime.
                </p>
            </div>

            <div className="pricing-grid">
                {tiers.map((tier, index) => (
                    <div key={index} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
                        {tier.popular && <div className="popular-badge"><img src="/logo.png" alt="Popular" style={{ height: '0.9rem', width: 'auto', objectFit: 'contain', marginRight: '4px' }} /> Most Popular</div>}

                        <div className="pricing-header">
                            <h3>{tier.name}</h3>
                            <div className="price">
                                <span className="amount">{tier.price}</span>
                                {tier.period && <span className="period">{tier.period}</span>}
                            </div>
                            <p className="description">{tier.description}</p>
                        </div>

                        <ul className="pricing-features">
                            {tier.features.map((feature, fIndex) => (
                                <li key={fIndex} className={feature.included ? 'included' : 'excluded'}>
                                    {feature.included ? <Check size={18} className="icon-check" /> : <X size={18} className="icon-x" />}
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pricing-footer">
                            <button className={`btn ${tier.buttonClass}`} style={{ width: '100%' }}>
                                {tier.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
