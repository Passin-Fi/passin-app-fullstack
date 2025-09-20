import React from 'react';

interface Props {
    size?: number; // pixel size
    className?: string;
}

export default function ErrorAnimationIcon({ size = 96, className }: Props) {
    const px = `${size}px`;
    return (
        <div className={['relative mx-auto mb-6', className].filter(Boolean).join(' ')} style={{ width: px, height: px }}>
            <div className="absolute inset-0 rounded-full bg-red-200 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-pulse" />
            <svg
                className="relative z-10 text-red-500 drop-shadow"
                style={{ width: px, height: px }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" className="text-red-500/20" />
                <path d="M15 9 9 15M9 9l6 6" />
            </svg>
        </div>
    );
}
