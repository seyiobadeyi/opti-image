import type { Metadata } from 'next';
import PricingPage from './PricingPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Free Image Tools | Optimage',
    description: 'Optimage is 100% free. Compress, convert, resize, and enhance images with no limits, no paywalls, and no account required.',
    openGraph: {
        title: 'Optimage: Free Image Tools, No Paywalls',
        description: 'Every tool is free for everyone. No account required to start.',
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
