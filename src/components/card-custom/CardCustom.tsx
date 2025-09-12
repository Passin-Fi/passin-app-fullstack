import React from 'react';

export default function CardCustom({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`contained-card + ${className}`}>{children}</div>;
}
