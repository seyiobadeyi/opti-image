'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import React from 'react';

export function Tooltip({ children, content, side = 'top' }) {
    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        sideOffset={5}
                        className="tooltip-content"
                    >
                        {content}
                        <TooltipPrimitive.Arrow className="tooltip-arrow" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

export function InfoTooltip({ content }) {
    return (
        <Tooltip content={content}>
            <span style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
                <Info size={14} color="var(--text-muted)" style={{ marginLeft: '6px' }} />
            </span>
        </Tooltip>
    );
}
