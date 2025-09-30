'use client';

import { useRouter } from '@bprogress/next/app';
import { TransactionInstruction, useWallet } from '@lazorkit/wallet';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { OrderDoc, OrderStatus } from 'backend/_types/order';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'shadcn/button';
import { dataPools } from 'src/app/pools/data';
import ErrorAnimationIcon from 'src/components/icons/ErrorAnimationIcon';
import LoadingAnimation1 from 'src/components/icons/LoadingAnimation1';
import SuccessAnimationIcon from 'src/components/icons/SuccessAnimationIcon';
import Stepper, { StepperProps } from 'src/components/stepper/Stepper';
import { cn } from 'src/lib/utils';
import { BN, sleep } from 'src/utils';
import { formatAddress, formatNumber } from 'src/utils/format';

const stepPayment = () => ({ title: 'Payment', description: 'Check fiat money deposited into the system.' });
const stepCreateAndSendToken = () => ({ title: 'Create Smart Wallet & Send Token', description: 'Creating smart wallet corresponding for your passkeys and send tokens to smart wallet.' });
const stepSendTokenToSmartWallet = (smartWallet: string) => ({ title: 'Send Token to Smart Wallet', description: `Send tokens to the smart wallet. (${formatAddress(smartWallet, 4, 4)})` });
const stepSubToPool = (poolName: string) => ({ title: 'Subcrib to Pools', description: <pre>Deposit tokens to the pool. Pool: {poolName}</pre> });

