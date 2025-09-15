'use client';
import React from 'react';
import { LazorkitProvider as LazorkitWalletProvider } from '@lazorkit/wallet';

export default function LazorkitProvider({ children }: { children: React.ReactNode }) {
    return (
        <LazorkitWalletProvider
            rpcUrl="https://api.devnet.solana.com"
            paymasterUrl="https://kora-9do3.onrender.com"
            portalUrl="https://portal.lazor.sh"
            // rpcUrl={process.env.LAZORKIT_RPC_URL}
            // portalUrl={process.env.LAZORKIT_PORTAL_URL}
            // paymasterUrl={process.env.LAZORKIT_PAYMASTER_URL}
        >
            {children}
        </LazorkitWalletProvider>
    );
}
