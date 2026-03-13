'use client';

import React from 'react';
import type { ProgressTrackerProps } from '@/types';

export default function ProgressTracker({ processed, total }: ProgressTrackerProps): React.JSX.Element {
    const percent: number = total > 0 ? Math.round((processed / total) * 100) : 0;

    return (
        <div className="progress-section">
            <div className="progress-header">
                <h3>🔄 Processing...</h3>
                <span className="progress-status">
                    {processed} / {total} files • {percent}%
                </span>
            </div>
            <div className="progress-bar-wrapper">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}