export default function OrderInformation({ dataOrder, isSuccess }: { dataOrder: OrderDoc; isSuccess: boolean }) {
    const poolInfo = dataPools[dataOrder.id_pool];
    const router = useRouter();
    const [stepData, setStepData] = React.useState<StepperProps>({
        steps: [{ title: 'Payment', description: 'Check fiat money deposited into the system.' }],
        currentStep: 0,
        isProcessDone: false,
    });
    const [checkOrderAgain, setCheckOrderAgain] = React.useState<OrderDoc | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);
    const { syncWalletStatus, wallet, signAndSendTransaction, connectPasskey, smartWalletPubkey } = useWallet();

    useEffect(() => {
        if (stepData.currentStep === 2 && stepData.isProcessDone === false) {
            async function checkConditionSmartWallet() {
                if (!wallet) {
                    await connectPasskey();
                    return false;
                }
                await syncWalletStatus();
                await sleep(100);
                console.log('syncWalletStatus done', { smartWalletPubkey });
                return true;
            }

            async function subcribeToPool() {
                if (!smartWalletPubkey) {
                    return;
                }
                try {
                    const ixs: TransactionInstruction[] = [];

                    const transferIx = SystemProgram.transfer({
                        fromPubkey: smartWalletPubkey,
                        toPubkey: new PublicKey('H5s5m3LDeBawe1NTNcNPjrhKKgnpSDmDRZsiL6pXk3wQ'),
                        lamports: 10_000_000,
                    });
                    ixs.push(transferIx);
                    const tx = await signAndSendTransaction(ixs);
                    console.log('signAndSendTransaction:', tx);
                    const updatedb = await fetch(`/api/orders`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reference_id: dataOrder.reference_id, subcribe_to_pool_tx_hash: tx }),
                    });
                    console.log('Updated order after subcribe to pool:', await updatedb.json());
                    toast.success('Subcribed to pool successfully');
                } catch (error) {
                    console.error('Error create payment test:', error);
                    toast.error('Error subcribe to pool: ' + (error as Error).message);
                }
            }
        }
    }, [stepData.currentStep, stepData.isProcessDone]);

    useEffect(() => {
        let currentStep = 0;
        let isProcessDone = false;
        let steps = [];
        if (dataOrder.payment.shipping.smart_wallet_address) {
            if (dataOrder.status == OrderStatus.CreateAndSendTokenSuccess) {
                steps.push(stepPayment(), stepCreateAndSendToken(), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
            } else {
                steps.push(stepPayment(), stepSendTokenToSmartWallet(dataOrder.payment.shipping.smart_wallet_address), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
            }
        } else {
            steps.push(stepPayment(), stepCreateAndSendToken(), stepSubToPool(poolInfo?.name || 'Unknown Pool'));
        }
        setStepData({ steps, currentStep: currentStep, isProcessDone });
    }, [dataOrder]);

    useEffect(() => {
        async function captureOrder() {
            setIsFetching(true);
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}/capture`, { method: 'POST' });
                const order = (await res.json()) as OrderDoc;
                console.log('Captured order:', order);
                setCheckOrderAgain(order);
            } catch (error) {
                console.error('Error capturing order:', error);
            }
            setIsFetching(false);
        }
        async function getOrderStatusAgain() {
            try {
                const res = await fetch(`/api/orders/${dataOrder.payment.id}`);
                const status = (await res.json()) as { status: OrderStatus; order: OrderDoc };
                return status;
            } catch (error) {
                console.error('Error fetching order status:', error);
                return null;
            }
        }
        async function fetchOrderStatusLoop() {
            while (true) {
                const status = await getOrderStatusAgain();
                if (status) {
                    switch (status?.status) {
                        case OrderStatus.PaymentPending:
                            setStepData((prev) => ({ ...prev, currentStep: 0, isProcessDone: false }));
                            break;
                        case OrderStatus.PaymentCancel:
                            setStepData((prev) => ({ ...prev, currentStep: 0, isProcessDone: true }));
                            return; // stop checking
                        case OrderStatus.PaymentSuccess:
                            setStepData((prev) => ({ ...prev, currentStep: 1, isProcessDone: false }));
                            break;
                        case OrderStatus.CreateAndSendTokenToSWallet:
                            setStepData((prev) => ({ ...prev, currentStep: 1, isProcessDone: false }));
                            break;
                        case OrderStatus.CreateAndSendTokenSuccess:
                            setStepData((prev) => ({ ...prev, currentStep: 2, isProcessDone: false }));
                            // const checkReadySubToPool = await checkConditionSmartWallet();
                            // if (checkReadySubToPool) {
                            //     await subcribeToPool();
                            //     return; // stop checking tam thoi
                            // }
                            await sleep(1500); // wait for db update
                            break;
                        case OrderStatus.CreateAndSendTokenFail:
                            setStepData((prev) => ({ ...prev, currentStep: 1, isProcessDone: true }));
                            return; // stop checking
                        case OrderStatus.SWalletExists:
                        case OrderStatus.TokenSending:
                            setStepData((prev) => ({ ...prev, currentStep: 1, isProcessDone: false }));
                            break;
                        case OrderStatus.TokenSendSuccess:
                            setStepData((prev) => ({ ...prev, currentStep: 2, isProcessDone: false }));
                            // const checkReadySubToPool2 = await checkConditionSmartWallet();
                            // if (checkReadySubToPool2) {
                            //     await subcribeToPool();
                            //     return; // stop checking tam thoi
                            // }
                            // return; // stop checking
                            await sleep(1500); // wait for db update
                            break;
                        case OrderStatus.TokenSendFail:
                            setStepData((prev) => ({ ...prev, currentStep: 1, isProcessDone: true }));
                            return; // stop checking
                        case OrderStatus.SubcribeToPoolSuccess:
                            setStepData((prev) => ({ ...prev, currentStep: 3, isProcessDone: true }));
                            return; // done
                    }
                }
                sleep(600);
            }
        }
        captureOrder();
        fetchOrderStatusLoop();
    }, []);

    return (
        <div className="py-6">
            {isFetching ? <LoadingAnimation1 /> : <>{isSuccess ? <SuccessAnimationIcon /> : <ErrorAnimationIcon />}</>}
            <h1 className={cn('text-center text-2xl font-bold mb-2', isSuccess ? 'text-emerald-600' : 'text-red-600')}>{isSuccess ? 'Payment successful' : 'Payment failed'}</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">{isSuccess ? 'Thank you, your order has been received.' : 'Sorry, the transaction was unsuccessful. Please try again.'}</p>

            <Stepper {...stepData} />

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
