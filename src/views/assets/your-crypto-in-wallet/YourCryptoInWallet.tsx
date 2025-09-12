import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import React from 'react';
import CardCustom from 'src/components/card-custom/CardCustom';
import IconAndName from 'src/components/icon-and-name/IconAndName';
import { ChevronsUpDown } from 'lucide-react';
import { formatNumber } from 'src/utils/format';

export default function YourCryptoInWallet() {
    return (
        <div className="mt-6">
            <h4 className="font-bold">Your Crypto In Wallet</h4>
            <div className="mt-2.5 flex place-items-center justify-between">
                <div className="flex place-items-center ">
                    <p className="muted">Coin</p>
                    <ChevronsUpDown size={12} className="text-muted-foreground" />
                </div>
                <div className="flex place-items-center ">
                    <p className="muted">Amount</p>
                    <ChevronsUpDown size={12} className="text-muted-foreground" />
                </div>
            </div>
            <CardCustom>
                <div className="flex place-items-center justify-between">
                    <IconAndName tokenName="USDT" />
                    <div className="text-right">
                        <p className="leading-4.5 text-sm font-bold">{formatNumber(864.804)}</p>
                        <p className="muted">$864.80</p>
                    </div>
                </div>
            </CardCustom>
        </div>
    );
}
