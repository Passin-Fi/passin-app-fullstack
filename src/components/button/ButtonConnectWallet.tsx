'use client';
import { useWallet } from '@lazorkit/wallet';
import React from 'react';
import { Button } from 'shadcn/button';

export default function ButtonConnectWallet() {
    const { createPasskeyOnly, isConnecting, isLoading, smartWalletPubkey, wallet } = useWallet();

    return (
        <>
            <Button onClick={() => console.log({ wallet, smartWalletPubkey })}>Logs</Button>
            <Button onClick={createPasskeyOnly}>Signup</Button>
        </>
    );
}
