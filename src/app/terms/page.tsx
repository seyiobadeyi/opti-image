import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service — Optimage',
    description: 'Terms of Service for Optimage bulk image optimizer and converter.',
};

export default function TermsPage(): React.JSX.Element {
    return (
        <>
            <Header />
            <div className="legal-page">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last updated: March 2026</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By using Optimage by Dream Intrepid Ltd (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service.
                    If you do not agree, please do not use the Service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                    Optimage provides a free online tool for compressing, converting, and optimizing images.
                    The Service supports various image formats including JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, and BMP.
                </p>

                <h2>3. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                    <li>Upload illegal, harmful, or offensive content</li>
                    <li>Attempt to overload, disrupt, or abuse the Service</li>
                    <li>Use automated tools or scripts to excessively use the Service</li>
                    <li>Circumvent any rate limiting or security measures</li>
                    <li>Use the Service for any unlawful purpose</li>
                </ul>

                <h2>4. Intellectual Property</h2>
                <p>
                    You retain all rights to the images you upload. We do not claim ownership of any content
                    you process through our Service. We do not store your images beyond the temporary processing period.
                </p>

                <h2>5. Limitations</h2>
                <ul>
                    <li>Maximum file size: 100MB per file</li>
                    <li>Maximum files per batch: 50 files</li>
                    <li>Processed files are available for download for 30 minutes</li>
                    <li>Service is provided on an &ldquo;as is&rdquo; basis without warranties</li>
                </ul>

                <h2>6. Disclaimer</h2>
                <p>
                    The Service is provided &ldquo;as is&rdquo; without warranty of any kind. We are not responsible
                    for any loss of data, quality degradation, or damages resulting from the use of this Service.
                    Always keep a backup of your original images.
                </p>

                <h2>7. Rate Limiting</h2>
                <p>
                    To ensure fair usage for all users, we enforce rate limits on the number of requests
                    per time period. Excessive usage may result in temporary restrictions.
                </p>

                <h2>8. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these Terms at any time. Continued use of the Service
                    after changes constitutes acceptance of the modified Terms.
                </p>

                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at{' '}
                    <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--primary)' }}>optimage@dreamintrepid.com</a>.
                </p>
            </div>
            <Footer />
        </>
    );
}
