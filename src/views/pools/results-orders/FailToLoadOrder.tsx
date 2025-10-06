'use client';
import React from 'react';
import { Button } from 'shadcn/button';
import ErrorAnimationIcon from 'src/components/icons/ErrorAnimationIcon';

export default function FailToLoadOrder({ error }: { error?: string }) {
    return (
        <div className="py-10">
            <ErrorAnimationIcon />
            <h2 className="text-center text-xl font-semibold mb-2">The order cannot be load!</h2>
            <p className="text-center text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-center text-sm text-muted-foreground mb-4">Please try again later</p>
            <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </div>
    );
}
