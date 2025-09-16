'use client';
import { useRouter } from '@bprogress/next/app';
import { useWallet } from '@lazorkit/wallet';
import React from 'react';
import { Button } from 'shadcn/button';
import { usePasskeyConnected } from 'src/jotai/connect-wallet/hooks';
import { formatAddress } from 'src/utils/format';

export default function ButtonConnectWallet() {
    const { createPasskeyOnly, isConnecting, isLoading, smartWalletPubkey, wallet, buildSmartWalletTransaction, createSmartWalletOnly, connect, disconnect } = useWallet();
    const [passkeyConnected, setPasskeyConnected] = usePasskeyConnected();
    const router = useRouter();

    async function getPasskeysSelect() {
        try {
            const data = await createPasskeyOnly();
            console.log('data', data);
            setPasskeyConnected(data);
        } catch (error) {
            console.error('Error creating passkey-only wallet:', error);
        }
    }

    if (passkeyConnected) {
        return (
            <Button variant={'secondary'} onClick={() => router.push('/account')}>
                {formatAddress(passkeyConnected.publicKey, 4, 4)}
            </Button>
        );
    }

    return (
        <>
            <Button onClick={getPasskeysSelect} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Sign In'}
            </Button>
        </>
    );
}
