import React from 'react';
import { cn } from 'src/lib/utils';

export default function CardCustom({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn(`card-custom1`, className)}>{children}</div>;
}
