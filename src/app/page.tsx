'use client';
import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol, WalletName } from 'crypto-icons/types';
import { toast } from 'react-toastify';
import { Button } from 'shadcn/button';
import LoadingAnimation1 from 'src/components/loading-icon/LoadingAnimation1';
import ButtonToggleMode from 'src/components/toggle-mode/ButtonToggleMode';

export default function Home() {
    return (
        <div>
            <ButtonToggleMode></ButtonToggleMode>
            <Button onClick={() => toast.success('OK done!')}>Click</Button>
            <CryptoIcon name={TokenSymbol.SOL} />
            <CryptoIcon name={WalletName.LazorKit} size={40} />
            <LoadingAnimation1 />
        </div>
    );
}
