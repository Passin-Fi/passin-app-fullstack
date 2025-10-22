'use client';
import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import React from 'react';
import { Badge } from 'shadcn/badge';
import { TypePool } from 'src/app/pools/data';
import CardCustom from 'src/components/card-custom/CardCustom';
import { formatNumber } from 'src/utils/format';
import usePoolOnChainInfo from '../hooks/usePoolInfo';
import { Skeleton } from 'shadcn/skeleton';

export default function CardPoolInfo({ dataPool }: { dataPool: TypePool }) {
    const onchainInfoPool = usePoolOnChainInfo({ poolId: dataPool.id });

    return (
        <CardCustom>
            <div className="flex place-items-center justify-between">
                <div className="flex gap-1 place-items-center">
                    <CryptoIcon name={dataPool.tokenDeposit.symbol} size={32} />
                    <h5>{dataPool.name}</h5>
                </div>
                <div className="text-right">
                    <p className="lead leading-4.5">APY</p>
                    <p className="lead text-primary text-sm font-bold leading-4.5">50%</p>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <p className="muted">Your Balance</p>
                    <div className="flex place-items-center gap-1 justify-center">
                        {onchainInfoPool.userDeposited.isLoading ? (
                            <Skeleton className="h-6 w-30" />
                        ) : (
                            <p className="lead font-bold ">{formatNumber(onchainInfoPool.userDeposited.data, { fractionDigits: 6 })}</p>
                        )}
                        <CryptoIcon name={dataPool.tokenDeposit.symbol} size={18} />
                    </div>
                </div>
                <div>
                    <p className="muted">Total Profit</p>
                    <div className="flex place-items-center gap-1 justify-center">
                        <p className="lead font-bold ">{formatNumber(223.474)}</p>
                        <CryptoIcon name={dataPool.tokenDeposit.symbol} size={18} />
                    </div>
                </div>
                <div>
                    <p className="muted">TVl Pool</p>
                    <div className="flex place-items-center gap-1 justify-center">
                        {onchainInfoPool.totalSupply.isLoading ? (
                            <Skeleton className="h-6 w-30" />
                        ) : (
                            <p className="lead font-bold ">{formatNumber(onchainInfoPool.totalSupply.data, { fractionDigits: 6 })}</p>
                        )}
                        <CryptoIcon name={dataPool.tokenDeposit.symbol} size={18} />
                    </div>
                </div>
                <div>
                    <p className="muted">Project</p>
                    <p className="lead font-bold text-center">Kamino</p>
                </div>
            </div>
            <div className="mt-4 flex place-items-center gap-1">
                {dataPool.category.map((category) => (
                    <Badge key={category} variant={'secondary'}>
                        {category}
                    </Badge>
                ))}
            </div>
        </CardCustom>
    );
}
