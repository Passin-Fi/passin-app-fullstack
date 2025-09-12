'use client';

import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { Button } from 'shadcn/button';
import { Input } from 'shadcn/input';
import CardCustom from 'src/components/card-custom/CardCustom';

export default function Subcribe() {
    const params = useParams<{ id: string }>();

    return (
        <CardCustom>
            <h4 className="text-center font-bold">Deposit in Pool {params.id}</h4>
            <div>
                <p className="muted">Enter amount</p>
                <Input
                    placeholder="0,00"
                    type="number"
                    endAdornment={
                        <>
                            <span className="font-bold">USDT</span>
                            <CryptoIcon name="USDT" size={14} />
                        </>
                    }
                    endAdornmentClassName="flex items-center gap-1"
                />
            </div>
            <div className="mt-4">
                <p className="muted">Spend</p>
                <Input
                    placeholder="0,00"
                    type="number"
                    endAdornment={
                        <>
                            <span className="font-bold">VND</span>
                            <CryptoIcon name="VND" size={14} />
                        </>
                    }
                    endAdornmentClassName="flex items-center gap-1"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <Button variant={'outline'} className="flex-1">
                    <Link className="w-full" href={`/pools/${params.id}`}>
                        Cancel
                    </Link>
                </Button>
                <Button className="flex-1">Subcribe</Button>
            </div>
        </CardCustom>
    );
}
