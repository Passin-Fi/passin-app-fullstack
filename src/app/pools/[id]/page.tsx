'use client';
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import CardInfomation from '../../../views/pools/card-infomation/card-infomation';
import CardIntroduce from '../../../views/pools/card-introduce/CardIntroduce';
import Link from 'next/link';
import PoolButtons from 'src/views/pools/pool-buttons/PoolButtons';
import CardPoolInfo from 'src/views/pools/card-pool-info/CardPoolInfo';

export default function DetailPool() {
    const params = useParams<{ id: string }>();

    return (
        <div className="pb-[100px]">
            <Link href={'/pools'}>
                <div className="flex place-items-center gap-1 mb-3">
                    <ChevronLeft size={16} />
                    <h4 className="font-bold">Pools/{params.id.toUpperCase()}</h4>
                </div>
            </Link>
            <CardPoolInfo />
            <div className="desktop:flex desktop:gap-2">
                <CardInfomation />
                <CardIntroduce />
            </div>
            <PoolButtons />
        </div>
    );
}
