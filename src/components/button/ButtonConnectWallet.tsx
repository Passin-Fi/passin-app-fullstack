'use client';
import { PasskeyData, useWallet } from '@lazorkit/wallet';
import React from 'react';
import { Button } from 'shadcn/button';

export default function ButtonConnectWallet() {
    const { createPasskeyOnly, isConnecting, isLoading, smartWalletPubkey, wallet } = useWallet();
    const [data, setData] = React.useState<PasskeyData | null>(null);
    async function getPasskeysSelect() {
        try {
            const data = await createPasskeyOnly();
            console.log('data', data);
            setData(data);
        } catch (error) {
            console.error('Error creating passkey-only wallet:', error);
        }
    }

    return (
        <>
            <Button onClick={() => console.log({ data, wallet, smartWalletPubkey })}>Logs</Button>
            <Button onClick={getPasskeysSelect}>Signup</Button>
        </>
    );
}
