import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { TokenSymbol } from 'crypto-icons/types';
import React from 'react';
import { Button } from 'shadcn/button';
import CardCustom from 'src/components/card-custom/CardCustom';
import { ChevronRight } from 'lucide-react';
import { Badge } from 'shadcn/badge';
import Link from 'next/link';
import { formatNumber } from 'src/utils/format';

export default function Pools() {
    return (
        <div className="mt-4">
            <CardCustom>
                <div className="flex justify-between">
                    <div className="flex gap-2 place-items-center">
                        <CryptoIcon name={TokenSymbol.SOL} className="size-8 desktop:size-11" />
                        <div>
                            <h5>{TokenSymbol.SOL}</h5>
                            <Link href={`/pools/${TokenSymbol.SOL}`}>
                                <div className="flex place-items-center ">
                                    <h6 className="text-primary cursor-pointer">Detail</h6>
                                    <ChevronRight className="size-3 text-primary" />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Button className="w-[93px] h-[32px]">
                        <Link className="w-full" href={`/pools/${TokenSymbol.SOL}/subcribe`}>
                            Subcribe
                        </Link>
                    </Button>
                </div>
                <div className="mt-2 flex justify-between">
                    <div>
                        <p className="muted">TVL Pool</p>
                        <p className="lead font-bold text-center">{formatNumber(213.474)}</p>
                    </div>
                    <div>
                        <p className="muted">APY</p>
                        <p className="lead font-bold text-center">{formatNumber(21)}%</p>
                    </div>
                    <div>
                        <p className="muted">Your Balance</p>
                        <p className="lead font-bold text-center">{formatNumber(1.11)}</p>
                    </div>
                    <div>
                        <p className="muted">Project</p>
                        <p className="lead font-bold text-center">Kamino</p>
                    </div>
                </div>
                <div className="mt-2 flex place-items-center gap-1">
                    <Badge variant={'secondary'}>Lending</Badge>
                    <Badge variant={'secondary'}>Liquidity Provider</Badge>
                    <Badge variant={'secondary'}>Yield Aggregator</Badge>
                </div>
            </CardCustom>
        </div>
    );
}
