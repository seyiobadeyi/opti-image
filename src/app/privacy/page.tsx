import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy — Optimage',
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
                    Welcome to Optimage by Dream Intrepid Ltd (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). This Privacy Policy explains how we collect, use,
                    and protect your information when you use our image optimization service.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We collect minimal information to provide our service:</p>
                <ul>
                    <li><strong>Images you upload:</strong> We temporarily store your uploaded images only for the duration of processing. All images are automatically deleted within 30 minutes after processing.</li>
                    <li><strong>Usage data:</strong> We may collect anonymized usage statistics such as the number of images processed, file sizes, and conversion formats to improve our service.</li>
                    <li><strong>Cookies:</strong> We use cookies for essential site functionality and, with your consent, for advertising purposes through Google AdSense.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <ul>
                    <li>To process and optimize your images as requested</li>
                    <li>To improve our service and user experience</li>
                    <li>To display relevant advertisements through Google AdSense</li>
                    <li>To monitor and prevent abuse of our service</li>
                </ul>

                <h2>4. Data Retention</h2>
                <p>
                    Uploaded and processed images are stored temporarily and are automatically deleted within 30 minutes.
                    We do not permanently store any of your images.
                </p>

                <h2>5. Third-Party Services</h2>
                <p>We may use the following third-party services:</p>
                <ul>
                    <li><strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies to serve ads based on your prior visits.</li>
                    <li><strong>Google Analytics:</strong> For anonymized usage analytics to understand how our service is used.</li>
                </ul>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Decline non-essential cookies via the cookie consent banner</li>
                    <li>Request information about data we may hold about you</li>
                    <li>Request deletion of any data associated with you</li>
                </ul>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--primary)' }}>optimage@dreamintrepid.com</a>.
                </p>
            </div>
            <Footer />
        </>
    );
}
