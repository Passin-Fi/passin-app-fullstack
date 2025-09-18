'use client';
import React from 'react';
import { Button } from 'shadcn/button';
import ErrorAnimationIcon from 'src/components/icons/ErrorAnimationIcon';

export default function NotFoundOrder() {
    return (
        <div className="py-10">
            <ErrorAnimationIcon />
            <h2 className="text-center text-xl font-semibold mb-2">Order not found!</h2>
            <p className="text-center text-sm text-muted-foreground mb-4">Check ID order again</p>
            <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        </div>
    );
}
