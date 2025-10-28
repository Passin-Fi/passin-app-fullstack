'use client';
import React from 'react';
import { dataPools } from './data';
import CardPoolInfoOverview from 'src/views/pools/list-pool/CardPoolInfoOverview';

export default function Pools() {
    return (
        <div className="mt-4">
            <h4 className="font-bold mb-4">Pools</h4>
            <div className="grid gap-4 grid-cols-2">
                {Object.keys(dataPools).map((poolId) => (
                    <CardPoolInfoOverview key={poolId} dataPool={dataPools[poolId]} />
                ))}
            </div>
        </div>
    );
}
