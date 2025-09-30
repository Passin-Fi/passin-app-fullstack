'use client';
import { useRouter } from '@bprogress/next/app';
import { useWallet } from '@lazorkit/wallet';
import { Key, Wallet2 } from 'lucide-react';
import React from 'react';
import { Button } from 'shadcn/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'shadcn/dropdown-menu';
import { usePasskeyConnected } from 'src/jotai/connect-wallet/hooks';
import { formatAddress } from 'src/utils/format';

export default function ButtonConnectWallet() {
    const { connectPasskey, isConnecting, isLoading, smartWalletPubkey, wallet, isConnected, signAndSendTransaction, createSmartWallet, buildSmartWalletTransaction, connect, disconnect } =
        useWallet();
    const { passkeyConnected } = usePasskeyConnected();
    const router = useRouter();

    async function getPasskeysSelect() {
        try {
            const data = await connectPasskey();
        } catch (error) {
            console.error('Error creating passkey-only wallet:', error);
        }
    }

    async function getSmartWallet() {
        try {
            const data = await connect();
            console.log('data', data);
        } catch (error) {
            console.error('Error creating smart wallet:', error);
        }
    }
    if (isConnecting) {
        return (
            <Button variant={'secondary'} disabled>
                Connecting...
            </Button>
        );
    }

    if (smartWalletPubkey) {
        return (
            <Button variant={'secondary'} onClick={() => router.push('/account')}>
                {formatAddress(smartWalletPubkey.toString(), 4, 4)}
            </Button>
        );
    }

    if (passkeyConnected) {
        return (
            <Button variant={'secondary'} onClick={() => router.push('/account')}>
                {formatAddress(passkeyConnected.publicKey, 4, 4)}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Login</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[101]" align="end">
                <DropdownMenuItem onClick={getPasskeysSelect}>
                    <Key />
                    Passkeys Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={getSmartWallet}>
                    <Wallet2 />
                    Smart Wallet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <Button onClick={getPasskeysSelect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Sign In'}
        </Button>
    );
}
