'use client';
import React from 'react';
import { layoutConstants } from './constant';
import Navigation from './Navigation';
import ButtonConnectWallet from '../button/ButtonConnectWallet';
import Image from 'next/image';
import { LOGO_FULL_HORIZONTAL, LOGO_ICON_ONLY } from 'src/constant/imagePath';
import useBreakpoint from 'src/hooks/useBreakpoint';

export default function Header() {
    const { isMobile } = useBreakpoint();
    return (
        <div className="fixed top-0 left-0" style={{ zIndex: layoutConstants.headerZindex, width: '100%' }}>
            <div className="absolute top-0 left-0 w-full h-full z-0" style={{ backdropFilter: 'blur(10px)' }}></div>
            <div className="container relative z-10">
                <div className="flex items-center justify-between" style={{ height: layoutConstants.headerHeight }}>
                    <div style={{ position: 'relative', width: isMobile ? 45 : 155, height: 35 }}>
                        <Image src={isMobile ? LOGO_ICON_ONLY : LOGO_FULL_HORIZONTAL} alt="EZSol logo" fill sizes="180px" />
                    </div>
                    <Navigation />

                    <ButtonConnectWallet />
                </div>
            </div>
        </div>
    );
}
