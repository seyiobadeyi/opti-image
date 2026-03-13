import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingHero from '@/components/LandingHero';
import LandingBento from '@/components/LandingBento';
import DropZoneClient from './DropZoneClient';
import HowToUse from '@/components/HowToUse';
import FAQAccordion from '@/components/FAQAccordion';
import ScrollReveal from '@/components/ScrollReveal';
import CookieConsent from '@/components/CookieConsent';
import type { Metadata } from 'next';
import type { CampaignSlug, CampaignData } from '@/types';

export const metadata: Metadata = {
    title: 'Optimage AI | Specialized Optimization',
    description: 'AI-powered media optimization for developers, marketers, and creators.',
};

const CAMPAIGNS: Record<CampaignSlug, CampaignData> = {
    'bwai': {
        headline: 'AI Image Optimization for <span style="background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;">Faster Websites.</span><br />Try Optimage live at Build With AI.',
        subtext: 'Upload an image now to see live compression, performance stats, and the AI optimization engine in action. Special access for Build With AI attendees.',
        title: 'Optimage at Build With AI | Live Demo'
    },
    'seo': {
        headline: 'Improve LCP and PageSpeed <span style="background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;">Instantly.</span><br />Stop letting images kill your ranking.',
        subtext: 'Automatically compress images by up to 80% with zero visible quality loss. Built specifically for technical SEO professionals and marketers.',
        title: 'SEO Image Optimizer | Improve Core Web Vitals | Optimage'
    },
    'marketers': {
        headline: 'Faster Pages. Higher Conversions. <span style="background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;">Better ROI.</span>',
        subtext: 'Don\'t let slow images bounce your ad traffic. Optimize your entire visual catalog in seconds without losing brand quality.',
        title: 'Image Optimization for Marketers | Maximize Conversions | Optimage'
    },
    'wordpress': {
        headline: 'The Ultimate Image Optimizer for <span style="background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;">WordPress.</span>',
        subtext: 'Pre-optimize your media library assets before you upload. Next-gen WebP & AVIF formats ready for your theme.',
        title: 'WordPress Image Optimizer | Next-Gen Formats | Optimage'
    },
    'shopify': {
        headline: 'Lightning Fast Stores. <span style="background: var(--gradient-primary); -webkit-background-clip: text; color: transparent;">More Sales.</span>',
        subtext: 'Heavy product catalogs slow down Shopify checkouts. Batch compress your entire product feed locally before uploading to your CDN.',
        title: 'Shopify Image Optimizer | Faster Catalogs | Optimage'
    }
};

interface CampaignPageProps {
    params: Promise<{ campaign: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps): Promise<React.JSX.Element> {
    const { campaign } = await params;

    const campaignData = CAMPAIGNS[campaign.toLowerCase() as CampaignSlug];

    if (!campaignData) {
        notFound();
    }

    return (
        <>
            <Header />

            <main className="app-container">
                <LandingHero
                    customHeadline={campaignData.headline}
                    customSubtext={campaignData.subtext}
                />

                {/* We use a Client Component wrapper for the complex stateful Dropzone logic */}
                <DropZoneClient />

                <ScrollReveal>
                    <HowToUse />
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <LandingBento />
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <FAQAccordion />
                </ScrollReveal>
            </main>

            <Footer />
            <CookieConsent />
        </>
    );
}
