import React from 'react';

interface Props {
    size?: number; // pixel size (width = height)
    className?: string;
}

export default function SuccessAnimationIcon({ size = 96, className }: Props) {
    const px = `${size}px`;
    return (
        <div className={['relative mx-auto mb-6', className].filter(Boolean).join(' ')} style={{ width: px, height: px }}>
            <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-pulse" />
            <svg
                className="relative z-10 text-emerald-500 drop-shadow"
                style={{ width: px, height: px }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" className="text-emerald-500/20" />
                <path d="m8 12 3 3 5-6" />
            </svg>
        </div>
    );
}
