import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol } from 'crypto-icons/types';
import { useParams } from 'next/navigation';
import React from 'react';
import { Badge } from 'shadcn/badge';
import CardCustom from 'src/components/card-custom/CardCustom';
import { formatNumber } from 'src/utils/format';

export default function CardPoolInfo() {
    const params = useParams<{ id: string }>();
    return (
        <CardCustom>
            <div className="flex place-items-center justify-between">
                <div className="flex gap-1 place-items-center">
                    <CryptoIcon name={TokenSymbol.SOL} size={32} />
                    <h5>{TokenSymbol.SOL}</h5>
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
                        <p className="lead font-bold ">{formatNumber(213.474)}</p>
                        <CryptoIcon name={params.id.toUpperCase()} size={14} />
                    </div>
                </div>
                <div>
                    <p className="muted">Total Profit</p>
                    <div className="flex place-items-center gap-1 justify-center">
                        <p className="lead font-bold ">{formatNumber(223.474)}</p>
                        <CryptoIcon name={params.id.toUpperCase()} size={14} />
                    </div>
                </div>
                <div>
                    <p className="muted">TVl Pool</p>
                    <div className="flex place-items-center gap-1 justify-center">
                        <p className="lead font-bold ">{formatNumber(223.474)}</p>
                        <CryptoIcon name={params.id.toUpperCase()} size={14} />
                    </div>
                </div>
                <div>
                    <p className="muted">Project</p>
                    <p className="lead font-bold text-center">Kamino</p>
                </div>
            </div>
            <div className="mt-4 flex place-items-center gap-1">
                <Badge variant={'secondary'}>Lending</Badge>
                <Badge variant={'secondary'}>Liquidity Provider</Badge>
                <Badge variant={'secondary'}>Yield Aggregator</Badge>
            </div>
        </CardCustom>
    );
}
