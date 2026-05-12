import type { Metadata } from 'next';
import PricingPage from './PricingPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Pricing | Optimage',
    description: 'One simple plan. Every image format, bulk processing, video compression, AI transcription, and more.',
    openGraph: {
        title: 'Optimage Pricing: Simple, Transparent',
        description: 'No seat limits, no per-file fees. Everything included in one plan.',
        url: 'https://optimage.dreamintrepid.com/pricing',
    },
};

export default function Page() {
    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <Header />
            <PricingPage />
            <Footer />
        </div>
    );
}
