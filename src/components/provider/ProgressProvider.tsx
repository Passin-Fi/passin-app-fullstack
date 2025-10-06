'use client';
import React from 'react';
import { ProgressProvider as BProgress } from '@bprogress/next/app';

export default function ProgressProvider({ children }: { children: React.ReactNode }) {
    return (
        <BProgress height="2px" color="#C7FE62" options={{ showSpinner: false }} startOnLoad>
            {children}
        </BProgress>
    );
}
