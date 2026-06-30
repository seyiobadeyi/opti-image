import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Optimage — free client photo gallery delivery';

export default function Image() {
    return renderOgImage({
        title: 'Your clients deserve a gallery, not a link.',
        eyebrow: 'Free Client Gallery Delivery',
    });
}
