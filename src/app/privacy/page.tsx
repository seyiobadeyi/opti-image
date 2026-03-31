import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Optimage',
    description: 'Privacy Policy for Optimage bulk image optimizer and converter.',
};

export default function PrivacyPage(): React.JSX.Element {
    return (
        <>
            <Header />
            <div className="legal-page">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last updated: March 2026</p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to Optimage (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), a service operated by Dream Intrepid Ltd. We are committed to protecting your privacy and ensuring your data is handled in compliance with the General Data Protection Regulation (GDPR) and the Nigeria Data Protection Regulation (NDPR).
                </p>

                <h2>2. Data Controller vs. Data Processor</h2>
                <p>
                    <strong>When you use our Image Compression or AI Media tools:</strong> We act as the Data Controller for your account information and the direct usage data generated.
                </p>
                <p>
                    <strong>When you use our Client Gallery Delivery:</strong> You (the photographer/creator) are the Data Controller for the media you upload and the email addresses of the clients you share galleries with. Optimage acts solely as a Data Processor. We do not use, sell, or independently contact your clients.
                </p>

                <h2>3. Information We Collect</h2>
                <ul>
                    <li><strong>Account Information:</strong> Name, email address, and authentication data when you register.</li>
                    <li><strong>Ephemeral Processing Data (Compression & AI):</strong> Files uploaded for standard optimization or AI transcription are processed on edge nodes. Processed files are automatically purged from our servers within 30 minutes. We do NOT use your uploads to train any AI models.</li>
                    <li><strong>Persistent Gallery Data:</strong> Media uploaded to Client Galleries is securely stored via Supabase and Cloudinary until you delete the gallery or the gallery expires.</li>
                    <li><strong>Payment Information:</strong> We do not store full credit card details. Subscriptions and payments are securely processed by Paystack (our sub-processor).</li>
                    <li><strong>Usage & Analytics:</strong> Anonymized telemetry regarding file sizes, processing times, and feature usage to maintain platform health.</li>
                </ul>

                <h2>4. Third-Party Sub-Processors</h2>
                <p>To provide our services, we utilize industry-standard sub-processors, binding them to strict data processing agreements:</p>
                <ul>
                    <li><strong>Supabase:</strong> Database and authentication services.</li>
                    <li><strong>Cloudinary:</strong> Content Delivery Network (CDN) and secure media storage for active galleries.</li>
                    <li><strong>Paystack:</strong> Secure payment processing.</li>
                    <li><strong>OpenAI:</strong> Strict zero-retention API processing for audio/video transcription.</li>
                </ul>

                <h2>5. Your NDPR & GDPR Rights</h2>
                <p>Under applicable data protection laws, you possess the right to:</p>
                <ul>
                    <li><strong>Right of Access & Portability:</strong> Request a copy of the personal data we hold about you.</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data via your dashboard.</li>
                    <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request immediate deletion of your account and all associated persistent gallery data.</li>
                    <li><strong>Right to Restrict Processing:</strong> Pause the use of your data for specific operations.</li>
                </ul>
                <p>To exercise any of these rights, contact us using the details below. We will respond within 30 days.</p>

                <h2>6. Data Security</h2>
                <p>
                    We implement strict access controls, row-level security (RLS) policies, and encryption at rest to protect your data. PIN-protected client galleries use cryptographic hashing to ensure unauthorized parties cannot access your protected work.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    For privacy inquiries or to exercise your rights, please contact our Data Protection Officer at{' '}
                    <a href="mailto:privacy@dreamintrepid.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>privacy@dreamintrepid.com</a>.
                </p>
            </div>
            <Footer />
        </>
    );
}
