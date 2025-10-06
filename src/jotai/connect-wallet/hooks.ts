'use client';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { passkeysConnected } from './states';
import BN from 'bn.js';
import { useWallet } from '@lazorkit/wallet';
import { useEffect } from 'react';

export function usePasskeyConnected() {
    const { smartWalletPubkey } = useWallet();
    const [passkey, setPasskey] = useAtom(passkeysConnected);

    const refetch = () => {
        const localStoragePublicKey = localStorage.getItem('PUBLIC_KEY');
        const localStorageCredentialId = localStorage.getItem('CREDENTIAL_ID');
        const localStorageSmartWalletId = localStorage.getItem('SMART_WALLET_ID');
        const localStorageSmartWalletAddress = localStorage.getItem('SMART_WALLET_ADDRESS');
        if (!localStoragePublicKey || !localStorageCredentialId || !localStorageSmartWalletId) {
            setPasskey(null);
            return;
        }

        setPasskey({
            publicKey: localStoragePublicKey,
            credentialId: localStorageCredentialId,
            smartWalletId: new BN(localStorageSmartWalletId || '0'),
            smartWalletAddress: localStorageSmartWalletAddress || '',
            isCreated: true,
        });
    };

    useEffect(() => {
        refetch();
    }, [smartWalletPubkey?.toString()]);
    return {
        passkeyConnected: passkey,
        setPasskeyConnected: setPasskey,
        refetch,
    };
}
