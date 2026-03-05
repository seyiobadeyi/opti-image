'use client';

export default function AdBanner({ slot, format, style }) {
    // Placeholder component for Google AdSense
    // Once you have an approved AdSense account, replace the content below
    // with actual ad unit code from your AdSense dashboard
    //
    // Example real implementation:
    // <ins className="adsbygoogle"
    //   style={{ display: 'block' }}
    //   data-ad-client="ca-pub-XXXXXXXXXX"
    //   data-ad-slot={slot}
    //   data-ad-format={format || 'auto'}
    //   data-full-width-responsive="true"
    // />

    return (
        <div
            className="ad-banner"
            style={style}
            data-ad-slot={slot}
            data-ad-format={format || 'auto'}
        >
            <span>Ad Space • {slot || 'Banner'}</span>
        </div>
    );
}
