'use client';
import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol, WalletName } from 'crypto-icons/types';
import { toast } from 'react-toastify';
import { Button } from 'shadcn/button';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import ButtonToggleMode from 'src/components/button/ButtonToggleMode';

export default function Home() {
    return (
        <div>
            <div className="container">
                <div className="container mt-4">
                    <div className="glass-card" style={{ maxWidth: '400px', height: '200px', marginBottom: '20px' }}>
                        Content
                        <p>sdasd</p>
                    </div>

                    {/* <div className="w-96 h-24 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full inset-0 border-1 shadow-[inset_0px_0px_1px_0px] bg-[#ffffff1a] rounded-[inherit] rounded-tr-none rounded-bl-none"></div>
                    </div> */}
                </div>
                {/* <ButtonToggleMode></ButtonToggleMode>
                <Button onClick={() => toast.success('OK done!')}>Click</Button>
                <CryptoIcon name={TokenSymbol.SOL} />
                <CryptoIcon name={WalletName.LazorKit} size={40} />
                <LoadingAnimation1 /> */}
            </div>
        </div>
    );
}
