import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import React from 'react';
import CardCustom from 'src/components/card-custom/CardCustom';
import { formatNumber } from 'src/utils/format';

export default function YourCryptoInPools() {
    return (
        <div className="mt-6">
            <h4 className="font-bold">Your Crypto In Pools</h4>
            <CardCustom className="mt-2.5">
                <div className="flex place-items-center justify-between">
                    <div className="flex place-items-center gap-2">
                        <CryptoIcon size={32} name="SOL" />
                        <div>
                            <p className="leading-4.5 text-sm font-bold">SOL</p>
                            <p className="lead text-sm">
                                APY
                                <span className="text-primary font-bold"> 50%</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="lead">Amount</p>
                        <p className="text-primary text-sm leading-4.5 font-bold">{formatNumber(864.804)}</p>
                    </div>
                </div>
            </CardCustom>
        </div>
    );
}
