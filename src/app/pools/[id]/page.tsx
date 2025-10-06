'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import CardInfomation from '../../../views/pools/card-infomation/card-infomation';
import CardIntroduce from '../../../views/pools/card-introduce/CardIntroduce';
import Link from 'next/link';
import PoolButtons from 'src/views/pools/pool-buttons/PoolButtons';
import CardPoolInfo from 'src/views/pools/card-pool-info/CardPoolInfo';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from 'shadcn/breadcrumb';
import { dataPools } from '../data';

export default function DetailPool() {
    const { id: idPool } = useParams<{ id: string }>();

    return (
        <div className="pb-[100px]">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/pools">Pools</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-bold">{dataPools[idPool].name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CardPoolInfo dataPool={dataPools[idPool]} />
            <div className="desktop:flex desktop:gap-2">
                <CardInfomation />
                <CardIntroduce />
            </div>
            <PoolButtons />
        </div>
    );
}
