'use client';
import React from 'react';
import CardCustom from 'src/components/card-custom/CardCustom';
import IconAndName from 'src/components/icon-and-name/IconAndName';
import { ChevronsUpDown } from 'lucide-react';
import { formatNumber } from 'src/utils/format';
import useAllTokenBalanceInfos from 'src/hooks/solana/useAllTokenBalanceInfos';
import useTokenPrice from 'src/hooks/useTokenPrice';
import { TokenSymbol } from 'crypto-icons/types';
import { BN } from 'src/utils';

export default function YourCryptoInWallet() {
    const { allSlpTokenBalances, native } = useAllTokenBalanceInfos('E15ePZMaiW5qfhW1U4ULA6oqWhAgY8DNUQJCnkEzj6LU');
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

            <TokenRow tokenName={TokenSymbol.SOL} balance={native.SOL.balance} />
            {Object.entries(allSlpTokenBalances.data || {}).map(([tokenName, balance]) => (
                <TokenRow key={tokenName} tokenName={tokenName as TokenSymbol} balance={balance} />
            ))}
        </div>
    );
}

function TokenRow({ tokenName, balance }: { tokenName: TokenSymbol; balance: string | number | BigNumber }) {
    const { data } = useTokenPrice(tokenName, 'USD');
    return (
        <CardCustom className="mb-2.5">
            <div className="flex place-items-center justify-between">
                <IconAndName tokenName={tokenName} sizeIcon={28} />

                <div className="text-right">
                    <p className="lead font-bold">{formatNumber(BN(balance), { fractionDigits: 6 })}</p>
                    <p className="muted">${formatNumber(BN(balance).times(BN(data?.rate || 0)), { fractionDigits: 6 })}</p>
                </div>
            </div>
        </CardCustom>
    );
}
