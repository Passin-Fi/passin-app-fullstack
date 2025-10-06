import { useWallet } from '@lazorkit/wallet';
import { useEffect, useState } from 'react';

export default function useSmartWalletActive() {
    const { getSmartWalletByPasskey, wallet } = useWallet();
    const [isActive, setSmartWalletActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function getSmartWallet() {
        if (!wallet) {
            return {
                smartWallet: null,
                walletDevice: null,
            };
        }
        return await getSmartWalletByPasskey(wallet.passkeyPubkey);
    }
    async function checkSmartWalletActive() {
        setLoading(true);
        try {
            if (!wallet) {
                setSmartWalletActive(false);
                setLoading(false);
                return false;
            }
            const smartWallet = await getSmartWalletByPasskey(wallet.passkeyPubkey);
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
    }, [wallet?.passkeyPubkey, getSmartWalletByPasskey]);
    return {
        isFetchingSmartWalletStatus: loading,
        isSmartWalletActive: isActive,
        checkSmartWalletActive,
        getSmartWallet,
    };
}
