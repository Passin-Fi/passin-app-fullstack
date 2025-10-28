'use client';
import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Badge } from 'shadcn/badge';
import { Button } from 'shadcn/button';
import { TypePool } from 'src/app/pools/data';
import CardCustom from 'src/components/card-custom/CardCustom';
import { formatNumber } from 'src/utils/format';
import usePoolOnChainInfo from '../hooks/usePoolInfo';

export default function CardPoolInfoOverview({ dataPool }: { dataPool: TypePool }) {
    const onchainInfoPool = usePoolOnChainInfo({ poolId: dataPool.id });

    return (
        <CardCustom className="not-desktop:col-span-2 desktop:col-span-1">
            <div className="flex gap-2 justify-between">
                <div className="flex gap-2 place-items-center">
                    <CryptoIcon name={dataPool.tokenDeposit.symbol} size={48} className="mobile:size-8 tablet:size-10 desktop:size-12" />
                    <div>
                        <h5>{dataPool.name}</h5>
                        <Link href={`/pools/${dataPool.id}`}>
                            <div className="flex place-items-center">
                                <p className="muted text-primary cursor-pointer">Detail</p>
                                <ChevronRight size={18} className="text-primary" />
                            </div>
                        </Link>
                    </div>
                </div>

                <Button className="w-[93px] h-[32px]">
                    <Link className="w-full" href={`/pools/${dataPool.id}/subscribe`}>
                        Subscribe
                    </Link>
                </Button>
            </div>
            <div className="mt-2 flex justify-between">
                <div>
                    <p className="muted">Project</p>
                    <p className="lead font-bold text-center">Kamino</p>
                </div>
                <div>
                    <p className="muted">TVL Pool</p>
                    <p className="lead font-bold text-center">{formatNumber(onchainInfoPool.userDeposited.data, { fractionDigits: 6 })}</p>
                </div>

                <div>
                    <p className="muted">Your Balance</p>
                    <p className="lead font-bold text-center">{formatNumber(onchainInfoPool.userDeposited.data, { fractionDigits: 6 })}</p>
                </div>
                <div>
                    <p className="muted text-foreground">APY</p>
                    <p className="lead font-bold text-center text-primary">{formatNumber(50)}%</p>
                </div>
            </div>
            <div className="mt-2 flex place-items-center gap-1">
                {dataPool.category.map((category) => (
                    <Badge key={category} variant={'secondary'}>
                        {category}
                    </Badge>
                ))}
            </div>
        </CardCustom>
    );
}
