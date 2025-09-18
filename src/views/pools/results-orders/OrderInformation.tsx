'use client';

import { useRouter } from '@bprogress/next/app';
import { OrderDoc } from 'backend/_types/order';
import React, { useEffect } from 'react';
import { Button } from 'shadcn/button';
import { dataPools } from 'src/app/pools/data';
import ErrorAnimationIcon from 'src/components/icons/ErrorAnimationIcon';
import SuccessAnimationIcon from 'src/components/icons/SuccessAnimationIcon';
import Stepper from 'src/components/stepper/Stepper';
import { cn } from 'src/lib/utils';
import { BN } from 'src/utils';
import { formatNumber } from 'src/utils/format';

export default function OrderInformation({ dataOrder, isSuccess }: { dataOrder: OrderDoc; isSuccess: boolean }) {
    const poolInfo = dataPools[dataOrder.id_pool];
    const router = useRouter();
    const [checkOrderAgain, setCheckOrderAgain] = React.useState<OrderDoc | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);

    useEffect(() => {}, [dataOrder]);

    return (
        <div className="py-6">
            {isSuccess ? <SuccessAnimationIcon /> : <ErrorAnimationIcon />}
            <h1 className={cn('text-center text-2xl font-bold mb-2', isSuccess ? 'text-emerald-600' : 'text-red-600')}>{isSuccess ? 'Payment successful' : 'Payment failed'}</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">{isSuccess ? 'Thank you, your order has been received.' : 'Sorry, the transaction was unsuccessful. Please try again.'}</p>

            <Stepper
                steps={[
                    { title: 'Payment', description: 'Payment fiat completed' },
                    { title: 'Create Wallet', description: 'Creating wallet in progress' },
                    { title: 'Deposit', description: 'Depositing to pool' },
                    { title: 'Finalize', description: 'Finalizing the order' },
                ]}
                currentStep={2}
            />

            <div className="space-y-3 text-sm">
                <InfoRow label="Payment ID" value={dataOrder.payment.id} />
                <InfoRow label="Pool" value={dataOrder.payment.order_lines.supplier} />
                <InfoRow label="Status" value={dataOrder.status} />
                <InfoRow label="Created at" value={new Date(dataOrder.created_at).toLocaleString()} />
                <InfoRow label="Amount" value={dataOrder.payment.order_lines.quantity + ' ' + dataOrder.payment.order_lines.note} />
                <InfoRow label="Unit price" value={'$' + dataOrder.payment.order_lines.unit_price} />
                <InfoRow label="Total price" value={'$' + formatNumber(BN(dataOrder.payment.order_lines.unit_price).times(dataOrder.payment.order_lines.quantity), { fractionDigits: 4 })} />
            </div>

            <div className="mt-8 flex gap-3">
                <Button className="flex-1" variant="default" onClick={() => router.push('/pools')}>
                    Back to Pools
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => router.refresh()}>
                    Reload
                </Button>
            </div>
        </div>
    );
}

const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between gap-4 rounded-md border px-3 py-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium truncate max-w-[65%] text-right" title={String(value ?? '')}>
            {value ?? '-'}
        </span>
    </div>
);
