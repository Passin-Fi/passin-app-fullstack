import React from 'react';
import { layoutConstants } from './constant';

export default function Content({ children }: { children: React.ReactNode }) {
    return <div style={{ paddingTop: layoutConstants.headerHeight, paddingBottom: layoutConstants.navigationHeight }}>{children}</div>;
}
