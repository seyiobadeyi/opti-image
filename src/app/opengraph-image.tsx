import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

// Default OG card for the homepage and any page without its own opengraph-image.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Optimage — free image tools';

export default function Image() {
    return renderOgImage({
        title: 'Free image tools that don’t charge you.',
        eyebrow: 'Compress · Convert · Resize · Deliver',
    });
}
