import React from 'react';
import YourCryptoInPools from 'src/views/assets/your-crypto-in-pools/YourCryptoInPools';
import YourCryptoInWallet from 'src/views/assets/your-crypto-in-wallet/YourCryptoInWallet';
import EstimatedBalance from 'src/views/assets/estimated-balance/EstimatedBalance';

export default function Assets() {
    return (
        <div>
            <EstimatedBalance />
            {/* <YourCryptoInPools /> */}
            <YourCryptoInWallet />
        </div>
    );
}
