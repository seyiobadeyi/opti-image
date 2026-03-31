import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Optimage',
    description: 'Terms of Service for Optimage — a product of Dream Intrepid Ltd. Covers image optimisation, video processing, gallery delivery, subscriptions, and acceptable use.',
};

export default function TermsPage(): React.JSX.Element {
    return (
        <>
            <Header />
            <main style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) 24px' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Terms of Service
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '48px' }}>
                    Effective date: 1 April 2026. These terms govern your use of Optimage, a product of Dream Intrepid Ltd.
                </p>

                {/* ── 1 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        1. About Optimage
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Optimage is a web-based media platform operated by Dream Intrepid Ltd, a company incorporated in Nigeria
                        (&ldquo;Dream Intrepid&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). Optimage provides image optimisation,
                        video processing, transcription, and a gallery delivery platform for photographers and content creators.
                        By accessing or using any part of the service, you (&ldquo;you&rdquo; or &ldquo;the user&rdquo;) agree to be bound by these Terms.
                        If you do not agree, you must not use the service.
                    </p>
                </section>

                {/* ── 2 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        2. Who May Use This Service
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        You must be at least 18 years of age, or the age of majority in your jurisdiction, to create an account or
                        use subscription features. Guest use of the basic image optimisation tool is available without an account.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        By using the service, you represent and warrant that you have the legal capacity to enter into these Terms
                        and that your use will comply with all applicable laws.
                    </p>
                </section>

                {/* ── 3 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        3. Description of Services
                    </h2>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        3.1 Image Optimisation and Conversion
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Optimage provides tools to compress, resize, rotate, convert, and enhance images in formats including
                        JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, and BMP. Temporary processing files are stored for a limited
                        period as described under Data Retention (Section 9). We do not claim ownership of any images you upload.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        3.2 Video Processing and Transcription
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Registered subscribers may upload video files for compression, format conversion, and AI-assisted
                        transcription. Video processing is resource-intensive and subject to file size and duration limits
                        defined in the subscription plan. We do not permanently store your video files beyond the processing period.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        3.3 Gallery Delivery Platform
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        The gallery delivery feature allows photographers (&ldquo;Gallery Owners&rdquo;) to upload, store, and share
                        photographic content with designated clients and recipients (&ldquo;Viewers&rdquo;). Gallery Owners are solely
                        responsible for the content they upload and the individuals to whom they share access. Dream Intrepid Ltd
                        acts as a platform provider and does not review, endorse, or take responsibility for gallery content.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Gallery features include PIN-protected access, account-gated access, optional download permissions,
                        payment instruction display, and a client favourite-selection tool.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        3.4 Subscription Services
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Certain features — including video processing, bulk image processing beyond free limits, gallery creation,
                        and hosted image storage — require an active paid subscription. The features available at each subscription
                        tier are described on the Pricing page, which may be updated from time to time.
                    </p>
                </section>

                {/* ── 4 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        4. User Accounts
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        To access subscription features, you must create an account. You are responsible for maintaining the
                        confidentiality of your account credentials and for all activity that occurs under your account.
                        You must notify us immediately at{' '}
                        <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                            optimage@dreamintrepid.com
                        </a>{' '}
                        if you suspect unauthorised access.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent
                        activity, or are found to be used for harmful purposes. You may delete your account at any time by
                        contacting us, subject to the data retention provisions in Section 9.
                    </p>
                </section>

                {/* ── 5 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        5. Gallery Platform — Specific Terms
                    </h2>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        5.1 Gallery Creation and Content
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Gallery Owners may upload photographs and other image files to create client galleries. By uploading
                        content, you represent and warrant that: (a) you own or have the necessary rights and licences to
                        the content; (b) the content does not infringe any third-party intellectual property, privacy, or
                        moral rights; and (c) the content complies with Section 6 (Acceptable Use) of these Terms.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        We reserve the right to remove any gallery content that violates these Terms without prior notice.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        5.2 Client Data and Email Addresses
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        When a Gallery Owner uses the &ldquo;Send to client&rdquo; feature, they provide the email address of their
                        client. This email address is stored on our platform and used solely to: (a) deliver the gallery
                        invitation email; (b) send gallery status notifications (such as when a gallery goes live or expires);
                        (c) display the email address in the Gallery Owner&rsquo;s activity log.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        We do not use client email addresses for marketing. Gallery Owners are responsible for having
                        appropriate authorisation to share their clients&rsquo; email addresses with us and for complying
                        with applicable data protection laws, including the Nigeria Data Protection Regulation (NDPR)
                        and, where applicable, the GDPR.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        5.3 Gallery Access and Permissions
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Gallery Owners may configure their galleries as public (accessible to anyone with the link),
                        PIN-protected (requiring a code to enter), or account-gated (requiring a free Optimage account).
                        Gallery Owners are solely responsible for the security of any access credentials they choose to
                        share with third parties. We are not liable for unauthorised access resulting from credentials
                        shared by the Gallery Owner.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        5.4 Payment Instructions
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        The platform provides a facility for Gallery Owners to display payment instructions to their clients
                        (such as bank transfer details). Dream Intrepid Ltd does not process, facilitate, or verify any
                        payments between Gallery Owners and their clients. We have no visibility into whether any payment
                        has been made.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        The &ldquo;Confirm payment received&rdquo; function is a manual acknowledgement by the Gallery Owner
                        only — it does not constitute payment verification by us. All payment disputes are strictly between
                        the Gallery Owner and their client. Dream Intrepid Ltd bears no responsibility for failed, disputed,
                        or fraudulent payments.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        5.5 Gallery Expiry and Deletion
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Gallery content is retained for as long as the gallery exists in the system. When a gallery is
                        deleted by the owner, or when the associated subscription expires and is not renewed after a grace
                        period of 30 days, gallery content is queued for permanent deletion from our storage provider.
                        We do not guarantee the preservation of gallery content after deletion. Gallery Owners are solely
                        responsible for retaining local copies of their uploaded content.
                    </p>
                </section>

                {/* ── 6 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        6. Acceptable Use
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        You agree not to use the service to:
                    </p>
                    <ul style={{ lineHeight: 1.75, color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                        <li style={{ marginBottom: '8px' }}>Upload, store, or distribute illegal, harmful, harassing, defamatory, obscene, or offensive content</li>
                        <li style={{ marginBottom: '8px' }}>Infringe the intellectual property, privacy, or other rights of any third party</li>
                        <li style={{ marginBottom: '8px' }}>Upload non-consensual intimate imagery or content involving minors</li>
                        <li style={{ marginBottom: '8px' }}>Attempt to gain unauthorised access to any gallery, account, or system component</li>
                        <li style={{ marginBottom: '8px' }}>Use automated scripts, bots, or crawlers to excessively use or scrape the service</li>
                        <li style={{ marginBottom: '8px' }}>Circumvent rate limiting, authentication, or security measures</li>
                        <li style={{ marginBottom: '8px' }}>Use the service for any unlawful purpose or in violation of any applicable regulation</li>
                        <li style={{ marginBottom: '8px' }}>Misrepresent your identity or affiliation when using the platform</li>
                    </ul>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginTop: '14px' }}>
                        Violation of this section may result in immediate suspension or termination of your account without
                        refund, and may be reported to the relevant authorities.
                    </p>
                </section>

                {/* ── 7 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        7. Intellectual Property
                    </h2>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        7.1 Your Content
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        You retain all intellectual property rights in the content you upload to Optimage. By uploading content,
                        you grant Dream Intrepid Ltd a limited, non-exclusive, royalty-free licence to store, display, and
                        process your content solely for the purpose of providing the service to you. This licence terminates
                        when your content is deleted from our systems.
                    </p>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', marginTop: '20px', color: 'var(--text-primary)' }}>
                        7.2 Our Platform
                    </h3>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        The Optimage platform, including its software, design, trademarks, logos, and all associated
                        intellectual property, is owned by Dream Intrepid Ltd. You may not copy, modify, distribute,
                        reverse-engineer, or create derivative works from any part of the platform without our express
                        written consent.
                    </p>
                </section>

                {/* ── 8 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        8. Subscription and Payment
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Subscription fees are charged in advance for the applicable billing period. All fees are non-refundable
                        except where required by applicable law. Prices may change at any time; we will provide reasonable notice
                        of any changes affecting existing subscribers.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        If a payment fails or is not received, we reserve the right to suspend or downgrade your account.
                        To cancel your subscription, contact us at{' '}
                        <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                            optimage@dreamintrepid.com
                        </a>{' '}
                        or manage it through your payment provider. Cancellation takes effect at the end of the current
                        billing period.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Referral credits and promotional discounts are subject to the specific terms communicated at the
                        time of issue and are not redeemable for cash.
                    </p>
                </section>

                {/* ── 9 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        9. Data Retention
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Temporarily processed images (uploaded via the basic optimisation tool) are stored for a short window
                        to allow downloading and are then automatically purged. Hosted images associated with processing history
                        are retained for as long as your account is active. Gallery images are retained as described in
                        Section 5.5.
                    </p>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        Account data (email address, processing history, subscription records) is retained for as long as your
                        account exists and for a reasonable period thereafter to comply with legal or audit obligations. You may
                        request deletion of your personal data by contacting{' '}
                        <a href="mailto:privacy@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                            privacy@dreamintrepid.com
                        </a>.
                    </p>
                </section>

                {/* ── 10 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        10. Limitation of Liability
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, whether express
                        or implied. To the fullest extent permitted by law, Dream Intrepid Ltd shall not be liable for:
                    </p>
                    <ul style={{ lineHeight: 1.75, color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                        <li style={{ marginBottom: '8px' }}>Loss of gallery content due to deletion, storage failure, or account termination</li>
                        <li style={{ marginBottom: '8px' }}>Loss of business, revenue, or client relationships arising from gallery unavailability</li>
                        <li style={{ marginBottom: '8px' }}>Unauthorised access to a gallery where the Gallery Owner has shared access credentials</li>
                        <li style={{ marginBottom: '8px' }}>Any indirect, consequential, incidental, special, or punitive damages</li>
                        <li style={{ marginBottom: '8px' }}>Loss of data arising from processing, compression, or conversion errors</li>
                        <li style={{ marginBottom: '8px' }}>Service interruptions caused by maintenance, infrastructure failures, or events outside our control</li>
                    </ul>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginTop: '14px' }}>
                        Where liability cannot be fully excluded by law, our total aggregate liability to you shall not
                        exceed the amount you paid us in the three months preceding the event giving rise to the claim.
                    </p>
                </section>

                {/* ── 11 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        11. Indemnification
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        You agree to indemnify, defend, and hold harmless Dream Intrepid Ltd, its officers, employees, and
                        agents from and against any claims, losses, damages, liabilities, costs, and expenses (including
                        reasonable legal fees) arising from: (a) your use of the service; (b) your violation of these Terms;
                        (c) content you upload or share via the platform; or (d) your breach of any applicable law or the
                        rights of any third party.
                    </p>
                </section>

                {/* ── 12 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        12. Service Availability
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        We aim to maintain high availability but do not guarantee uninterrupted access. Scheduled maintenance,
                        updates, and events beyond our reasonable control (including infrastructure provider outages, force
                        majeure events, and denial-of-service attacks) may cause temporary unavailability. We are not liable
                        for service interruptions. We reserve the right to modify, suspend, or discontinue any feature or
                        the entire service at any time, with reasonable notice where practicable.
                    </p>
                </section>

                {/* ── 13 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        13. Governing Law
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
                        Any disputes arising from or relating to these Terms or the service shall be subject to the exclusive
                        jurisdiction of the courts of Nigeria. If you are accessing the service from outside Nigeria, you
                        remain responsible for compliance with local laws applicable to your use.
                    </p>
                </section>

                {/* ── 14 ── */}
                <section style={{ marginBottom: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        14. Changes to These Terms
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                        We may update these Terms from time to time. When we make material changes, we will update the
                        effective date at the top of this page and, where appropriate, notify registered users by email.
                        Your continued use of the service after any change constitutes your acceptance of the revised Terms.
                        If you do not agree to the revised Terms, you must stop using the service and may request account
                        deletion.
                    </p>
                </section>

                {/* ── 15 ── */}
                <section style={{ marginBottom: '60px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        15. Contact
                    </h2>
                    <p style={{ lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        If you have any questions about these Terms or your rights under them, please contact us:
                    </p>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px 24px', border: '1px solid var(--border)' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-primary)' }}>Dream Intrepid Ltd</p>
                        <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            General enquiries:{' '}
                            <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                                optimage@dreamintrepid.com
                            </a>
                        </p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Privacy and data requests:{' '}
                            <a href="mailto:privacy@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                                privacy@dreamintrepid.com
                            </a>
                        </p>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
