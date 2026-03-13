'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ScrollRevealProps, ScrollDirection } from '@/types';

const directionOffsets: Record<ScrollDirection, { x: number; y: number }> = {
    up: { x: 0, y: 24 },
    down: { x: 0, y: -24 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
};

export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    className,
}: ScrollRevealProps): React.JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const offset = directionOffsets[direction];

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, x: offset.x, y: offset.y }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}
