import { useWallet } from '@lazorkit/wallet';
import { checkSmartWallet } from 'backend/_helper/check_smartwallet_by_passkey';
import { useEffect, useState } from 'react';

export default function useSmartWalletActive() {
    const { wallet } = useWallet();
    const [isActive, setSmartWalletActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function getSmartWallet() {
        if (!wallet) {
            return {
                smartWallet: null,
                walletDevice: null,
            };
        }
        return await checkSmartWallet(wallet.passkeyPubkey);
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
    }, [wallet?.passkeyPubkey]);
    return {
        isFetchingSmartWalletStatus: loading,
        isSmartWalletActive: isActive,
        checkSmartWalletActive,
        getSmartWallet,
    };
}
