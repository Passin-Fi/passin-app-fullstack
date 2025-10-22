import { PublicKey, useWallet } from '@lazorkit/wallet';
import { checkSmartWallet } from 'backend/_helper/check_smartwallet_by_passkey';
import { useEffect, useState } from 'react';

export default function useSmartWalletActive() {
    const { wallet } = useWallet();
    const [isActive, setSmartWalletActive] = useState<boolean>(false);
    const [smartWallet, setSmartWallet] = useState<PublicKey | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    async function getSmartWallet() {
        if (!wallet) {
            setSmartWallet(null);
            setSmartWalletActive(false);
            return {
                smartWallet: null,
                walletDevice: null,
            };
        }
        const response = await checkSmartWallet(wallet.passkeyPubkey);
        setSmartWallet(response.smartWallet);
        setSmartWalletActive(true);
        return response;
    }
    async function checkSmartWalletActive() {
        setLoading(true);
        try {
            if (!wallet) {
                setSmartWalletActive(false);
                setLoading(false);
                return false;
            }
            const smartWallet = await checkSmartWallet(wallet.passkeyPubkey);
            setSmartWalletActive(!!smartWallet.smartWallet);
            setSmartWallet(smartWallet.smartWallet);
            setLoading(false);
            return !!smartWallet.smartWallet;
        } catch (error) {
            console.error('Error checking smart wallet:', error);
            setSmartWalletActive(false);
            setLoading(false);
            return false;
        }
    }
    useEffect(() => {
        checkSmartWalletActive();
    }, [wallet?.passkeyPubkey?.toString()]);
    return {
        isFetchingSmartWalletStatus: loading,
        isSmartWalletActive: isActive,
        smartWallet,
        checkSmartWalletActive,
        getSmartWallet,
    };
}
