import React from 'react';
import { layoutConstants } from './constant';
import { Button } from 'shadcn/button';
import Navigation from './Navigation';
import ButtonConnectWallet from '../button/ButtonConnectWallet';

export default function Header() {
    return (
        <div className="fixed top-0 left-0" style={{ zIndex: layoutConstants.headerZindex, width: '100%' }}>
            <div className="absolute top-0 left-0 w-full h-full z-0" style={{ backdropFilter: 'blur(10px)' }}></div>
            <div className="container relative z-10">
                <div className="flex items-center justify-between" style={{ height: layoutConstants.headerHeight }}>
                    <div>Logo</div>
                    <Navigation />
                    {/* <Button variant={'default'} className="">
                        Connect Wallet
                    </Button> */}
                    <ButtonConnectWallet />
                </div>
            </div>
        </div>
    );
}
