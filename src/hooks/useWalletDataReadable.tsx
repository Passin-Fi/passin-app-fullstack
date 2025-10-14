import { useWallet } from '@lazorkit/wallet';
import React from 'react';

export default function useWalletDataReadable() {
    const { error, wallet, smartWalletPubkey, isSigning, isLoading, isConnected, isConnecting } = useWallet();
    return {
        error,
        smartWalletPubkey: smartWalletPubkey?.toString() || null,
        wallet: wallet
            ? {
                  credentialId: wallet.credentialId,
                  expo: wallet.expo,
                  passkeyPubkey: Buffer.from(wallet.passkeyPubkey).toString('base64'),
                  platform: wallet.platform,
                  walletDevice: wallet.walletDevice,
                  smartWallet: wallet.smartWallet.toString(),
                  walletId: wallet.walletId,
              }
            : null,
        isSigning,
        isLoading,
        isConnected,
        isConnecting,
    };
}
