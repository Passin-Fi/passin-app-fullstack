'use client';
import { PasskeyData, SmartWalletCreationResult, useWallet } from '@lazorkit/wallet';
import React from 'react';
import { Button } from 'shadcn/button';

export default function ButtonConnectWallet() {
    const { createPasskeyOnly, isConnecting, isLoading, smartWalletPubkey, wallet, buildSmartWalletTransaction, createSmartWalletOnly, connect, disconnect } = useWallet();
    const [data, setData] = React.useState<PasskeyData | null>(null);
    const [dataCreateSmartWallet, setDataCreateSmartWallet] = React.useState<SmartWalletCreationResult | null>(null);
    async function getPasskeysSelect() {
        try {
            const data = await createPasskeyOnly();
            console.log('data', data);
            setData(data);
        } catch (error) {
            console.error('Error creating passkey-only wallet:', error);
        }
    }
    async function createSmartWallet() {
        try {
            if (!data) return;
            const res = await createSmartWalletOnly(data);
            console.log('dataCreateSmartWallet', res);
            setDataCreateSmartWallet(res);
        } catch (error) {
            console.error('Error creating smart wallet:', error);
        }
    }

    async function testFunctionConnect() {
        try {
            const res = await connect();
            console.log('connect', res);
        } catch (error) {
            console.error('Error connect:', error);
        }
    }

    return (
        <>
            <Button onClick={() => console.log({ data, dataCreateSmartWallet, wallet, smartWalletPubkey })}>Logs</Button> <br />
            <Button onClick={getPasskeysSelect}>Signup</Button> <br />
            <Button disabled={!data} onClick={createSmartWallet}>
                {isLoading ? 'Creating...' : 'Create Smart Wallet'}
            </Button>{' '}
            <Button onClick={testFunctionConnect}>Test connect function</Button>
            <br />
            {smartWalletPubkey && <div>Smart Wallet: {smartWalletPubkey.toBase58()}</div>}
            <Button variant={'destructive'} onClick={disconnect}>
                Disconnect
            </Button>
        </>
    );
}
